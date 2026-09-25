import type { GameState, Player, WordIndex } from "./types";
import { selectWord } from "./wordSelection";
import { awardPoint } from "./scoring";

/**
 * Provisional round-count rule (see project plan, "Rounds -> Still to
 * decide"). V1 just plays until the players choose to end the game, so
 * this constant is not currently enforced - it's here so a future
 * "first to X points" or "N rounds" rule has one obvious place to live.
 */
export const TARGET_SCORE: number | null = null;

export function createInitialState(
  player1Name: string,
  player2Name: string
): GameState {
  return {
    phase: "lobby",
    players: [
      { id: "p1", name: player1Name || "Player 1", score: 0 },
      { id: "p2", name: player2Name || "Player 2", score: 0 },
    ],
    round: 0,
    currentWord: null,
    claimedBy: null,
    lastResult: null,
    usedWords: [],
  };
}

/** lobby -> countdown, and result -> countdown (start of every round) */
export function beginCountdown(state: GameState): GameState {
  return {
    ...state,
    phase: "countdown",
    currentWord: null,
    claimedBy: null,
    lastResult: null,
  };
}

/** countdown -> word-revealed, once the 3-2-1 count finishes */
export function revealWord(state: GameState, wordIndex: WordIndex): GameState {
  if (state.phase !== "countdown") return state;
  const word = selectWord(wordIndex, state.usedWords);
  return {
    ...state,
    phase: "word-revealed",
    round: state.round + 1,
    currentWord: word,
    usedWords: word ? [...state.usedWords, word] : state.usedWords,
  };
}

/** word-revealed -> claimed */
export function claim(state: GameState, playerId: string): GameState {
  if (state.phase !== "word-revealed") return state;
  return { ...state, phase: "claimed", claimedBy: playerId };
}

/** claimed -> result (judge decides whether the sung lyric counted) */
export function resolveClaim(
  state: GameState,
  outcome: "point" | "no-point"
): GameState {
  if (state.phase !== "claimed" || !state.claimedBy) return state;

  const players = state.players.map((p) =>
    p.id === state.claimedBy && outcome === "point" ? awardPoint(p) : p
  ) as [Player, Player];

  return { ...state, phase: "result", players, lastResult: outcome };
}

/** result -> finished */
export function endGame(state: GameState): GameState {
  return { ...state, phase: "finished" };
}

/** finished/anywhere -> lobby, with scores and round reset */
export function resetGame(state: GameState): GameState {
  return createInitialState(state.players[0].name, state.players[1].name);
}

export function leadingPlayer(state: GameState): Player | null {
  const [a, b] = state.players;
  if (a.score === b.score) return null;
  return a.score > b.score ? a : b;
}

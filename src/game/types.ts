// ---- Word dataset -----------------------------------------------------

export interface SongOccurrence {
  id: string;
  artist: string;
  title: string;
  score: number;
}

export interface WordEntry {
  num_occurrences: number;
  average_score: number;
  max_score: number;
  occurrences: SongOccurrence[];
}

export type WordIndex = Record<string, WordEntry>;

// ---- Players ------------------------------------------------------------

export interface Player {
  id: string;
  name: string;
  score: number;
}

// ---- Game state -----------------------------------------------------

export type GamePhase =
  | "lobby"
  | "countdown"
  | "word-revealed"
  | "claimed"
  | "result"
  | "finished";

export interface GameState {
  phase: GamePhase;
  players: [Player, Player];
  round: number;
  currentWord: string | null;
  claimedBy: string | null; // player id
  lastResult: "point" | "no-point" | null;
  usedWords: string[];
}

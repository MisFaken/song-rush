import { useEffect, useReducer, useState } from "react";
import type { WordIndex, GameState } from "../game/types";
import {
  createInitialState,
  beginCountdown,
  revealWord,
  claim,
  resolveClaim,
  endGame,
  resetGame,
  leadingPlayer,
} from "../game/game";
import { PlayerSetup } from "./PlayerSetup";
import { Half } from "./Half";
import { NetStrip } from "./NetStrip";

interface GameScreenProps {
  wordIndex: WordIndex;
}

type Action =
  | { type: "START_GAME"; player1: string; player2: string }
  | { type: "REVEAL_WORD" }
  | { type: "CLAIM"; playerId: string }
  | { type: "RESOLVE"; outcome: "point" | "no-point" }
  | { type: "NEXT_ROUND" }
  | { type: "END_GAME" }
  | { type: "RESET" };

function makeReducer(wordIndex: WordIndex) {
  return function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
      case "START_GAME":
        return beginCountdown(
          createInitialState(action.player1, action.player2)
        );
      case "REVEAL_WORD":
        return revealWord(state, wordIndex);
      case "CLAIM":
        return claim(state, action.playerId);
      case "RESOLVE":
        return resolveClaim(state, action.outcome);
      case "NEXT_ROUND":
        return state.phase === "result" ? beginCountdown(state) : state;
      case "END_GAME":
        return endGame(state);
      case "RESET":
        return resetGame(state);
      default:
        return state;
    }
  };
}

/** How long the 3-2-1 count runs before the word flashes in, in seconds. */
const COUNTDOWN_SECONDS = 3;

export function GameScreen({ wordIndex }: GameScreenProps) {
  const [state, dispatch] = useReducer(
    makeReducer(wordIndex),
    createInitialState("", "")
  );
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (state.phase !== "countdown") return;
    setCountdownValue(COUNTDOWN_SECONDS);
    let n = COUNTDOWN_SECONDS;
    const id = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(id);
        dispatch({ type: "REVEAL_WORD" });
      } else {
        setCountdownValue(n);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [state.phase]);

  if (state.phase === "lobby") {
    return (
      <PlayerSetup
        onStart={(p1, p2) =>
          dispatch({ type: "START_GAME", player1: p1, player2: p2 })
        }
      />
    );
  }

  if (state.phase === "finished") {
    const winner = leadingPlayer(state);
    return (
      <div className="finished">
        <p className="winner-label">
          {winner ? "The mic goes to" : "It's a tie!"}
        </p>
        {winner && <h2 className="winner-name">{winner.name}</h2>}
        <div className="final-scores">
          <span className="p1">
            {state.players[0].name}: {state.players[0].score}
          </span>
          <span className="p2">
            {state.players[1].name}: {state.players[1].score}
          </span>
        </div>
        <button
          className="play-again-button"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="court">
      <Half
        position="top"
        player={state.players[0]}
        phase={state.phase}
        word={state.currentWord}
        countdownValue={countdownValue}
        claimedBy={state.claimedBy}
        onClaim={(playerId) => dispatch({ type: "CLAIM", playerId })}
      />
      <NetStrip
        state={state}
        onResolve={(outcome) => dispatch({ type: "RESOLVE", outcome })}
        onNextRound={() => dispatch({ type: "NEXT_ROUND" })}
        onEndGame={() => dispatch({ type: "END_GAME" })}
      />
      <Half
        position="bottom"
        player={state.players[1]}
        phase={state.phase}
        word={state.currentWord}
        countdownValue={countdownValue}
        claimedBy={state.claimedBy}
        onClaim={(playerId) => dispatch({ type: "CLAIM", playerId })}
      />
    </div>
  );
}

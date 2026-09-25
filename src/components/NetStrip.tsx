import type { GameState } from "../game/types";

interface NetStripProps {
  state: GameState;
  onResolve: (outcome: "point" | "no-point") => void;
  onNextRound: () => void;
  onEndGame: () => void;
}

export function NetStrip({
  state,
  onResolve,
  onNextRound,
  onEndGame,
}: NetStripProps) {
  if (state.phase === "claimed") {
    const claimant = state.players.find((p) => p.id === state.claimedBy);
    return (
      <div className="net">
        <div className="net-judge">
          <span className="net-round" style={{ flex: "none" }}>
            {claimant?.name ?? ""} sang it?
          </span>
          <button className="no-point" onClick={() => onResolve("no-point")}>
            No
          </button>
          <button className="point" onClick={() => onResolve("point")}>
            Point!
          </button>
        </div>
      </div>
    );
  }

  if (state.phase === "result") {
    const claimant = state.players.find((p) => p.id === state.claimedBy);
    const text =
      state.lastResult === "point"
        ? `Point, ${claimant?.name ?? "them"}!`
        : "No point";
    return (
      <div className="net">
        <div className="net-result">
          <span className="result-text">{text}</span>
          <button className="next-button" onClick={onNextRound}>
            Next round
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="net">
      <span className="net-round">Round {state.round}</span>
      <button className="net-icon" aria-label="End game" onClick={onEndGame}>
        ⏹
      </button>
    </div>
  );
}

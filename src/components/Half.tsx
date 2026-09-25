import type { ReactNode } from "react";
import type { GamePhase, Player } from "../game/types";

interface HalfProps {
  position: "top" | "bottom";
  player: Player;
  phase: GamePhase;
  word: string | null;
  countdownValue: number;
  claimedBy: string | null;
  onClaim: (playerId: string) => void;
}

export function Half({
  position,
  player,
  phase,
  word,
  countdownValue,
  claimedBy,
  onClaim,
}: HalfProps) {
  const isClaimant = claimedBy === player.id;
  const isOtherClaimed = claimedBy !== null && claimedBy !== player.id;
  const canClaim = phase === "word-revealed";
  const side = position === "top" ? "p1" : "p2";

  const classes = ["half", position, side, isClaimant && "won", isOtherClaimed && "lost"]
    .filter(Boolean)
    .join(" ");

  let body: ReactNode = null;
  if (phase === "countdown") {
    body = <span className="half-count">{countdownValue}</span>;
  } else if (phase === "word-revealed") {
    body = <span className="half-word">{word ?? "…"}</span>;
  } else if (phase === "claimed" || phase === "result") {
    body = isClaimant ? (
      <span className="half-claimed-label">Grabbed it!</span>
    ) : (
      <span className="half-word">{word ?? "…"}</span>
    );
  }

  return (
    <div className={classes}>
      <button
        className="half-btn"
        disabled={!canClaim}
        aria-label={`${player.name}, grab the mic`}
        onClick={() => canClaim && onClaim(player.id)}
      >
        <div className="half-inner">
          <div className="half-word-area">{body}</div>
          <div className="half-score-row">
            <span className="sname">{player.name}</span>
            <span className="sval">{player.score}</span>
          </div>
        </div>
      </button>
    </div>
  );
}

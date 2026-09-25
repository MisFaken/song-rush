import type { Player } from "./types";

/** Provisional scoring: a correct sung lyric is worth one point. */
export function awardPoint(player: Player): Player {
  return { ...player, score: player.score + 1 };
}

export function noPoint(player: Player): Player {
  return player;
}

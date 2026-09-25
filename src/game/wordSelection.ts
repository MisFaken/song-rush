// src/game/wordSelection.ts
import type { WordIndex } from "./types";

/**
 * Word selection is intentionally provisional (see project plan, "Gameplay
 * Rules Deliberately Not Finalized" -> Word selection).
 *
 * V1 weights each candidate word by its `average_score` - words that score
 * higher (roughly: fit more/better-known lyrics) come up more often, but
 * every word with a positive score stays reachable. Later this can grow
 * into selectEasyWord / selectMediumWord / selectHardWord using
 * num_occurrences / max_score too, without any change to GameScreen or
 * other components - they only ever call `selectWord`.
 */
export function selectWord(
  wordIndex: WordIndex,
  usedWords: string[] = []
): string | null {
  const available = Object.keys(wordIndex).filter(
    (w) => !usedWords.includes(w)
  );

  // If every word has been used, allow repeats rather than ending the game.
  const pool = available.length > 0 ? available : Object.keys(wordIndex);
  if (pool.length === 0) return null;

  // Weighted pick: probability of a word is proportional to its
  // average_score. A tiny floor keeps a score of 0 from making a word
  // permanently unreachable.
  const weights = pool.map((w) => Math.max(wordIndex[w].average_score, 0.001));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let roll = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }

  // Floating-point fallback - should be unreachable in practice.
  return pool[pool.length - 1];
}
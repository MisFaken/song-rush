import type { WordIndex } from "./types";

/**
 * Word selection is intentionally provisional (see project plan, "Gameplay
 * Rules Deliberately Not Finalized" -> Word selection).
 *
 * V1 implements plain random selection from words that haven't been used
 * yet this game. Later this can grow into selectEasyWord / selectMediumWord
 * / selectHardWord using num_occurrences / average_score / max_score,
 * without any change to GameScreen or other components - they only ever
 * call `selectWord`.
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

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

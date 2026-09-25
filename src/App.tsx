import wordIndexData from "./data/word_index.json";
import type { WordIndex } from "./game/types";
import { GameScreen } from "./components/GameScreen";

// word_index.json is treated as read-only static data (see project plan).
const wordIndex = wordIndexData as WordIndex;

export default function App() {
  return <GameScreen wordIndex={wordIndex} />;
}

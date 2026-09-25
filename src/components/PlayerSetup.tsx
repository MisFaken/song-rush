import { useState } from "react";

interface PlayerSetupProps {
  onStart: (player1Name: string, player2Name: string) => void;
}

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  return (
    <div className="lobby">
      <div className="lobby-heading">
        <h1>
          Song <span>Rush</span>
        </h1>
        <p>Lay the phone flat between you. See the word. Race for the mic.</p>
      </div>

      <div className="player-input p1">
        <label htmlFor="player1">Player 1 (top edge)</label>
        <input
          id="player1"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="Player 1"
          maxLength={16}
        />
      </div>

      <div className="player-input p2">
        <label htmlFor="player2">Player 2 (bottom edge)</label>
        <input
          id="player2"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="Player 2"
          maxLength={16}
        />
      </div>

      <button
        className="start-button"
        onClick={() => onStart(name1.trim(), name2.trim())}
      >
        Start game
      </button>
    </div>
  );
}

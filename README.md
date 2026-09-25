# Song Rush

A mobile-first, pass-and-play party game: lay the phone flat on a table
between two players, flip a word, race to grab the mic, sing a real lyric
containing that word to score a point.

The screen is split into two halves — like the two sides of a tennis
court — one per player, each showing the word and their own score. The top
half is rotated 180° so the player on that side reads it right-side up.
Before each word, a 3-2-1 countdown flashes on both halves.

This is the **V1 skeleton** described in the project plan — a static React +
TypeScript + Vite app, playable on one phone, with game rules, game state,
and UI kept in separate layers so the (still-experimental) rules can change
without touching the interface.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL in Chrome on your phone (same Wi-Fi network) or
in a desktop browser's mobile emulation view.

## Build for production

```bash
npm run build
npm run preview   # sanity-check the built app locally
```

The build output lands in `dist/`.

## Deploy for free

Any static host works. The simplest path:

1. Push this repo to GitHub.
2. Connect it to **Cloudflare Pages** or **Netlify** (build command
   `npm run build`, output directory `dist`), or use **GitHub Pages** with
   the `dist/` output.
3. Open the resulting HTTPS URL on a phone. No install, no login.

## Replacing the word data

`src/data/word_index.json` currently ships with a small **placeholder**
dataset (~19 words, a few real song/artist credits each) so the app runs
out of the box. Drop your real preprocessed dataset in at the same path,
keeping this shape:

```ts
type WordIndex = Record<string, {
  num_occurrences: number;
  average_score: number;
  max_score: number;
  occurrences: { id: string; artist: string; title: string; score: number }[];
}>;
```

Nothing else needs to change — `App.tsx` imports the file directly and the
rest of the app only ever sees the `WordIndex` type.

## Where things live

```
src/
├── game/            # Pure logic — no React, no DOM
│   ├── types.ts         WordIndex / Player / GameState types
│   ├── game.ts           phase transitions (lobby → countdown → word-revealed → claimed → result → finished)
│   ├── wordSelection.ts   selectWord() — currently plain random, swap the body later
│   └── scoring.ts         awardPoint() / noPoint()
│
├── components/      # Presentation only — reads state, calls dispatch
│   ├── PlayerSetup.tsx
│   ├── Half.tsx          one half of the split "court" — rendered twice (top, rotated
│   │                     180° so that player reads it right-side up, and bottom);
│   │                     the whole half is the claim button, word + score live inside it
│   ├── NetStrip.tsx      shared strip between the two halves — round counter, end
│   │                     button, and the judge / next-round controls
│   └── GameScreen.tsx    the useReducer wiring between game.ts and the UI, plus the
│                         3-2-1 countdown timer between rounds
│
└── data/
    └── word_index.json
```

## What V1 deliberately leaves open

Per the project plan, these are still unfinalized and intentionally easy to
swap later without a rewrite:

- **Word selection** — `wordSelection.ts` is plain random today. Difficulty
  tiers (`selectEasyWord`, etc.) using `average_score` / `max_score` /
  `num_occurrences` are future work.
- **Song validation** — right now the second player on the couch acts as
  judge and taps "Point" / "No point". Showing candidate songs, letting the
  singer pick which one they meant, or automated lyric/audio matching are
  all future work.
- **Round structure** — the game currently plays until someone taps "End
  game." A fixed round count or "first to X points" rule can be added in
  `game.ts` (see the `TARGET_SCORE` constant) without touching the UI.

## Explicit non-goals for V1

No accounts, no backend, no online multiplayer, no automated singing
validation. Two players, one phone, one device. Online play (separate
phones, a realtime backend) is Phase 4 in the project plan.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base "./" so the built app works when hosted from any sub-path
// (GitHub Pages project sites, Cloudflare Pages, Netlify, etc.)
export default defineConfig({
  plugins: [react()],
  base: "./",
});

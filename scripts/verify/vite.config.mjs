import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Builds scripts/verify/probe.jsx as an SSR bundle so the real source modules
 * (with Vite's import.meta.env inlining) can be executed under Node + jsdom.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: "scripts/verify/probe.jsx",
    outDir: "scripts/verify/.dist",
    emptyOutDir: true,
    target: "node18",
    minify: false,
    sourcemap: false,
  },
});

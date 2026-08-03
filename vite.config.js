import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * AURELIA — build configuration.
 * - Vendor splitting keeps the critical path tiny (React + Lenis in separate chunks).
 * - Heavy sections (Gallery, LocationMap, CaseStudy…) are code-split per-route imports.
 * - es2020 target keeps output lean for modern evergreen browsers.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 420,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          scroll: ["lenis"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});

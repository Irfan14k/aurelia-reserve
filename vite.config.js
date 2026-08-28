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
    // Vite 5.4+ rejects unknown Host headers. Allow the sandbox preview hosts
    // (and localhost) so the dev server is reachable through a proxy.
    allowedHosts: [".e2b.app", "localhost", "127.0.0.1"],
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [".e2b.app", "localhost", "127.0.0.1"],
  },
});

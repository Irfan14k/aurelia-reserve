/**
 * Sets up a minimal DOM (jsdom) and executes the built probe, which mounts the
 * real useResidences / useEnquiry / useAuth hooks and asserts on their output.
 *
 *   npm run verify            # both modes: unconfigured + unreachable backend
 *   npm run verify:static     # no Supabase env — bundled-data fallback
 *   npm run verify:offline    # env set but backend unreachable — error paths
 *
 * jsdom is a dev-only harness dependency and is deliberately kept out of
 * package.json so production installs (Vercel) stay lean. One-time setup:
 *   npm install --no-save jsdom@^25
 */
import { pathToFileURL } from "node:url";
import path from "node:path";

let JSDOM;
try {
  ({ JSDOM } = await import("jsdom"));
} catch {
  console.error(
    "\njsdom is not installed. It is required only for this verify harness and is\n" +
      "kept out of package.json so deploy installs stay lean.\n\n" +
      "    npm install --no-save jsdom@^25\n\n" +
      "Then re-run:  npm run verify\n"
  );
  process.exit(2);
}

const nodeFetch = globalThis.fetch;

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

const { window } = dom;

globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.Element = window.Element;
globalThis.Node = window.Node;
globalThis.Event = window.Event;
globalThis.CustomEvent = window.CustomEvent;
globalThis.MutationObserver = window.MutationObserver;
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// `navigator` is a getter-only global on modern Node — define rather than assign.
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
  writable: true,
});

// jsdom does not implement fetch; keep Node's so the real HTTP error path runs.
globalThis.fetch = nodeFetch;
window.fetch = nodeFetch;

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/verify/run.mjs <path-to-built-probe>");
  process.exit(2);
}

await import(pathToFileURL(path.resolve(target)).href);

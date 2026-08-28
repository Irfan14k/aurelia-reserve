import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";

import { useResidences } from "../../src/hooks/useResidences.js";
import { useEnquiry } from "../../src/hooks/useEnquiry.js";
import { useAuth } from "../../src/hooks/useAuth.js";
import { isSupabaseConfigured } from "../../src/lib/supabase.js";
import { RESIDENCES } from "../../src/data/residences.js";

/**
 * Probe — mounts the three real hooks and reports what they did.
 * No logic is re-implemented here: the assertions read the hooks' own output.
 */
function Probe({ onSnapshot }) {
  const res = useResidences({ subscribe: false });
  const enq = useEnquiry({ memberId: null });
  const auth = useAuth();
  const [, force] = useState(0);

  useEffect(() => {
    onSnapshot({ res, enq, auth });
  });

  // Re-render a few times so async transitions are captured.
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 50);
    return () => clearInterval(t);
  }, []);

  return null;
}

const results = [];
const check = (name, pass, detail = "") =>
  results.push({ name, pass, detail });

const MODE = process.env.PROBE_MODE; // "unconfigured" | "unreachable"

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);

let snapshot = null;
await act(async () => {
  root.render(<Probe onSnapshot={(s) => (snapshot = s)} />);
});

// Let the async query / auth bootstrap settle. DNS failures against a bogus
// project ref can take several seconds, so wait on a condition, not a clock.
const settled = () => snapshot && snapshot.res.loading === false && snapshot.auth.initializing === false;
for (let i = 0; i < 300 && !settled(); i++) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 100));
  });
}

console.log(`\n— PROBE MODE: ${MODE} —`);
console.log(`isSupabaseConfigured = ${isSupabaseConfigured}`);

if (MODE === "unconfigured") {
  check("no env -> isSupabaseConfigured false", isSupabaseConfigured === false);
  check("residences serve bundled data", snapshot.res.source === "static", `source=${snapshot.res.source}`);
  check("all 3 residences present", snapshot.res.residences.length === STATIC_COUNT(), `n=${snapshot.res.residences.length}`);
  check("no error surfaced", snapshot.res.error === null, String(snapshot.res.error));
  check("not stuck loading", snapshot.res.loading === false);
  check("auth not initializing", snapshot.auth.initializing === false);
  check("no user", snapshot.auth.user === null);

  const sent = await act(async () => snapshot.enq.submit({ name: "Asha Rao", email: "asha@example.com", phone: "+91 98200 00000" }));
  check("enquiry resolves ok without backend", sent.ok === true, JSON.stringify(sent));
  check("enquiry flagged stored=false (simulated)", sent.stored === false, JSON.stringify(sent));
  check("enquiry hook reports isLive false", snapshot.enq.isLive === false);
} else {
  check("env present -> isSupabaseConfigured true", isSupabaseConfigured === true);
  check("failed query degrades to bundled data", snapshot.res.source === "static", `source=${snapshot.res.source}`);
  check("all 3 residences still present", snapshot.res.residences.length === STATIC_COUNT(), `n=${snapshot.res.residences.length}`);
  check("failure is reported, not swallowed", typeof snapshot.res.error === "string" && snapshot.res.error.length > 0, String(snapshot.res.error));
  check("not stuck loading after failure", snapshot.res.loading === false);
  check("auth settles to signed-out", snapshot.auth.initializing === false && snapshot.auth.user === null);

  const sent = await act(async () => snapshot.enq.submit({ name: "Asha Rao", email: "asha@example.com", phone: "+91 98200 00000" }));
  check("failed insert reports ok=false", sent.ok === false, JSON.stringify(sent));
  check("failed insert surfaces an error string", typeof sent.error === "string" && sent.error.length > 0, String(sent.error));
  check("enquiry hook status is 'error'", snapshot.enq.status === "error", snapshot.enq.status);

  const signIn = await act(async () => snapshot.auth.signIn({ email: "nobody@example.com", password: "wrong-password" }));
  check("sign-in failure reports ok=false", signIn.ok === false, JSON.stringify(signIn));
  check("sign-in failure surfaces an error string", typeof signIn.error === "string" && signIn.error.length > 0, String(signIn.error));
  check("still signed out after failure", snapshot.auth.user === null);
}

function STATIC_COUNT() {
  return RESIDENCES.length;
}

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed (mode=${MODE})`);

await act(async () => root.unmount());
process.exit(failed === 0 ? 0 : 1);

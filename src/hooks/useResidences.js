import { useCallback, useEffect, useRef, useState } from "react";

import { loadSupabase, isSupabaseConfigured } from "../lib/supabase";
import { RESIDENCES as STATIC_RESIDENCES, COMPARE_DATA } from "../data/residences";

/**
 * Residences — dynamic catalogue with a guaranteed static fallback.
 *
 * Reads the `residences` table ordered by `position`. When Supabase is not
 * configured, or the query fails, the bundled data from `src/data/residences.js`
 * is served instead, so the section never renders empty on the marketing site.
 *
 * `source` is `"database" | "static"` — surfaced as a small chip in the UI so a
 * reviewer can see the query actually ran.
 *
 * @returns {{
 *   residences: object[], compareData: Record<string, object>,
 *   source: "database"|"static", loading: boolean, error: string|null,
 *   refresh: () => Promise<void>
 * }}
 */
export function useResidences({ subscribe = true } = {}) {
  const [residences, setResidences] = useState(STATIC_RESIDENCES);
  const [compareData, setCompareData] = useState(COMPARE_DATA);
  // Honest about what is on screen: the bundled data renders first, so `source`
  // only becomes "database" once a query has actually resolved.
  const [source, setSource] = useState("static");
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchResidences = useCallback(async () => {
    const db = await loadSupabase();
    if (!db) {
      setResidences(STATIC_RESIDENCES);
      setCompareData(COMPARE_DATA);
      setSource("static");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error: queryError } = await db
      .from("residences")
      .select(
        "id, position, name, tag, beds, area, price, remaining, image, blurb, features, aspect, terrace, lift"
      )
      .eq("is_published", true)
      .order("position", { ascending: true });

    if (!mounted.current) return;

    if (queryError) {
      // Never break the page for a backend hiccup — degrade to the bundle.
      console.warn("[aurelia] residences query failed, using static fallback:", queryError.message);
      setResidences(STATIC_RESIDENCES);
      setCompareData(COMPARE_DATA);
      setSource("static");
      setError(queryError.message);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setResidences(STATIC_RESIDENCES);
      setCompareData(COMPARE_DATA);
      setSource("static");
      setError(null);
      setLoading(false);
      return;
    }

    const rows = data.map((r) => ({
      ...r,
      // numeric comes back as a string; the price counter needs a number.
      price: Number(r.price),
      features: Array.isArray(r.features) ? r.features : [],
    }));

    const compare = {};
    for (const r of rows) {
      compare[r.id] = {
        beds: r.beds,
        area: r.area,
        price: r.price,
        remaining: r.remaining,
        aspect: r.aspect,
        terrace: r.terrace,
        lift: r.lift,
      };
    }

    setResidences(rows);
    setCompareData(compare);
    setSource("database");
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResidences();
  }, [fetchResidences]);

  // Live availability: anyone updating `remaining` re-renders every open tab.
  useEffect(() => {
    if (!isSupabaseConfigured || !subscribe) return;
    let cancelled = false;
    let channel = null;
    let db = null;

    loadSupabase().then((client) => {
      if (cancelled || !client) return;
      db = client;
      channel = client
        .channel("residences-catalogue")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "residences" },
          () => fetchResidences()
        )
        .subscribe();
    });

    return () => {
      cancelled = true;
      if (db && channel) db.removeChannel(channel);
    };
  }, [fetchResidences, subscribe]);

  return { residences, compareData, source, loading, error, refresh: fetchResidences };
}

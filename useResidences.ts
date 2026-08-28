import { useCallback, useEffect, useState } from "react";
import { fetchResidences } from "../services/residences";
import { toMessage } from "../lib/supabase/client";
import type { Residence } from "../types/domain";

type Source = "live" | "demo";

interface UseResidencesState {
  residences: Residence[];
  loading: boolean;
  error: string | null;
  source: Source;
  refetch: () => void;
}

/** Load published residences with loading / error / empty handling. */
export function useResidences(): UseResidencesState {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<Source>("demo");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchResidences();
        if (cancelled) return;
        setResidences(result.residences);
        setSource(result.source);
      } catch (err) {
        if (cancelled) return;
        setError(toMessage(err, "Unable to load residences."));
        setResidences([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { residences, loading, error, source, refetch };
}

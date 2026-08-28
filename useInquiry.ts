import { useCallback, useRef, useState } from "react";
import { submitInquiry } from "../services/inquiries";
import { toMessage } from "../lib/supabase/client";
import type { InquiryInput } from "../types/domain";

type Status = "idle" | "submitting" | "success" | "error";

interface UseInquiryState {
  status: Status;
  error: string | null;
  isSubmitting: boolean;
  submit: (input: InquiryInput) => Promise<boolean>;
  reset: () => void;
}

/**
 * Submit a reservation / enquiry.
 *
 * Guards against duplicate submissions: a ref lock plus an isSubmitting flag
 * means rapid double-clicks or Enter-spam only ever produce one request.
 */
export function useInquiry(): UseInquiryState {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const submit = useCallback(async (input: InquiryInput): Promise<boolean> => {
    if (inFlight.current) return false;
    inFlight.current = true;

    setStatus("submitting");
    setError(null);

    try {
      await submitInquiry(input);
      setStatus("success");
      return true;
    } catch (err) {
      setError(toMessage(err, "We could not send your enquiry. Please try again."));
      setStatus("error");
      return false;
    } finally {
      inFlight.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    if (inFlight.current) return;
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, isSubmitting: status === "submitting", submit, reset };
}

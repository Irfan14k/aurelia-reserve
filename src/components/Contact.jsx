import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import { fmtINR } from "../lib/format";
import { useEnquiry, useResidences } from "../hooks";
import { useMembers } from "../context/AuthContext";

const FIELDS = [
  { id: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { id: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { id: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { id: "interest", label: "Residence of interest", type: "select", required: false },
  { id: "message", label: "What should we prepare for your visit?", type: "textarea", required: false },
];

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = "May we have your name?";
  if (!values.email.trim()) errors.email = "An email helps us reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "That email doesn't look right.";
  if (!values.phone.trim()) errors.phone = "A number for the concierge.";
  else if (!/^[+\d][\d\s-]{7,14}$/.test(values.phone)) errors.phone = "A valid number, please.";
  return errors;
};

/**
 * Contact — floating labels, validation with micro-shake, a loading
 * morph on submit, and a gold check-draw success state.
 */
export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent
  const [failure, setFailure] = useState(null);
  const formRef = useRef(null);

  const { user } = useMembers();
  const { submit, isLive } = useEnquiry({ memberId: user?.id ?? null });
  const { residences } = useResidences({ subscribe: false });

  const set = (id) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [id]: v }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  // Pre-fill and lock the identity of a signed-in member.
  useEffect(() => {
    if (!user) return;
    setValues((prev) => ({
      ...prev,
      email: prev.email || user.email || "",
      name: prev.name || user.user_metadata?.full_name || "",
    }));
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    setFailure(null);

    const res = await submit({
      name: values.name,
      email: values.email,
      phone: values.phone,
      residenceId: values.interest,
      message: values.message,
    });

    setState(res.ok ? "sent" : "idle");
    if (!res.ok) setFailure(res.error || "That enquiry did not reach the concierge.");
  };

  const inputProps = (f) => ({
    id: f.id,
    name: f.id,
    type: f.type,
    value: values[f.id],
    onChange: set(f.id),
    className: `contact__input${errors[f.id] ? " has-error" : ""}${values[f.id] ? " is-filled" : ""}`,
    autoComplete: f.autoComplete,
    "aria-invalid": Boolean(errors[f.id]),
    "aria-describedby": errors[f.id] ? `${f.id}-error` : undefined,
    required: f.required,
  });

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="contact__grid">
          {/* ——— Left: the invitation ——— */}
          <div className="contact__intro">
            <p className="eyebrow" data-reveal>07 · Private Enquiry</p>
            <h2 className="contact__title" data-reveal style={{ "--d": "120ms" }}>
              Come and <em>stand in it</em>.
            </h2>
            <p className="contact__lede lede" data-reveal style={{ "--d": "240ms" }}>
              The sea cannot be photographed. Book a private viewing —
              the concierge will have the lights low, the water warm,
              and your residence keyed for the evening.
            </p>

            <dl className="contact__details" data-reveal style={{ "--d": "360ms" }}>
              <div>
                <dt>Sales gallery</dt>
                <dd>{SITE.address}</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{SITE.hours}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </dd>
              </div>
            </dl>
          </div>

          {/* ——— Right: the form ——— */}
          <div className="contact__card glass hairline-card" data-reveal style={{ "--d": "200ms" }}>
            {state === "sent" ? (
              <div className="contact__success" role="status">
                <svg viewBox="0 0 64 64" fill="none" aria-hidden>
                  <circle cx="32" cy="32" r="30" stroke="rgba(201,169,106,0.4)" strokeWidth="1.5" />
                  <path className="check-path" d="M20 33.5 28.5 42 45 24" stroke="#E6CD94" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="contact__success-title">Your enquiry is with the concierge.</h3>
                <p className="contact__success-note">
                  Expect a call within the hour, {values.name.split(" ")[0] || "friend"}.
                  The sea will keep.
                </p>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setValues({ name: "", email: "", phone: "", interest: "", message: "" });
                    setState("idle");
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate>
                <div className="contact__field">
                  <label htmlFor="name" className="contact__label">Full name</label>
                  <input {...inputProps(FIELDS[0])} />
                  {errors.name && <p className="contact__error" id="name-error">{errors.name}</p>}
                </div>

                <div className="contact__row">
                  <div className="contact__field">
                    <label htmlFor="email" className="contact__label">Email</label>
                    <input {...inputProps(FIELDS[1])} />
                    {errors.email && <p className="contact__error" id="email-error">{errors.email}</p>}
                  </div>
                  <div className="contact__field">
                    <label htmlFor="phone" className="contact__label">Phone</label>
                    <input {...inputProps(FIELDS[2])} />
                    {errors.phone && <p className="contact__error" id="phone-error">{errors.phone}</p>}
                  </div>
                </div>

                <div className="contact__field">
                  <label htmlFor="interest" className="contact__label">Residence of interest</label>
                  <select {...inputProps(FIELDS[3])}>
                    <option value="">Any — surprise me</option>
                    {residences.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — from {fmtINR(Number(r.price) * 1e7)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact__field">
                  <label htmlFor="message" className="contact__label">What should we prepare for your visit?</label>
                  <textarea {...inputProps(FIELDS[4])} rows={3} maxLength={300} />
                  <span className="contact__count" aria-hidden>
                    {values.message.length}/300
                  </span>
                </div>

                {failure && (
                  <p className="contact__failure" role="alert">
                    {failure} — please call the concierge on {SITE.phone}.
                  </p>
                )}

                <button
                  type="submit"
                  className={`btn-lux contact__submit${state === "sending" ? " is-sending" : ""}`}
                  disabled={state === "sending"}
                  data-cursor-label="Send"
                >
                  <span className="btn-lux__sheen" aria-hidden />
                  {state === "sending" ? (
                    <span className="contact__loading" aria-hidden>
                      <i /><i /><i />
                    </span>
                  ) : (
                    "Request a private viewing"
                  )}
                </button>

                <p className="contact__fine">
                  {isLive
                    ? "Your enquiry is written to the concierge inbox. Nothing is shared beyond it."
                    : "Concept demo — no backend is attached, so nothing is stored or sent."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

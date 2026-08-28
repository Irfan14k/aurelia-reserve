import { useEffect, useState } from "react";
import { site, telHref, waHref, mailHref } from "../config/site";
import { useInquiry } from "../hooks/useInquiry";
import { useResidences } from "../hooks/useResidences";

function Field({ label, name, type = "text", required, value, onChange, error }: {
  label: string; name: string; type?: string; required?: boolean;
  value: string; onChange: (v: string) => void; error?: string;
}) {
  const filled = value.length > 0;
  return (
    <div className="relative pt-5">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`peer w-full bg-transparent border-b py-3 text-bone placeholder-transparent outline-none transition-colors ${
          error ? "border-red-400/60" : "border-parchment/20 focus:border-gold"
        }`}
        placeholder={label}
      />
      <label
        htmlFor={name}
        className={`absolute left-0 mono text-[0.6rem] tracking-[0.35em] uppercase transition-all duration-500 pointer-events-none ${
          filled ? "top-0 text-gold" : "top-8 text-parchment/40 peer-focus:top-0 peer-focus:text-gold"
        }`}
      >
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {error && <div className="mono text-[0.55rem] tracking-[0.3em] uppercase text-red-400/80 mt-2">{error}</div>}
    </div>
  );
}

const EMPTY = { first: "", last: "", email: "", phone: "", msg: "" };

export default function Contact() {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, error: submitError, isSubmitting, submit, reset } = useInquiry();
  const { residences, loading: residencesLoading } = useResidences();
  const [interestId, setInterestId] = useState<string>("");

  // Default the selector to the second residence once data arrives
  useEffect(() => {
    if (!interestId && residences.length > 0) {
      setInterestId(residences[Math.min(1, residences.length - 1)].id);
    }
  }, [residences, interestId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.first.trim()) e.first = "Required";
    if (!f.last.trim()) e.last = "Required";
    if (!f.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ok = await submit({
      firstName: f.first,
      lastName: f.last,
      email: f.email,
      phone: f.phone || undefined,
      message: f.msg || undefined,
      residenceId: interestId || null,
      source: "contact-section",
    });

    if (ok) setF(EMPTY);
  };

  const shortName = (name: string) => name.replace(/^The\s+/i, "");

  return (
    <section id="contact" className="relative py-32 md:py-44 px-6 md:px-14 bg-obsidian overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" aria-hidden />
      <div className="light-rays" aria-hidden />

      <div className="max-w-[1400px] mx-auto relative">
        <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
          <span className="w-10 h-px bg-gold" />
          <span>07 · Enquire</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-6">
            <h2 className="display text-5xl md:text-7xl leading-[0.9] text-bone" data-reveal>
              Let's build<br />something<br />
              <em className="text-gold-grad">extraordinary.</em>
            </h2>
            <p className="mt-8 text-parchment/70 leading-relaxed max-w-md serif italic" data-reveal style={{ ["--reveal-delay" as any]: "150ms" }}>
              Interested in creating a premium digital experience for your luxury project? Let's discuss your vision.
            </p>

            <div className="mt-16 space-y-6" data-reveal style={{ ["--reveal-delay" as any]: "300ms" }}>
              <div className="divider-line" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-2">Studio</div>
                  <div className="serif text-parchment/80 italic">Concept Atelier</div>
                  <div className="mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/50 mt-1">Portfolio Project</div>
                </div>
                <div>
                  <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-2">Availability</div>
                  <div className="serif text-parchment/80 italic">Open for collaboration</div>
                  <div className="mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/50 mt-1">Worldwide</div>
                </div>
              </div>
              <div className="divider-line" />
              <blockquote className="serif italic text-lg text-parchment/70 border-l-2 border-gold/40 pl-6 max-w-md">
                "Every interaction is designed to communicate calm, elegance and timeless luxury."
              </blockquote>
            </div>

            <div className="mt-12 flex flex-wrap gap-6" data-reveal style={{ ["--reveal-delay" as any]: "450ms" }}>
              {[
                { l: "Call", i: "phone", href: telHref(site.contact.phone) },
                { l: "WhatsApp", i: "chat", href: waHref(site.contact.whatsapp, "Hello — I'd like to know more about Aurelia Reserve.") },
                { l: "Email", i: "mail", href: mailHref(site.contact.email) },
              ].map((c) => {
                const glyph = (
                  <span className="w-9 h-9 rounded-full border border-parchment/20 group-hover:border-gold flex items-center justify-center transition-colors">
                    {c.i === "phone" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>}
                    {c.i === "chat" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                    {c.i === "mail" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                  </span>
                );

                if (!c.href) {
                  return (
                    <span
                      key={c.l}
                      title="Configure in src/config/site.ts"
                      className="flex items-center gap-3 mono text-[0.65rem] tracking-[0.32em] uppercase text-parchment/35 group cursor-not-allowed"
                    >
                      {glyph}
                      {c.l}
                    </span>
                  );
                }

                return (
                  <a
                    key={c.l}
                    href={c.href}
                    target={c.i === "chat" ? "_blank" : undefined}
                    rel={c.i === "chat" ? "noopener noreferrer" : undefined}
                    data-cursor={c.l}
                    className="flex items-center gap-3 mono text-[0.65rem] tracking-[0.32em] uppercase text-parchment/60 hover:text-gold transition-colors group"
                  >
                    {glyph}
                    {c.l}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-6" data-reveal style={{ ["--reveal-delay" as any]: "200ms" }}>
            <form onSubmit={onSubmit} noValidate className="glass-strong glass-reflect p-8 md:p-10 relative overflow-hidden">
              {status === "success" && (
                <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-10 z-10">
                  <svg width="72" height="72" viewBox="0 0 60 60" className="text-gold mb-6">
                    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="1"
                      strokeDasharray="180" strokeDashoffset="180"
                      style={{ animation: "circ 0.9s ease forwards" }} />
                    <path d="M 18 30 L 27 39 L 42 22" fill="none" stroke="currentColor" strokeWidth="1.5"
                      strokeDasharray="40" strokeDashoffset="40"
                      style={{ animation: "check 0.7s ease 0.8s forwards" }} />
                  </svg>
                  <div className="display text-4xl text-bone mb-2 italic">Received.</div>
                  <div className="text-parchment/60 text-sm serif italic">Your enquiry is a matter we treat with care.</div>
                  <div className="mono text-[0.55rem] tracking-[0.35em] uppercase text-gold mt-6">Confirmation · Sent</div>
                  <button
                    type="button"
                    onClick={reset}
                    data-cursor="Send"
                    className="btn-ghost mt-8 text-[0.6rem] px-5 py-3"
                  >
                    Send Another
                  </button>
                  <style>{`
                    @keyframes circ { to { stroke-dashoffset: 0; } }
                    @keyframes check { to { stroke-dashoffset: 0; } }
                  `}</style>
                </div>
              )}

              <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-8">
                Private Enquiry
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" name="first" required value={f.first} onChange={(v) => setF({ ...f, first: v })} error={errors.first} />
                  <Field label="Last Name" name="last" required value={f.last} onChange={(v) => setF({ ...f, last: v })} error={errors.last} />
                </div>
                <Field label="Email" name="email" type="email" required value={f.email} onChange={(v) => setF({ ...f, email: v })} error={errors.email} />
                <Field label="Phone" name="phone" type="tel" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />

                <div className="pt-4">
                  <label className="mono text-[0.6rem] tracking-[0.4em] uppercase text-parchment/50 mb-3 block">
                    Residence of Interest
                  </label>

                  {residencesLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-[62px] bg-ash/50 animate-pulse" />
                      ))}
                    </div>
                  ) : residences.length === 0 ? (
                    <div className="mono text-[0.58rem] tracking-[0.28em] uppercase text-parchment/40 py-3">
                      No residences published
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {residences.map((r) => (
                        <button
                          type="button"
                          key={r.id}
                          data-cursor="Select"
                          onClick={() => setInterestId(r.id)}
                          className={`text-center py-3 px-2 border transition-all duration-500 ${
                            interestId === r.id
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-parchment/20 text-parchment/60 hover:border-parchment/40"
                          }`}
                        >
                          <div className="display text-lg">{r.n}</div>
                          <div className="mono text-[0.55rem] tracking-[0.25em] uppercase mt-1 truncate">
                            {shortName(r.name)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label htmlFor="msg" className="mono text-[0.6rem] tracking-[0.4em] uppercase text-parchment/50 mb-3 block">
                    Message
                  </label>
                  <textarea
                    id="msg"
                    name="msg"
                    rows={3}
                    value={f.msg}
                    onChange={(e) => setF({ ...f, msg: e.target.value })}
                    className="w-full bg-transparent border-b border-parchment/20 py-3 text-bone placeholder-parchment/30 focus:border-gold outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
              </div>

              {status === "error" && submitError && (
                <div role="alert" className="mt-6 border-l-2 border-red-400/60 pl-4">
                  <div className="mono text-[0.58rem] tracking-[0.32em] uppercase text-red-400/90 mb-1">
                    Submission failed
                  </div>
                  <div className="text-sm text-parchment/70">{submitError}</div>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  data-cursor="Send"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold disabled:opacity-70 flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3 h-3 border border-obsidian border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting</span>
                    </>
                  ) : (
                    <>
                      <span>Start Your Project</span>
                      <span>→</span>
                    </>
                  )}
                </button>
                <button data-cursor="Book" type="button" className="btn-ghost disabled:opacity-60" disabled={isSubmitting}>
                  Book Discovery Call
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

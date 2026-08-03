/**
 * Legal disclaimer — quiet, honest, and in keeping with the brand voice.
 */
export default function LegalDisclaimer() {
  return (
    <section className="legal" aria-label="Legal disclaimer">
      <div className="wrap">
        <div className="legal__inner" data-reveal>
          <p className="legal__title">Disclaimer</p>
          <p>
            AURELIA is a concept experience. All imagery is generative or
            illustrative, all pricing is indicative, and no tower has yet
            touched the sky. Floor plans are indicative layouts for
            demonstration; final drawings are issued on request. This website
            is a portfolio piece — the building, when it comes, will be real.
          </p>
        </div>
      </div>
    </section>
  );
}

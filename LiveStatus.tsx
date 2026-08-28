import { useCountUp } from "../hooks";

function Metric({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const { n, ref } = useCountUp(target);
  return (
    <div className="flex flex-col gap-2 px-6 md:px-10 py-6 border-l border-gold/10 first:border-l-0 min-w-[160px]">
      <span ref={ref} className="display text-3xl md:text-4xl text-gold-grad">
        {n.toLocaleString()}{suffix}
      </span>
      <span className="mono text-[0.6rem] tracking-[0.35em] uppercase text-parchment/50">{label}</span>
    </div>
  );
}

export default function LiveStatus() {
  return (
    <section className="relative bg-obsidian border-y border-gold/10 z-10">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-stretch">
        <div className="flex items-center gap-4 px-6 md:px-10 py-6 border-b lg:border-b-0 lg:border-r border-gold/10 min-w-[240px]">
          <span className="live-dot" />
          <div>
            <div className="mono text-[0.6rem] tracking-[0.35em] uppercase text-parchment/50">Reserve · Live Status</div>
            <div className="serif text-sm text-bone mt-1 italic">All indicators nominal</div>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap">
          <Metric target={7} label="Residences Available" />
          <Metric target={12} label="Site Visit Slots · Wk" />
          <Metric target={1284} label="Brochure Downloads" />
          <Metric target={98} suffix="%" label="Concept Complete" />
        </div>
        <div className="px-6 md:px-10 py-6 border-t lg:border-t-0 lg:border-l border-gold/10 min-w-[220px]">
          <div className="mono text-[0.6rem] tracking-[0.35em] uppercase text-parchment/50 mb-1">Last Updated</div>
          <div className="serif text-sm text-bone italic">Moments ago · Season IV</div>
        </div>
      </div>
    </section>
  );
}

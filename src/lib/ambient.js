/**
 * Procedural ambient soundscape — no audio files, zero network cost.
 * A slow pad (two detuned oscillators), filtered wind and a low ocean
 * swell, mixed very quiet. Starts only on user gesture (autoplay-safe).
 */
let ctx = null;
let master = null;
let playing = false;
const subs = new Set();

export const isPlaying = () => playing;

export const onSoundChange = (fn) => {
  subs.add(fn);
  fn(playing);
  return () => subs.delete(fn);
};

const emit = () => subs.forEach((fn) => fn(playing));

function buildGraph() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // ——— Pad: warm detuned drone ———
  const padGain = ctx.createGain();
  padGain.gain.value = 0.5;
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 480;
  padFilter.Q.value = 0.6;
  padFilter.connect(padGain);
  padGain.connect(master);

  const oscA = ctx.createOscillator();
  oscA.type = "sine";
  oscA.frequency.value = 110;
  const oscB = ctx.createOscillator();
  oscB.type = "triangle";
  oscB.frequency.value = 164.81;
  const oscC = ctx.createOscillator();
  oscC.type = "sine";
  oscC.frequency.value = 110.6; // gentle beating

  oscA.connect(padFilter);
  oscB.connect(padFilter);
  oscC.connect(padFilter);

  // slow filter breathing
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 160;
  lfo.connect(lfoGain);
  lfoGain.connect(padFilter.frequency);

  // ——— Wind: filtered noise with slow gain ———
  const windGain = ctx.createGain();
  windGain.gain.value = 0.28;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 420;
  windFilter.Q.value = 0.5;
  windFilter.connect(windGain);
  windGain.connect(master);

  const noise = (len) => {
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  };
  const windSrc = ctx.createBufferSource();
  windSrc.buffer = noise(4);
  windSrc.loop = true;
  windSrc.connect(windFilter);

  const windLfo = ctx.createOscillator();
  windLfo.frequency.value = 0.09;
  const windLfoGain = ctx.createGain();
  windLfoGain.gain.value = 0.16;
  windLfo.connect(windLfoGain);
  windLfoGain.connect(windGain.gain);

  // ——— Ocean swell ———
  const swellGain = ctx.createGain();
  swellGain.gain.value = 0.5;
  const swellFilter = ctx.createBiquadFilter();
  swellFilter.type = "lowpass";
  swellFilter.frequency.value = 190;
  swellFilter.connect(swellGain);
  swellGain.connect(master);

  const swellSrc = ctx.createBufferSource();
  swellSrc.buffer = noise(6);
  swellSrc.loop = true;
  swellSrc.connect(swellFilter);

  const swellLfo = ctx.createOscillator();
  swellLfo.frequency.value = 0.05;
  const swellLfoGain = ctx.createGain();
  swellLfoGain.gain.value = 0.42;
  swellLfo.connect(swellLfoGain);
  swellLfoGain.connect(swellGain.gain);

  // start
  [oscA, oscB, oscC, lfo, windSrc, windLfo, swellSrc, swellLfo].forEach((n) => n.start());
}

export function toggleAmbient() {
  if (!ctx) buildGraph();
  if (!ctx) return;

  if (playing) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1);
    playing = false;
    emit();
    setTimeout(() => ctx?.suspend(), 1400);
  } else {
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 3);
    playing = true;
    emit();
  }
}

/**
 * Tiny pub/sub "app is ready" signal — set by the preloader, consumed by
 * Hero (starts its cinematic intro) without prop drilling.
 */
let ready = false;
const subs = new Set();

export const getReady = () => ready;

export const onReady = (fn) => {
  subs.add(fn);
  if (ready) fn(true);
  return () => subs.delete(fn);
};

export const setReady = (value) => {
  ready = value;
  subs.forEach((fn) => fn(value));
};

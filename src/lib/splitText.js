/**
 * Hand-rolled split-text engine (no GSAP dependency).
 * Wraps words (or chars) in masked spans:
 *   <span class="split-word"><span class="split-word__in">word</span></span>
 * Each outer span gets `--i` (its index) which drives the stagger delay.
 * Reveal by adding `.is-split` to the parent element.
 */
export function splitText(el, { type = "words", minChars = 1 } = {}) {
  if (!el || el.dataset.splitDone) return;
  el.dataset.splitDone = "1";

  let index = 0;

  const wrap = (text) => {
    const unit = type === "chars" ? Array.from(text) : text.split(/\s+/);
    return unit
      .filter((u) => u.length >= minChars || type === "words")
      .map((u, i) => {
        const outer = document.createElement("span");
        outer.className = type === "chars" ? "split-char" : "split-word";
        outer.style.setProperty("--i", `${(index + i) * (type === "chars" ? 14 : 85)}ms`);
        const inner = document.createElement("span");
        inner.className = type === "chars" ? "split-char__in" : "split-word__in";
        inner.textContent = u;
        outer.appendChild(inner);
        return outer;
      })
      .reduce((frag, node, i, arr) => {
        frag.appendChild(node);
        if (i < arr.length - 1) frag.appendChild(document.createTextNode(" "));
        return frag;
      }, document.createDocumentFragment());
  };

  const walk = (node) => {
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (!text) return;
        const frag = wrap(text);
        node.replaceChild(frag, child);
        index += text.split(/\s+/).filter(Boolean).length;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.dataset?.splitSkip) return;
        walk(child);
      }
    });
  };

  walk(el);
  return el;
}

/** Convenience: split + trigger reveal after a delay (for hero intro). */
export function splitAndReveal(el, { type = "words", delay = 0 } = {}) {
  if (!el) return;
  splitText(el, { type });
  setTimeout(() => el.classList.add("is-split"), delay);
}

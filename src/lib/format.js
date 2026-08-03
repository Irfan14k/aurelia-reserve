/** Indian-market formatting helpers. */

export const fmtINR = (n) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const fmtCrore = (n, suffix = " Cr") =>
  `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 1 : 0, maximumFractionDigits: 1 })}${suffix}`;

export const fmtArea = (sqft) => `${sqft.toLocaleString("en-IN")} sq ft`;

export const pad2 = (n) => String(n).padStart(2, "0");

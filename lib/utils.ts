export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const smootherstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** True for "[YOUR NAME]"-style placeholders. */
export const isPlaceholder = (value?: string | null) =>
  !value || /^\[.*\]$/.test(value.trim());

/** Returns the URL only when it is a real http(s)/mailto value. */
export const realLink = (value?: string | null) => {
  if (isPlaceholder(value)) return null;
  return value as string;
};

export const mailto = (email?: string | null) => {
  const real = realLink(email);
  return real ? `mailto:${real}` : null;
};

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const pad = (n: number) => String(n).padStart(2, "0");

export type Lang = "tr" | "en";

/**
 * Content that exists in two languages. A bare string means "identical in both"
 * (brand names such as SWITCHPILOT are never translated).
 */
export type Localized = string | Record<Lang, string>;

/** Dotted paths to every *string* leaf of a dictionary — typo-proof `t("a.b")`. */
type Join<K extends string, P> = P extends string ? `${K}.${P}` : never;
export type Paths<T> = T extends string
  ? never
  : T extends readonly unknown[]
    ? never
    : {
        [K in keyof T & string]: T[K] extends string ? K : Join<K, Paths<T[K]>>;
      }[keyof T & string];

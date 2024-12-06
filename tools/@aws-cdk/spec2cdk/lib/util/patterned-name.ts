export function parsePattern<A extends string>(pattern: string, fields: { [k in A]: unknown }): PatternedString<A> {
  const placeholders = Object.keys(fields);
  if (!placeholders.some((param) => pattern.includes(param))) {
    throw new Error(`--pattern must contain one of [${placeholders.join(', ')}]`);
  }

  return (values: { [k in A]: string }) => {
    let ret = pattern;
    for (const [k, v] of Object.entries(values)) {
      ret = ret.replace(`%${k}%`, String(v));
    }
    return ret;
  };
}

export type PatternValues<A extends string> = { [k in A]: string };

export type PatternedString<A extends string> = (values: PatternValues<A>) => string;

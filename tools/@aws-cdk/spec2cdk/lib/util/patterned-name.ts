const POSSIBLE_PATTERN_KEYS = ['moduleName', 'serviceName', 'serviceShortName'];

export type PatternKeys = (typeof POSSIBLE_PATTERN_KEYS)[number];

export function parsePattern<A extends string>(pattern: string): PatternedString<A> {
  if (!POSSIBLE_PATTERN_KEYS.some((param) => pattern.includes(param))) {
    // eslint-disable-next-line @cdklabs/no-throw-default-error
    throw new Error(`--pattern must contain one of [${POSSIBLE_PATTERN_KEYS.join(', ')}]`);
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

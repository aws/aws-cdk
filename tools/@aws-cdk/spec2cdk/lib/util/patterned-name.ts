export const PATTERN_FIELDS = ['moduleName', 'serviceName', 'serviceShortName'];

export type FilePatternKeys = (typeof PATTERN_FIELDS)[number];

export function parseFilePattern(pattern: string): FilePatternFormatter {
  if (!PATTERN_FIELDS.some((param) => pattern.includes(param))) {
    // eslint-disable-next-line @cdklabs/no-throw-default-error
    throw new Error(`--pattern must contain one of [${PATTERN_FIELDS.join(', ')}]`);
  }

  return (values: { [k in FilePatternKeys]: string }) => {
    let ret = pattern;
    for (const [k, v] of Object.entries(values)) {
      ret = ret.replace(`%${k}%`, String(v));
    }
    return ret;
  };
}

export type FilePatternValues = { [k in FilePatternKeys]: string };

export function substituteFilePattern(pattern: string, values: FilePatternValues): string {
  return parseFilePattern(pattern)(values);
}

export type FilePatternFormatter = (values: FilePatternValues) => string;

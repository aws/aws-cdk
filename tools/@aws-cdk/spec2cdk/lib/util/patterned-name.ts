export const PATTERN_FIELDS = ['moduleName', 'serviceName', 'serviceShortName'] as const;

export type FilePatternKeys = (typeof PATTERN_FIELDS)[number];

export function parseFilePattern(pattern: string): FilePatternFormatter {
  return (values: { [k in FilePatternKeys]: string }) => {
    let ret = pattern;
    for (const [k, v] of Object.entries(values)) {
      ret = ret.replace(`%${k}%`, String(v));
    }
    return ret;
  };
}

export type FilePatternValues = Record<FilePatternKeys, string>;

export function substituteFilePattern(pattern: string, values: FilePatternValues): string {
  return parseFilePattern(pattern)(values);
}

export type FilePatternFormatter = (values: FilePatternValues) => string;

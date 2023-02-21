import { Stats } from '../stats';

export interface SimpleStatistic {
  type: 'simple';
  statistic: string;
}

export interface GenericStatistic {
  type: 'generic';
  statistic: string;
}

export interface ParseableStatistic {
  statPrefix: string;
  statName: string;
  rawStatistic: string;
}

export interface SingleStatistic extends ParseableStatistic {
  type: 'single';
  value: number;
}

export interface PairStatistic extends ParseableStatistic {
  type: 'pair';
  isPercent: boolean;
  lower?: number;
  upper?: number;
  canBeSingleStat: boolean;
  asSingleStatStr?: string;
}

export interface PercentileStatistic extends SingleStatistic {
  statName: 'percentile';
}

export interface TrimmedMeanStatistic extends PairStatistic {
  statName: 'trimmedMean';
}

export interface WinsorizedMeanStatistic extends PairStatistic {
  statName: 'winsorizedMean';
}

export interface TrimmedCountStatistic extends PairStatistic {
  statName: 'trimmedCount';
}

export interface TrimmedSumStatistic extends PairStatistic {
  statName: 'trimmedSum';
}

function parseSingleStatistic(statistic: string, prefix: string): Omit<SingleStatistic, 'statName'> | undefined {
  const prefixLower = prefix.toLowerCase();

  // Allow `P99` uppercase
  statistic = statistic.toLowerCase();

  if (!statistic.startsWith(prefixLower)) {
    return undefined;
  }

  let r: RegExpExecArray | null = null;

  // p99.99
  // /^p(\d{1,2}(?:\.\d+)?)$/
  r = new RegExp(`^${prefixLower}(\\d{1,2}(?:\\.\\d+)?)$`).exec(statistic);
  if (r) {
    return {
      type: 'single',
      rawStatistic: statistic,
      statPrefix: prefixLower,
      value: parseFloat(r[1]),
    };
  }

  return undefined;
}

function parsePairStatistic(statistic: string, prefix: string): Omit<PairStatistic, 'statName'> | undefined {
  const prefixUpper = prefix.toUpperCase();

  // Allow `tm(10%:90%)` lowercase
  statistic = statistic.toUpperCase();

  if (!statistic.startsWith(prefixUpper)) {
    return undefined;
  }

  const common: Omit<PairStatistic, 'statName' | 'isPercent'> = {
    type: 'pair',
    canBeSingleStat: false,
    rawStatistic: statistic,
    statPrefix: prefixUpper,
  };

  let r: RegExpExecArray | null = null;

  // TM(99.999:)
  // /TM\((\d{1,2}(?:\.\d+)?):\)/
  r = new RegExp(`^${prefixUpper}\\((\\d+(?:\\.\\d+)?)\\:\\)$`).exec(statistic);
  if (r) {
    return {
      ...common,
      lower: parseFloat(r[1]),
      upper: undefined,
      isPercent: false,
    };
  }

  // TM(99.999%:)
  // /TM\((\d{1,2}(?:\.\d+)?)%:\)/
  r = new RegExp(`^${prefixUpper}\\((\\d{1,2}(?:\\.\\d+)?)%\\:\\)$`).exec(statistic);
  if (r) {
    return {
      ...common,
      lower: parseFloat(r[1]),
      upper: undefined,
      isPercent: true,
    };
  }

  // TM(:99.999)
  // /TM\(:(\d{1,2}(?:\.\d+)?)\)/
  r = new RegExp(`^${prefixUpper}\\(\\:(\\d+(?:\\.\\d+)?)\\)$`).exec(statistic);
  if (r) {
    return {
      ...common,
      lower: undefined,
      upper: parseFloat(r[1]),
      isPercent: false,
    };
  }

  // TM(:99.999%)
  // /TM\(:(\d{1,2}(?:\.\d+)?)%\)/
  // Note: this can be represented as a single stat! TM(:90%) = tm90
  r = new RegExp(`^${prefixUpper}\\(\\:(\\d{1,2}(?:\\.\\d+)?)%\\)$`).exec(statistic);
  if (r) {
    return {
      ...common,
      canBeSingleStat: true,
      asSingleStatStr: `${prefix.toLowerCase()}${r[1]}`,
      lower: undefined,
      upper: parseFloat(r[1]),
      isPercent: true,
    };
  }

  // TM(99.999:99.999)
  // /TM\((\d{1,2}(?:\.\d+)?):(\d{1,2}(?:\.\d+)?)\)/
  r = new RegExp(`^${prefixUpper}\\((\\d+(?:\\.\\d+)?)\\:(\\d+(?:\\.\\d+)?)\\)$`).exec(statistic);
  if (r) {
    return {
      ...common,
      lower: parseFloat(r[1]),
      upper: parseFloat(r[2]),
      isPercent: false,
    };
  }

  // TM(99.999%:99.999%)
  // /TM\((\d{1,2}(?:\.\d+)?)%:(\d{1,2}(?:\.\d+)?)%\)/
  r = new RegExp(`^${prefixUpper}\\((\\d{1,2}(?:\\.\\d+)?)%\\:(\\d{1,2}(?:\\.\\d+)?)%\\)$`).exec(statistic);
  if (r) {
    return {
      ...common,
      lower: parseFloat(r[1]),
      upper: parseFloat(r[2]),
      isPercent: true,
    };
  }

  return undefined;
}

export function singleStatisticToString(parsed: SingleStatistic): string {
  return `${parsed.statPrefix}${parsed.value}`;
}

export function pairStatisticToString(parsed: PairStatistic): string {
  const percent = parsed.isPercent ? '%' : '';
  const lower = parsed.lower ? `${parsed.lower}${percent}` : '';
  const upper = parsed.upper ? `${parsed.upper}${percent}` : '';
  return `${parsed.statPrefix}(${lower}:${upper})`;
}

/**
 * Parse a statistic, returning the type of metric that was used
 */
export function parseStatistic(
  stat: string,
):
  | SimpleStatistic
  | PercentileStatistic
  | TrimmedMeanStatistic
  | WinsorizedMeanStatistic
  | TrimmedCountStatistic
  | TrimmedSumStatistic
  | GenericStatistic {
  const lowerStat = stat.toLowerCase();

  // Simple statistics
  const statMap: { [k: string]: string } = {
    average: Stats.AVERAGE,
    avg: Stats.AVERAGE,
    minimum: Stats.MINIMUM,
    min: Stats.MINIMUM,
    maximum: Stats.MAXIMUM,
    max: Stats.MAXIMUM,
    samplecount: Stats.SAMPLE_COUNT,
    n: Stats.SAMPLE_COUNT,
    sum: Stats.SUM,
    iqm: Stats.IQM,
  };

  if (lowerStat in statMap) {
    return {
      type: 'simple',
      statistic: statMap[lowerStat],
    } as SimpleStatistic;
  }

  let m: ReturnType<typeof parseSingleStatistic> | ReturnType<typeof parsePairStatistic> = undefined;

  // Percentile statistics
  m = parseSingleStatistic(stat, 'p');
  if (m) return { ...m, statName: 'percentile' } as PercentileStatistic;

  // Trimmed mean statistics
  m = parseSingleStatistic(stat, 'tm') || parsePairStatistic(stat, 'tm');
  if (m) return { ...m, statName: 'trimmedMean' } as TrimmedMeanStatistic;

  // Winsorized mean statistics
  m = parseSingleStatistic(stat, 'wm') || parsePairStatistic(stat, 'wm');
  if (m) return { ...m, statName: 'winsorizedMean' } as WinsorizedMeanStatistic;

  // Trimmed count statistics
  m = parseSingleStatistic(stat, 'tc') || parsePairStatistic(stat, 'tc');
  if (m) return { ...m, statName: 'trimmedCount' } as TrimmedCountStatistic;

  // Trimmed sum statistics
  m = parseSingleStatistic(stat, 'ts') || parsePairStatistic(stat, 'ts');
  if (m) return { ...m, statName: 'trimmedSum' } as TrimmedSumStatistic;

  return {
    type: 'generic',
    statistic: stat,
  } as GenericStatistic;
}

export function normalizeStatistic(parsed: ReturnType<typeof parseStatistic>): string {
  if (parsed.type === 'simple' || parsed.type === 'generic') {
    return parsed.statistic;
  } else if (parsed.type === 'single') {
    // Avoid parsing because we might get into
    // floating point rounding issues, return as-is but lowercase the stat prefix.
    return parsed.rawStatistic.toLowerCase();
  } else if (parsed.type === 'pair') {
    // Avoid parsing because we might get into
    // floating point rounding issues, return as-is but uppercase the stat prefix.
    return parsed.rawStatistic.toUpperCase();
  }

  return '';
}

export function normalizeRawStringStatistic(stat: string): string {
  const parsed = parseStatistic(stat);
  return normalizeStatistic(parsed);
}

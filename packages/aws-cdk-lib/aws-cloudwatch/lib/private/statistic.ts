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

export interface PercentileRankStatistic extends PairStatistic {
  statName: 'percentileRank';
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

  // A decimal positive number regex (1, 1.2, 99.999, etc)
  const reDecimal = '\\d+(?:\\.\\d+)?';

  // p99.99
  // /^p(\d+(?:\.\d+)?)$/
  const r = new RegExp(`^${prefixLower}(${reDecimal})$`).exec(statistic);
  if (!r) {
    return undefined;
  }

  const value = parseFloat(r[1]);
  if (value < 0 || value > 100) {
    return undefined;
  }
  return {
    type: 'single',
    rawStatistic: statistic,
    statPrefix: prefixLower,
    value,
  };
}

/**
 * Parse a statistic that looks like `tm( LOWER : UPPER )`.
 */
function parsePairStatistic(statistic: string, prefix: string): Omit<PairStatistic, 'statName'> | undefined {
  const r = new RegExp(`^${prefix}\\(([^)]+)\\)$`, 'i').exec(statistic);
  if (!r) {
    return undefined;
  }

  const common: Omit<PairStatistic, 'statName' | 'isPercent'> = {
    type: 'pair',
    canBeSingleStat: false,
    rawStatistic: statistic,
    statPrefix: prefix.toUpperCase(),
  };

  const [lhs, rhs] = r[1].split(':');
  if (rhs === undefined) {
    // Doesn't have 2 parts
    return undefined;
  }

  const parseNumberAndPercent = (x: string): [number | undefined | 'fail', boolean] => {
    x = x.trim();
    if (!x) {
      return [undefined, false];
    }
    const value = parseFloat(x.replace(/%$/, ''));
    const percent = x.endsWith('%');
    if (isNaN(value) || value < 0 || (percent && value > 100)) {
      return ['fail', false];
    }
    return [value, percent];
  };

  const [lower, lhsPercent] = parseNumberAndPercent(lhs);
  const [upper, rhsPercent] = parseNumberAndPercent(rhs);
  if (lower === 'fail' || upper === 'fail' || (lower === undefined && upper === undefined)) {
    return undefined;
  }

  if (lower !== undefined && upper !== undefined && lhsPercent !== rhsPercent) {
    // If one value is a percentage, the other one must be too
    return undefined;
  }

  const isPercent = lhsPercent || rhsPercent;
  const canBeSingleStat = lower === undefined && isPercent;
  const asSingleStatStr = canBeSingleStat ? `${prefix.toLowerCase()}${upper}` : undefined;

  return { ...common, lower, upper, isPercent, canBeSingleStat, asSingleStatStr };
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
  | PercentileRankStatistic
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

  // Percentile Rank statistics
  m = parsePairStatistic(stat, 'pr');
  if (m) return { ...m, statName: 'percentileRank' } as PercentileRankStatistic;

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

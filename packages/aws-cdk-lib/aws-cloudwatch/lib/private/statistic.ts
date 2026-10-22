/**
 * Implementation of https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html
 */
import type { Statistic } from '../metric-types';
import { Stats } from '../stats';

export type ParsedStatistic =
  | SimpleStatistic
  | UnparseableStatistic
  | ExtendedStatisticWithoutParameters
  | ExtendedStatisticWithThreshold
  | ExtendedStatisticWithRange
  ;

export interface SimpleStatistic {
  type: 'simple';
  statistic: typeof Stats.AVERAGE | typeof Stats.MINIMUM | typeof Stats.MAXIMUM | typeof Stats.SAMPLE_COUNT | typeof Stats.SUM;
}

export interface UnparseableStatistic {
  type: 'unparseable';
  originalInput: string;
}

export interface ExtendedStatisticWithoutParameters {
  type: 'extended';
  statistic: 'IQM';
}

export interface ExtendedStatisticWithThreshold {
  type: 'single';
  statPrefix: 'p' | 'tm' | 'wm' | 'tc' | 'ts';
  value: number;
  originalInput: string;
}

export interface ExtendedStatisticWithRange {
  type: 'range';
  statPrefix: 'PR' | 'TM' | 'WM' | 'TC' | 'TS';
  originalInput: string;
  isPercent: boolean;
  lower?: number;
  upper?: number;
  asSingleStatStr?: string;
}

function parseSingleStatistic(rawStat: string, prefix: ExtendedStatisticWithThreshold['statPrefix']): ExtendedStatisticWithThreshold | undefined {
  // A decimal positive number regex (1, 1.2, 99.999, etc)
  const reDecimal = '\\d+(?:\\.\\d+)?';

  // p99.99
  // /^p(\d+(?:\.\d+)?)$/
  const r = new RegExp(`^${prefix}(${reDecimal})$`, 'i').exec(rawStat);
  if (!r) {
    return undefined;
  }

  const value = parseFloat(r[1]);
  if (value < 0 || value > 100) {
    return undefined;
  }
  return {
    type: 'single',
    originalInput: rawStat,
    statPrefix: prefix,
    value,
  };
}

/**
 * Parse a statistic that looks like `tm( LOWER : UPPER )`.
 */
function parsePairStatistic(statistic: string, prefix: ExtendedStatisticWithRange['statPrefix']): ExtendedStatisticWithRange | undefined {
  const r = new RegExp(`^${prefix}\\(([^)]+)\\)$`, 'i').exec(statistic);
  if (!r) {
    return undefined;
  }

  const partial: Omit<ExtendedStatisticWithRange, 'isPercent'> = {
    type: 'range',
    originalInput: statistic,
    statPrefix: prefix,
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

  return { ...partial, lower, upper, isPercent };
}

export function singleStatisticToString(parsed: ExtendedStatisticWithThreshold): string {
  return `${parsed.statPrefix}${parsed.value}`;
}

export function pairStatisticToString(parsed: ExtendedStatisticWithRange): string {
  const percent = parsed.isPercent ? '%' : '';
  const lower = parsed.lower ? `${parsed.lower}${percent}` : '';
  const upper = parsed.upper ? `${parsed.upper}${percent}` : '';
  return `${parsed.statPrefix}(${lower}:${upper})`;
}

/**
 * Parse a statistic, returning the type of metric that was used
 */
export function parseStatistic(stat: string): ParsedStatistic {
  const lowerStat = stat.toLowerCase();

  // Simple statistics
  const simpleStats: { [k: string]: SimpleStatistic['statistic'] } = {
    average: Stats.AVERAGE,
    avg: Stats.AVERAGE,
    minimum: Stats.MINIMUM,
    min: Stats.MINIMUM,
    maximum: Stats.MAXIMUM,
    max: Stats.MAXIMUM,
    samplecount: Stats.SAMPLE_COUNT,
    n: Stats.SAMPLE_COUNT,
    sum: Stats.SUM,
  };

  if (lowerStat in simpleStats) {
    return { type: 'simple', statistic: simpleStats[lowerStat] };
  }

  // IQM is a supported statistic but must be rendered as an ExtendedStatistic,
  // so it is classified separately from the simple statistics above.
  if (lowerStat === 'iqm') {
    return { type: 'extended', statistic: 'IQM' };
  }

  const m = parseSingleStatistic(stat, 'p')
    ?? parseSingleStatistic(stat, 'tm')
    ?? parseSingleStatistic(stat, 'wm')
    ?? parseSingleStatistic(stat, 'tc')
    ?? parseSingleStatistic(stat, 'ts')
    ?? parsePairStatistic(stat, 'PR')
    ?? parsePairStatistic(stat, 'TM')
    ?? parsePairStatistic(stat, 'WM')
    ?? parsePairStatistic(stat, 'TC')
    ?? parsePairStatistic(stat, 'TS');
  if (m) return m;

  return {
    type: 'unparseable',
    originalInput: stat,
  };
}

export function normalizeStatistic(parsed: ReturnType<typeof parseStatistic>): string {
  switch (parsed.type) {
    case 'simple':
    case 'extended':
      return parsed.statistic;
    case 'unparseable':
      return parsed.originalInput;
    case 'single':
      // Avoid parsing because we might get into
      // floating point rounding issues, return as-is but lowercase the stat prefix.
      return parsed.originalInput.toLowerCase();
    case 'range':
      // Avoid parsing because we might get into
      // floating point rounding issues, return as-is but uppercase the stat prefix.
      return parsed.originalInput.toUpperCase();
  }
}

export function normalizeRawStringStatistic(stat: string): string {
  const parsed = parseStatistic(stat);
  return normalizeStatistic(parsed);
}

export interface StatisticFields {
  readonly statistic?: Statistic;
  readonly extendedStatistic?: string;
}

export function parseStatisticToFields(statistic: string): StatisticFields {
  const parsed = parseStatistic(statistic);
  switch (parsed.type) {
    case 'simple':
      return { statistic: parsed.statistic as Statistic }; // Stats strings and Statistic enum values are the same strings
    case 'extended':
    case 'single':
    case 'range':
      return { extendedStatistic: normalizeStatistic(parsed) };
    case 'unparseable':
      // This won't be correct, but we need to leave the user's input somewhere
      return { extendedStatistic: parsed.originalInput };
  }
}

export interface SimpleStatistic {
  type: 'simple';
  statistic: Statistic;
}

export interface PercentileStatistic {
  type: 'percentile';
  percentile: number;
}

export interface GenericStatistic {
  type: 'generic';
  statistic: string;
}

/**
 * Parse a statistic, returning the type of metric that was used (simple or percentile)
 */
export function parseStatistic(stat: string): SimpleStatistic | PercentileStatistic | GenericStatistic {
  const lowerStat = stat.toLowerCase();

  // Simple statistics
  const statMap: {[k: string]: Statistic} = {
    average: Statistic.AVERAGE,
    avg: Statistic.AVERAGE,
    minimum: Statistic.MINIMUM,
    min: Statistic.MINIMUM,
    maximum: Statistic.MAXIMUM,
    max: Statistic.MAXIMUM,
    samplecount: Statistic.SAMPLE_COUNT,
    n: Statistic.SAMPLE_COUNT,
    sum: Statistic.SUM,
  };

  if (lowerStat in statMap) {
    return {
      type: 'simple',
      statistic: statMap[lowerStat],
    };
  }

  // Percentile statistics
  const re = /^p([\d.]+)$/;
  const m = re.exec(lowerStat);
  if (m) {
    return {
      type: 'percentile',
      percentile: parseFloat(m[1]),
    };
  }

  return {
    type: 'generic',
    statistic: stat,
  };
}

export function normalizeStatistic(stat: string): string {
  const parsed = parseStatistic(stat);
  if (parsed.type === 'simple' || parsed.type === 'generic') {
    return parsed.statistic;
  } else {
    // Already percentile. Avoid parsing because we might get into
    // floating point rounding issues, return as-is but lowercase the p.
    return stat.toLowerCase();
  }
}

/**
 * Enum for simple statistics
 *
 * (This is a private copy of the type in `metric-types.ts`; this type should always
 * been private, the public one has been deprecated and isn't used anywhere).
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html
 */
export enum Statistic {
  /**
   * The count (number) of data points used for the statistical calculation.
   */
  SAMPLE_COUNT = 'SampleCount',

  /**
   * The value of Sum / SampleCount during the specified period.
   */
  AVERAGE = 'Average',
  /**
   * All values submitted for the matching metric added together.
   * This statistic can be useful for determining the total volume of a metric.
   */
  SUM = 'Sum',
  /**
   * The lowest value observed during the specified period.
   * You can use this value to determine low volumes of activity for your application.
   */
  MINIMUM = 'Minimum',
  /**
   * The highest value observed during the specified period.
   * You can use this value to determine high volumes of activity for your application.
   */
  MAXIMUM = 'Maximum',
}
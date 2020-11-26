import { loadCannedMetricsFile, MetricTemplate } from './canned-metrics/canned-metrics-schema';

export type NonEmptyArray<T> = [T, ...T[]];

/**
 * A single canned service metric
 *
 * These are kindly provided to us by the good people of CloudWatch Explorer.
 */
export interface CannedMetric {
  /**
   * Metric namespace
   */
  readonly namespace: string;

  /**
   * Metric name
   */
  readonly metricName: string;

  /**
   * List of all possible dimension permutations for this metric
   *
   * Most metrics will have a single list of strings as their one set of
   * allowed dimensions, but some metrics are emitted under multiple
   * combinations of dimensions.
   */
  readonly dimensions: NonEmptyArray<string[]>;

  /**
   * Suggested default aggregration statistic
   *
   * Not always the most appropriate one to use! These defaults have
   * been classified by people and they generally just pick "Average"
   * as the default, even if it doesn't make sense.
   *
   * For example: for event-based metrics that only ever emit `1`
   * (and never `0`) the better statistic would be `Sum`.
   *
   * Use your judgement based on the type of metric this is.
   */
  readonly defaultStat: string;
}

/**
 * Return the list of canned metrics for the given service
 */
export function cannedMetricsForService(cloudFormationNamespace: string): CannedMetric[] {
  // One metricTemplate has a single set of dimensions, but the same metric NAME
  // may occur in multiple metricTemplates (if it has multiple sets of dimensions)
  const metricTemplates = cannedMetricsIndex()[cloudFormationNamespace] ?? [];

  // First construct almost what we need, but with a single dimension per metric
  const metricsWithDuplicates = flatMap(metricTemplates, metricSet => {
    const dimensions = metricSet.dimensions.map(d => d.dimensionName);
    return metricSet.metrics.map(metric => ({
      namespace: metricSet.namespace,
      dimensions,
      metricName: metric.name,
      defaultStat: metric.defaultStat,
    }));
  });

  // Then combine the dimensions for the same metrics into a single list
  return groupBy(metricsWithDuplicates, m => `${m.namespace}/${m.metricName}`).map(metrics => ({
    namespace: metrics[0].namespace,
    metricName: metrics[0].metricName,
    defaultStat: metrics[0].defaultStat,
    dimensions: Array.from(dedupeStringLists(metrics.map(m => m.dimensions))) as any,
  }));
}

type CannedMetricsIndex = Record<string, MetricTemplate[]>;

let cannedMetricsCache: CannedMetricsIndex | undefined;

/**
 * Load the canned metrics file and process it into an index, grouped by service namespace
 */
function cannedMetricsIndex() {
  if (cannedMetricsCache === undefined) {
    cannedMetricsCache = {};
    for (const group of loadCannedMetricsFile()) {
      for (const metricTemplate of group.metricTemplates) {
        const [aws, service] = metricTemplate.resourceType.split('::');
        const serviceKey = [aws, service].join('::');
        (cannedMetricsCache[serviceKey] ?? (cannedMetricsCache[serviceKey] = [])).push(metricTemplate);
      }
    }
  }
  return cannedMetricsCache;
}

function flatMap<A, B>(xs: A[], fn: (x: A) => B[]): B[] {
  return Array.prototype.concat.apply([], xs.map(fn));
}

function groupBy<A>(xs: A[], keyFn: (x: A) => string): Array<NonEmptyArray<A>> {
  const obj: Record<string, NonEmptyArray<A>> = {};
  for (const x of xs) {
    const key = keyFn(x);
    if (key in obj) {
      obj[key].push(x);
    } else {
      obj[key] = [x];
    }
  }
  return Object.values(obj);
}

function* dedupeStringLists(xs: string[][]): IterableIterator<string[]> {
  const seen = new Set<string>();
  for (const x of xs) {
    x.sort();
    const key = `${x.join(',')}`;
    if (!seen.has(key)) {
      yield x;
    }
    seen.add(key);
  }
}
/**
 * Get the canned metrics source file
 */
export function loadCannedMetricsFile(): CannedMetricsFile {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('./services.json');
}

/**
 * Schema definitions for the accompanying file "services.json".
 */
export type CannedMetricsFile = MetricInfoGroup[];

export interface MetricInfoGroup {
  /**
   * List of metric templates
   */
  readonly metricTemplates: MetricTemplate[];
}


export interface MetricTemplate {
  /**
   * CloudFormation resource name
   */
  readonly resourceType: string;

  /**
   * Metric namespace
   */
  readonly namespace: string;

  /**
   * Set of dimensions for this set of metrics
   */
  readonly dimensions: Dimension[];

  /**
   * Set of metrics these dimensions apply to
   */
  readonly metrics: Metric[];
}

/**
 * Dimension for this set of metric templates
 */
export interface Dimension {
  /**
   * Name of the dimension
   */
  readonly dimensionName: string;

  /**
   * A potential fixed value for this dimension
   *
   * (Currently unused by the spec reader, but could be used)
   */
  readonly dimensionValue?: string;
}

/**
 * A description of an available metric
 */
export interface Metric {
  /**
   * Name of the metric
   */
  readonly name: string;

  /**
   * Default (suggested) statistic for this metric
   */
  readonly defaultStat: string;
}
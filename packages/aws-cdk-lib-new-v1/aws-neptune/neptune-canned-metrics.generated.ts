/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class NeptuneMetrics {
  public static cpuUtilizationAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "CPUUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static freeLocalStorageMinimum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "FreeLocalStorage",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }

  public static freeableMemoryMinimum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "FreeableMemory",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }

  public static gremlinErrorsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "GremlinErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static gremlinRequestsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "GremlinRequests",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static gremlinRequestsPerSecAverage(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "GremlinRequestsPerSec",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static http413Sum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "Http413",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static http500Sum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "Http500",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static loaderRequestsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "LoaderRequests",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static networkReceiveThroughputSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "NetworkReceiveThroughput",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static sparqlErrorsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "SparqlErrors",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static sparqlRequestsPerSecSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "SparqlRequestsPerSec",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static volumeBytesUsedSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "VolumeBytesUsed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static volumeReadIoPsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "VolumeReadIOPs",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static volumeWriteIoPsSum(dimensions: { DBClusterIdentifier: string; }): MetricWithDims<{ DBClusterIdentifier: string; }> {
    return {
      "namespace": "AWS/Neptune",
      "metricName": "VolumeWriteIOPs",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}
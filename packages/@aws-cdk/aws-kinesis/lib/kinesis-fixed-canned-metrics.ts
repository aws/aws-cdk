import { KinesisMetrics as CannedMetrics } from './kinesis-canned-metrics.generated';

/**
 * This class is to consolidate all the metrics from Stream in just one place.
 *
 * Current generated canned metrics don't match the proper metrics from the service. If it is fixed
 * at the source this class can be removed and just use the generated one directly.
 *
 * Stream Metrics reference: https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
 */
export class KinesisMetrics {
  public static getRecordsBytesAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsSuccessAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Success',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsRecordsAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Records',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsLatencyAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordBytesAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecord.Bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordLatencyAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecord.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsIteratorAgeMillisecondsMaximum(dimensions: { StreamName: string }) {
    return CannedMetrics.getRecordsIteratorAgeMillisecondsMaximum(dimensions);
  }
  public static putRecordSuccessAverage(dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.putRecordSuccessSum(dimensions),
      statistic: 'Average',
    };
  }
  public static putRecordsBytesAverage(dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.putRecordsBytesSum(dimensions),
      statistic: 'Average',
    };
  }
  public static putRecordsLatencyAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsSuccessAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.Success',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsTotalRecordsAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.TotalRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsSuccessfulRecordsAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.SuccessfulRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsFailedRecordsAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.FailedRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsThrottledRecordsAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.ThrottledRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static incomingBytesAverage(dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.incomingBytesSum(dimensions),
      statistic: 'Average',
    };
  }
  public static incomingRecordsAverage(dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.incomingRecordsSum(dimensions),
      statistic: 'Average',
    };

  }
  public static readProvisionedThroughputExceededAverage(dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.readProvisionedThroughputExceededSum(dimensions),
      statistic: 'Average',
    };
  }
  public static writeProvisionedThroughputExceededAverage(dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.writeProvisionedThroughputExceededSum(dimensions),
      statistic: 'Average',
    };
  }
}

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
  public static getRecordsBytesAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsSuccessAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Success',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsRecordsAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Records',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsLatencyAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordBytesAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecord.Bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordLatencyAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecord.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static getRecordsIteratorAgeMillisecondsMaximum(this: void, dimensions: { StreamName: string }) {
    return CannedMetrics.getRecordsIteratorAgeMillisecondsMaximum(dimensions);
  }
  public static putRecordSuccessAverage(this: void, dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.putRecordSuccessSum(dimensions),
      statistic: 'Average',
    };
  }
  public static putRecordsBytesAverage(this: void, dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.putRecordsBytesSum(dimensions),
      statistic: 'Average',
    };
  }
  public static putRecordsLatencyAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.Latency',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsSuccessAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.Success',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsTotalRecordsAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.TotalRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsSuccessfulRecordsAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.SuccessfulRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsFailedRecordsAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.FailedRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static putRecordsThrottledRecordsAverage(this: void, dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'PutRecords.ThrottledRecords',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static incomingBytesAverage(this: void, dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.incomingBytesSum(dimensions),
      statistic: 'Average',
    };
  }
  public static incomingRecordsAverage(this: void, dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.incomingRecordsSum(dimensions),
      statistic: 'Average',
    };
  }
  public static readProvisionedThroughputExceededAverage(this: void, dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.readProvisionedThroughputExceededSum(dimensions),
      statistic: 'Average',
    };
  }
  public static writeProvisionedThroughputExceededAverage(this: void, dimensions: { StreamName: string }) {
    return {
      ...CannedMetrics.writeProvisionedThroughputExceededSum(dimensions),
      statistic: 'Average',
    };
  }
}

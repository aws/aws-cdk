/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class KinesisMetrics {
  public static readProvisionedThroughputExceededSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "ReadProvisionedThroughputExceeded",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static writeProvisionedThroughputExceededSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "WriteProvisionedThroughputExceeded",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getRecordsIteratorAgeMillisecondsMaximum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "GetRecords.IteratorAgeMilliseconds",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static putRecordSuccessSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "PutRecord.Success",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putRecordsSuccessSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "PutRecords.Success",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static putRecordsBytesSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "PutRecords.Bytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getRecordsSuccessSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "GetRecords.Success",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getRecordsBytesSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "GetRecords.Bytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getRecordsRecordsSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "GetRecords.Records",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static getRecordsLatencyMaximum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "GetRecords.Latency",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }

  public static incomingBytesSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "IncomingBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static incomingRecordsSum(dimensions: { StreamName: string; }): MetricWithDims<{ StreamName: string; }> {
    return {
      "namespace": "AWS/Kinesis",
      "metricName": "IncomingRecords",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}
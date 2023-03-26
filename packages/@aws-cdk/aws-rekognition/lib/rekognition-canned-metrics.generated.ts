// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class RekognitionMetrics {
  public static successfulRequestCountSum(dimensions: { Operation: string }) {
    return {
      namespace: 'AWS/Rekognition',
      metricName: 'SuccessfulRequestCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static serverErrorCountSum(dimensions: { Operation: string }) {
    return {
      namespace: 'AWS/Rekognition',
      metricName: 'ServerErrorCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static detectedFaceCountSum(dimensions: { Operation: string }) {
    return {
      namespace: 'AWS/Rekognition',
      metricName: 'DetectedFaceCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static detectedLabelCountSum(dimensions: { Operation: string }) {
    return {
      namespace: 'AWS/Rekognition',
      metricName: 'DetectedLabelCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static responseTimeAverage(dimensions: { Operation: string }) {
    return {
      namespace: 'AWS/Rekognition',
      metricName: 'ResponseTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static userErrorCountSum(dimensions: { Operation: string }) {
    return {
      namespace: 'AWS/Rekognition',
      metricName: 'UserErrorCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}

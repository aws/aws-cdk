// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class KMSMetrics {
  public static secondsUntilKeyMaterialExpirationAverage(dimensions: { KeyId: string }) {
    return {
      namespace: 'AWS/KMS',
      metricName: 'SecondsUntilKeyMaterialExpiration',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}

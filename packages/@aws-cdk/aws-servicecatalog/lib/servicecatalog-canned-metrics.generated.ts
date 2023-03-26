// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class ServiceCatalogMetrics {
  public static provisionedProductLaunchSum(dimensions: { ProductId: string }) {
    return {
      namespace: 'AWS/ServiceCatalog',
      metricName: 'ProvisionedProductLaunch',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}

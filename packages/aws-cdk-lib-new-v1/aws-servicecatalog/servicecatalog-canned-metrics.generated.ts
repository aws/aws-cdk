/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ServiceCatalogMetrics {
  public static provisionedProductLaunchSum(dimensions: { ProductId: string; }): MetricWithDims<{ ProductId: string; }> {
    return {
      "namespace": "AWS/ServiceCatalog",
      "metricName": "ProvisionedProductLaunch",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}
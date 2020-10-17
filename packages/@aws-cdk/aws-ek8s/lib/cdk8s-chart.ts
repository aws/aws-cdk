import * as eks from '@aws-cdk/aws-eks';
import * as cdk8s from 'cdk8s';

/**
 * EKS custom chart that is backed by a cdk8s chart.
 */
export class Cdk8sChart implements eks.ICustomChart {

  private readonly chart: cdk8s.Chart;

  constructor(chart: cdk8s.Chart) {
    this.chart = chart;
  }

  /**
   * Convert the chart into a kuberenetes manifest.
   */
  public toManifest(): any[] {
    return this.chart.toJson();
  }

}
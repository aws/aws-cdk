import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { Construct, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Helm Chart Properties.
 */
export interface HelmChartProps {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The name of the release.
   */
  readonly name: string;

  /**
   * The name of the chart.
   */
  readonly chart: string;

  /**
   * The chart version to install.
   * @default - If this is not specified, the latest version is installed
   */
  readonly version?: string;

  /**
   * The repository which contains the chart. For example: https://kubernetes-charts.storage.googleapis.com/
   * @default - No repository will be used, which means that the chart needs to be an absolute URL.
   */
  readonly repository?: string;

  /**
   * The Kubernetes namespace scope of the requests.
   * @default default
   */
  readonly namespace?: string;

  /**
   * The values used to generate the release.
   * @default - No values are provided to the chart.
   */
  readonly values?: {[key: string]: any};
}

/**
 * Represents a helm chart within the Kubernetes system.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
export class HelmChart extends Construct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-HelmChart';

  constructor(scope: Construct, id: string, props: HelmChartProps) {
    super(scope, id);

    const stack = Stack.of(this);

    // we maintain a single manifest custom resource handler for each cluster
    const handler = props.cluster._helmChartHandler;
    if (!handler) {
      throw new Error(`Cannot define a Helm chart on a cluster with kubectl disabled`);
    }

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(handler),
      resourceType: HelmChart.RESOURCE_TYPE,
      properties: {
        Name: props.name,
        Chart: props.chart,
        Version: props.version,
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace || 'default',
        Repository: props.repository
      }
    });
  }
}

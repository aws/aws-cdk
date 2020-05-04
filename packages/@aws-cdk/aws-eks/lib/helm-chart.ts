import { Construct, CustomResource, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Helm Chart options.
 */

export interface HelmChartOptions {
  /**
   * The name of the chart.
   */
  readonly chart: string;

  /**
   * The name of the release.
   * @default - If no release name is given, it will use the last 53 characters of the node's unique id.
   */
  readonly release?: string;

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
   * The values to be used by the chart.
   * @default - No values are provided to the chart.
   */
  readonly values?: {[key: string]: any};

  /**
   * Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a
   * Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.
   * @default - Helm will not wait before marking release as successful
   */
  readonly wait?: boolean;
}

/**
 * Helm Chart properties.
 */
export interface HelmChartProps extends HelmChartOptions {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;
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

    const provider = props.cluster._kubectlProvider;

    new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: HelmChart.RESOURCE_TYPE,
      properties: {
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._getKubectlCreationRoleArn(provider.role),
        Release: props.release || this.node.uniqueId.slice(-53).toLowerCase(), // Helm has a 53 character limit for the name
        Chart: props.chart,
        Version: props.version,
        Wait: props.wait || false,
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace || 'default',
        Repository: props.repository,
      },
    });
  }
}

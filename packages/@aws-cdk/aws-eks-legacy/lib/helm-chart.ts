import * as path from 'path';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, Names, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';
import { KubectlLayer } from './kubectl-layer';

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
   * @default - If no release name is given, it will use the last 63 characters of the node's unique id.
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

    // we maintain a single manifest custom resource handler for each cluster
    const handler = this.getOrCreateHelmChartHandler(props.cluster);
    if (!handler) {
      throw new Error('Cannot define a Helm chart on a cluster with kubectl disabled');
    }

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(handler),
      resourceType: HelmChart.RESOURCE_TYPE,
      properties: {
        Release: props.release || Names.uniqueId(this).slice(-63).toLowerCase(), // Helm has a 63 character limit for the name
        Chart: props.chart,
        Version: props.version,
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace || 'default',
        Repository: props.repository,
      },
    });
  }

  private getOrCreateHelmChartHandler(cluster: Cluster): lambda.IFunction | undefined {
    if (!cluster.kubectlEnabled) {
      return undefined;
    }

    let handler = cluster.node.tryFindChild('HelmChartHandler') as lambda.IFunction;
    if (!handler) {
      handler = new lambda.Function(cluster, 'HelmChartHandler', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'helm-chart')),
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: 'index.handler',
        timeout: Duration.minutes(15),
        layers: [KubectlLayer.getOrCreate(this, { version: '2.0.0-beta1' })],
        memorySize: 256,
        environment: {
          CLUSTER_NAME: cluster.clusterName,
        },

        // NOTE: we must use the default IAM role that's mapped to "system:masters"
        // as the execution role of this custom resource handler. This is the only
        // way to be able to interact with the cluster after it's been created.
        role: cluster._defaultMastersRole,
      });
    }
    return handler;
  }
}

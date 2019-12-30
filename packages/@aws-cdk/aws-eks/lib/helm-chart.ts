import { CustomResource, NestedStack } from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';
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

    if (!props.cluster._clusterResource) {
      throw new Error(`Cannot define a Helm chart on a cluster with kubectl disabled`);
    }

    const stack = Stack.of(this);

    const provider = HelmResourceProvider.getOrCreate(this);

    new CustomResource(this, 'Resource', {
      provider: provider.provider,
      resourceType: HelmChart.RESOURCE_TYPE,
      properties: {
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._clusterResource.getCreationRoleArn(provider.role),
        Release: props.release || this.node.uniqueId.slice(-63).toLowerCase(), // Helm has a 63 character limit for the name
        Chart: props.chart,
        Version: props.version,
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace || 'default',
        Repository: props.repository
      }
    });
  }
}

class HelmResourceProvider extends NestedStack {
  /**
   * Creates a stack-singleton resource provider nested stack.
   */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-eks.HelmResourceProvider';
    return stack.node.tryFindChild(uid) as HelmResourceProvider || new HelmResourceProvider(stack, uid);
  }

  /**
   * The custom resource provider.
   */
  public readonly provider: cr.Provider;

  /**
   * The IAM role used to execute this provider.
   */
  public readonly role: iam.IRole;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'helm-chart')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      layers: [ KubectlLayer.getOrCreate(this, { version: "2.0.0-beta1" }) ],
      memorySize: 256,
    });

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler
    });

    this.role = handler.role!;

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: [ 'eks:DescribeCluster' ],
      resources: [ '*' ]
    }));
  }
}

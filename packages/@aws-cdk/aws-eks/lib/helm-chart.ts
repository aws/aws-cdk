import { Asset } from '@aws-cdk/aws-s3-assets';
import { CustomResource, Duration, Names, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { KubectlProvider } from './kubectl-provider';

/**
 * Helm Chart options.
 */

export interface HelmChartOptions {
  /**
   * The name of the chart.
   * Either this or `chartAsset` must be specified.
   *
   * @default - No chart name. Implies `chartAsset` is used.
   */
  readonly chart?: string;

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
   * The repository which contains the chart. For example: https://charts.helm.sh/stable/
   * @default - No repository will be used, which means that the chart needs to be an absolute URL.
   */
  readonly repository?: string;

  /**
  * The chart in the form of an asset.
  * Either this or `chart` must be specified.
  *
  * @default - No chart asset. Implies `chart` is used.
  */
  readonly chartAsset?: Asset;

  /**
   * The Kubernetes namespace scope of the requests.
   * @default default
   */
  readonly namespace?: string;

  /**
   * The values to be used by the chart.
   * For nested values use a nested dictionary. For example:
   * values: {
   *  installationCRDs: true,
   *  webhook: { port: 9443 }
   * }
   * @default - No values are provided to the chart.
   */
  readonly values?: {[key: string]: any};

  /**
   * Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a
   * Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.
   * @default - Helm will not wait before marking release as successful
   */
  readonly wait?: boolean;

  /**
   * Amount of time to wait for any individual Kubernetes operation. Maximum 15 minutes.
   * @default Duration.minutes(5)
   */
  readonly timeout?: Duration;

  /**
   * create namespace if not exist
   * @default true
   */
  readonly createNamespace?: boolean;

  /**
   * if set, no CRDs will be installed
   * @default - CRDs are installed if not already present
   */
  readonly skipCrds?: boolean;
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
  readonly cluster: ICluster;
}

/**
 * Represents a helm chart within the Kubernetes system.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
export class HelmChart extends Construct {
  /**
   * The CloudFormation resource type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-HelmChart';

  constructor(scope: Construct, id: string, props: HelmChartProps) {
    super(scope, id);

    const stack = Stack.of(this);

    const provider = KubectlProvider.getOrCreate(this, props.cluster);

    const timeout = props.timeout?.toSeconds();
    if (timeout && timeout > 900) {
      throw new Error('Helm chart timeout cannot be higher than 15 minutes.');
    }

    if (!props.chart && !props.chartAsset) {
      throw new Error("Either 'chart' or 'chartAsset' must be specified to install a helm chart");
    }

    if (props.chartAsset && (props.repository || props.version)) {
      throw new Error(
        "Neither 'repository' nor 'version' can be used when configuring 'chartAsset'",
      );
    }

    // default not to wait
    const wait = props.wait ?? false;
    // default to create new namespace
    const createNamespace = props.createNamespace ?? true;
    // default to not skip crd installation
    const skipCrds = props.skipCrds ?? false;

    props.chartAsset?.grantRead(provider.handlerRole);

    new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: HelmChart.RESOURCE_TYPE,
      properties: {
        ClusterName: props.cluster.clusterName,
        RoleArn: provider.roleArn, // TODO: bake into the provider's environment
        Release: props.release ?? Names.uniqueId(this).slice(-53).toLowerCase(), // Helm has a 53 character limit for the name
        Chart: props.chart,
        ChartAssetURL: props.chartAsset?.s3ObjectUrl,
        Version: props.version,
        Wait: wait || undefined, // props are stringified so we encode “false” as undefined
        Timeout: timeout ? `${timeout.toString()}s` : undefined, // Helm v3 expects duration instead of integer
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace ?? 'default',
        Repository: props.repository,
        CreateNamespace: createNamespace || undefined,
        SkipCrds: skipCrds || undefined,
      },
    });
  }
}

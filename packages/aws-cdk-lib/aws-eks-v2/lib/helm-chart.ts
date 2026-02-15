import { Construct } from 'constructs';
import type { ICluster } from './cluster';
import { KubectlProvider } from './kubectl-provider';
import type { Asset } from '../../aws-s3-assets';
import type { Duration, RemovalPolicy } from '../../core';
import { CustomResource, Names, Stack, ValidationError } from '../../core';

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
   * Whether or not Helm should treat this operation as atomic; if set, upgrade process rolls back changes
   * made in case of failed upgrade. The --wait flag will be set automatically if --atomic is used.
   * @default false
   */
  readonly atomic?: boolean;

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

  /**
   * The removal policy applied to the custom resource that manages the Helm chart.
   *
   * The removal policy controls what happens to the resource if it stops being managed by CloudFormation.
   * This can happen in one of three situations:
   *
   * - The resource is removed from the template, so CloudFormation stops managing it
   * - A change to the resource is made that requires it to be replaced, so CloudFormation stops managing it
   * - The stack is deleted, so CloudFormation stops managing all resources in it
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
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

  /**
   * The name of the chart.
   */
  public readonly chart?: string;

  /**
   * The repository which contains the chart.
   */
  public readonly repository?: string;

  /**
   * The chart version to install.
   */
  public readonly version?: string;

  /**
   * The chart in the form of an asset.
   */
  public readonly chartAsset?: Asset;

  /**
   * Whether or not Helm should treat this operation as atomic.
   */
  public readonly atomic?: boolean;

  constructor(scope: Construct, id: string, props: HelmChartProps) {
    super(scope, id);

    // Exposing these properties is done for convenience
    // For more details see issue #26678
    this.chart = props.chart;
    this.repository = props.repository;
    this.version = props.version;
    this.chartAsset = props.chartAsset;

    const stack = Stack.of(this);

    const provider = KubectlProvider.getKubectlProvider(this, props.cluster);
    if (!provider) {
      throw new ValidationError('Kubectl Provider is not defined in this cluster. Define it when creating the cluster', this);
    }

    const timeout = props.timeout?.toSeconds();
    if (timeout && timeout > 900) {
      throw new ValidationError('Helm chart timeout cannot be higher than 15 minutes.', this);
    }

    if (!this.chart && !this.chartAsset) {
      throw new ValidationError("Either 'chart' or 'chartAsset' must be specified to install a helm chart", this);
    }

    if (this.chartAsset && (this.repository || this.version)) {
      throw new ValidationError(
        "Neither 'repository' nor 'version' can be used when configuring 'chartAsset'",
        this,
      );
    }

    // default not to wait
    const wait = props.wait ?? false;
    // default to create new namespace
    const createNamespace = props.createNamespace ?? true;
    // default to not skip crd installation
    const skipCrds = props.skipCrds ?? false;
    // default to set atomic as false
    const atomic = props.atomic ?? false;

    this.chartAsset?.grantRead(provider.role!);

    new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: HelmChart.RESOURCE_TYPE,
      removalPolicy: props.removalPolicy,
      properties: {
        ClusterName: props.cluster.clusterName,
        Release: props.release ?? Names.uniqueId(this).slice(-53).toLowerCase(), // Helm has a 53 character limit for the name
        Chart: this.chart,
        ChartAssetURL: this.chartAsset?.s3ObjectUrl,
        Version: this.version,
        Wait: wait || undefined, // props are stringified so we encode “false” as undefined
        Timeout: timeout ? `${timeout.toString()}s` : undefined, // Helm v3 expects duration instead of integer
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace ?? 'default',
        Repository: this.repository,
        CreateNamespace: createNamespace || undefined,
        SkipCrds: skipCrds || undefined,
        Atomic: atomic || undefined, // props are stringified so we encode “false” as undefined
      },
    });
  }
}

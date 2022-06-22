import * as fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Node } from 'constructs';
import { Cluster } from './cluster';
import { HelmChart } from './helm-chart';
import { ServiceAccount } from './service-account';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Duration, Names, Stack } from '@aws-cdk/core';

/**
 * Controller version.
 *
 * Corresponds to the image tag of 'amazon/aws-load-balancer-controller' image.
 */
export class AlbControllerVersion {

  /**
   * v2.0.0
   */
  public static readonly V2_0_0 = new AlbControllerVersion('v2.0.0', false);

  /**
   * v2.0.1
   */
  public static readonly V2_0_1 = new AlbControllerVersion('v2.0.1', false);

  /**
   * v2.1.0
   */
  public static readonly V2_1_0 = new AlbControllerVersion('v2.1.0', false);

  /**
   * v2.1.1
   */
  public static readonly V2_1_1 = new AlbControllerVersion('v2.1.1', false);

  /**
   * v2.1.2
   */
  public static readonly V2_1_2 = new AlbControllerVersion('v2.1.2', false);

  /**
   * v2.1.3
   */
  public static readonly V2_1_3 = new AlbControllerVersion('v2.1.3', false);

  /**
   * v2.0.0
   */
  public static readonly V2_2_0 = new AlbControllerVersion('v2.2.0', false);

  /**
   * v2.2.1
   */
  public static readonly V2_2_1 = new AlbControllerVersion('v2.2.1', false);

  /**
   * v2.2.2
   */
  public static readonly V2_2_2 = new AlbControllerVersion('v2.2.2', false);

  /**
   * v2.2.3
   */
  public static readonly V2_2_3 = new AlbControllerVersion('v2.2.3', false);

  /**
   * v2.2.4
   */
  public static readonly V2_2_4 = new AlbControllerVersion('v2.2.4', false);

  /**
   * v2.3.0
   */
  public static readonly V2_3_0 = new AlbControllerVersion('v2.3.0', false);

  /**
   * v2.3.1
   */
  public static readonly V2_3_1 = new AlbControllerVersion('v2.3.1', false);

  /**
   * v2.4.1
   */
  public static readonly V2_4_1 = new AlbControllerVersion('v2.4.1', false);

  /**
   * Specify a custom version.
   * Use this if the version you need is not available in one of the predefined versions.
   * Note that in this case, you will also need to provide an IAM policy in the controller options.
   *
   * @param version The version number.
   */
  public static of(version: string) {
    return new AlbControllerVersion(version, true);
  }

  private constructor(
    /**
     * The version string.
     */
    public readonly version: string,
    /**
     * Whether or not its a custom version.
     */
    public readonly custom: boolean) { }
}

/**
 * ALB Scheme.
 *
 * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.3/guide/ingress/annotations/#scheme
 */
export enum AlbScheme {

  /**
   * The nodes of an internal load balancer have only private IP addresses.
   * The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes.
   * Therefore, internal load balancers can only route requests from clients with access to the VPC for the load balancer.
   */
  INTERNAL = 'internal',

  /**
   * An internet-facing load balancer has a publicly resolvable DNS name, so it can route requests from clients over the internet
   * to the EC2 instances that are registered with the load balancer.
   */
  INTERNET_FACING = 'internet-facing'
}

/**
 * Options for `AlbController`.
 */
export interface AlbControllerOptions {

  /**
   * Version of the controller.
   */
  readonly version: AlbControllerVersion;

  /**
   * The repository to pull the controller image from.
   *
   * Note that the default repository works for most regions, but not all.
   * If the repository is not applicable to your region, use a custom repository
   * according to the information here: https://github.com/kubernetes-sigs/aws-load-balancer-controller/releases.
   *
   * @default '602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller'
   */
  readonly repository?: string;

  /**
   * The IAM policy to apply to the service account.
   *
   * If you're using one of the built-in versions, this is not required since
   * CDK ships with the appropriate policies for those versions.
   *
   * However, if you are using a custom version, this is required (and validated).
   *
   * @default - Corresponds to the predefined version.
   */
  readonly policy?: any;

  /**
   * The aws-load-balancer-controller Helm Chart version.
   *
   * @default '1.4.1'
   */
  readonly chartVersion?: string;

}

/**
 * Properties for `AlbController`.
 */
export interface AlbControllerProps extends AlbControllerOptions {

  /**
   * [disable-awslint:ref-via-interface]
   * Cluster to install the controller onto.
   */
  readonly cluster: Cluster;
}

/**
 * Construct for installing the AWS ALB Contoller on EKS clusters.
 *
 * Use the factory functions `get` and `getOrCreate` to obtain/create instances of this controller.
 *
 * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller
 *
 */
export class AlbController extends Construct {

  /**
   * Create the controller construct associated with this cluster and scope.
   *
   * Singleton per stack/cluster.
   */
  public static create(scope: Construct, props: AlbControllerProps) {
    const stack = Stack.of(scope);
    const uid = AlbController.uid(props.cluster);
    return new AlbController(stack, uid, props);
  }

  private static uid(cluster: Cluster) {
    return `${Names.nodeUniqueId(cluster.node)}-AlbController`;
  }

  public constructor(scope: Construct, id: string, props: AlbControllerProps) {
    super(scope, id);

    const namespace = 'kube-system';
    const serviceAccount = new ServiceAccount(this, 'alb-sa', { namespace, name: 'aws-load-balancer-controller', cluster: props.cluster });

    if (props.version.custom && !props.policy) {
      throw new Error("'albControllerOptions.policy' is required when using a custom controller version");
    }

    // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#iam-permissions
    const policy: any = props.policy ?? JSON.parse(fs.readFileSync(path.join(__dirname, 'addons', `alb-iam_policy-${props.version.version}.json`), 'utf8'));

    for (const statement of policy.Statement) {
      serviceAccount.addToPrincipalPolicy(iam.PolicyStatement.fromJson(statement));
    }

    // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#add-controller-to-cluster
    const chart = new HelmChart(this, 'Resource', {
      cluster: props.cluster,
      chart: 'aws-load-balancer-controller',
      repository: 'https://aws.github.io/eks-charts',
      namespace,
      release: 'aws-load-balancer-controller',

      // latest at the time of writing. We intentionally don't
      // want to expose this since helm here is just an implementation detail
      // for installing a specific version of the controller itself.
      // https://github.com/aws/eks-charts/blob/v0.0.65/stable/aws-load-balancer-controller/Chart.yaml
      version: props.chartVersion ?? '1.4.1',

      wait: true,
      timeout: Duration.minutes(15),
      values: {
        clusterName: props.cluster.clusterName,
        serviceAccount: {
          create: false,
          name: serviceAccount.serviceAccountName,
        },
        region: Stack.of(this).region,
        vpcId: props.cluster.vpc.vpcId,
        image: {
          repository: props.repository ?? '602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller',
          tag: props.version.version,
        },
      },
    });

    // the controller relies on permissions deployed using these resources.
    Node.of(chart).addDependency(serviceAccount);
    Node.of(chart).addDependency(props.cluster.openIdConnectProvider);
    Node.of(chart).addDependency(props.cluster.awsAuth);
  }
}

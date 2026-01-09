import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { Cluster, AuthenticationMode } from './cluster';
import { HelmChart } from './helm-chart';
import { ServiceAccount } from './service-account';
import * as iam from '../../aws-iam';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.

import { Aws, Duration, Names, Stack, ValidationError } from '../../core';

/**
 * Controller version.
 *
 * Corresponds to the image tag of 'amazon/aws-load-balancer-controller' image.
 */
export class AlbControllerVersion {
  /**
   * v2.0.0
   */
  public static readonly V2_0_0 = new AlbControllerVersion('v2.0.0', '1.4.1', false);

  /**
   * v2.0.1
   */
  public static readonly V2_0_1 = new AlbControllerVersion('v2.0.1', '1.4.1', false);

  /**
   * v2.1.0
   */
  public static readonly V2_1_0 = new AlbControllerVersion('v2.1.0', '1.4.1', false);

  /**
   * v2.1.1
   */
  public static readonly V2_1_1 = new AlbControllerVersion('v2.1.1', '1.4.1', false);

  /**
   * v2.1.2
   */
  public static readonly V2_1_2 = new AlbControllerVersion('v2.1.2', '1.4.1', false);

  /**
   * v2.1.3
   */
  public static readonly V2_1_3 = new AlbControllerVersion('v2.1.3', '1.4.1', false);

  /**
   * v2.0.0
   */
  public static readonly V2_2_0 = new AlbControllerVersion('v2.2.0', '1.4.1', false);

  /**
   * v2.2.1
   */
  public static readonly V2_2_1 = new AlbControllerVersion('v2.2.1', '1.4.1', false);

  /**
   * v2.2.2
   */
  public static readonly V2_2_2 = new AlbControllerVersion('v2.2.2', '1.4.1', false);

  /**
   * v2.2.3
   */
  public static readonly V2_2_3 = new AlbControllerVersion('v2.2.3', '1.4.1', false);

  /**
   * v2.2.4
   */
  public static readonly V2_2_4 = new AlbControllerVersion('v2.2.4', '1.4.1', false);

  /**
   * v2.3.0
   */
  public static readonly V2_3_0 = new AlbControllerVersion('v2.3.0', '1.4.1', false);

  /**
   * v2.3.1
   */
  public static readonly V2_3_1 = new AlbControllerVersion('v2.3.1', '1.4.1', false);

  /**
   * v2.4.1
   */
  public static readonly V2_4_1 = new AlbControllerVersion('v2.4.1', '1.4.1', false);

  /**
   * v2.4.2
   */
  public static readonly V2_4_2 = new AlbControllerVersion('v2.4.2', '1.4.3', false);

  /**
   * v2.4.3
   */
  public static readonly V2_4_3 = new AlbControllerVersion('v2.4.3', '1.4.4', false);

  /**
   * v2.4.4
   */
  public static readonly V2_4_4 = new AlbControllerVersion('v2.4.4', '1.4.5', false);

  /**
   * v2.4.5
   */
  public static readonly V2_4_5 = new AlbControllerVersion('v2.4.5', '1.4.6', false);

  /**
   * v2.4.6
   */
  public static readonly V2_4_6 = new AlbControllerVersion('v2.4.6', '1.4.7', false);

  /**
   * v2.4.7
   */
  public static readonly V2_4_7 = new AlbControllerVersion('v2.4.7', '1.4.8', false);

  /**
   * v2.5.0
   */
  public static readonly V2_5_0 = new AlbControllerVersion('v2.5.0', '1.5.0', false);

  /**
   * v2.5.1
   */
  public static readonly V2_5_1 = new AlbControllerVersion('v2.5.1', '1.5.2', false);

  /**
   * v2.5.2
   */
  public static readonly V2_5_2 = new AlbControllerVersion('v2.5.2', '1.5.3', false);

  /**
   * v2.5.3
   */
  public static readonly V2_5_3 = new AlbControllerVersion('v2.5.3', '1.5.4', false);

  /**
   * v2.5.4
   */
  public static readonly V2_5_4 = new AlbControllerVersion('v2.5.4', '1.5.5', false);

  /**
   * v2.6.0
   */
  public static readonly V2_6_0 = new AlbControllerVersion('v2.6.0', '1.6.0', false);

  /**
   * v2.6.1
   */
  public static readonly V2_6_1 = new AlbControllerVersion('v2.6.1', '1.6.1', false);

  /**
   * v2.6.2
   */
  public static readonly V2_6_2 = new AlbControllerVersion('v2.6.2', '1.6.2', false);

  /**
   * v2.7.0
   */
  public static readonly V2_7_0 = new AlbControllerVersion('v2.7.0', '1.7.0', false);

  /**
   * v2.7.1
   */
  public static readonly V2_7_1 = new AlbControllerVersion('v2.7.1', '1.7.1', false);

  /**
   * v2.7.2
   */
  public static readonly V2_7_2 = new AlbControllerVersion('v2.7.2', '1.7.2', false);

  /**
   * v2.8.0
   */
  public static readonly V2_8_0 = new AlbControllerVersion('v2.8.0', '1.8.0', false);

  /**
   * v2.8.1
   */
  public static readonly V2_8_1 = new AlbControllerVersion('v2.8.1', '1.8.1', false);

  /**
   * v2.8.2
   */
  public static readonly V2_8_2 = new AlbControllerVersion('v2.8.2', '1.8.2', false);

  /**
   * v2.8.3
   */
  public static readonly V2_8_3 = new AlbControllerVersion('v2.8.3', '1.8.3', false);

  /**
   * v2.8.4
   */
  public static readonly V2_8_4 = new AlbControllerVersion('v2.8.4', '1.8.4', false);

  /**
   * v2.8.5
   */
  public static readonly V2_8_5 = new AlbControllerVersion('v2.8.5', '1.8.5', false);

  /**
   * v2.8.6
   */
  public static readonly V2_8_6 = new AlbControllerVersion('v2.8.6', '1.8.6', false);

  /**
   * v2.9.0
   */
  public static readonly V2_9_0 = new AlbControllerVersion('v2.9.0', '1.9.0', false);

  /**
   * v2.9.1
   */
  public static readonly V2_9_1 = new AlbControllerVersion('v2.9.1', '1.9.1', false);

  /**
   * v2.9.2
   */
  public static readonly V2_9_2 = new AlbControllerVersion('v2.9.2', '1.9.2', false);

  /**
   * v2.9.3
   */
  public static readonly V2_9_3 = new AlbControllerVersion('v2.9.3', '1.9.3', false);

  /**
   * v2.10.0
   */
  public static readonly V2_10_0 = new AlbControllerVersion('v2.10.0', '1.10.0', false);

  /**
   * v2.10.1
   */
  public static readonly V2_10_1 = new AlbControllerVersion('v2.10.1', '1.10.1', false);

  /**
   * v2.11.0
   */
  public static readonly V2_11_0 = new AlbControllerVersion('v2.11.0', '1.11.0', false);

  /**
   * v2.12.0
   */
  public static readonly V2_12_0 = new AlbControllerVersion('v2.12.0', '1.12.0', false);

  /**
   * v2.12.1
   */
  public static readonly V2_12_1 = new AlbControllerVersion('v2.12.1', '1.12.1', false);

  /**
   * v2.13.0
   */
  public static readonly V2_13_0 = new AlbControllerVersion('v2.13.0', '1.13.0', false);

  /**
   * v2.13.1
   */
  public static readonly V2_13_1 = new AlbControllerVersion('v2.13.1', '1.13.1', false);

  /**
   * v2.13.2
   */
  public static readonly V2_13_2 = new AlbControllerVersion('v2.13.2', '1.13.2', false);

  /**
   * v2.13.3
   */
  public static readonly V2_13_3 = new AlbControllerVersion('v2.13.3', '1.13.3', false);

  /**
   * Specify a custom version and an associated helm chart version.
   * Use this if the version you need is not available in one of the predefined versions.
   * Note that in this case, you will also need to provide an IAM policy in the controller options.
   *
   * ALB controller version and helm chart version compatibility information can be found
   * here: https://github.com/aws/eks-charts/blob/v0.0.133/stable/aws-load-balancer-controller/Chart.yaml
   *
   * @param version The version number.
   * @param helmChartVersion The version of the helm chart. Version 1.4.1 is the default version to support legacy
   * users.
   */
  public static of(version: string, helmChartVersion: string = '1.4.1') {
    return new AlbControllerVersion(version, helmChartVersion, true);
  }

  private constructor(
    /**
     * The version string.
     */
    public readonly version: string,
    /**
     * The version of the helm chart to use.
     */
    public readonly helmChartVersion: string,
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
  INTERNET_FACING = 'internet-facing',
}

/**
 * Security mode for ALB Controller IAM policies.
 */
export enum AlbControllerSecurityMode {
  /**
   * Compatible mode - uses the same IAM policy patterns as existing versions.
   * This mode maintains backward compatibility but may have broader permissions.
   *
   * @default
   */
  COMPATIBLE = 'compatible',

  /**
   * Scoped mode - applies additional resource scoping to IAM policies where possible.
   * This mode provides enhanced security by limiting resource access to the cluster's VPC and region,
   * but may not be compatible with all use cases.
   */
  SCOPED = 'scoped',
}

/**
 * Helm chart options that can be set for AlbControllerChart
 * To add any new supported values refer
 * https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/helm/aws-load-balancer-controller/values.yaml
 */
export interface AlbControllerHelmChartOptions {

  /**
   * Enable or disable AWS WAFv2 on the ALB ingress controller.
   *
   * @default - no value defined for this helm chart option, so it will not be set in the helm chart values
   */
  readonly enableWafv2?: boolean;

  /**
   * Enable or disable AWS WAF on the ALB ingress controller.
   *
   * @default - no value defined for this helm chart option, so it will not be set in the helm chart values
   */
  readonly enableWaf?: boolean;
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
   * Additional helm chart values for ALB controller
   *
   * @default - no additional helm chart values
   */
  readonly additionalHelmChartValues?: AlbControllerHelmChartOptions;

  /**
   * Security mode for IAM policy resource scoping.
   *
   * - COMPATIBLE: Uses the same IAM policy patterns as existing versions (default)
   * - SCOPED: Applies additional resource scoping where possible for enhanced security
   *
   * @default AlbControllerSecurityMode.COMPATIBLE
   */
  readonly securityMode?: AlbControllerSecurityMode;
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
      throw new ValidationError("'albControllerOptions.policy' is required when using a custom controller version", this);
    }

    // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#iam-permissions
    const policy: any = props.policy ?? JSON.parse(fs.readFileSync(path.join(__dirname, 'addons', `alb-iam_policy-${props.version.version}.json`), 'utf8'));

    const securityMode = props.securityMode ?? AlbControllerSecurityMode.COMPATIBLE;

    for (const statement of policy.Statement) {
      let rewrittenStatement = {
        ...statement,
        Resource: this.rewritePolicyResources(statement.Resource, statement.Action, securityMode, props.cluster),
      };

      // In SCOPED mode, add additional conditions for enhanced security
      if (securityMode === AlbControllerSecurityMode.SCOPED) {
        rewrittenStatement = this.addScopingConditions(rewrittenStatement, props.cluster);
      }

      serviceAccount.addToPrincipalPolicy(iam.PolicyStatement.fromJson(rewrittenStatement));
    }

    // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#add-controller-to-cluster
    const chart = new HelmChart(this, 'Resource', {
      cluster: props.cluster,
      chart: 'aws-load-balancer-controller',
      repository: 'https://aws.github.io/eks-charts',
      namespace,
      release: 'aws-load-balancer-controller',
      version: props.version.helmChartVersion,
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
        ...props.additionalHelmChartValues, // additional helm chart options for ALB controller chart
      },
    });

    // the controller relies on permissions deployed using these resources.
    chart.node.addDependency(serviceAccount);
    chart.node.addDependency(props.cluster.openIdConnectProvider);
    if (props.cluster.authenticationMode != AuthenticationMode.API) {
      // ensure the dependency only when ConfigMap is supported
      chart.node.addDependency(props.cluster.awsAuth);
    }
  }

  private rewritePolicyResources(
    resources: string | string[] | undefined,
    actions: string[],
    securityMode: AlbControllerSecurityMode,
    cluster: Cluster,
  ): string | string[] | undefined {
    // This is safe to disable because we're actually replacing the literal partition with a reference to
    // the stack partition (which is hardcoded into the JSON files) to prevent issues such as
    // aws/aws-cdk#22520.
    const rewriteResource = (s: string) => {
      // eslint-disable-next-line @cdklabs/no-literal-partition
      let rewritten = s.replace('arn:aws:', `arn:${Aws.PARTITION}:`);

      // Apply additional scoping for SCOPED mode
      if (securityMode === AlbControllerSecurityMode.SCOPED) {
        rewritten = this.applyScopedResources(rewritten, actions, cluster);
      }

      return rewritten;
    };

    if (!resources) {
      return resources;
    }
    if (!Array.isArray(resources)) {
      return rewriteResource(resources);
    }
    return resources.map(rewriteResource);
  }

  private applyScopedResources(resource: string, _actions: string[], cluster: Cluster): string {
    const stack = Stack.of(this);
    const region = stack.region;
    const account = stack.account;

    // For EC2 VPC resources, scope to the cluster's VPC
    // eslint-disable-next-line @cdklabs/no-literal-partition
    if (resource.includes(`arn:${Aws.PARTITION}:ec2:*:*:vpc/*`)) {
      return `arn:${Aws.PARTITION}:ec2:${region}:${account}:vpc/${cluster.vpc.vpcId}`;
    }

    // For EC2 resources, apply region/account scoping
    // eslint-disable-next-line @cdklabs/no-literal-partition
    if (resource.includes(`arn:${Aws.PARTITION}:ec2:*:*:`)) {
      return resource.replace(`arn:${Aws.PARTITION}:ec2:*:*:`, `arn:${Aws.PARTITION}:ec2:${region}:${account}:`);
    }

    // For ELB resources, apply region/account scoping
    // eslint-disable-next-line @cdklabs/no-literal-partition
    if (resource.includes(`arn:${Aws.PARTITION}:elasticloadbalancing:*:*:`)) {
      return resource.replace(`arn:${Aws.PARTITION}:elasticloadbalancing:*:*:`, `arn:${Aws.PARTITION}:elasticloadbalancing:${region}:${account}:`);
    }

    return resource;
  }

  /**
   * Add additional scoping conditions for enhanced security in SCOPED mode.
   * This method adds region-based conditions for read-only operations with Resource: "*".
   */
  private addScopingConditions(statement: any, cluster: Cluster): any {
    const stack = Stack.of(cluster);
    const region = stack.region;

    // Only apply additional conditions to statements with Resource: "*"
    if (statement.Resource !== '*') {
      return statement;
    }

    const actions = Array.isArray(statement.Action) ? statement.Action : [statement.Action];

    // Add region scoping for EC2 read-only operations
    if (this.hasEC2ReadOnlyActions(actions)) {
      return {
        ...statement,
        Condition: {
          ...statement.Condition,
          StringEquals: {
            ...statement.Condition?.StringEquals,
            'aws:RequestedRegion': region,
          },
        },
      };
    }

    // Add region scoping for ELB read-only operations
    if (this.hasELBReadOnlyActions(actions)) {
      return {
        ...statement,
        Condition: {
          ...statement.Condition,
          StringEquals: {
            ...statement.Condition?.StringEquals,
            'aws:RequestedRegion': region,
          },
        },
      };
    }

    // Add region scoping for ACM operations (regional service)
    if (this.hasACMActions(actions)) {
      return {
        ...statement,
        Condition: {
          ...statement.Condition,
          StringEquals: {
            ...statement.Condition?.StringEquals,
            'aws:RequestedRegion': region,
          },
        },
      };
    }

    return statement;
  }

  /**
   * Check if the actions contain EC2 read-only operations that can be region-scoped.
   */
  private hasEC2ReadOnlyActions(actions: string[]): boolean {
    const ec2ReadOnlyActions = [
      'ec2:DescribeAccountAttributes',
      'ec2:DescribeAddresses',
      'ec2:DescribeAvailabilityZones',
      'ec2:DescribeInternetGateways',
      'ec2:DescribeVpcs',
      'ec2:DescribeVpcPeeringConnections',
      'ec2:DescribeSubnets',
      'ec2:DescribeSecurityGroups',
      'ec2:DescribeInstances',
      'ec2:DescribeNetworkInterfaces',
      'ec2:DescribeTags',
      'ec2:GetCoipPoolUsage',
      'ec2:DescribeCoipPools',
      'ec2:GetSecurityGroupsForVpc',
      'ec2:DescribeIpamPools',
      'ec2:DescribeRouteTables',
    ];

    return actions.some(action => ec2ReadOnlyActions.includes(action));
  }

  /**
   * Check if the actions contain ELB read-only operations that can be region-scoped.
   */
  private hasELBReadOnlyActions(actions: string[]): boolean {
    const elbReadOnlyActions = [
      'elasticloadbalancing:DescribeLoadBalancers',
      'elasticloadbalancing:DescribeLoadBalancerAttributes',
      'elasticloadbalancing:DescribeListeners',
      'elasticloadbalancing:DescribeListenerCertificates',
      'elasticloadbalancing:DescribeSSLPolicies',
      'elasticloadbalancing:DescribeRules',
      'elasticloadbalancing:DescribeTargetGroups',
      'elasticloadbalancing:DescribeTargetGroupAttributes',
      'elasticloadbalancing:DescribeTargetHealth',
      'elasticloadbalancing:DescribeTags',
      'elasticloadbalancing:DescribeTrustStores',
      'elasticloadbalancing:DescribeListenerAttributes',
      'elasticloadbalancing:DescribeCapacityReservation',
    ];

    return actions.some(action => elbReadOnlyActions.includes(action));
  }

  /**
   * Check if the actions contain ACM operations that can be region-scoped.
   */
  private hasACMActions(actions: string[]): boolean {
    const acmActions = [
      'acm:ListCertificates',
      'acm:DescribeCertificate',
    ];

    return actions.some(action => acmActions.includes(action));
  }
}

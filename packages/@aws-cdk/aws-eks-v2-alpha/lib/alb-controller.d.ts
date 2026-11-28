import { Construct } from 'constructs';
import { Cluster } from './cluster';
/**
 * Controller version.
 *
 * Corresponds to the image tag of 'amazon/aws-load-balancer-controller' image.
 */
export declare class AlbControllerVersion {
    /**
     * The version string.
     */
    readonly version: string;
    /**
     * The version of the helm chart to use.
     */
    readonly helmChartVersion: string;
    /**
     * Whether or not its a custom version.
     */
    readonly custom: boolean;
    /**
     * v2.0.0
     */
    static readonly V2_0_0: AlbControllerVersion;
    /**
     * v2.0.1
     */
    static readonly V2_0_1: AlbControllerVersion;
    /**
     * v2.1.0
     */
    static readonly V2_1_0: AlbControllerVersion;
    /**
     * v2.1.1
     */
    static readonly V2_1_1: AlbControllerVersion;
    /**
     * v2.1.2
     */
    static readonly V2_1_2: AlbControllerVersion;
    /**
     * v2.1.3
     */
    static readonly V2_1_3: AlbControllerVersion;
    /**
     * v2.0.0
     */
    static readonly V2_2_0: AlbControllerVersion;
    /**
     * v2.2.1
     */
    static readonly V2_2_1: AlbControllerVersion;
    /**
     * v2.2.2
     */
    static readonly V2_2_2: AlbControllerVersion;
    /**
     * v2.2.3
     */
    static readonly V2_2_3: AlbControllerVersion;
    /**
     * v2.2.4
     */
    static readonly V2_2_4: AlbControllerVersion;
    /**
     * v2.3.0
     */
    static readonly V2_3_0: AlbControllerVersion;
    /**
     * v2.3.1
     */
    static readonly V2_3_1: AlbControllerVersion;
    /**
     * v2.4.1
     */
    static readonly V2_4_1: AlbControllerVersion;
    /**
     * v2.4.2
     */
    static readonly V2_4_2: AlbControllerVersion;
    /**
     * v2.4.3
     */
    static readonly V2_4_3: AlbControllerVersion;
    /**
     * v2.4.4
     */
    static readonly V2_4_4: AlbControllerVersion;
    /**
     * v2.4.5
     */
    static readonly V2_4_5: AlbControllerVersion;
    /**
     * v2.4.6
     */
    static readonly V2_4_6: AlbControllerVersion;
    /**
     * v2.4.7
     */
    static readonly V2_4_7: AlbControllerVersion;
    /**
     * v2.5.0
     */
    static readonly V2_5_0: AlbControllerVersion;
    /**
     * v2.5.1
     */
    static readonly V2_5_1: AlbControllerVersion;
    /**
     * v2.5.2
     */
    static readonly V2_5_2: AlbControllerVersion;
    /**
     * v2.5.3
     */
    static readonly V2_5_3: AlbControllerVersion;
    /**
     * v2.5.4
     */
    static readonly V2_5_4: AlbControllerVersion;
    /**
     * v2.6.0
     */
    static readonly V2_6_0: AlbControllerVersion;
    /**
     * v2.6.1
     */
    static readonly V2_6_1: AlbControllerVersion;
    /**
     * v2.6.2
     */
    static readonly V2_6_2: AlbControllerVersion;
    /**
     * v2.7.0
     */
    static readonly V2_7_0: AlbControllerVersion;
    /**
     * v2.7.1
     */
    static readonly V2_7_1: AlbControllerVersion;
    /**
     * v2.7.2
     */
    static readonly V2_7_2: AlbControllerVersion;
    /**
     * v2.8.0
     */
    static readonly V2_8_0: AlbControllerVersion;
    /**
     * v2.8.1
     */
    static readonly V2_8_1: AlbControllerVersion;
    /**
     * v2.8.2
     */
    static readonly V2_8_2: AlbControllerVersion;
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
    static of(version: string, helmChartVersion?: string): AlbControllerVersion;
    private constructor();
}
/**
 * ALB Scheme.
 *
 * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.3/guide/ingress/annotations/#scheme
 */
export declare enum AlbScheme {
    /**
     * The nodes of an internal load balancer have only private IP addresses.
     * The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes.
     * Therefore, internal load balancers can only route requests from clients with access to the VPC for the load balancer.
     */
    INTERNAL = "internal",
    /**
     * An internet-facing load balancer has a publicly resolvable DNS name, so it can route requests from clients over the internet
     * to the EC2 instances that are registered with the load balancer.
     */
    INTERNET_FACING = "internet-facing"
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
export declare class AlbController extends Construct {
    /**
     * Create the controller construct associated with this cluster and scope.
     *
     * Singleton per stack/cluster.
     */
    static create(scope: Construct, props: AlbControllerProps): AlbController;
    private static uid;
    constructor(scope: Construct, id: string, props: AlbControllerProps);
    private rewritePolicyResources;
}

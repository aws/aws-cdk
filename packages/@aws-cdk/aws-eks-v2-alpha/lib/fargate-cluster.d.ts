import { Construct } from 'constructs';
import { Cluster, ClusterCommonOptions } from './cluster';
import { FargateProfile, FargateProfileOptions } from './fargate-profile';
/**
 * Configuration props for EKS Fargate.
 */
export interface FargateClusterProps extends ClusterCommonOptions {
    /**
     * Fargate Profile to create along with the cluster.
     *
     * @default - A profile called "default" with 'default' and 'kube-system'
     *            selectors will be created if this is left undefined.
     */
    readonly defaultProfile?: FargateProfileOptions;
}
/**
 * Defines an EKS cluster that runs entirely on AWS Fargate.
 *
 * The cluster is created with a default Fargate Profile that matches the
 * "default" and "kube-system" namespaces. You can add additional profiles using
 * `addFargateProfile`.
 */
export declare class FargateCluster extends Cluster {
    /** Uniquely identifies this class. */
    static readonly PROPERTY_INJECTION_ID: string;
    /**
     * Fargate Profile that was created with the cluster.
     */
    readonly defaultProfile: FargateProfile;
    constructor(scope: Construct, id: string, props: FargateClusterProps);
}

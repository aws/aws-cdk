import { Construct } from '@aws-cdk/core';
import { Cluster, ClusterOptions, CoreDnsComputeType } from './cluster';
import { FargateProfileOptions } from './fargate-profile';

/**
 * Configuration props for EKS Fargate.
 */
export interface FargateClusterProps extends ClusterOptions {
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
export class FargateCluster extends Cluster {
  constructor(scope: Construct, id: string, props: FargateClusterProps = { }) {
    super(scope, id, {
      ...props,
      defaultCapacity: 0,
      kubectlEnabled: true,
      coreDnsComputeType: props.coreDnsComputeType ?? CoreDnsComputeType.FARGATE,
    });

    this.addFargateProfile(
      props.defaultProfile?.fargateProfileName ?? (props.defaultProfile ? 'custom' : 'default'),
      props.defaultProfile ?? {
        selectors: [
          {namespace: 'default'},
          {namespace: 'kube-system'},
        ],
      },
    );
  }
}

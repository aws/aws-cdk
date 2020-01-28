import { Construct } from '@aws-cdk/core';
import { Cluster, ClusterOptions, CoreDnsComputeType } from './cluster';

/**
 * Configuration props for EKS Fargate.
 */
export interface FargateClusterProps extends ClusterOptions {
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
      coreDnsComputeType: props.coreDnsComputeType ?? CoreDnsComputeType.FARGATE
    });

    this.addFargateProfile('default', {
      selectors: [
        { namespace: 'default' },
        { namespace: 'kube-system' },
      ]
    });
  }
}
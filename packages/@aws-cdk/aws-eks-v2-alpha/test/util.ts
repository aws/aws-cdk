import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib/core';
import { Cluster, FargateCluster, ClusterProps, KubernetesVersion } from '../lib';

const CLUSTER_VERSION = KubernetesVersion.V1_25;
const DEFAULT_REGION = 'us-east-1';

export function testFixture(region: string = DEFAULT_REGION) {
  const { stack, app } = testFixtureNoVpc(region);
  const vpc = new ec2.Vpc(stack, 'VPC');

  return { stack, vpc, app };
}

export function testFixtureNoVpc(region: string = DEFAULT_REGION) {
  const app = new App();
  const stack = new Stack(app, 'Stack', { env: { region } });
  return { stack, app };
}

export interface testFixtureClusterOptions {
  /**
   * Indicates whether the cluster should be a Fargate cluster or not.
   * If true, a FargateCluster will be created, otherwise a regular Cluster.
   */
  isFargate?: boolean;
};

/**
 * Creates a test fixture for an EKS cluster.
 *
 * @param props - Optional properties to pass to the Cluster or FargateCluster constructor.
 * @param region - The AWS region to create the cluster in. Defaults to the DEFAULT_REGION.
 * @param options - Additional options for the test fixture cluster.
 * @returns An object containing the stack, app, and the created cluster.
 */
export function testFixtureCluster(props: Omit<ClusterProps, 'version'> = {}, region: string = DEFAULT_REGION, options?: testFixtureClusterOptions) {
  const { stack, app } = testFixtureNoVpc(region);
  const clusterProps = {
    version: CLUSTER_VERSION,
    prune: false, // mainly because this feature was added later and we wanted to avoid having to update all test expectations....
    ...props,
  };
  const cluster = options?.isFargate ? new FargateCluster(stack, 'Cluster', clusterProps) : new Cluster(stack, 'Cluster', clusterProps);

  return { stack, app, cluster };
};

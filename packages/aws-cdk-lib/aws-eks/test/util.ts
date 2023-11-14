import * as ec2 from '../../aws-ec2';
import { App, Stack } from '../../core';
import { Cluster, ClusterProps, KubernetesVersion } from '../lib';

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

export function testFixtureCluster(props: Omit<ClusterProps, 'version'> = {}, region: string = DEFAULT_REGION) {
  const { stack, app } = testFixtureNoVpc(region);
  const cluster = new Cluster(stack, 'Cluster', {
    version: CLUSTER_VERSION,
    prune: false, // mainly because this feature was added later and we wanted to avoid having to update all test expectations....
    ...props,
  });

  return { stack, app, cluster };
}

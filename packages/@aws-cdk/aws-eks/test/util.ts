import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Cluster, ClusterProps, KubernetesVersion } from '../lib';

const CLUSTER_VERSION = KubernetesVersion.V1_16;

export function testFixture() {
  const { stack, app } = testFixtureNoVpc();
  const vpc = new ec2.Vpc(stack, 'VPC');

  return { stack, vpc, app };
}

export function testFixtureNoVpc() {
  const app = new App();
  const stack = new Stack(app, 'Stack', { env: { region: 'us-east-1' } });
  return { stack, app };
}

export function testFixtureCluster(props: Omit<ClusterProps, 'version'> = {}) {
  const { stack, app } = testFixtureNoVpc();
  const cluster = new Cluster(stack, 'Cluster', {
    version: CLUSTER_VERSION,
    prune: false, // mainly because this feature was added later and we wanted to avoid having to update all test expectations....
    ...props,
  });

  return { stack, app, cluster };
}

// we must specify an explicit environment because we have an AMI map that is
// keyed from the target region.
const env = {
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
};

export class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, { env });
  }
}

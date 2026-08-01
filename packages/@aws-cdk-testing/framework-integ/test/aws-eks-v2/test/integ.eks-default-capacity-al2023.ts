import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { EKS_DEFAULT_AL2023 } from 'aws-cdk-lib/cx-api';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks-v2';

/**
 * Integration test for EKS v2 cluster with default capacity and the
 * `@aws-cdk/aws-eks:defaultToAL2023` feature flag enabled.
 *
 * Validates that when the flag is enabled, `defaultCapacityType` is
 * `NODEGROUP`, and `amiType` is omitted, the default nodegroup is created
 * with AL2023_x86_64_STANDARD.
 *
 * Pinned to k8s 1.33 — the first version where the old AL2_x86_64 default
 * would fail deployment, proving the flag actually unblocks the user.
 */
class EksV2DefaultCapacityAl2023Stack extends Stack {
  public readonly cluster: eks.Cluster;

  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 2,
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_33),
    });
  }
}

const app = new App({
  context: {
    [EKS_DEFAULT_AL2023]: true,
  },
});

const stack = new EksV2DefaultCapacityAl2023Stack(app, 'aws-cdk-eks-v2-default-capacity-al2023-test');

const integTest = new integ.IntegTest(app, 'aws-cdk-eks-v2-default-capacity-al2023', {
  testCases: [stack],
  diffAssets: false,
});

// Verify the default nodegroup was created with AL2023_x86_64_STANDARD.
integTest.assertions
  .awsApiCall('EKS', 'describeNodegroup', {
    clusterName: stack.cluster.clusterName,
    nodegroupName: stack.cluster.defaultNodegroup!.nodegroupName,
  })
  .expect(
    integ.ExpectedResult.objectLike({
      nodegroup: {
        amiType: 'AL2023_x86_64_STANDARD',
      },
    }),
  );

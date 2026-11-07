/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { CfnResource, StackProps } from 'aws-cdk-lib';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

const stackName = 'aws-cdk-eks-cluster-deletion-protection';

class EksClusterDeletionProtectionStack extends Stack {
  public readonly cluster: eks.Cluster;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // Suppress Security Guardian: this role intentionally uses account root principal
    // so any account user can administer the cluster for testing purposes
    (mastersRole.node.defaultChild as CfnResource).addMetadata('guard', {
      SuppressedRules: ['IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS'],
    });

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    // create cluster with deletion protection enabled
    this.cluster = new eks.Cluster(this, 'ClusterWithProtection', {
      vpc,
      mastersRole,
      defaultCapacity: 1,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
      clusterName: 'eks-deletion-protection-test',
      deletionProtection: true,
    });

    new CfnOutput(this, 'ClusterWithProtectionName', { value: this.cluster.clusterName });
  }
}

const app = new App();

const stack = new EksClusterDeletionProtectionStack(app, stackName, {
  env: { region: 'us-east-1' },
});

const test = new integ.IntegTest(app, 'aws-cdk-eks-cluster-deletion-protection-integ', {
  testCases: [stack],
});

// Test: attempt to delete the stack - should fail because deletionProtection is enabled
test.assertions.awsApiCall('CloudFormation', 'deleteStack', {
  StackName: stackName,
}).next(
  // Verify the stack deletion failed
  test.assertions.awsApiCall('CloudFormation', 'describeStacks', {
    StackName: stackName,
  }).expect(integ.ExpectedResult.objectLike({
    Stacks: integ.Match.arrayWith([
      integ.Match.objectLike({
        StackName: stackName,
        StackStatus: 'DELETE_FAILED',
      }),
    ]),
  })).waitForAssertions(),
).next(
  // Disable deletion protection directly via EKS API so the stack can be cleaned up
  test.assertions.awsApiCall('eks', 'updateClusterConfig', {
    name: 'eks-deletion-protection-test',
    deletionProtection: false,
  }),
).next(
  // Wait for the cluster to become ACTIVE after the update
  test.assertions.awsApiCall('eks', 'describeCluster', {
    name: 'eks-deletion-protection-test',
  }).expect(integ.ExpectedResult.objectLike({
    cluster: integ.Match.objectLike({
      status: 'ACTIVE',
      deletionProtection: false,
    }),
  })).waitForAssertions(),
);

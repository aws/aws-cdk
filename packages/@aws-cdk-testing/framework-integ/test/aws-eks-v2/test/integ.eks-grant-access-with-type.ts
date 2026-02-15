/// !cdk-integ pragma:disable-update-workflow EKSGrantAccessWithType
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from 'aws-cdk-lib/aws-eks-v2';

/**
 * Integration test for AccessEntry with different access entry types.
 *
 * Tests the AccessEntryType enum values that work on standard EKS clusters:
 * - STANDARD: Standard access entry type that supports access policies
 * - EC2_LINUX: For self-managed EC2 Linux nodes
 *
 * Note: The following types require special cluster configurations and cannot be tested here:
 * - EC2: Requires EKS Auto Mode cluster
 * - HYBRID_LINUX: Requires hybrid nodes-enabled cluster with RemoteNetworkConfig
 * - HYPERPOD_LINUX: Requires SageMaker HyperPod cluster
 *
 * Important AWS EKS API Constraint:
 * - Access entries with type EC2, HYBRID_LINUX, or HYPERPOD_LINUX cannot have access policies attached
 * - Only STANDARD type access entries support access policies
 */
class EksGrantAccessWithType extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      defaultCapacity: 0,
      version: eks.KubernetesVersion.V1_33,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
      },
    });

    // Test 1: AccessEntry with EC2_LINUX type (for self-managed EC2 Linux nodes)
    // Note: EC2_LINUX type access entries can have access policies attached
    const ec2LinuxRole = new iam.Role(this, 'EC2LinuxRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    new eks.AccessEntry(this, 'EC2LinuxAccess', {
      cluster,
      principal: ec2LinuxRole.roleArn,
      accessPolicies: [],
      accessEntryType: eks.AccessEntryType.EC2_LINUX,
    });

    // Test 2: grantAccess with STANDARD type and access policies
    const standardRole = new iam.Role(this, 'StandardRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    cluster.grantAccess(
      'StandardAccess',
      standardRole.roleArn,
      [
        eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
          accessScopeType: eks.AccessScopeType.CLUSTER,
        }),
      ],
      { accessEntryType: eks.AccessEntryType.STANDARD },
    );

    // Test 3: grantAccess without type (backward compatibility - defaults to STANDARD)
    const defaultRole = new iam.Role(this, 'DefaultRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    cluster.grantAccess(
      'DefaultAccess',
      defaultRole.roleArn,
      [
        eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
          accessScopeType: eks.AccessScopeType.CLUSTER,
        }),
      ],
    );
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new EksGrantAccessWithType(app, 'aws-cdk-eks-grant-access-with-type');

new integ.IntegTest(app, 'aws-cdk-eks-grant-access-with-type-integ', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

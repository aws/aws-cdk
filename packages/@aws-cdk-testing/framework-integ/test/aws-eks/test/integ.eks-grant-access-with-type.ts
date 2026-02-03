/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

/**
 * Integration test for AccessEntry with different access entry types.
 *
 * Tests the new AccessEntryType enum values (EC2, HYBRID_LINUX, HYPERPOD_LINUX)
 * and the optional accessEntryType parameter in grantAccess method.
 *
 * Important AWS EKS API Constraint:
 * - Access entries with type EC2, HYBRID_LINUX, or HYPERPOD_LINUX cannot have access policies attached
 * - Only STANDARD type access entries support access policies
 * - Use AccessEntry construct directly for non-STANDARD types
 * - Use grantAccess method for STANDARD types with policies
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
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      defaultCapacity: 0,
      authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
    });

    // Test 1: AccessEntry with EC2 type (for EKS Auto Mode)
    // Note: EC2 type access entries cannot have access policies attached per AWS EKS API
    const ec2Role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    new eks.AccessEntry(this, 'EC2Access', {
      cluster,
      principal: ec2Role.roleArn,
      accessPolicies: [], // Empty array - EC2 type cannot have policies
      accessEntryType: eks.AccessEntryType.EC2,
    });

    // Test 2: AccessEntry with HYBRID_LINUX type
    // Note: HYBRID_LINUX type access entries cannot have access policies attached per AWS EKS API
    const hybridRole = new iam.Role(this, 'HybridRole', {
      assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
    });

    new eks.AccessEntry(this, 'HybridAccess', {
      cluster,
      principal: hybridRole.roleArn,
      accessPolicies: [], // Empty array - HYBRID_LINUX type cannot have policies
      accessEntryType: eks.AccessEntryType.HYBRID_LINUX,
    });

    // Test 3: AccessEntry with HYPERPOD_LINUX type
    // Note: HYPERPOD_LINUX type access entries cannot have access policies attached per AWS EKS API
    const hyperpodRole = new iam.Role(this, 'HyperpodRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
    });

    new eks.AccessEntry(this, 'HyperpodAccess', {
      cluster,
      principal: hyperpodRole.roleArn,
      accessPolicies: [], // Empty array - HYPERPOD_LINUX type cannot have policies
      accessEntryType: eks.AccessEntryType.HYPERPOD_LINUX,
    });

    // Test 4: grantAccess with STANDARD type and access policies
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

    // Test 5: grantAccess without type (backward compatibility - defaults to STANDARD)
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

app.synth();

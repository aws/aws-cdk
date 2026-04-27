/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from 'aws-cdk-lib/aws-eks-v2';

/**
 * Integration test for AccessEntry using the `iamPrincipal` property.
 *
 * Verifies that IAM roles and users can be passed directly to AccessEntry
 * via `iamPrincipal` instead of providing a raw ARN string via `principal`.
 */
class EksAccessEntryIamPrincipal extends Stack {
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

    // Test 1: AccessEntry with iamPrincipal using an IAM Role
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    new eks.AccessEntry(this, 'AccessEntryRole', {
      accessPolicies: [
        eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
          accessScopeType: eks.AccessScopeType.CLUSTER,
        }),
      ],
      cluster,
      iamPrincipal: role,
      accessEntryType: eks.AccessEntryType.STANDARD,
    });

    // Test 2: AccessEntry with iamPrincipal using an IAM User
    const user = new iam.User(this, 'User');

    new eks.AccessEntry(this, 'AccessEntryUser', {
      accessPolicies: [
        eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
          accessScopeType: eks.AccessScopeType.CLUSTER,
        }),
      ],
      cluster,
      iamPrincipal: user,
      accessEntryType: eks.AccessEntryType.STANDARD,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new EksAccessEntryIamPrincipal(app, 'EKSAccessEntryIamPrincipal');
new integ.IntegTest(app, 'aws-cdk-eks-access-entry-iam-principal-integ', {
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

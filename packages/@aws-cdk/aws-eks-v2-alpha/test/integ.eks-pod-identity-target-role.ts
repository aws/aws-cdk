/// !cdk-integ pragma:disable-update-workflow
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';
import * as eks from '../lib';

/**
 * Focused integration test for EKS Pod Identity targetRole functionality.
 *
 * Tests that a ServiceAccount with targetRole creates the correct Pod Identity Association.
 */
class EksPodIdentityTargetRoleStack extends Stack {
  public readonly cluster: eks.Cluster;
  public readonly targetRole: iam.Role;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // create a minimal vpc with 1 NAT gateway
    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });

    // Create minimal EKS cluster
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_32,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
    });

    // Create target role for cross-account scenario
    this.targetRole = new iam.Role(this, 'TargetRole', {
      assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
    });

    // Create ServiceAccount with targetRole - this is what we're testing
    this.cluster.addServiceAccount('ServiceAccount', {
      identityType: eks.IdentityType.POD_IDENTITY,
      targetRole: this.targetRole,
    });
  }
}

const app = new App();
const stack = new EksPodIdentityTargetRoleStack(app, 'eks-pod-identity-target-role-test');

const integTest = new IntegTest(app, 'eks-pod-identity-target-role-integ', {
  testCases: [stack],
});

// Get the association ID by listing Pod Identity Associations
// We don't add expectations on the list call to avoid the previous failure
const listAssociations = integTest.assertions.awsApiCall('EKS', 'listPodIdentityAssociations', {
  clusterName: stack.cluster.clusterName,
});

// Validate the Pod Identity Association details using the association ID from the list
const describeAssociation = integTest.assertions.awsApiCall('EKS', 'describePodIdentityAssociation', {
  clusterName: stack.cluster.clusterName,
  associationId: listAssociations.getAttString('associations.0.associationId'),
});

// Validate the Pod Identity Association details including the targetRoleArn
describeAssociation.expect(ExpectedResult.objectLike({
  association: Match.objectLike({
    clusterName: stack.cluster.clusterName,
    namespace: 'default',
    serviceAccount: Match.stringLikeRegexp('.*serviceaccount.*'),
    // Validate that a service account role was created (this is automatic)
    roleArn: Match.stringLikeRegexp('arn:aws:iam::\\d+:role/.*ServiceAccountRole.*'),
    // This is the key validation - targetRoleArn should match our specified target role
    targetRoleArn: stack.targetRole.roleArn,
    associationArn: Match.stringLikeRegexp('arn:aws:eks:.*:podidentityassociation/.*'),
  }),
}));

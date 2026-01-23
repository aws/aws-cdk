/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV34Layer } from '@aws-cdk/lambda-layer-kubectl-v34';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from '../lib';

/**
 * Integration test for custom security group in kubectlProviderOptions
 *
 * This test verifies that when a custom security group is specified in
 * kubectlProviderOptions, it is correctly applied to the Kubectl Handler
 * Lambda function instead of the cluster's security group.
cd */
class EksKubectlCustomSecurityGroupStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // allow account users to assume this role in order to admin the cluster
    // Condition restricts to roles in the same account to satisfy security guard requirements
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal().withConditions({
        StringEquals: {
          'aws:PrincipalAccount': this.account,
        },
      }),
    });

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    // Create a custom security group for the kubectl provider
    // This security group will be used instead of the cluster security group
    const kubectlSecurityGroup = new ec2.SecurityGroup(this, 'KubectlSecurityGroup', {
      vpc,
      description: 'Custom security group for kubectl provider Lambda function',
      allowAllOutbound: true,
    });

    // Get private subnets for the kubectl provider
    const privateSubnets = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    }).subnets;

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      mastersRole,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      version: eks.KubernetesVersion.V1_34,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV34Layer(this, 'kubectlLayer'),
        securityGroup: kubectlSecurityGroup,
        privateSubnets,
      },
    });

    // Add ingress rule to allow the kubectl provider to communicate with the cluster
    // The cluster security group needs to allow traffic from the kubectl security group
    cluster.connections.allowFrom(
      new ec2.Connections({
        securityGroups: [kubectlSecurityGroup],
      }),
      ec2.Port.tcp(443),
      'Allow kubectl provider to access EKS cluster',
    );

    // This is the validation. It won't work if the custom security group
    // is not properly configured and applied to the kubectl provider Lambda.
    cluster.addManifest('test-config-map', {
      kind: 'ConfigMap',
      apiVersion: 'v1',
      data: {
        test: 'custom-security-group',
        message: 'This manifest verifies the kubectl provider uses the custom security group',
      },
      metadata: {
        name: 'test-config-map',
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new EksKubectlCustomSecurityGroupStack(app, 'aws-cdk-eks-kubectl-custom-security-group-test');
new integ.IntegTest(app, 'aws-cdk-eks-kubectl-custom-security-group', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

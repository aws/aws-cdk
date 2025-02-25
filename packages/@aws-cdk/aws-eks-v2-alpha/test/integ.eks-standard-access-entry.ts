/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from '../lib';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';

class EksStandardAccessEntry extends Stack {
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
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
    });

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    new eks.AccessEntry(this, 'AccessEntry', {
      accessPolicies: [
        eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
          accessScopeType: eks.AccessScopeType.CLUSTER,
        }),
      ],
      cluster,
      principal: role.roleArn,
      accessEntryType: eks.AccessEntryType.STANDARD,
    });
  }
}

const app = new App();
const stack = new EksStandardAccessEntry(app, 'EKSStandardAccessEntry');
new integ.IntegTest(app, 'aws-cdk-eks-standard-access-entry-integ', {
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

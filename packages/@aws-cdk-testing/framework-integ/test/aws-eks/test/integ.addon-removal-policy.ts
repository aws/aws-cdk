import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class EksAddonRemovalPolicyStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const cluster = new eks.Cluster(this, 'Cluster', {
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
      prune: false,
      vpc,
    });

    new eks.Addon(this, 'DestroyAddon', {
      cluster,
      addonName: 'kube-proxy',
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();

const stack = new EksAddonRemovalPolicyStack(app, 'aws-cdk-eks-addon-removal-policy-test');

new integ.IntegTest(app, 'aws-cdk-eks-addon-removal-policy', {
  testCases: [stack],
  diffAssets: false,
});

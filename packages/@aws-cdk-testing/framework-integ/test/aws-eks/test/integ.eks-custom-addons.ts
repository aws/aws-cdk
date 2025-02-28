/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

class EksStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
      defaultCapacity: 2,
      bootstrapSelfManagedAddons: false,
    },
    );
    new eks.Addon(this, 'CoreDNS', {
      cluster,
      addonName: 'coredns',
      addonVersion: 'v1.11.4-eksbuild.2',
      preserveOnDelete: false,
    });
    new eks.Addon(this, 'kubeproxy', {
      cluster,
      addonName: 'kube-proxy',
      addonVersion: 'v1.32.0-eksbuild.2',
      preserveOnDelete: false,
    });
    new eks.Addon(this, 'vpccni', {
      cluster,
      addonName: 'vpc-cni',
      addonVersion: 'v1.19.2-eksbuild.1',
      preserveOnDelete: false,
    });
  }
}

const app = new App();
const stack = new EksStack(app, 'eks-custom-addons-stack');
new integ.IntegTest(app, 'eks-custom-addons-integ', {
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

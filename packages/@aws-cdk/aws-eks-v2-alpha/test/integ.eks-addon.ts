import { App, Stack } from 'aws-cdk-lib';
import * as eks from '../lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';

class EksClusterStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_33,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
      },
    });

    new eks.Addon(this, 'Addon', {
      addonName: 'coredns',
      cluster,
      preserveOnDelete: true,
      configurationValues: {
        replicaCount: 2,
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

const stack = new EksClusterStack(app, 'EksClusterWithAddonStack');
new integ.IntegTest(app, 'EksClusterwithAddon', {
  testCases: [stack],
});

import { App, Stack } from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

class EksClusterStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    new eks.Cluster(this, 'EksCluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      bootstrapSelfManagedAddons: true,
    });
  }
}

const app = new App();

const stack = new EksClusterStack(app, 'EksClusterWithSelfManagedAddonsStack');
new integ.IntegTest(app, 'EksClusterWithSelfManagedAddons', {
  testCases: [stack],
});

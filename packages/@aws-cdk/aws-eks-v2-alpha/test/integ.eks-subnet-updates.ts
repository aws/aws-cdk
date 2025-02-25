import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from '../lib';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';

class EksClusterStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      defaultCapacity: 0,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
    });
  }
}

const app = new App();

const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-stack');
new integ.IntegTest(app, 'aws-cdk-eks-cluster', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

app.synth();

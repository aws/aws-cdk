import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';
import * as eks from '../lib';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';

export class EksAutoModeCluster extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    const mastersRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    new eks.Cluster(this, 'hello-eks', {
      vpc,
      mastersRole,
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectl'),
      },
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
    });
  }
}

const app = new App();

const stack = new EksAutoModeCluster(app, 'eks-auto-mode-stack', { env: { region: 'us-east-1' } });

new integ.IntegTest(app, 'aws-cdk-eks-cluster-integ', {
  testCases: [stack],
});

/// !cdk-integ pragma:disable-update-workflow
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from '../lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';

interface EksFargateClusterStackProps extends StackProps {
  vpc?: ec2.IVpc;
}
class EksFargateClusterStack extends Stack {
  constructor(scope: App, id: string, props?: EksFargateClusterStackProps) {
    super(scope, id, props);

    new eks.FargateCluster(this, 'FargateTestCluster', {
      vpc: props?.vpc,
      version: eks.KubernetesVersion.V1_32,
      prune: false,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new EksFargateClusterStack(app, 'eks-fargate-cluster-test-stack', {});
new integ.IntegTest(app, 'eks-fargate-cluster', {
  testCases: [stack],
  diffAssets: false,
});

app.synth();

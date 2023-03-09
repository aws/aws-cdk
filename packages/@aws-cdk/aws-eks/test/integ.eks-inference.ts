/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from '../lib';

class EksClusterInferenceStack extends Stack {

  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this),
      albController: {
        version: eks.AlbControllerVersion.V2_4_1,
      },
    });

    cluster.addAutoScalingGroupCapacity('InferenceInstances', {
      instanceType: new ec2.InstanceType('inf1.2xlarge'),
      minCapacity: 1,
    });
  }
}

const app = new App();
const stack = new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-interence', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
app.synth();

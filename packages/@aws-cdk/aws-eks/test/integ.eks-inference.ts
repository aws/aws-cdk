/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
import { App } from '@aws-cdk/core';
import * as eks from '../lib';
import { TestStack } from './util';

class EksClusterInferenceStack extends TestStack {

  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_21,
      albController: {
        version: eks.AlbControllerVersion.V2_3_1,
      },
    });

    cluster.addAutoScalingGroupCapacity('InferenceInstances', {
      instanceType: new ec2.InstanceType('inf1.2xlarge'),
      minCapacity: 1,
    });
  }
}

const app = new App();
new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference-test');
app.synth();

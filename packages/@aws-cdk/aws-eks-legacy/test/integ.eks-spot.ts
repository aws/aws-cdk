/// !cdk-integ pragma:enable-lookups
import * as ec2 from '@aws-cdk/aws-ec2';
import { App } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as eks from '../lib';
import { TestStack } from './util';

class MyStack extends TestStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'vpc', { maxAzs: 2 });

    // two on-demand instances
    const cluster = new eks.Cluster(this, 'myCluster', {
      defaultCapacity: 2,
      vpc,
    });

    // up to ten spot instances
    cluster.addCapacity('spot', {
      spotPrice: '0.1094',
      instanceType: new ec2.InstanceType('t3.large'),
      maxCapacity: 10,
      bootstrapOptions: {
        kubeletExtraArgs: '--node-labels foo=bar,goo=far',
        awsApiRetryAttempts: 5,
      },
    });
  }
}

const app = new App();
new MyStack(app, 'integ-eks-spot');
app.synth();

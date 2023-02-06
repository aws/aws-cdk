import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ecs from '../../lib';

interface WindowsEcsClusterProps extends cdk.StackProps {
  enableTaskENI: boolean,
  awsVpcBlockIMDS: boolean,
  awsVpcAdditionalLocalRoutes?: string[]
}

class WindowsEcsCluster extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WindowsEcsClusterProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });

    cluster.addCapacity('windows-cluster', {
      minCapacity: 2,
      instanceType: new ec2.InstanceType('c5.large'),
      machineImage: ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2019),
      enableTaskENI: props.enableTaskENI,
      awsVpcBlockIMDS: props.awsVpcBlockIMDS,
      awsVpcAdditionalLocalRoutes: props.awsVpcAdditionalLocalRoutes,
    });
  }
}

const app = new cdk.App();

new IntegTest(app, 'DifferentOptions', {
  testCases: [
    new WindowsEcsCluster(app, 'all-enabled', {
      enableTaskENI: true,
      awsVpcBlockIMDS: true,
      awsVpcAdditionalLocalRoutes: ['10.1.0.0/16'],
    }),
  ],
});

app.synth();

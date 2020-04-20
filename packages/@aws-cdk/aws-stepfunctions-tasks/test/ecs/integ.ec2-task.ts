import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as tasks from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ2', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
  isDefault: true,
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});

// Build task definition
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});

// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
  result: sfn.Result.fromObject({ SomeKey: 'SomeValue' }),
}).next(new sfn.Task(stack, 'Run', { task: new tasks.RunEcsEc2Task({
  integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
  cluster,
  taskDefinition,
  containerOverrides: [
    {
      containerName: 'TheContainer',
      environment: [
        {
          name: 'SOME_KEY',
          value: sfn.Data.stringAt('$.SomeKey'),
        },
      ],
    },
  ],
})}));

new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

app.synth();

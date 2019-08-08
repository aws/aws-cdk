import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import path = require('path');
import tasks = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ2', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION
  }
});

const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
  isDefault: true
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Build task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256
});
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' })
});

// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
    result: sfn.Result.fromObject({ SomeKey: 'SomeValue' })
}).next(new sfn.Task(stack, 'FargateTask', { task: new tasks.RunEcsFargateTask({
  integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
  cluster, taskDefinition,
  assignPublicIp: true,
  containerOverrides: [
    {
      containerName: 'TheContainer',
      environment: [
        {
          name: 'SOME_KEY',
          value: sfn.Data.stringAt('$.SomeKey')
        }
      ]
    }
  ]
})}));

new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

app.synth();
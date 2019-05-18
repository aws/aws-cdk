import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import tasks = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ2');

const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
  isDefault: true
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Build task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryMiB: '512',
  cpu: '256'
});
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(stack, 'EventImage', { directory: path.resolve(__dirname, 'eventhandler-image') }),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver(stack, 'TaskLogging', { streamPrefix: 'EventDemo' })
});

// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
    result: { SomeKey: 'SomeValue' }
}).next(new sfn.Task(stack, 'FargateTask', { task: new tasks.RunEcsFargateTask({
  cluster, taskDefinition,
  assignPublicIp: true,
  containerOverrides: [
    {
      containerName: 'TheContainer',
      environment: [
        {
          name: 'SOME_KEY',
          value: tasks.JsonPath.stringFromPath('$.SomeKey')
        }
      ]
    }
  ]
})}));

new sfn.StateMachine(stack, 'StateMachine', {
  definition,
});

app.run();
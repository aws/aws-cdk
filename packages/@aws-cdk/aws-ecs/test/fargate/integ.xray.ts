import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// TODO: change to building image from Asset
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryMiB: '1GB',
  cpu: '512',
  executionRole: iam.Role.fromRoleAttributes(stack, 'ExecutionRole', {
    roleArn: 'arn:aws:iam::xxxxxxxxxxxx51:role/ecsExecutionRole'
  })
});

// TODO: remove after change to use asset image
const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry("xxxxxxxxxxxx51.dkr.ecr.us-west-2.amazonaws.com/scorekeep-api"),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.Tcp
});

const service = new ecs.FargateService(stack, "Service", {
  cluster,
  taskDefinition,
});

service.addTracing();

app.run();

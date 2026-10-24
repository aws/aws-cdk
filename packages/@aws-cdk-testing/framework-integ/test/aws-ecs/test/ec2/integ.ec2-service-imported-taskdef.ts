import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});

const stack = new cdk.Stack(app, 'aws-ecs-integ-ec2-imported-taskdef');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Ec2Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t3.micro'),
  minCapacity: 1,
  maxCapacity: 1,
});

// Create an owned task definition to get a real ARN
const ownedTaskDef = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
ownedTaskDef.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

// Import the task definition by ARN (cross-resource reference within the same stack)
const importedTaskDef = ecs.TaskDefinition.fromTaskDefinitionArn(
  stack,
  'ImportedTaskDef',
  ownedTaskDef.taskDefinitionArn,
);

// Create a service using the imported task definition
const service = new ecs.Ec2Service(stack, 'ServiceWithImportedTaskDef', {
  cluster,
  taskDefinition: importedTaskDef,
  desiredCount: 0, // Set to 0 to reduce costs during integration testing
});

// Create another service demonstrating placement strategies with imported task definition
const serviceWithPlacement = new ecs.Ec2Service(stack, 'ServiceWithPlacementAndImportedTaskDef', {
  cluster,
  taskDefinition: importedTaskDef,
  desiredCount: 0,
  placementStrategies: [
    ecs.PlacementStrategy.spreadAcrossInstances(),
  ],
});

const integTest = new IntegTest(app, 'integ-aws-ecs-ec2-imported-taskdef', {
  testCases: [stack],
});

// Verify the service uses the correct task definition
integTest.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [service.serviceName],
}).assertAtPath(
  'services.0.taskDefinition',
  ExpectedResult.stringLikeRegexp('task-definition/'),
);

// Verify placement strategy is set correctly
integTest.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [serviceWithPlacement.serviceName],
}).assertAtPath(
  'services.0.placementStrategy.0.type',
  ExpectedResult.stringLikeRegexp('spread'),
);

app.synth();

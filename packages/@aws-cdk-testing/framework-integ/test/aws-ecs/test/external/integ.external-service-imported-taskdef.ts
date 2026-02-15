import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});

const stack = new cdk.Stack(app, 'ecs-external-service-imported-taskdef');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

// Create an owned ExternalTaskDefinition to get a real ARN
const ownedTaskDef = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
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
const service = new ecs.ExternalService(stack, 'ServiceWithImportedTaskDef', {
  cluster,
  taskDefinition: importedTaskDef,
  desiredCount: 0, // Set to 0 to reduce costs during integration testing
});

// Create a daemon service using the imported task definition
const daemonService = new ecs.ExternalService(stack, 'DaemonServiceWithImportedTaskDef', {
  cluster,
  taskDefinition: importedTaskDef,
  daemon: true,
});

const integTest = new IntegTest(app, 'integ-ecs-external-service-imported-taskdef', {
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

// Verify daemon scheduling strategy is set correctly
integTest.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [daemonService.serviceName],
}).assertAtPath(
  'services.0.schedulingStrategy',
  ExpectedResult.stringLikeRegexp('DAEMON'),
);

app.synth();

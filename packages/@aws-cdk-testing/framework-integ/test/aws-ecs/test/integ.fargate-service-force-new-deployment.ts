import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-ecs-force-new-deployment');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{ containerPort: 80 }],
});

// Create a service with forceNewDeployment enabled
const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 1,
  forceNewDeployment: {
    enabled: true,
    nonce: 'initial-deployment',
  },
});

const integTest = new IntegTest(app, 'ForceNewDeploymentTest', {
  testCases: [stack],
});

// Verify the service is created and in ACTIVE state
integTest.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [service.serviceName],
})
  .assertAtPath('services.0.status', ExpectedResult.stringLikeRegexp('ACTIVE'));

app.synth();

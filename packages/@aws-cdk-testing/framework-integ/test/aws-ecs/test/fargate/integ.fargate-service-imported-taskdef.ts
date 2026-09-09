import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});

// Stack 1: Create a task definition
const producerStack = new cdk.Stack(app, 'aws-ecs-integ-imported-taskdef-producer');
const vpc = new ec2.Vpc(producerStack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(producerStack, 'Cluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(producerStack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{ containerPort: 80 }],
});

// Stack 2: Import the task definition by ARN and create a service with it
const consumerStack = new cdk.Stack(app, 'aws-ecs-integ-imported-taskdef-consumer');
consumerStack.addDependency(producerStack);

const importedVpc = ec2.Vpc.fromVpcAttributes(consumerStack, 'Vpc', {
  vpcId: vpc.vpcId,
  availabilityZones: vpc.availabilityZones,
  privateSubnetIds: vpc.privateSubnets.map(s => s.subnetId),
});

const importedCluster = ecs.Cluster.fromClusterAttributes(consumerStack, 'Cluster', {
  clusterName: cluster.clusterName,
  vpc: importedVpc,
  securityGroups: [],
});

// Import the task definition using its ARN (cross-stack reference)
const importedTaskDef = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(
  consumerStack,
  'ImportedTaskDef',
  taskDefinition.taskDefinitionArn,
);

new ecs.FargateService(consumerStack, 'ServiceWithImportedTaskDef', {
  cluster: importedCluster,
  taskDefinition: importedTaskDef,
  desiredCount: 1,
});

new integ.IntegTest(app, 'FargateServiceImportedTaskDefTest', {
  testCases: [producerStack, consumerStack],
});

app.synth();

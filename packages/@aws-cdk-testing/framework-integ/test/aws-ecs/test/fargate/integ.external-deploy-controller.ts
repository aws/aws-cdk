import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{
    containerPort: 80,
    protocol: ecs.Protocol.TCP,
  }],
});

new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  deploymentController: {
    type: ecs.DeploymentControllerType.EXTERNAL,
  },
});

new integ.IntegTest(app, 'aws-ecs-fargate-integ-external-deploy-controller', {
  testCases: [stack],
});

app.synth();

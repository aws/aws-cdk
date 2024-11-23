import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-availability-zone-rebalancing');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  availabilityZoneRebalancing: ecs.AvailabilityZoneRebalancing.ENABLED,
});

new integ.IntegTest(app, 'EcsAvailabilityZoneRebalancing', {
  testCases: [stack],
});

app.synth();


import * as auto_scaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-capacity-provider-codedeploy-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

const autoScalingGroup = new auto_scaling.AutoScalingGroup(stack, 'Asg', {
  vpc,
  instanceType: new ec2.InstanceType('t3.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  minCapacity: 1,
  maxCapacity: 3,
});

const capacityProvider = new ecs.AsgCapacityProvider(stack, 'AsgCapacityProvider', {
  autoScalingGroup,
});
cluster.addAsgCapacityProvider(capacityProvider);

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('WebContainer', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

new ecs.Ec2Service(stack, 'Ec2Service', {
  cluster,
  taskDefinition,
  deploymentController: {
    type: ecs.DeploymentControllerType.CODE_DEPLOY,
  },
  capacityProviderStrategies: [
    {
      capacityProvider: capacityProvider.capacityProviderName,
      weight: 1,
      base: 1,
    },
  ],
});

new integ.IntegTest(app, 'EcsCapacityProviderCodeDeployTest', {
  testCases: [stack],
});

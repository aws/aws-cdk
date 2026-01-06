import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'integ-ec2-force-new-deployment');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'EC2CPCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryReservationMiB: 256,
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t3.medium'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.STANDARD),
  minCapacity: 1,
  maxCapacity: 5,
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  // This is to allow cdk destroy to work; otherwise deletion will hang bc ASG cannot be deleted
  enableManagedTerminationProtection: false,
  enableManagedDraining: true,
});

cluster.addAsgCapacityProvider(cp);

// Service with capacity provider strategies and CODE_DEPLOY deployment controller
// Using forceNewDeployment to allow changes to ASG instance types
new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
  desiredCount: 1,
  capacityProviderStrategies: [
    {
      capacityProvider: cp.capacityProviderName,
      weight: 1,
    },
  ],
  deploymentController: {
    type: ecs.DeploymentControllerType.CODE_DEPLOY,
  },
  forceNewDeployment: {
    enable: true,
    nonce: 'test-nonce-123',
  },
});

app.synth();

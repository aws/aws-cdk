import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'cdk-ecs-none');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

const insRole = new iam.Role(stack, 'InstanceRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceForEC2Role'), // for ECS
    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'), // for SSM
  ],
});
insRole.applyRemovalPolicy(RemovalPolicy.DESTROY);

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  role: insRole,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2023(),
  minCapacity: 1,
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  enableManagedTerminationProtection: false,
});

cluster.addAsgCapacityProvider(cp);

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
  logging: new ecs.NoneLogDriver(),
});

new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
});

new integ.IntegTest(app, 'cdk-ecs-none-test', {
  testCases: [stack],
});


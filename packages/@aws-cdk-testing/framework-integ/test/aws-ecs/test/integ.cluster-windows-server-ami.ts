import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'integ-ecs-windows-server-ami');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
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
insRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  role: insRole,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
  machineImage: ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2022),
  minCapacity: 1,
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  enableManagedTerminationProtection: false,
});

cluster.addAsgCapacityProvider(cp);

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {});

taskDefinition.addContainer('fluent-bit', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-observability/aws-for-fluent-bit:windowsservercore-stable'),
  memoryLimitMiB: 2096,
  cpu: 1024,
});

new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
});

new integ.IntegTest(app, 'ClusterWindowsServer', {
  testCases: [stack],
});

app.synth();

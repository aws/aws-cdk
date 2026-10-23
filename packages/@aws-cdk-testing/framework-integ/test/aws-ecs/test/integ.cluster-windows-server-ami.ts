import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
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
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
  machineImage: ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2025),
  minCapacity: 1,
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  enableManagedTerminationProtection: false,
});

cluster.addAsgCapacityProvider(cp, {
  enableTaskIamRole: true,
});

// The task definition gets a task role by default, so the service can only
// place tasks on hosts that registered with the task-iam-role capability,
// which Windows hosts do only when enableTaskIamRole is set.
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {});

taskDefinition.addContainer('main', {
  image: ecs.ContainerImage.fromRegistry('hello-world'),
  memoryLimitMiB: 256,
});

new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
});

const integTest = new integ.IntegTest(app, 'ClusterWindowsServer', {
  testCases: [stack],
});

// The Windows host must register with the task-iam-role capability.
integTest.assertions.awsApiCall('ECS', 'listContainerInstances', {
  cluster: cluster.clusterName,
  filter: 'attribute:com.amazonaws.ecs.capability.task-iam-role exists',
})
  .assertAtPath('containerInstanceArns.0', integ.ExpectedResult.stringLikeRegexp('container-instance'))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(15),
    interval: cdk.Duration.seconds(30),
  });

app.synth();

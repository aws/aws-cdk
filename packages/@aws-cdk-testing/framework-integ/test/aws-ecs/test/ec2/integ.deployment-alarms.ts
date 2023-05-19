import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-deployment-alarms');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryReservationMiB: 256,
  portMappings: [
    {
      containerPort: 80,
    },
  ],
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  // This is to allow cdk destroy to work; otherwise deletion will hang bc ASG cannot be deleted
  enableManagedTerminationProtection: false,
});

const cluster = new ecs.Cluster(stack, 'EC2CPCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

cluster.addAsgCapacityProvider(cp);
const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80, open: true });

const metric = lb.metrics.httpCodeTarget(elbv2.HttpCodeTarget.TARGET_5XX_COUNT, {
  period: cdk.Duration.minutes(1),
});
const myAlarm = new cloudwatch.Alarm(lb, 'MyMetricAlarm', {
  metric,
  evaluationPeriods: 5,
  threshold: 100,
});

const svc = new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
});
svc.enableDeploymentAlarms({
  alarmNames: [myAlarm.alarmName],
  behavior: ecs.AlarmBehavior.FAIL_ON_ALARM,
});

const tg = listener.addTargets('ECS', {
  port: 80,
  targets: [svc],
});

svc.createAlarm({
  useAsDeploymentAlarm: true,
  alarmName: 'TargetResponseTime',
  evaluationPeriods: 5,
  threshold: 80,
  metric: tg.metrics.targetResponseTime(),
});

new integ.IntegTest(app, 'DeploymentAlarms', {
  testCases: [stack],
});
app.synth();
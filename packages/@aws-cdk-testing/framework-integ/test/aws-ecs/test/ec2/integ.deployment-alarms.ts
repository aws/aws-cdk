import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'integ-deployment-alarms');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryReservationMiB: 256,
  portMappings: [
    {
      containerPort: 80,
      hostPort: 8080,
      protocol: ecs.Protocol.TCP,
    },
  ],
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  }),
  // This is to allow cdk destroy to work; otherwise deletion will hang bc ASG cannot be deleted
  enableManagedTerminationProtection: false,
});

const cluster = new ecs.Cluster(stack, 'EC2CPCluster', {
  vpc,
});
cluster.addAsgCapacityProvider(cp);

const svc = new ecs.Ec2Service(stack, 'EC2Service', {
  cluster,
  taskDefinition,
});

const alarmName = 'AlarmCpuUtilization';
new cloudwatch.Alarm(stack, 'MyMetricAlarm', {
  alarmName,
  metric: svc.metricCpuUtilization(),
  evaluationPeriods: 5,
  threshold: 80,
  treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
});

svc.enableDeploymentAlarms([alarmName], {
  behavior: ecs.AlarmBehavior.FAIL_ON_ALARM,
});

new integ.IntegTest(app, 'DeploymentAlarms', {
  testCases: [stack],
});
app.synth();

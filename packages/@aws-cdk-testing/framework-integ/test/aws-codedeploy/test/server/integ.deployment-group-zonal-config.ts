import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'Stack');

const vpc = new ec2.Vpc(stack, 'Vpc');

const asg = new autoscaling.AutoScalingGroup(stack, 'Asg', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
  machineImage: new ec2.AmazonLinuxImage(),
  vpc,
});

const elb = new elbv2.ApplicationLoadBalancer(stack, 'Elb', { vpc });
const listener = elb.addListener('Listener', {
  port: 80,
  open: true,
});
const targetGroup = listener.addTargets('Target', {
  port: 80,
  targets: [asg],
});

new codedeploy.ServerDeploymentGroup(stack, 'CodeDeployGroup', {
  deploymentConfig: new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
    minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
    zonalConfig: {
      monitorDuration: cdk.Duration.seconds(0),
      firstZoneMonitorDuration: cdk.Duration.minutes(0),
      minimumHealthyHostsPerZone: codedeploy.MinimumHealthyHostsPerZone.count(1),
    },
  }),
  autoScalingGroups: [asg],
  loadBalancers: [
    codedeploy.LoadBalancer.application(targetGroup),
  ],
  alarms: [
    new cloudwatch.Alarm(stack, 'Alarm1', {
      metric: new cloudwatch.Metric({
        metricName: 'Errors',
        namespace: 'my.namespace',
      }),
      threshold: 1,
      evaluationPeriods: 1,
    }),
  ],
  autoRollback: {
    failedDeployment: false,
    deploymentInAlarm: false,
  },
});

new integ.IntegTest(app, 'ServerDeploymentGroupZonalConfig', {
  testCases: [stack],
});

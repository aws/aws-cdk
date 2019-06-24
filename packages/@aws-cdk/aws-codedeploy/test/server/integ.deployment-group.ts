import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import lb = require('@aws-cdk/aws-elasticloadbalancing');
import cdk = require('@aws-cdk/core');
import codedeploy = require('../../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-server-dg');

const vpc = new ec2.Vpc(stack, 'VPC');

const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
  machineImage: new ec2.AmazonLinuxImage(),
  vpc,
});

const elb = new lb.LoadBalancer(stack, 'ELB', { vpc });
elb.addListener({
  externalPort: 80,
});

new codedeploy.ServerDeploymentGroup(stack, 'CodeDeployGroup', {
  deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
  autoScalingGroups: [asg],
  loadBalancer: codedeploy.LoadBalancer.classic(elb),
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

app.synth();

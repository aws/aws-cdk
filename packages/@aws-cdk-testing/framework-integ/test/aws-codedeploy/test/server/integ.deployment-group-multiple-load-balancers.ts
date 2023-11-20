import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lb from 'aws-cdk-lib/aws-elasticloadbalancing';
import * as lb2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-server-dg-multi-lb');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
  machineImage: new ec2.AmazonLinuxImage(),
  vpc,
});

const elb = new lb.LoadBalancer(stack, 'ELB', { vpc });
elb.addListener({
  externalPort: 80,
});

const alb = new lb2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc: vpc,
});

const nlb = new lb2.NetworkLoadBalancer(stack, 'NLB', {
  vpc: vpc,
});

const listener = alb.addListener('Listener', { protocol: lb2.ApplicationProtocol.HTTP });
const targetGroup = listener.addTargets('Fleet', { protocol: lb2.ApplicationProtocol.HTTP });

const nlbListener = nlb.addListener('Listener', { port: 80 });
const nlbTargetGroup = nlbListener.addTargets('Fleet', { port: 80 });

new codedeploy.ServerDeploymentGroup(stack, 'CodeDeployGroupMultipleLoadBalancers', {
  deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
  autoScalingGroups: [asg],
  loadBalancers: [
    codedeploy.LoadBalancer.classic(elb),
    codedeploy.LoadBalancer.application(targetGroup),
    codedeploy.LoadBalancer.network(nlbTargetGroup),
  ],
});

new integ.IntegTest(app, 'ServerDeploymentGroupMultipleLB', {
  testCases: [stack],
});

app.synth();

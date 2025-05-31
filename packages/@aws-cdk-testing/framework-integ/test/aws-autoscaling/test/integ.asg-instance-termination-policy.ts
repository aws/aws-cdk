#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-instance-termination-policy');

const vpc = new ec2.Vpc(stack, 'VPC', {
  natGateways: 0,
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const lambdaFn = new lambda.Function(stack, 'MyFunction', {
  code: lambda.Code.fromInline(`exports.handler = ${asgHandler}`),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

lambdaFn.addPermission('AllowInvokeByAutoScaling', {
  action: 'lambda:InvokeFunction',
  principal: new iam.ArnPrincipal(`arn:${stack.partition}:iam::${stack.account}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling`),
});

const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: new ec2.AmazonLinuxImage(),
  terminationPolicies: [
    autoscaling.TerminationPolicy.CUSTOM_LAMBDA_FUNCTION,
    autoscaling.TerminationPolicy.OLDEST_INSTANCE,
  ],
  terminationPolicyCustomLambdaFunctionArn: lambdaFn.functionArn,
});

asg.node.addDependency(lambdaFn);
asg.node.addDependency(vpc);

new integ.IntegTest(app, 'InstanceTerminationPolicyTest', {
  testCases: [stack],
});

app.synth();

function asgHandler(_event: any, _context: any, callback: any) {
  let json = JSON.parse(JSON.stringify(_event));
  let instanceIds: string[] = [];
  json.Instances.forEach((instance: any) => {
    instanceIds.push(instance.InstanceId);
  });
  // eslint-disable-next-line quote-props
  const result = { 'InstanceIDs': instanceIds };
  return callback(undefined, result);
}

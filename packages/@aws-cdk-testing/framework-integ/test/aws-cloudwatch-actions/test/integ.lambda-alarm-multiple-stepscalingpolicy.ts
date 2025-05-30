import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION } from 'aws-cdk-lib/cx-api';

const app = new App({
  context: {
    [LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION]: true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'lambda-alarm-multiple-stepscalingpolicy');

const myLambda = new lambda.Function(stack, 'MyLambda', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log("Alarm triggered:", JSON.stringify(event, null, 2));
    };
  `),
});

const myLambda2 = new lambda.Function(stack, 'MyLambda2', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log("Alarm triggered:", JSON.stringify(event, null, 2));
    };
  `),
});

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
});

const metric = new Metric({
  namespace: 'Repro',
  metricName: 'Metric',
});

const policy1 = autoScalingGroup.scaleOnMetric('MetricScale1', {
  metric,
  scalingSteps: [
    { upper: 10, change: -5 },
    { lower: 50, change: 5 },
  ],
});

const policy2 = autoScalingGroup.scaleOnMetric('MetricScale2', {
  metric,
  scalingSteps: [
    { upper: 20, change: -5 },
    { lower: 60, change: 5 },
  ],
});

const lambdaAction = new cloudwatchActions.LambdaAction(myLambda, {
  useUniquePermissionId: true,
});
const lambdaAction2 = new cloudwatchActions.LambdaAction(myLambda2, {
  useUniquePermissionId: true,
});

policy1.lowerAlarm?.addAlarmAction(lambdaAction);
policy2.lowerAlarm?.addAlarmAction(lambdaAction);

policy1.upperAlarm?.addAlarmAction(lambdaAction);
policy2.upperAlarm?.addAlarmAction(lambdaAction);

policy1.lowerAlarm?.addAlarmAction(lambdaAction2);
policy2.lowerAlarm?.addAlarmAction(lambdaAction2);

policy1.upperAlarm?.addAlarmAction(lambdaAction2);
policy2.upperAlarm?.addAlarmAction(lambdaAction2);

new integ.IntegTest(app, 'lambda-alarm-multiple-stepscalingpolicy-test', {
  testCases: [stack],
});

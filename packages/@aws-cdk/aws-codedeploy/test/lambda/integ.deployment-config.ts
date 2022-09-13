import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as codedeploy from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-lambda-config');

new codedeploy.LambdaDeploymentConfig(stack, 'LinearConfig', {
  trafficRoutingConfig: new codedeploy.TimeBasedLinearTrafficRoutingConfig({
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  }),
});

new integ.IntegTest(app, 'LambdaDeploymentConfigTest', {
  testCases: [stack],
});

app.synth();

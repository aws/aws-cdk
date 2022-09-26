import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as codedeploy from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-ecs-config');

new codedeploy.EcsDeploymentConfig(stack, 'LinearConfig', {
  trafficRouting: codedeploy.TrafficRouting.timeBasedLinear({
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  }),
});

new integ.IntegTest(app, 'EcsDeploymentConfigTest', {
  testCases: [stack],
});

app.synth();

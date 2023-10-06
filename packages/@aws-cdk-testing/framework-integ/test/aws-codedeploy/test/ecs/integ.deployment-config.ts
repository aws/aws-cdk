import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';

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

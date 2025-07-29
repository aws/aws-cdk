import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-lambda-config');

new codedeploy.LambdaDeploymentConfig(stack, 'LinearConfig', {
  trafficRouting: codedeploy.TrafficRouting.timeBasedLinear({
    interval: cdk.Duration.minutes(1),
    percentage: 5,
  }),
});

new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
  interval: cdk.Duration.minutes(1),
  percentage: 5,
  type: cdk.aws_codedeploy.CustomLambdaDeploymentConfigType.LINEAR,
  deploymentConfigName: 'hello',
});

new integ.IntegTest(app, 'LambdaDeploymentConfigTest', {
  testCases: [stack],
});

app.synth();

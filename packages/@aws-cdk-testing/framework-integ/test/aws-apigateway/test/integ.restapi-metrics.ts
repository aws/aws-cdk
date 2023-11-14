import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'restapi-metrics');
const restApi = new apigw.RestApi(stack, 'Api', { cloudWatchRole: true });
const stage = restApi.deploymentStage;
const method = restApi.root.addMethod('GET');

new cloudwatch.Alarm(stack, 'RestApiAlarm', {
  metric: restApi.metricClientError(),
  evaluationPeriods: 1,
  threshold: 1,
});

new cloudwatch.Alarm(stack, 'MethodAlarm', {
  metric: method.metricServerError(stage),
  evaluationPeriods: 1,
  threshold: 1,
});

new cloudwatch.Alarm(stack, 'StageAlarm', {
  metric: stage.metricCount(),
  evaluationPeriods: 1,
  threshold: 1,
});

new integ.IntegTest(app, 'MetricsTest', {
  testCases: [stack],
});

app.synth();

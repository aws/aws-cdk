import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-function', { env: { region: 'eu-west-1' } });

new cloudfront.Function(stack, 'function', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
  autoPublish: false,
});

new IntegTest(app, 'AutoPublishTest', {
  testCases: [stack],
});

app.synth();

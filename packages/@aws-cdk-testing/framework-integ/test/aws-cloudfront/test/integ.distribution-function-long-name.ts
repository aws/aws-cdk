import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-function-with-long-name');
stack.node.setContext('@aws-cdk/aws-cloudfront:useStableGeneratedFunctionName', true);

new cloudfront.Function(stack, 'test-function-id-name-long', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
});

new integ.IntegTest(app, 'FunctionNameLong', {
  testCases: [stack],
});

import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';

// CloudFormation supports InlineCode only for a subset of runtimes. This integration test
// is used to verify that the ones marked in the CDK are in fact supported by CloudFormation.
// Running `cdk deploy` on this stack will confirm if all the runtimes here are supported.
//
// To verify that the lambda function works correctly, use the function names that are part
// of the stack output (printed on the console at the end of 'cdk deploy') and run the command -
// aws lambda invoke --function-name <function-name>
//
// If successful, the output will contain "success"

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-runtime-inlinecode');

const python38 = new Function(stack, 'PYTHON_3_8', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_8,
});
new CfnOutput(stack, 'PYTHON_3_8-functionName', { value: python38.functionName });

const python39 = new Function(stack, 'PYTHON_3_9', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_9,
});
new CfnOutput(stack, 'PYTHON_3_9-functionName', { value: python39.functionName });

const python310 = new Function(stack, 'PYTHON_3_10', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_10,
});
new CfnOutput(stack, 'PYTHON_3_10-functionName', { value: python310.functionName });

const python312 = new Function(stack, 'PYTHON_3_12', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_12,
});
new CfnOutput(stack, 'PYTHON_3_12-functionName', { value: python312.functionName });

const python313 = new Function(stack, 'PYTHON_3_13', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_13,
});
new CfnOutput(stack, 'PYTHON_3_13-functionName', { value: python313.functionName });

const node18xfn = new Function(stack, 'NODEJS_18_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
});
new CfnOutput(stack, 'NODEJS_18_X-functionName', { value: node18xfn.functionName });

const node20xfn = new Function(stack, 'NODEJS_20_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_20_X,
});
new CfnOutput(stack, 'NODEJS_20_X-functionName', { value: node20xfn.functionName });

const node22xfn = new Function(stack, 'NODEJS_22_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_22_X,
});
new CfnOutput(stack, 'NODEJS_22_X-functionName', { value: node22xfn.functionName });

new integ.IntegTest(app, 'lambda-runtime-inlinecode', {
  testCases: [stack],
});

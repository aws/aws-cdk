import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { Function, InlineCode, Runtime } from '../lib';

// CloudFormation supports InlineCode only for a subset of runtimes. This integration test
// is used to verify that the ones marked in the CDK are in fact supported by CloudFormation.
// Running `cdk deploy` on this stack will confirm if all the runtimes here are supported.
//
// To verify that the lambda function works correctly, use the function names that are part
// of the stack output (printed on the console at the end of 'cdk deploy') and run the command -
// aws lambda invoke --function-name <function-name>
//
// If successful, the output will contain "success"

const app = new App();

const stack = new Stack(app, 'aws-cdk-lambda-runtime-inlinecode');

const python37 = new Function(stack, 'PYTHON_3_7', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_7,
});
new CfnOutput(stack, 'PYTHON_3_7-functionName', { value: python37.functionName });

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

const node14xfn = new Function(stack, 'NODEJS_14_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_14_X,
});
new CfnOutput(stack, 'NODEJS_14_X-functionName', { value: node14xfn.functionName });

const node16xfn = new Function(stack, 'NODEJS_16_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_16_X,
});
new CfnOutput(stack, 'NODEJS_16_X-functionName', { value: node16xfn.functionName });

const node18xfn = new Function(stack, 'NODEJS_18_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_18_X,
});
new CfnOutput(stack, 'NODEJS_18_X-functionName', { value: node18xfn.functionName });

app.synth();

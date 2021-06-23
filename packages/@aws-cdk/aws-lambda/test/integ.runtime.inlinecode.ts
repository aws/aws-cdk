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

const node10xfn = new Function(stack, 'NODEJS_10_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_10_X,
});
new CfnOutput(stack, 'NODEJS_10_X-functionName', { value: node10xfn.functionName });

const node12xfn = new Function(stack, 'NODEJS_12_X', {
  code: new InlineCode('exports.handler = async function(event) { return "success" }'),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_12_X,
});
new CfnOutput(stack, 'NODEJS_12_X-functionName', { value: node12xfn.functionName });

const python27 = new Function(stack, 'PYTHON_2_7', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_2_7,
});
new CfnOutput(stack, 'PYTHON_2_7-functionName', { value: python27.functionName });

const python36 = new Function(stack, 'PYTHON_3_6', {
  code: new InlineCode('def handler(event, context):\n  return "success"'),
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_6,
});
new CfnOutput(stack, 'PYTHON_3_6-functionName', { value: python36.functionName });

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

app.synth();

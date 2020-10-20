/// !cdk-integ *
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'EdgeFunction', {
  env: {
    region: 'eu-west-1', // Anything but us-east-1
  },
});

new lambda.EdgeFunction(stack, 'MyLambda', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
  handler: 'index.main',
  runtime: lambda.Runtime.PYTHON_3_6,
});

app.synth();

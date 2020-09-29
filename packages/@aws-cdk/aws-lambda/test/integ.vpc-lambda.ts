import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpc-lambda');
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('def main(event, context): pass'),
  handler: 'index.main',
  runtime: lambda.Runtime.PYTHON_3_6,
  vpc,
});

app.synth();

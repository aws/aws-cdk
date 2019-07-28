import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import lambda = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpc-lambda');
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('def main(event, context): pass'),
  handler: 'index.main',
  runtime: lambda.Runtime.PYTHON_3_6,
  vpc
});

app.synth();

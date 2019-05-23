import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import lambda = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpc-lambda');
const vpc = new ec2.Vpc(stack, 'VPC', { maxAZs: 2 });

new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('def main(event, context): pass'),
  handler: 'index.main',
  runtime: lambda.Runtime.Python36,
  vpc
});

app.run();

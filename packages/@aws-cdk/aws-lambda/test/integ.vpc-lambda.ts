import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import lambda = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-vpc-lambda');
const vpc = new ec2.VpcNetwork(stack, 'VPC', { maxAZs: 2 });

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('def main(event, context): pass'),
  handler: 'index.main',
  runtime: lambda.Runtime.Python36,
  vpc
});

fn.connections.allowToAnyIPv4(new ec2.TcpAllPorts(), 'Talk to everyone');

process.stdout.write(app.run());

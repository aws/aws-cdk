import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-vpc-singleton-lambda');
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

for (let i = 0; i < 5; i++) {
  const singleton = new lambda.SingletonFunction(stack, `Singleton${i}`, {
    code: new lambda.InlineCode('def main(event, context): pass'),
    handler: 'index.main',
    runtime: lambda.Runtime.PYTHON_3_6,
    vpc,
    uuid: 'fb6606b7-c48a-4d7f-8aed-6997bf3cf970',
  });

  singleton.connections.securityGroups[0].addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.udp(8080));
}

app.synth();

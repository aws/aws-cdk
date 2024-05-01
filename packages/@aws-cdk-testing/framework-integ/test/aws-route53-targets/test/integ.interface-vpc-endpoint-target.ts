import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-interface-vpc-endpoint', {
  env: {
    region: 'us-west-2',
  },
});

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'InterfaceEndpoint', {
  vpc,
  service: {
    name: 'com.amazonaws.us-west-2.sms',
    port: 80,
  },
  privateDnsEnabled: false,
  subnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
});
const zone = new route53.PrivateHostedZone(stack, 'PrivateZone', {
  vpc,
  zoneName: 'test.aws.cdk.com',
});

new route53.ARecord(stack, 'AliasEndpointRecord', {
  zone,
  recordName: 'foo',
  target: route53.RecordTarget.fromAlias(new targets.InterfaceVpcEndpointTarget(interfaceVpcEndpoint)),
});

app.synth();

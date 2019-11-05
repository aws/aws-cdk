import ec2 = require('@aws-cdk/aws-ec2');
import r53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/core');
import targets = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-interface-vpc-endpoint');
const vpc = new ec2.Vpc(stack, 'VPC');

const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'InterfaceEndpoint', {
  vpc,
  service: {
    name: 'com.amazonaws.vpce.us-west-2.vpce-svc-01234567890987654',
    port: 80
  },
  privateDnsEnabled: false,
  subnets: {
      subnetType: ec2.SubnetType.PRIVATE
  }
});
const zone = new r53.PrivateHostedZone(stack, 'PrivateZone', {
  vpc,
  zoneName: 'test.aws.cdk.com'
});

new r53.ARecord(stack, "AliasEndpointRecord", {
  zone,
  recordName: 'foo',
  target: r53.RecordTarget.fromAlias(new targets.InterfaceVpcEndpointTarget(interfaceVpcEndpoint))
});

app.synth();

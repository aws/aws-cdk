import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { SecretValue } from 'aws-cdk-lib/core';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpn-two-tunnels');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

new ec2.Vpc(stack, 'MyVpc', {
  cidr: '10.11.0.0/16',
  vpnConnections: {
    Dynamic: { // Dynamic routing
      ip: '52.85.255.164',
      tunnelOptions: [
        {
          preSharedKeySecret: SecretValue.unsafePlainText('secretkey1234'),
        },
        {
          preSharedKeySecret: SecretValue.unsafePlainText('secretkey5678'),
        },
      ],
    },
  },
});

new integ.IntegTest(app, 'aws-cdk-ec2-vpn-two-tunnels-test', {
  testCases: [stack],
});

app.synth();

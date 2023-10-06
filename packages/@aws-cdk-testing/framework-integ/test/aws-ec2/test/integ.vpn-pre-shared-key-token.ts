import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpn');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'MyVpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.10.0.0/16'),
  vpnConnections: {
    Dynamic: { // Dynamic routing
      ip: '52.85.255.164',
      tunnelOptions: [
        {
          preSharedKeySecret: cdk.SecretValue.unsafePlainText('ssmpwaaa'),
        },
      ],
    },
  },
});

vpc.addVpnConnection('Static', { // Static routing
  ip: '52.85.255.197',
  staticRoutes: [
    '192.168.10.0/24',
    '192.168.20.0/24',
  ],
});

app.synth();

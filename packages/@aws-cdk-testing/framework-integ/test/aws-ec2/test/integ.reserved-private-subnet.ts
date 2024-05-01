import * as cdk from 'aws-cdk-lib';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

/*
 * Creates a simple vpc with a public subnet and a private reserved subnet.
 * Public subnet should be visible but a private reserved subnet only has IP space reserved.
 * No resources are provisioned in a reserved subnet.
 *
 * Stack verification steps:
 * -- aws ec2 describe-nat-gateways returns { "natGateways": []}
 */

const app = new cdk.App();

class VpcReservedPrivateSubnetStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    /// !show
    // Specify no NAT gateways with a reserved private subnet
    new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [
        {
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          reserved: true,
        },
      ],
      natGateways: 0,
    });
    /// !hide
  }
}
new VpcReservedPrivateSubnetStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();

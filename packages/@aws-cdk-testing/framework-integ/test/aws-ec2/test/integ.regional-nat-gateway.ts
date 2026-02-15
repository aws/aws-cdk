import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class RegionalNatGatewayStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Minimal configuration - Regional NAT Gateway with automatic EIP allocation
    new ec2.Vpc(this, 'VpcMinimal', {
      natGatewayProvider: ec2.NatProvider.regionalGateway(),
      subnetConfiguration: [
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    // With explicit EIP allocation
    const eip = new ec2.CfnEIP(this, 'NatEip');
    new ec2.Vpc(this, 'VpcWithEip', {
      natGatewayProvider: ec2.NatProvider.regionalGateway({
        eip,
      }),
      subnetConfiguration: [
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    // With AvailabilityZoneAddresses for manual AZ configuration
    const eip1 = new ec2.CfnEIP(this, 'NatEip1');
    const eip2 = new ec2.CfnEIP(this, 'NatEip2');
    new ec2.Vpc(this, 'VpcWithAzAddresses', {
      natGatewayProvider: ec2.NatProvider.regionalGateway({
        availabilityZoneAddresses: [
          { allocationIds: [eip1.attrAllocationId], availabilityZone: 'us-east-1a' },
          { allocationIds: [eip2.attrAllocationId], availabilityZone: 'us-east-1b' },
        ],
      }),
      subnetConfiguration: [
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });
  }
}

const app = new cdk.App();
const stack = new RegionalNatGatewayStack(app, 'RegionalNatGatewayStack');

new IntegTest(app, 'regional-nat-gateway-integ', {
  testCases: [stack],
});

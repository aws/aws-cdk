import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

export class SubnetIpamTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcId = 'vpc-12345';
    const availabilityZone = 'us-east-1a';
    const ipv4IpamPoolId = 'ipam-pool-0example0123456789';
    const ipv6IpamPoolId = 'ipam-pool-0example9876543210';

    // Case 1: Basic IPv4 subnet (with CIDR block)
    new ec2.Subnet(this, 'SubnetWithIpv4', {
      vpcId,
      availabilityZone,
      cidrBlock: '10.0.0.0/24',
    });

    // Case 2: IPv4 + IPv6 CIDR block specification
    new ec2.Subnet(this, 'SubnetWithIpv6', {
      vpcId,
      availabilityZone,
      cidrBlock: '10.0.1.0/24',
      ipv6CidrBlock: '2001:db8::/64',
      assignIpv6AddressOnCreation: true,
    });

    // Case 3: IPv4 IPAM allocation only
    new ec2.Subnet(this, 'SubnetWithIpv4IpamAllocation', {
      vpcId,
      availabilityZone,
      ipv4IpamAllocation: {
        ipamPoolId: ipv4IpamPoolId,
        netmaskLength: 24,
      },
    });

    // Case 4: IPv6 IPAM allocation + required cidrBlock
    new ec2.Subnet(this, 'SubnetWithIpv6IpamAllocation', {
      vpcId,
      availabilityZone,
      cidrBlock: '10.0.2.0/24', // cidrBlock is required even with IPv6 IPAM
      ipv6IpamAllocation: {
        ipamPoolId: ipv6IpamPoolId,
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // Case 5: Both IPAM allocations
    new ec2.Subnet(this, 'SubnetWithBothIpamAllocations', {
      vpcId,
      availabilityZone,
      ipv4IpamAllocation: {
        ipamPoolId: ipv4IpamPoolId,
        netmaskLength: 24,
      },
      ipv6IpamAllocation: {
        ipamPoolId: ipv6IpamPoolId,
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // Case 6: IPAM allocations without netmaskLength
    new ec2.Subnet(this, 'SubnetWithIpamAllocationsWithoutNetmask', {
      vpcId,
      availabilityZone,
      ipv4IpamAllocation: {
        ipamPoolId: ipv4IpamPoolId,
        // netmaskLength is optional and will use the IPAM pool's default
      },
      ipv6IpamAllocation: {
        ipamPoolId: ipv6IpamPoolId,
        // netmaskLength is optional and will use the IPAM pool's default
      },
      assignIpv6AddressOnCreation: true,
    });
  }
}

const stack = new SubnetIpamTestStack(app, 'SubnetIpamTest');

new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

app.synth();

import { Match, Template } from '../../assertions';
import { App, Stack } from '../../core';
import * as ec2 from '../lib';

describe('subnet', () => {
  // IPv4の基本的なケース
  test('subnet with cidr block', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
    });
  });

  test('subnet with IPv4 IPAM allocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      ipv4IpamAllocation: {
        ipamPoolId: 'ipam-pool-12345',
        netmaskLength: 24,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      Ipv4IpamPoolId: 'ipam-pool-12345',
      Ipv4NetmaskLength: 24,
    });
  });

  test('subnet with mapPublicIpOnLaunch enabled', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
      mapPublicIpOnLaunch: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
      MapPublicIpOnLaunch: true,
    });
  });

  test('subnet with mapPublicIpOnLaunch disabled', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
      mapPublicIpOnLaunch: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
      MapPublicIpOnLaunch: false,
    });
  });

  // IPv6の基本的なケース
  test('subnet with ipv6CidrBlock', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
      ipv6CidrBlock: '2001:db8::/64',
      assignIpv6AddressOnCreation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
      Ipv6CidrBlock: '2001:db8::/64',
      AssignIpv6AddressOnCreation: true,
    });
  });

  test('subnet with IPv6 IPAM allocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
      ipv6IpamAllocation: {
        ipamPoolId: 'ipam-pool-67890',
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
      Ipv6IpamPoolId: 'ipam-pool-67890',
      Ipv6NetmaskLength: 64,
      AssignIpv6AddressOnCreation: true,
    });
  });

  test('subnet with assignIpv6AddressOnCreation disabled', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
      ipv6CidrBlock: '2001:db8::/64',
      assignIpv6AddressOnCreation: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
      Ipv6CidrBlock: '2001:db8::/64',
      AssignIpv6AddressOnCreation: false,
    });
  });

  // 複合ケース（IPv4とIPv6の組み合わせ）
  test('subnet with both IPv4 and IPv6 IPAM allocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      ipv4IpamAllocation: {
        ipamPoolId: 'ipam-pool-12345',
        netmaskLength: 24,
      },
      ipv6IpamAllocation: {
        ipamPoolId: 'ipam-pool-67890',
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      Ipv4IpamPoolId: 'ipam-pool-12345',
      Ipv4NetmaskLength: 24,
      Ipv6IpamPoolId: 'ipam-pool-67890',
      Ipv6NetmaskLength: 64,
      AssignIpv6AddressOnCreation: true,
    });
  });

  test('subnet with IPv4 CIDR and IPv6 IPAM allocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ec2.Subnet(stack, 'Subnet', {
      vpcId: 'vpc-1234',
      availabilityZone: 'eu-west-1a',
      cidrBlock: '10.0.0.0/24',
      ipv6IpamAllocation: {
        ipamPoolId: 'ipam-pool-67890',
        netmaskLength: 64,
      },
      assignIpv6AddressOnCreation: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      VpcId: 'vpc-1234',
      AvailabilityZone: 'eu-west-1a',
      CidrBlock: '10.0.0.0/24',
      Ipv6IpamPoolId: 'ipam-pool-67890',
      Ipv6NetmaskLength: 64,
      AssignIpv6AddressOnCreation: true,
    });
  });

  // エラーケース
  test('cannot specify both cidrBlock and ipv4IpamAllocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN & THEN
    expect(() => {
      new ec2.Subnet(stack, 'Subnet', {
        vpcId: 'vpc-1234',
        availabilityZone: 'eu-west-1a',
        cidrBlock: '10.0.0.0/24',
        ipv4IpamAllocation: {
          ipamPoolId: 'ipam-pool-12345',
          netmaskLength: 24,
        },
      });
    }).toThrow(/Cannot specify both cidrBlock and ipv4IpamAllocation/);
  });

  test('cannot specify both ipv6CidrBlock and ipv6IpamAllocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN & THEN
    expect(() => {
      new ec2.Subnet(stack, 'Subnet', {
        vpcId: 'vpc-1234',
        availabilityZone: 'eu-west-1a',
        cidrBlock: '10.0.0.0/24',
        ipv6CidrBlock: '2001:db8::/64',
        ipv6IpamAllocation: {
          ipamPoolId: 'ipam-pool-67890',
          netmaskLength: 64,
        },
      });
    }).toThrow(/Cannot specify both ipv6CidrBlock and ipv6IpamAllocation/);
  });

  test('cannot specify assignIpv6AddressOnCreation without ipv6CidrBlock or ipv6IpamAllocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN & THEN
    expect(() => {
      new ec2.Subnet(stack, 'Subnet', {
        vpcId: 'vpc-1234',
        availabilityZone: 'eu-west-1a',
        cidrBlock: '10.0.0.0/24',
        assignIpv6AddressOnCreation: true,
      });
    }).toThrow(/If you specify assignIpv6AddressOnCreation, you must also specify ipv6CidrBlock or ipv6IpamAllocation/);
  });

  test('cannot create subnet without VPC ID', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN & THEN
    expect(() => {
      new ec2.Subnet(stack, 'Subnet', {
        // vpcId missing
        availabilityZone: 'eu-west-1a',
        cidrBlock: '10.0.0.0/24',
      } as any); // Type assertion needed to bypass TypeScript checking
    }).toThrow(/vpcId/);
  });

  test('cannot create subnet without CIDR or IPAM allocation', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN & THEN
    expect(() => {
      new ec2.Subnet(stack, 'Subnet', {
        vpcId: 'vpc-1234',
        availabilityZone: 'eu-west-1a',
        // Neither cidrBlock nor ipv4IpamAllocation specified
      });
    }).toThrow(/Either cidrBlock or ipv4IpamAllocation must be specified/);
  });
});

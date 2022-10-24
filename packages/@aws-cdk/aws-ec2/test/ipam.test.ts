
import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AwsIpam, IpAddressManager, Cidr, SubnetType, Vpc } from '../lib';

describe('Cidr vpc allocation', () => {

  test('Default Cidr returns the correct vpc cidr', () => {
    const ipAddressManager = new Cidr('10.0.0.0/16');
    expect(ipAddressManager.allocateVpcCidr().cidrBlock).toEqual('10.0.0.0/16');
  });

  test('Default Cidr returns ipv4IpamPoolId as undefined', () => {
    const ipAddressManager = new Cidr('10.0.0.0/16');
    expect(ipAddressManager.allocateVpcCidr().ipv4IpamPoolId).toBeUndefined;
  });

  test('Default Cidr returns ipv4NetmaskLength as undefined', () => {
    const ipAddressManager = new Cidr('10.0.0.0/16');
    expect(ipAddressManager.allocateVpcCidr().ipv4NetmaskLength).toBeUndefined;
  });

});

describe('IpAddressManager.Cidr subnets allocation', () => {

  const cidrProps = '10.0.0.0/16';

  test('Default Cidr returns the correct subnet allocations, when you do not give a cidr for the subnets', () => {
    const ipAddressManager = new Cidr(cidrProps);
    expect(ipAddressManager.allocateSubnetsCidr({
      requestedSubnets: [{
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        subnetConstructId: 'public',
      }, {
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'private-with-egress',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        subnetConstructId: 'public',
      }],
      vpcCidr: '10.0.0.0/16',
    }).allocatedSubnets).toEqual([{ cidr: '10.0.0.0/17' }, { cidr: '10.0.128.0/17' }]);
  });

  test('Default Cidr returns the correct subnet allocations, when you provide a cidr for the subnets', () => {
    const ipAddressManager = new Cidr(cidrProps);
    expect(ipAddressManager.allocateSubnetsCidr({
      requestedSubnets: [{
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        subnetConstructId: 'public',
      }, {
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'private-with-egress',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        subnetConstructId: 'public',
      }],
      vpcCidr: '10.0.0.0/16',
    }).allocatedSubnets).toEqual([{ cidr: '10.0.0.0/24' }, { cidr: '10.0.1.0/24' }]);
  });

  test('Default Cidr returns the correct subnet allocations, when you mix provided and non provided cidr for the subnets', () => {
    const ipAddressManager = new Cidr(cidrProps);
    expect(ipAddressManager.allocateSubnetsCidr({
      requestedSubnets: [{
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        subnetConstructId: 'public',
      }, {
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'private-with-egress',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        subnetConstructId: 'public',
      }],
      vpcCidr: '10.0.0.0/16',
    }).allocatedSubnets).toEqual([{ cidr: '10.0.128.0/17' }, { cidr: '10.0.0.0/24' }]);
  });

});

describe('AwsIpam vpc allocation', () => {

  const awsIpamProps = {
    ipv4IpamPoolId: 'ipam-pool-0111222333444',
    ipv4NetmaskLength: 22,
  };

  test('AwsIpam returns cidrBlock as undefined', () => {
    const ipAddressManager = new AwsIpam(awsIpamProps);
    expect(ipAddressManager.allocateVpcCidr().cidrBlock).toBeUndefined;
  });

  test('AwsIpam returns the correct vpc ipv4IpamPoolId', () => {
    const ipAddressManager = new AwsIpam(awsIpamProps);
    expect(ipAddressManager.allocateVpcCidr().ipv4IpamPoolId).toEqual('ipam-pool-0111222333444');
  });

  test('AwsIpam returns the correct vpc ipv4NetmaskLength', () => {
    const ipAddressManager = new AwsIpam(awsIpamProps);
    expect(ipAddressManager.allocateVpcCidr().ipv4NetmaskLength).toEqual(22);
  });

});

describe('AwsIpam subnets allocation', () => {

  const awsIpamProps = {
    ipv4IpamPoolId: 'ipam-pool-0111222333444',
    ipv4NetmaskLength: 22,
  };

  test('AwsIpam returns subnet allocations as 2x TOKEN, when you do not give a cidr for the subnets', () => {
    const ipAddressManager = new AwsIpam({ defaultSubnetIpv4NetmaskLength: 24, ...awsIpamProps });
    const allocations = ipAddressManager.allocateSubnetsCidr({
      requestedSubnets: [{
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        subnetConstructId: 'public',
      }, {
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'private-with-egress',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        subnetConstructId: 'public',
      }],
      vpcCidr: '10.0.0.0/16',
    });

    expect (allocations.allocatedSubnets.length).toBe(2);
    expect (allocations.allocatedSubnets[0].cidr).toContain('TOKEN');
    expect (allocations.allocatedSubnets[1].cidr).toContain('TOKEN');
  });

  test('AwsIpam returns subnet allocations as 2x TOKEN, when you provide a cidr for the subnets', () => {
    const ipAddressManager = new AwsIpam(awsIpamProps);
    const allocations = ipAddressManager.allocateSubnetsCidr({
      requestedSubnets: [{
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        subnetConstructId: 'public',
      }, {
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'private-with-egress',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        subnetConstructId: 'public',
      }],
      vpcCidr: '10.0.0.0/16',
    });

    expect (allocations.allocatedSubnets.length).toBe(2);
    expect (allocations.allocatedSubnets[0].cidr).toContain('TOKEN');
    expect (allocations.allocatedSubnets[1].cidr).toContain('TOKEN');
  });

  test('AwsIpam returns subnet allocations as 2x TOKEN, when you mix provide and non provided cidr for the subnets', () => {
    const ipAddressManager = new AwsIpam({ defaultSubnetIpv4NetmaskLength: 24, ...awsIpamProps });
    const allocations = ipAddressManager.allocateSubnetsCidr({
      requestedSubnets: [{
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        subnetConstructId: 'public',
      }, {
        availabilityZone: 'dummyAz1',
        configuration: {
          name: 'private-with-egress',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        subnetConstructId: 'public',
      }],
      vpcCidr: '10.0.0.0/16',
    });

    expect (allocations.allocatedSubnets.length).toBe(2);
    expect (allocations.allocatedSubnets[0].cidr).toContain('TOKEN');
    expect (allocations.allocatedSubnets[1].cidr).toContain('TOKEN');
  });

});

describe('IpAddressManager.cidr Vpc Integration', () => {
  test('IpAddressManager.Cidr provides the correct Cidr allocation to the Vpc ', () => {

    const stack = new Stack();

    const cidrProps = '10.0.0.0/16';
    const ipAddressManager = IpAddressManager.cidr(cidrProps);

    new Vpc(stack, 'VpcNetwork', { ipAddressManager: ipAddressManager });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: cidrProps,
    });
  });

  test('IpAddressManager.cidr provides the correct Subnet allocation to the Vpc', () => {

    const stack = new Stack();

    const cidrProps = '10.0.0.0/16';
    const ipAddressManager = IpAddressManager.cidr(cidrProps);

    new Vpc(stack, 'VpcNetwork', { ipAddressManager: ipAddressManager });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.0.0.0/18',
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.0.64.0/18',
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.0.128.0/18',
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.0.192.0/18',
    });
  });
});

describe('AwsIpam Vpc Integration', () => {

  test('Should throw if there are subnets without explicit Cidr and no defaultCidr given', () => {

    const stack = new Stack();

    const awsIpamProps = {
      ipv4IpamPoolId: 'ipam-pool-0111222333444',
      ipv4NetmaskLength: 22,
    };

    const ipAddressManager = IpAddressManager.awsIpam(awsIpamProps);

    expect(() => {new Vpc(stack, 'VpcNetwork', { ipAddressManager: ipAddressManager });}).toThrow(/If you have not set a cidr for all subnets in this case you must set a defaultCidrMask in the provider/);;

  });

  test('AwsIpam provides the correct Cidr allocation to the Vpc ', () => {

    const stack = new Stack();

    const awsIpamProps = {
      ipv4IpamPoolId: 'ipam-pool-0111222333444',
      ipv4NetmaskLength: 22,
      defaultSubnetIpv4NetmaskLength: 24,
    };

    const ipAddressManager = IpAddressManager.awsIpam(awsIpamProps);

    new Vpc(stack, 'VpcNetwork', { ipAddressManager: ipAddressManager });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', {
      Ipv4IpamPoolId: awsIpamProps.ipv4IpamPoolId,
      Ipv4NetmaskLength: awsIpamProps.ipv4NetmaskLength,
    });
  });


  test('AwsIpam provides the correct Subnet allocation to the Vpc', () => {

    const stack = new Stack();

    const awsIpamProps = {
      ipv4IpamPoolId: 'ipam-pool-0111222333444',
      ipv4NetmaskLength: 22,
      defaultSubnetIpv4NetmaskLength: 24,
    };

    const ipAddressManager = IpAddressManager.awsIpam(awsIpamProps);

    new Vpc(stack, 'VpcNetwork', { ipAddressManager: ipAddressManager });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: {
        'Fn::Select': [0, {
          'Fn::Cidr': [{
            'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
          }, 4, '8'],
        }],
      },
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: {
        'Fn::Select': [1, {
          'Fn::Cidr': [{
            'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
          }, 4, '8'],
        }],
      },
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: {
        'Fn::Select': [2, {
          'Fn::Cidr': [{
            'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
          }, 4, '8'],
        }],
      },
    });
    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: {
        'Fn::Select': [3, {
          'Fn::Cidr': [{
            'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
          }, 4, '8'],
        }],
      },
    });
  });

  test('Should throw if ipv4NetmaskLength not big enough to allocate subnets', () => {

    const stack = new Stack();

    const awsIpamProps = {
      ipv4IpamPoolId: 'ipam-pool-0111222333444',
      ipv4NetmaskLength: 18,
      defaultSubnetIpv4NetmaskLength: 17,
    };

    const ipAddressManager = IpAddressManager.awsIpam(awsIpamProps);

    expect(() => {new Vpc(stack, 'VpcNetwork', { ipAddressManager: ipAddressManager });}).toThrow('IP space of size /18 not big enough to allocate subnets of sizes /17,/17,/17,/17');;

  });

  test('Should be able to allocate subnets from a SubnetConfiguration in Vpc Constructor', () => {

    const stack = new Stack();

    const awsIpamProps = {
      ipv4IpamPoolId: 'ipam-pool-0111222333444',
      ipv4NetmaskLength: 18,
      defaultSubnetIpv4NetmaskLength: 17,
    };

    const ipAddressManager = IpAddressManager.awsIpam(awsIpamProps);

    new Vpc(stack, 'VpcNetwork', {
      ipAddressManager: ipAddressManager,
      subnetConfiguration: [{
        name: 'public',
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24,
      }],
      maxAzs: 2,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: {
        'Fn::Select': [0, {
          'Fn::Cidr': [{
            'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
          }, 64, '8'],
        }],
      },
    });

    template.hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: {
        'Fn::Select': [1, {
          'Fn::Cidr': [{
            'Fn::GetAtt': ['VpcNetworkB258E83A', 'CidrBlock'],
          }, 64, '8'],
        }],
      },
    });

    template.resourceCountIs('AWS::EC2::Subnet', 2);

  });

});
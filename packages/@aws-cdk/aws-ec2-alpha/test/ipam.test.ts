import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib';
import { AddressFamily, Ipam, IpamPoolPublicIpSource } from '../lib';

describe('IPAM Test', () => {
  let stack: cdk.Stack;
  let ipam: Ipam;

  beforeEach(() => {
    const envUSA = { region: 'us-west-2' };
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app, 'IPAMTestStack', {
      env: envUSA,
    });
    ipam = new Ipam(stack, 'Ipam', {
      operatingRegions: ['us-west-2'],
    });
  });

  test('Creates IP Pool under Public Scope', () => {
    const pool = ipam.publicScope.addPool('Public', {
      addressFamily: AddressFamily.IP_V6,
      awsService: vpc.AwsServiceName.EC2,
      locale: 'us-west-2',
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
    });

    new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.2.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6Ipam({
        ipamPool: pool,
        netmaskLength: 52,
        cidrBlockName: 'Ipv6Ipam',
      })],
    });
    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::IPAMPool',
      {
        AddressFamily: 'ipv6',
        IpamScopeId: {
          'Fn::GetAtt': ['Ipam50346F82', 'PublicDefaultScopeId'],
        },
        Locale: 'us-west-2',
      },
    ); // End Template
  }); // End Test

  test('Creates IP Pool under Private Scope', () => {
    const pool = ipam.privateScope.addPool('Private', {
      addressFamily: vpc.AddressFamily.IP_V4,
      ipv4ProvisionedCidrs: ['10.2.0.0/16'],
      locale: 'us-west-2',
    });

    new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4Ipam({
        ipamPool: pool,
        netmaskLength: 20,
        cidrBlockName: 'SecondaryIpv4',
      })],
    });
    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::IPAMPool',
      {
        AddressFamily: 'ipv4',
        IpamScopeId: {
          'Fn::GetAtt': ['Ipam50346F82', 'PrivateDefaultScopeId'],
        },
        Locale: 'us-west-2',
      },
    ); // End Template
  });

  test('Creates nested IP Pools', () => {
    const pool = ipam.privateScope.addPool('Private', {
      addressFamily: vpc.AddressFamily.IP_V4,
      ipv4ProvisionedCidrs: ['10.2.0.0/14'],
      locale: 'us-west-2',
    });
    ipam.privateScope.addPool('PrivateChild', {
      addressFamily: vpc.AddressFamily.IP_V4,
      ipv4ProvisionedCidrs: ['10.2.0.0/16'],
      sourceIpamPoolId: pool.ipamPoolId,
    });

    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::IPAMPool',
      {
        AddressFamily: 'ipv4',
        SourceIpamPoolId: { 'Fn::GetAtt': ['IpamPrivate4E8D7A02', 'IpamPoolId'] },
      },
    );
  });

  test('Creates IPAM CIDR pool under public scope for IPv6', () => {
    // Create IPAM resources
    const ipamIpv6 = new Ipam(stack, 'TestIpam', {
      operatingRegions: ['us-west-2'],
    });
    const poolOptions: vpc.PoolOptions = {
      addressFamily: AddressFamily.IP_V6,
      awsService: vpc.AwsServiceName.EC2,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-2',
    };
    ipamIpv6.publicScope.addPool('TestPool', poolOptions);

    // Define the expected CloudFormation template
    const expectedTemplate = {
      Resources: {
        Ipam50346F82: { Type: 'AWS::EC2::IPAM' },
        TestIpamDBF92BA8: { Type: 'AWS::EC2::IPAM' },
        TestIpamTestPool5D90F91B: {
          Type: 'AWS::EC2::IPAMPool',
          Properties: {
            AddressFamily: 'ipv6',
            IpamScopeId: {
              'Fn::GetAtt': ['TestIpamDBF92BA8', 'PublicDefaultScopeId'],
            },
            Locale: 'us-west-2',
          },
        },
      },
    };
    // // Assert that the generated template matches the expected template
    Template.fromStack(stack).templateMatches(expectedTemplate);
  });

  test('Get region from stack env', () => {
    // Create IPAM resources
    const ipamRegion = new Ipam(stack, 'TestIpam', {
      operatingRegions: ['us-west-2'],
    });
    const poolOptions: vpc.PoolOptions = {
      addressFamily: AddressFamily.IP_V6,
      awsService: vpc.AwsServiceName.EC2,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-2',
    };
    ipamRegion.publicScope.addPool('TestPool', poolOptions);

    // Define the expected CloudFormation template
    const expectedTemplate = {
      Resources: {
        Ipam50346F82: { Type: 'AWS::EC2::IPAM' },
        TestIpamDBF92BA8: { Type: 'AWS::EC2::IPAM' },
        TestIpamTestPool5D90F91B: {
          Type: 'AWS::EC2::IPAMPool',
          Properties: {
            AddressFamily: 'ipv6',
            IpamScopeId: {
              'Fn::GetAtt': ['TestIpamDBF92BA8', 'PublicDefaultScopeId'],
            },
            Locale: 'us-west-2',
          },
        },
      },
    };
    // // Assert that the generated template matches the expected template
    Template.fromStack(stack).templateMatches(expectedTemplate);
  });

  test('Creates IPAM with default scopes', () => {
    new Ipam(stack, 'TestIpam', {
    });
    Template.fromStack(stack).hasResource(
      'AWS::EC2::IPAM', {},
    );
  });

  test('IPAM throws error if awsService is not provided for IPv6 address', () => {
    // Create IPAM resources
    const ipamRegion = new Ipam(stack, 'TestIpam', {
      operatingRegions: ['us-west-2'],
    });
    const poolOptions: vpc.PoolOptions = {
      addressFamily: AddressFamily.IP_V6,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-2',
    };
    expect(() => ipamRegion.publicScope.addPool('TestPool', poolOptions)).toThrow('awsService is required when addressFamily is set to ipv6');
  });

  test('IPAM throws error if operating region is provided as an empty array', () => {
    const app = new cdk.App();
    const stack_new = new cdk.Stack(app, 'TestStack');
    expect(() => new Ipam(stack_new, 'TestIpam', {
      operatingRegions: [],
    })).toThrow('Please provide at least one operating region');
  });

  test('IPAM infers region from provided operating region correctly', () => {
    const app = new cdk.App();
    const stack_new = new cdk.Stack(app, 'TestStack');
    new Ipam(stack_new, 'TestIpam', {
      operatingRegions: ['us-west-2'],
    });
    Template.fromStack(stack_new).hasResourceProperties(
      'AWS::EC2::IPAM', {
      OperatingRegions: [
        {
          RegionName: 'us-west-2',
        },
      ],
    },
    );
  });

  test('IPAM infers region from stack if not provided under IPAM class object', () => {
    const app = new cdk.App();
    const stack_new = new cdk.Stack(app, 'TestStack', {
      env: {
        region: 'us-west-2',
      },
    });
    new Ipam(stack_new, 'TestIpam', {});
    Template.fromStack(stack_new).hasResourceProperties(
      'AWS::EC2::IPAM', {
      OperatingRegions: [
        {
          RegionName: 'us-west-2',
        },
      ],
    },
    );
  });

  test('IPAM refers to stack region token', () => {
    const app = new cdk.App();
    const stack_new = new cdk.Stack(app, 'TestStack');
    new Ipam(stack_new, 'TestIpam', {});
    Template.fromStack(stack_new).hasResourceProperties(
      'AWS::EC2::IPAM', {
      OperatingRegions: [
        {
          RegionName: {
            Ref: 'AWS::Region',
          },
        },
      ],
    },
    );
  });

  test('IPAM throws error if locale(region) of pool is not one of the operating regions', () => {
    const ipamRegion = new Ipam(stack, 'TestIpam', {
      operatingRegions: ['us-west-2'],
    });
    const poolOptions: vpc.PoolOptions = {
      addressFamily: AddressFamily.IP_V6,
      awsService: vpc.AwsServiceName.EC2,
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
      locale: 'us-west-1', // Incorrect Region
    };
    expect(() => ipamRegion.publicScope.addPool('TestPool', poolOptions))
      .toThrow(
        `The provided locale 'us-west-1' is not in the operating regions (${ipamRegion.operatingRegions}). ` +
        'If specified, locale must be configured as an operating region for the IPAM.',
      );
  });

  test('IPAM handles operating regions correctly', () => {
    const new_app = new cdk.App();
    const testStack = new cdk.Stack(new_app, 'TestStack', {
      env: {
        region: 'us-west-1',
      },
    });
    new Ipam(testStack, 'TestIpamNew', {});
    Template.fromStack(testStack).hasResourceProperties(
      'AWS::EC2::IPAM', {
      OperatingRegions: [
        {
          RegionName: 'us-west-1',
        },
      ],
    },
    );
  });
});// End Test

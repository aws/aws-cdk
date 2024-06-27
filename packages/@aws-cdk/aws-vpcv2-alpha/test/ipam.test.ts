/* eslint-disable no-console */
import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib';
import { AddressFamily, Ipam, IpamPoolPublicIpSource } from '../lib';

describe('IPAM Test', () => {
  let stack: cdk.Stack;
  let ipam: Ipam;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
    ipam = new Ipam(stack, 'Ipam');
  });

  test('Creates IP Pool under Public Scope', () => {

    const pool = ipam.publicScope.addPool('Public', {
      addressFamily: AddressFamily.IP_V6,
      awsService: 'ec2',
      locale: 'us-east-1',
      publicIpSource: IpamPoolPublicIpSource.AMAZON,
    });

    new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.2.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv6Ipam({
        ipv6IpamPool: pool,
        ipv6NetmaskLength: 52,
      })],
    });
    // const template = Template.fromStack(stack);
    // console.log(JSON.stringify(template.toJSON(), null, 2));
    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::IPAMPool',
      {
        AddressFamily: 'ipv6',
        IpamScopeId: {
          'Fn::GetAtt': [
            'Ipam50346F82',
            'PublicDefaultScopeId',
          ],
        },
        Locale: 'us-east-1',
      },
    ); //End Template
  }); // End Test

  test('Creates IP Pool under Private Scope', () => {

    const pool = ipam.privateScope.addPool('Private', {
      addressFamily: vpc.AddressFamily.IP_V4,
      provisionedCidrs: [{ cidr: '10.2.0.0/16' }],
      locale: 'us-east-1',
    });

    new vpc.VpcV2(stack, 'TestVPC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.2.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4Ipam({
        ipv4IpamPool: pool,
        ipv4NetmaskLength: 20,
      })],
    });
    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::IPAMPool',
      {
        AddressFamily: 'ipv4',
        IpamScopeId: {
          'Fn::GetAtt': [
            'Ipam50346F82',
            'PrivateDefaultScopeId',
          ],
        },
        Locale: 'us-east-1',
      },
    ); //End Template
  });
}); // End Test
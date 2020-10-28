import * as aws from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import { hasAllTrafficEgress, SecurityGroupContextProviderPlugin } from '../../lib/context-providers/security-groups';
import { MockSdkProvider } from '../util/mock-sdk';

AWS.setSDK(require.resolve('aws-sdk'));

const mockSDK = new MockSdkProvider();

type AwsCallback<T> = (err: Error | null, val: T) => void;

afterEach(done => {
  AWS.restore();
  done();
});

describe('security group context provider plugin', () => {
  test('errors when no matches are found', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    AWS.mock('EC2', 'describeSecurityGroups', (_params: aws.EC2.DescribeSecurityGroupsRequest, cb: AwsCallback<aws.EC2.DescribeSecurityGroupsResult>) => {
      cb(null, { SecurityGroups: [] });
    });

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        securityGroupId: 'sg-1234',
      }),
    ).rejects.toThrow(/No security groups found/i);
  });

  test('looks up by security group id', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    AWS.mock('EC2', 'describeSecurityGroups', (_params: aws.EC2.DescribeSecurityGroupsRequest, cb: AwsCallback<aws.EC2.DescribeSecurityGroupsResult>) => {
      expect(_params).toEqual({ GroupIds: ['sg-1234'] });
      cb(null, {
        SecurityGroups: [
          {
            GroupId: 'sg-1234',
            IpPermissionsEgress: [
              {
                IpProtocol: '-1',
                IpRanges: [
                  { CidrIp: '0.0.0.0/0' },
                ],
              },
              {
                IpProtocol: '-1',
                Ipv6Ranges: [
                  { CidrIpv6: '::/0' },
                ],
              },
            ],
          },
        ],
      });
    });

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupId: 'sg-1234',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(true);
  });

  test('detects non all-outbound egress', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    AWS.mock('EC2', 'describeSecurityGroups', (_params: aws.EC2.DescribeSecurityGroupsRequest, cb: AwsCallback<aws.EC2.DescribeSecurityGroupsResult>) => {
      expect(_params).toEqual({ GroupIds: ['sg-1234'] });
      cb(null, {
        SecurityGroups: [
          {
            GroupId: 'sg-1234',
            IpPermissionsEgress: [
              {
                IpProtocol: '-1',
                IpRanges: [
                  { CidrIp: '10.0.0.0/16' },
                ],
              },
            ],
          },
        ],
      });
    });

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupId: 'sg-1234',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(false);
  });

  test('identifies allTrafficEgress from SecurityGroup permissions', () => {
    expect(
      hasAllTrafficEgress({
        IpPermissionsEgress: [
          {
            IpProtocol: '-1',
            IpRanges: [
              { CidrIp: '0.0.0.0/0' },
            ],
          },
          {
            IpProtocol: '-1',
            Ipv6Ranges: [
              { CidrIpv6: '::/0' },
            ],
          },
        ],
      }),
    ).toBe(true);
  });

  test('identifies allTrafficEgress from SecurityGroup permissions when combined', () => {
    expect(
      hasAllTrafficEgress({
        IpPermissionsEgress: [
          {
            IpProtocol: '-1',
            IpRanges: [
              { CidrIp: '0.0.0.0/0' },
            ],
            Ipv6Ranges: [
              { CidrIpv6: '::/0' },
            ],
          },
        ],
      }),
    ).toBe(true);
  });

  test('identifies lacking allTrafficEgress from SecurityGroup permissions', () => {
    expect(
      hasAllTrafficEgress({
        IpPermissionsEgress: [
          {
            IpProtocol: '-1',
            IpRanges: [
              { CidrIp: '10.0.0.0/16' },
            ],
          },
        ],
      }),
    ).toBe(false);

    expect(
      hasAllTrafficEgress({
        IpPermissions: [
          {
            IpProtocol: 'TCP',
            IpRanges: [
              { CidrIp: '0.0.0.0/0' },
            ],
          },
        ],
      }),
    ).toBe(false);
  });
});

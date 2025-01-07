import { DescribeSecurityGroupsCommand } from '@aws-sdk/client-ec2';
import { SDK, type SdkForEnvironment } from '../../lib';
import { hasAllTrafficEgress, SecurityGroupContextProviderPlugin } from '../../lib/context-providers/security-groups';
import { FAKE_CREDENTIAL_CHAIN, MockSdkProvider, mockEC2Client, restoreSdkMocksToDefault } from '../util/mock-sdk';

const mockSDK = new (class extends MockSdkProvider {
  public forEnvironment(): Promise<SdkForEnvironment> {
    return Promise.resolve({ sdk: new SDK(FAKE_CREDENTIAL_CHAIN, mockSDK.defaultRegion, {}), didAssumeRole: false });
  }
})();

beforeEach(() => {
  restoreSdkMocksToDefault();
  mockEC2Client.on(DescribeSecurityGroupsCommand).resolves({
    SecurityGroups: [
      {
        GroupId: 'sg-1234',
        IpPermissionsEgress: [
          {
            IpProtocol: '-1',
            IpRanges: [{ CidrIp: '0.0.0.0/0' }],
          },
          {
            IpProtocol: '-1',
            Ipv6Ranges: [{ CidrIpv6: '::/0' }],
          },
        ],
      },
    ],
  });
});

describe('security group context provider plugin', () => {
  test('errors when no matches are found', async () => {
    // GIVEN
    restoreSdkMocksToDefault();
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

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

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupId: 'sg-1234',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(true);
    expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSecurityGroupsCommand, {
      GroupIds: ['sg-1234'],
    });
  });

  test('looks up by security group id and vpc id', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupId: 'sg-1234',
      vpcId: 'vpc-1234567',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(true);
    expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSecurityGroupsCommand, {
      GroupIds: ['sg-1234'],
      Filters: [
        {
          Name: 'vpc-id',
          Values: ['vpc-1234567'],
        },
      ],
    });
  });

  test('looks up by security group name', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupName: 'my-security-group',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(true);
    expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSecurityGroupsCommand, {
      Filters: [
        {
          Name: 'group-name',
          Values: ['my-security-group'],
        },
      ],
    });
  });

  test('looks up by security group name and vpc id', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupName: 'my-security-group',
      vpcId: 'vpc-1234567',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(true);
    expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSecurityGroupsCommand, {
      Filters: [
        {
          Name: 'vpc-id',
          Values: ['vpc-1234567'],
        },
        {
          Name: 'group-name',
          Values: ['my-security-group'],
        },
      ],
    });
  });

  test('detects non all-outbound egress', async () => {
    // GIVEN
    mockEC2Client.on(DescribeSecurityGroupsCommand).resolves({
      SecurityGroups: [
        {
          GroupId: 'sg-1234',
          IpPermissionsEgress: [
            {
              IpProtocol: '-1',
              IpRanges: [{ CidrIp: '10.0.0.0/16' }],
            },
          ],
        },
      ],
    });
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    const res = await provider.getValue({
      account: '1234',
      region: 'us-east-1',
      securityGroupId: 'sg-1234',
    });

    // THEN
    expect(res.securityGroupId).toEqual('sg-1234');
    expect(res.allowAllOutbound).toEqual(false);
    expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSecurityGroupsCommand, {
      GroupIds: ['sg-1234'],
    });
  });

  test('errors when more than one security group is found', async () => {
    // GIVEN
    mockEC2Client.on(DescribeSecurityGroupsCommand).resolves({
      SecurityGroups: [
        {
          GroupId: 'sg-1234',
          IpPermissionsEgress: [
            {
              IpProtocol: '-1',
              IpRanges: [{ CidrIp: '10.0.0.0/16' }],
            },
          ],
        },
        {
          GroupId: 'sg-1234',
          IpPermissionsEgress: [
            {
              IpProtocol: '-1',
              IpRanges: [{ CidrIp: '10.0.0.0/16' }],
            },
          ],
        },
      ],
    });
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        securityGroupId: 'sg-1234',
      }),
    ).rejects.toThrow(/\More than one security groups found matching/i);
    expect(mockEC2Client).toHaveReceivedCommandWith(DescribeSecurityGroupsCommand, {
      GroupIds: ['sg-1234'],
    });
  });

  test('errors when securityGroupId and securityGroupName are specified both', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
        securityGroupId: 'sg-1234',
        securityGroupName: 'my-security-group',
      }),
    ).rejects.toThrow(
      /\'securityGroupId\' and \'securityGroupName\' can not be specified both when looking up a security group/i,
    );
  });

  test('errors when neither securityGroupId nor securityGroupName are specified', async () => {
    // GIVEN
    const provider = new SecurityGroupContextProviderPlugin(mockSDK);

    // WHEN
    await expect(
      provider.getValue({
        account: '1234',
        region: 'us-east-1',
      }),
    ).rejects.toThrow(/\'securityGroupId\' or \'securityGroupName\' must be specified to look up a security group/i);
  });

  test('identifies allTrafficEgress from SecurityGroup permissions', () => {
    expect(
      hasAllTrafficEgress({
        IpPermissionsEgress: [
          {
            IpProtocol: '-1',
            IpRanges: [{ CidrIp: '0.0.0.0/0' }],
          },
          {
            IpProtocol: '-1',
            Ipv6Ranges: [{ CidrIpv6: '::/0' }],
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
            IpRanges: [{ CidrIp: '0.0.0.0/0' }],
            Ipv6Ranges: [{ CidrIpv6: '::/0' }],
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
            IpRanges: [{ CidrIp: '10.0.0.0/16' }],
          },
        ],
      }),
    ).toBe(false);

    expect(
      hasAllTrafficEgress({
        IpPermissions: [
          {
            IpProtocol: 'TCP',
            IpRanges: [{ CidrIp: '0.0.0.0/0' }],
          },
        ],
      }),
    ).toBe(false);
  });
});

import { DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import { DatabaseInstanceContextProviderPlugin } from '../../lib/context-providers/rds-database-instance';
import { mockRDSClient, MockSdkProvider, restoreSdkMocksToDefault } from '../util/mock-sdk';

let provider: DatabaseInstanceContextProviderPlugin;

beforeEach(() => {
  provider = new DatabaseInstanceContextProviderPlugin(new MockSdkProvider());
  restoreSdkMocksToDefault();
});

test('looks up RDS instance', async () => {
  // GIVEN
  mockRDSClient.on(DescribeDBInstancesCommand).resolves({
    DBInstances: [
      {
        DBInstanceIdentifier: 'instance-id-1',
        DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        Endpoint: {
          HostedZoneId: 'ABCDEFG',
          Port: 5432,
          Address: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        },
        DbiResourceId: 'db-ABCDEFGHI',
        DBSecurityGroups: [],
      },
    ],
  });

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    instanceIdentifier: 'instance-id-1',
  });

  // THEN
  expect(result).toEqual({
    instanceIdentifier: 'instance-id-1',
    instanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
    dbInstanceEndpointAddress: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
    dbInstanceEndpointPort: 5432,
    instanceResourceId: 'db-ABCDEFGHI',
    dbSecurityGroupIds: [],
  });
});

test('looks up RDS instance with DBSecurityGroups', async () => {
  // GIVEN
  mockRDSClient.on(DescribeDBInstancesCommand).resolves({
    DBInstances: [
      {
        DBInstanceIdentifier: 'instance-id-1',
        DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        Endpoint: {
          HostedZoneId: 'ABCDEFG',
          Port: 5432,
          Address: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        },
        DbiResourceId: 'db-ABCDEFGHI',
        DBSecurityGroups: [
          {
            DBSecurityGroupName: 'dbsg-1',
            Status: 'active',
          },
          {
            DBSecurityGroupName: 'dbsg-2',
            Status: 'active',
          },
        ],
      },
    ],
  });

  // WHEN
  const result = await provider.getValue({
    account: '123456789012',
    region: 'us-east-1',
    instanceIdentifier: 'instance-id-1',
  });

  // THEN
  expect(result).toEqual({
    instanceIdentifier: 'instance-id-1',
    instanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
    dbInstanceEndpointAddress: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
    dbInstanceEndpointPort: 5432,
    instanceResourceId: 'db-ABCDEFGHI',
    dbSecurityGroupIds: ['dbsg-1', 'dbsg-2'],
  });
});

test('looks up RDS instance - no result', async () => {
  // GIVEN
  mockRDSClient.on(DescribeDBInstancesCommand).resolves({
    DBInstances: [
    ],
  });

  // WHEN, THEN
  await expect(
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      instanceIdentifier: 'instance-id-1',
    }),
  ).rejects.toThrow('No DatabaseInstance found matching instance-id-1');
});

test('looks up RDS instance - multiple result', async () => {
  // GIVEN
  mockRDSClient.on(DescribeDBInstancesCommand).resolves({
    DBInstances: [
      {
        DBInstanceIdentifier: 'instance-id-1',
        DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        Endpoint: {
          HostedZoneId: 'ABCDEFG',
          Port: 5432,
          Address: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        },
        DbiResourceId: 'db-ABCDEFGHI',
        DBSecurityGroups: [],
      },
      {
        DBInstanceIdentifier: 'instance-id-1',
        DBInstanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        Endpoint: {
          HostedZoneId: 'ABCDEFG',
          Port: 5432,
          Address: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        },
        DbiResourceId: 'db-ABCDEFGHI',
        DBSecurityGroups: [],
      },
    ],
  });

  // WHEN, THEN
  await expect(
    provider.getValue({
      account: '123456789012',
      region: 'us-east-1',
      instanceIdentifier: 'instance-id-1',
    }),
  ).rejects.toThrow('More than one DatabaseInstance found matching instance-id-1');
});

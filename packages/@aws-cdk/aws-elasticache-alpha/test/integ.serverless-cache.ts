import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Duration, RemovalPolicy, Size, Stack } from 'aws-cdk-lib';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Key } from 'aws-cdk-lib/aws-kms';
import type { Construct } from 'constructs';
import { AccessControl, CacheEngine, IamUser, ServerlessCache, UserGroup } from '../lib';

const cacheName = 'serverlesscache';
const userName = 'user';
const userGroupName = 'usergroup';

class TestStack extends Stack {
  public cache: ServerlessCache;
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'VPC');
    const key = new Key(this, 'Key', {});
    const securityGroup = new SecurityGroup(this, 'SecurityGroup', { vpc });
    const user = new IamUser(this, 'User', {
      userId: userName,
      accessControl: AccessControl.fromAccessString('on ~* +@all'),
    });
    const userGroup = new UserGroup(this, 'UserGroup', { users: [user], userGroupName: userGroupName });
    user.applyRemovalPolicy(RemovalPolicy.DESTROY);
    userGroup.applyRemovalPolicy(RemovalPolicy.DESTROY);
    this.cache = new ServerlessCache(this, 'Cache', {
      description: 'Serverless cache',
      vpc,
      engine: CacheEngine.VALKEY_8,
      serverlessCacheName: cacheName,
      kmsKey: key,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      userGroup,
      backup: {
        backupRetentionLimit: 2,
        backupNameBeforeDeletion: 'last-snapshot-name',
      },
      cacheUsageLimits: {
        dataStorageMinimumSize: Size.gibibytes(1),
        dataStorageMaximumSize: Size.gibibytes(1),
        requestRateLimitMinimum: 1_000,
        requestRateLimitMaximum: 2_000,
      },
    });
    this.cache.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const clientSG = new SecurityGroup(this, 'ClientSG', { vpc });
    clientSG.connections.allowToDefaultPort(this.cache);
  }
}

const app = new App();
const testCase1 = new TestStack(app, 'aws-cdk-serverless-cache', { env: { region: 'us-east-1' } });
const integ = new IntegTest(app, 'aws-cdk-serverless-cache-integ', {
  testCases: [testCase1],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});

const cacheDescription = integ.assertions.awsApiCall('ElastiCache', 'describeServerlessCaches', {
  ServerlessCacheName: cacheName,
});

cacheDescription.expect(ExpectedResult.objectLike({
  ServerlessCaches: [{
    Engine: 'valkey',
    MajorEngineVersion: '8',
    ServerlessCacheName: cacheName,
    Description: 'Serverless cache',
    Status: 'available',
    UserGroupId: userGroupName,
    CacheUsageLimits: {
      DataStorage: {
        Maximum: 1,
        Minimum: 1,
        Unit: 'GB',
      },
      ECPUPerSecond: {
        Maximum: 2000,
        Minimum: 1000,
      },
    },
    SnapshotRetentionLimit: 2,
  }],
})).waitForAssertions(
  {
    totalTimeout: Duration.minutes(2),
    interval: Duration.seconds(5),
  },
);


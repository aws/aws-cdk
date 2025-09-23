import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Size, Stack, StackProps } from 'aws-cdk-lib';
import { AccessControl, CacheEngine, IamUser, ServerlessCache, UserGroup } from '../lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'VPC');
    const key = new Key(this, 'Key', {});
    const securityGroup = new SecurityGroup(this, 'SecurityGroup', { vpc });
    const user = new IamUser(this, 'User', {
      userId: 'user',
      accessControl: AccessControl.fromAccessString('on ~* +@all'),
    });
    const userGroup = new UserGroup(this, 'UserGroup', { users: [user] });

    new ServerlessCache(this, 'Cache', {
      description: 'Serverless cache',
      vpc,
      engine: CacheEngine.VALKEY_8,
      serverlessCacheName: 'serverelessCache',
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
        requestRateLimitMaximum: 1_000,

      },
    });
  }
}

const app = new App();
new IntegTest(app, 'aws-cdk-serverless-cache-integ', {
  testCases: [new TestStack(app, 'aws-cdk-serverless-cache', { env: { region: 'us-east-1' } })],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});

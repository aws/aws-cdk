import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import { AccessControl, CacheEngine, IamUser, ServerlessCache, UserGroup } from '../lib';

const userName = 'user';

class TestStack extends Stack {
  public cache: ServerlessCache;
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'VPC');

    const user = new IamUser(this, 'User', {
      userId: userName,
      accessControl: AccessControl.fromAccessString('on ~* +@all'),
    });

    const userGroup = new UserGroup(this, 'UserGroup', { users: [user] });

    this.cache = new ServerlessCache(this, 'Cache', {
      vpc,
      engine: CacheEngine.VALKEY_8,
      userGroup,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'aws-cdk-serverless-cache-auto-generate-name', {});
new IntegTest(app, 'aws-cdk-serverless-cache-integ-auto-generate-name', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

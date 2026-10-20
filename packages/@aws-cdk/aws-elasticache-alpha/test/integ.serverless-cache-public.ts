import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { CacheEngine, ConnectionType, ServerlessCache } from '../lib';

const cacheName = 'public-serverless-cache';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const cache = new ServerlessCache(this, 'Cache', {
      engine: CacheEngine.VALKEY_9,
      serverlessCacheName: cacheName,
      connectionType: ConnectionType.PUBLIC,
    });
    cache.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-serverless-cache-public', { env: { region: 'us-east-1' } });
const integ = new IntegTest(app, 'aws-cdk-serverless-cache-public-integ', {
  testCases: [testCase],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});

integ.assertions.awsApiCall('ElastiCache', 'describeServerlessCaches', {
  ServerlessCacheName: cacheName,
}).expect(ExpectedResult.objectLike({
  ServerlessCaches: [{
    Engine: 'valkey',
    MajorEngineVersion: '9',
    ServerlessCacheName: cacheName,
    Status: 'available',
    UserGroupId: 'default.iam-user-group',
    ConnectionType: 'public',
  }],
})).waitForAssertions({
  totalTimeout: Duration.minutes(15),
  interval: Duration.seconds(30),
});

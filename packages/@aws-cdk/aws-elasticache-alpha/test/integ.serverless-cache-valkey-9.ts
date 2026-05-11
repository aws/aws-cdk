import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import { CacheEngine, ServerlessCache } from '../lib';

const cacheName = 'valkey-9-cache';

class TestStack extends Stack {
  public cache: ServerlessCache;
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'VPC');
    this.cache = new ServerlessCache(this, 'Cache', {
      vpc,
      engine: CacheEngine.VALKEY_9,
      serverlessCacheName: cacheName,
    });
    this.cache.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-serverless-cache-valkey-9', { env: { region: 'us-east-1' } });
const integ = new IntegTest(app, 'aws-cdk-serverless-cache-valkey-9-integ', {
  testCases: [testCase],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});

const cacheDescription = integ.assertions.awsApiCall('ElastiCache', 'describeServerlessCaches', {
  ServerlessCacheName: cacheName,
});

cacheDescription.expect(ExpectedResult.objectLike({
  ServerlessCaches: [{
    Engine: 'valkey',
    MajorEngineVersion: '9',
    ServerlessCacheName: cacheName,
    Status: 'available',
  }],
})).waitForAssertions({
  totalTimeout: Duration.minutes(15),
  interval: Duration.seconds(30),
});

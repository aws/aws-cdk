import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { CacheEngine, ServerlessCache } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-cdk-serverless-cache-memcached', { env: { region: 'us-east-1' } });

const vpc = new Vpc(stack, 'VPC');
const cache = new ServerlessCache(stack, 'Cache', {
  vpc,
  engine: CacheEngine.MEMCACHED_1_6,
  serverlessCacheName: 'test-serverelss-cache',
});
cache.applyRemovalPolicy(RemovalPolicy.DESTROY);

new IntegTest(app, 'aws-cdk-serverless-cache-memcached-integ', {
  testCases: [stack],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});

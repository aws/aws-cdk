import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'baseAPI', {
  name: 'baseAPI',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
});

new appsync.ApiCache(stack, 'apiCache', {
  apiId: api.apiId,
  apiCachingBehavior: appsync.CacheBehavior.FULL_REQUEST_CACHING,
  type: appsync.CacheType.LARGE,
  ttl: 60,
});

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();
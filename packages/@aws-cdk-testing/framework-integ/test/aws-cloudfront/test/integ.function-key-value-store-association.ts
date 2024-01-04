import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-function-key-value-store-assocation');

const store = new cloudfront.KeyValueStore(stack, 'TestKeyValueStore', {
  comment: 'A test Key Value Store for CloudFront',
  source: cloudfront.ImportSource.fromAsset(path.join(__dirname, 'test-import-source.json')),
});
const store2 = new cloudfront.KeyValueStore(stack, 'TestKeyValueStore2');
new cloudfront.Function(stack, 'TestFunction', {
  code: cloudfront.FunctionCode.fromInline('code'),
  keyValueStores: [store, store2],
});

new IntegTest(app, 'FunctionKeyValueStoreAssocation', {
  testCases: [stack],
});

app.synth();

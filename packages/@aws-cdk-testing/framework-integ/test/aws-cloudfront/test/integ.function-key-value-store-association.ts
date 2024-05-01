import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-function-key-value-store-association');

const store = new cloudfront.KeyValueStore(stack, 'TestKeyValueStore', {
  comment: 'A test Key Value Store for CloudFront',
  source: cloudfront.ImportSource.fromAsset(path.join(__dirname, 'test-import-source.json')),
});
new cloudfront.Function(stack, 'TestFunction', {
  functionName: 'TestKvFunction',
  code: cloudfront.FunctionCode.fromInline('code'),
  keyValueStore: store,
});

new IntegTest(app, 'FunctionKeyValueStoreAssociation', {
  testCases: [stack],
});

app.synth();

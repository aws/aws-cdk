import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-key-value-store');

new cloudfront.KeyValueStore(stack, 'TestKeyValueStore', {
  comment: 'A test Key Value Store for CloudFront',
  source: cloudfront.ImportSource.fromAsset(path.join(__dirname, 'test-import-source.json')),
});

new IntegTest(app, 'KeyValueStore', {
  testCases: [stack],
});

app.synth();

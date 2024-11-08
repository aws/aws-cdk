import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-key-value-store');

new cloudfront.KeyValueStore(stack, 'TestKeyValueStore', {
  comment: 'A test Key Value Store for CloudFront',
  source: cloudfront.ImportSource.fromInline(JSON.stringify({
    data: [
      {
        key: 'key1',
        value: 'value1',
      },
      {
        key: 'key2',
        value: 'value2',
      },
    ],
  })),
});

new IntegTest(app, 'KeyValueStore', {
  testCases: [stack],
});

app.synth();

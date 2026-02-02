import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-tenant-mode-validation');

new cloudfront.Distribution(stack, 'ValidTenantDist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
  },
  connectionMode: cloudfront.ConnectionMode.TENANT_ONLY,
  comment: 'Valid tenant-only distribution',
  enableLogging: true,
  httpVersion: cloudfront.HttpVersion.HTTP2,
  sslSupportMethod: cloudfront.SSLMethod.SNI,
});

new IntegTest(app, 'integ-mt-distribution-with-webacl', {
  testCases: [stack],
});

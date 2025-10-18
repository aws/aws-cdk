import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-mt-distribution-extensive');

new cloudfront.MTDistribution(stack, 'MyDist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
  },
  comment: 'a test',
  defaultRootObject: 'index.html',
  enabled: true,
  enableLogging: true,
  geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
  httpVersion: cloudfront.HttpVersion.HTTP2,
  logFilePrefix: 'logs/',
  logIncludesCookies: true,
  tenantConfig: {
    parameterDefinitions: [
      {
        definition: {
          stringSchema: {
            required: false,
            comment: 'tenantName',
            defaultValue: 'root',
          },
        },
        name: 'tenantName',
      },
    ],
  },
});

new IntegTest(app, 'mt-distribution-extensive-test', {
  testCases: [stack],
});


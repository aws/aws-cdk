import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-with-webacl', {
  env: {
    region: 'us-east-1',
  },
});

const webAcl = new CfnWebACL(stack, 'WebAcl', {
  defaultAction: {
    allow: {},
  },
  scope: 'CLOUDFRONT',
  visibilityConfig: {
    cloudWatchMetricsEnabled: false,
    metricName: 'webAclMetric',
    sampledRequestsEnabled: false,
  },
});

const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
});

distribution.attachWebAclId(webAcl.attrArn);

new IntegTest(app, 'integ-cloudfront-with-webacl', {
  testCases: [stack],
});

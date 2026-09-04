import * as cdk from 'aws-cdk-lib';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';

const app = new cdk.App({
  context: {
    [cxapi.CFN_RESOURCE_ADD_OVERRIDE_LIST_FOR_EMPTY_OBJECTS]: true,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-with-webacl', {
  env: {
    region: 'us-east-1',
  },
});

const webAcl = new CfnWebACL(stack, 'WebAcl', {
  defaultAction: {
    allow: {},
  },
  rules: [{
    name: 'BlockRule',
    priority: 0,
    statement: {
      geoMatchStatement: {
        countryCodes: ['US'],
      },
    },
    action: {
      allow: {},
    },
    visibilityConfig: {
      cloudWatchMetricsEnabled: false,
      metricName: 'blockRuleMetric',
      sampledRequestsEnabled: false,
    },
  }],
  scope: 'CLOUDFRONT',
  visibilityConfig: {
    cloudWatchMetricsEnabled: false,
    metricName: 'webAclMetric',
    sampledRequestsEnabled: false,
  },
});
webAcl.addPropertyOverride('Rules.0.Action', { Block: {} });

const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
});

distribution.attachWebAclId(webAcl.attrArn);

new IntegTest(app, 'integ-cloudfront-with-webacl', {
  testCases: [stack],
});

import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { TestOrigin } from './test-origin';

const app = new App();
const stack = new Stack(app, 'cloudfront-waf-protection', {
  env: { region: 'us-east-1' },
});

const distribution = new cloudfront.Distribution(stack, 'Distro', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
});

distribution.enableWafProtection({
  enableCoreProtection: true,
});

const integTest = new IntegTest(app, 'integ-cloudfront-waf-protection-test', {
  testCases: [stack],
  regions: ['us-east-1'],
  assertionStack: stack,
});

const webAcl = distribution.node.findChild('WebAcl') as wafv2.CfnWebACL;

integTest.assertions.awsApiCall('WAFV2', 'getWebACL', {
  Id: webAcl.attrId,
  Name: webAcl.name,
  Scope: 'CLOUDFRONT',
}).expect(ExpectedResult.objectLike({
  WebACL: {
    DefaultAction: {
      Allow: {},
    },
    VisibilityConfig: {
      CloudWatchMetricsEnabled: true,
      MetricName: webAcl.name,
      SampledRequestsEnabled: true,
    },
    Rules: Match.arrayWith([
      Match.objectLike({
        Name: 'AWS-AWSManagedRulesAmazonIpReputationList',
        Priority: 0,
        Statement: {
          ManagedRuleGroupStatement: {
            VendorName: 'AWS',
            Name: 'AWSManagedRulesAmazonIpReputationList',
          },
        },
        OverrideAction: {
          None: {},
        },
        VisibilityConfig: {
          SampledRequestsEnabled: true,
          CloudWatchMetricsEnabled: true,
          MetricName: 'AWS-AWSManagedRulesAmazonIpReputationList',
        },
      }),
      Match.objectLike({
        Name: 'AWS-AWSManagedRulesCommonRuleSet',
        Priority: 1,
        Statement: {
          ManagedRuleGroupStatement: {
            VendorName: 'AWS',
            Name: 'AWSManagedRulesCommonRuleSet',
          },
        },
        OverrideAction: {
          None: {},
        },
        VisibilityConfig: {
          SampledRequestsEnabled: true,
          CloudWatchMetricsEnabled: true,
          MetricName: 'AWS-AWSManagedRulesCommonRuleSet',
        },
      }),
      Match.objectLike({
        Name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
        Priority: 2,
        Statement: {
          ManagedRuleGroupStatement: {
            VendorName: 'AWS',
            Name: 'AWSManagedRulesKnownBadInputsRuleSet',
          },
        },
        OverrideAction: {
          None: {},
        },
        VisibilityConfig: {
          SampledRequestsEnabled: true,
          CloudWatchMetricsEnabled: true,
          MetricName: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
        },
      }),
    ]),
  },
}));

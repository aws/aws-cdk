import { App, Fn, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
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

const webAclArn = integTest.assertions.awsApiCall('cloudfront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).getAttString('DistributionConfig.WebACLId');

// WebAclArn: arn:aws:wafv2:us-east-1:1111:global/webacl/Name/Id
const parts = Fn.split('/', webAclArn, 4);
const webAclId = parts[3];
const webAclName = parts[2];

integTest.assertions.awsApiCall('WAFV2', 'getWebACL', {
  Id: webAclId,
  Name: webAclName,
  Scope: 'CLOUDFRONT',
}).expect(ExpectedResult.objectLike({
  WebACL: {
    DefaultAction: {
      Allow: {},
    },
    VisibilityConfig: {
      CloudWatchMetricsEnabled: true,
      MetricName: webAclName,
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

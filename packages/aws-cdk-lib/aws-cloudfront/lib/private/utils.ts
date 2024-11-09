import { IDistribution } from '..';
import { aws_wafv2 } from '../../..';
import { Stack } from '../../../core';

/**
 * Format distribution ARN from stack and distribution ID.
 */
export function formatDistributionArn(dist: IDistribution) {
  return Stack.of(dist).formatArn({
    service: 'cloudfront',
    region: '',
    resource: 'distribution',
    resourceName: dist.distributionId,
  });
}


/**
 * Populate recommended one-click security WAF WebACL setting for CloudFront
 */
export function getDefaultWAFWebAclProps(webAclName: string): aws_wafv2.CfnWebACLProps {
  return {
    name: webAclName,
    defaultAction: {
      allow: {},
    },
    scope: 'CLOUDFRONT',
    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      metricName: webAclName,
      sampledRequestsEnabled: true,
    },
    rules: [
      {
        name: "AWS-AWSManagedRulesAmazonIpReputationList",
        priority: 0,
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesAmazonIpReputationList"
          }
        },
        overrideAction: {
          none: {}
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AWS-AWSManagedRulesAmazonIpReputationList"
        }
      },
      {
        name: "AWS-AWSManagedRulesCommonRuleSet",
        priority: 1,
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesCommonRuleSet"
          }
        },
        overrideAction: {
          none: {}
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AWS-AWSManagedRulesCommonRuleSet"
        }
      },
      {
        name: "AWS-AWSManagedRulesKnownBadInputsRuleSet",
        priority: 2,
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesKnownBadInputsRuleSet"
          }
        },
        overrideAction: {
          none: {}
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AWS-AWSManagedRulesKnownBadInputsRuleSet"
        }
      }
    ],
  };
}
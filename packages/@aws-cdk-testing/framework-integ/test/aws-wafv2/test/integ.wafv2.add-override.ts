#!/usr/bin/env node
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

class WafStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var rule: wafv2.CfnWebACL.RuleProperty = {
      name: 'MyRuleObject',
      priority: 0,
      statement: {
        byteMatchStatement: {
          fieldToMatch: {
            singleHeader: {
              name: 'User-Agent',
            },
          },
          positionalConstraint: 'EXACTLY',
          searchString: 'MyCustomUserAgent',
          textTransformations: [
            { priority: 0, type: 'NONE' },
          ],
        },
      },
      action: {
        block: {},
      },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'MyRuleObjectMetrics',
      },
    };

    const params = {
      defaultAction: {
        block: {},
      },
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'MyWebACLMetric',
      },
      name: 'MyWebACL',
      description: 'My Web Application Firewall',
      rules: [rule],
    };

    const wafWebAcl = new wafv2.CfnWebACL(this, 'CfnWebACL', params);

    const plainJson = {
      Action: {
        Block: {},
      },
      Name: 'MyJsonPlainRule',
      Priority: 1,
      Statement: {
        ByteMatchStatement: {
          FieldToMatch: {
            SingleHeader: {
              name: 'Other-User-Agent',
            },
          },
          positionalConstraint: 'EXACTLY',
          searchString: 'MyCustomOtherUserAgent',
          textTransformations: [
            { priority: 0, type: 'NONE' },
          ],
        },
      },
    };
    wafWebAcl.addOverride('Properties.Rules.1', plainJson);
  }
}

const app = new cdk.App();
const stack = new WafStack(app, 'aws-cdk-aws-wafv2');

new IntegTest(app, 'CfnWebACL', {
  testCases: [stack],
});

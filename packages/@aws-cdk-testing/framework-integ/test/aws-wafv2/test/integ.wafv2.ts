#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-wafv2');

const props = {
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
};

new wafv2.CfnWebACL(stack, 'CfnWebACL', props);

new IntegTest(app, 'CfnWebACL', {
  testCases: [stack],
});

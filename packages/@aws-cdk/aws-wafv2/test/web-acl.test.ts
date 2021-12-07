import { Template, Match } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as wafv2 from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  // WHEN
  new wafv2.WebAcl(stack, 'MyWebAcl', {
    scope: wafv2.Scope.REGIONAL,
    defaultAction: wafv2.DefaultAction.allow(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::WAFv2::WebACL', {
    DefaultAction: {
      Allow: {},
    },
    Scope: 'REGIONAL',
    VisibilityConfig: {
      CloudWatchMetricsEnabled: true,
      MetricName: 'MyWebAcl',
      SampledRequestsEnabled: true,
    },
  });
});

test('can get web ACL name', () => {
  const stack = new cdk.Stack();
  // GIVEN
  const webAcl = new wafv2.WebAcl(stack, 'MyWebAcl', {
    scope: wafv2.Scope.REGIONAL,
    defaultAction: wafv2.DefaultAction.allow(),
  });

  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      WebAclName: webAcl.webAclName,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    WebAclName: { Ref: 'MyWebAcl2C5E4DE6' },
  });
});

test.each([
  ['Arn', 'webAclArn'],
  ['Capacity', 'webAclCapacity'],
  ['Id', 'webAclId'],
  ['LabelNamespace', 'webAclLabelNamespace'],
] as const)('can get web ACL %s', (attrName, propName) => {
  const stack = new cdk.Stack();
  // GIVEN
  const webAcl = new wafv2.WebAcl(stack, 'MyWebAcl', {
    scope: wafv2.Scope.REGIONAL,
    defaultAction: wafv2.DefaultAction.allow(),
  });

  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      [`WebAcl${attrName}`]: webAcl[propName],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    [`WebAcl${attrName}`]: {
      'Fn::GetAtt': ['MyWebAcl2C5E4DE6', attrName],
    },
  });
});

test('can set scope', () => {
  const stack = new cdk.Stack();

  // WHEN
  new wafv2.WebAcl(stack, 'MyWebAcl', {
    scope: wafv2.Scope.CLOUDFRONT,
    defaultAction: wafv2.DefaultAction.allow(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::WAFv2::WebACL', {
    Scope: 'CLOUDFRONT',
  });
});

test('can set defaultAction', () => {
  const stack = new cdk.Stack();

  // WHEN
  new wafv2.WebAcl(stack, 'MyWebAcl', {
    scope: wafv2.Scope.REGIONAL,
    defaultAction: wafv2.DefaultAction.block(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::WAFv2::WebACL', {
    DefaultAction: {
      Block: {},
    },
  });
});

test('can set physical name', () => {
  const stack = new cdk.Stack();

  // WHEN
  new wafv2.WebAcl(stack, 'MyWebAcl', {
    webAclName: 'test-WebAcl',
    scope: wafv2.Scope.REGIONAL,
    defaultAction: wafv2.DefaultAction.allow(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::WAFv2::WebACL', {
    Name: 'test-WebAcl',
    VisibilityConfig: Match.objectLike({
      MetricName: 'test-WebAcl',
    }),
  });
});

test('can set visibilityConfig', () => {
  const stack = new cdk.Stack();

  // WHEN
  new wafv2.WebAcl(stack, 'MyWebAcl', {
    scope: wafv2.Scope.REGIONAL,
    defaultAction: wafv2.DefaultAction.allow(),
    visibilityConfig: {
      cloudWatchMetricsEnabled: false,
      metricName: 'test-metric-name',
      sampledRequestsEnabled: false,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::WAFv2::WebACL', {
    VisibilityConfig: {
      CloudWatchMetricsEnabled: false,
      MetricName: 'test-metric-name',
      SampledRequestsEnabled: false,
    },
  });
});

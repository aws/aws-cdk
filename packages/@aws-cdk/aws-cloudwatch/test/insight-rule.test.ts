import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';

import { InsightRule, RuleState } from '../lib';

describe('Insight Rule', () => {
  let simpleRuleBody = JSON.stringify({
    Schema: {
      Name: 'CloudWatchLogRule',
      Version: 1,
    },
    AggregateOn: 'Count',
    Contribution: {
      Filters: [],
      Keys: [
        '$.query_type',
        '$.srcaddr',
      ],
    },
    LogFormat: 'JSON',
    LogGroupNames: [
      '<loggroupname>',
    ],
  });

  test('can create a simple insight rule', () => {
    const stack = new Stack();

    new InsightRule(stack, 'SimpleInsightRule', {
      ruleBody: simpleRuleBody,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::InsightRule', {
      RuleState: 'ENABLED',
    });
  });

  test('can create a DISABLED insight rule', () => {
    const stack = new Stack();

    new InsightRule(stack, 'DisabledInsightRule', {
      ruleBody: simpleRuleBody,
      ruleState: RuleState.DISABLED,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::InsightRule', {
      RuleState: 'DISABLED',
    });
  });
});

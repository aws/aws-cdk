import { Template } from '@aws-cdk/assertions';
import { Stack } from '../../core/lib/stack';
import { AggregateOptions, InsightRule, LogFormat } from './../lib/insight-rule';

describe('Insight Rule', () => {
  let logGroupNames = ['<loggroupname>'];
  let ruleName = 'my-insight-rule';
  let keys = [
    '$.key_1',
    '$.key_2',
  ];

  test('can create an insight rule', () => {
    const stack = new Stack();

    new InsightRule(stack, 'MyInsightRule', {
      logGroupNames,
      ruleName,
      keys,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::InsightRule', {
      ruleState: 'ENABLED',
      ruleBody: {
        AggregateOn: AggregateOptions.COUNT,
        Contribution: {
          Keys: keys,
          Filters: [],
          ValueOf: '',
        },
        Schema: {
          Name: 'CloudWatchLogRule',
          Version: 1,
        },
        LogGroupNames: logGroupNames,
        LogFormat: LogFormat.JSON,
      },
    });
  });
});

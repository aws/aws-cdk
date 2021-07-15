import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { InsightRule, InsightRuleStates } from '../lib';

const emptyRuleBody = ' ';
const ruleBody = '{\n' +
    '    "Schema": {\n' +
    '        "Name": "CloudWatchLogRule",\n' +
    '        "Version": 1\n' +
    '    },\n' +
    '    "LogGroupNames": [\n' +
    '        "API-Gateway-Access-Logs*",\n' +
    '        "Log-group-name2"\n' +
    '    ],\n' +
    '    "LogFormat": "JSON",\n' +
    '    "Contribution": {\n' +
    '        "Keys": [\n' +
    '            "$.ip"\n' +
    '        ],\n' +
    '        "ValueOf": "$.requestBytes",\n' +
    '        "Filters": [\n' +
    '            {\n' +
    '                "Match": "$.httpMethod",\n' +
    '                "In": [\n' +
    '                    "PUT"\n' +
    '                ]\n' +
    '            }\n' +
    '        ]\n' +
    '    },\n' +
    '    "AggregateOn": "Sum"\n' +
    '}';

export = {
  'In InsightRules, Testing only that all parameters are in template'(test: Test) {

    //WHEN
    const stack = new Stack();
    new InsightRule(stack, 'rule', {
      insightRuleName: 'rule1',
      insightRuleBody: emptyRuleBody,
      insightRuleState: InsightRuleStates.ENABLED,
    });

    //THEN
    expect(stack).to(haveResource('AWS::CloudWatch::InsightRule', {
      RuleName: 'rule1',
      RuleBody: emptyRuleBody,
      RuleState: 'ENABLED',
    }));

    test.done();
  },

  'In InsightRules, Testing that RuleState is ENABLED when left out' (test: Test) {
    //WHEN
    const stack = new Stack();
    new InsightRule(stack, 'rule2', {
      insightRuleName: 'rule2',
      insightRuleBody: emptyRuleBody,
    });

    //THEN
    expect(stack).to(haveResource('AWS::CloudWatch::InsightRule', {
      RuleName: 'rule2',
      RuleBody: emptyRuleBody,
      RuleState: 'ENABLED',
    }));

    test.done();
  },

  'In InsightRules, Testing that all parameters exist with rule' (test: Test) {
    //WHEN
    const stack = new Stack();
    new InsightRule(stack, 'rule2', {
      insightRuleName: 'rule3',
      insightRuleBody: ruleBody,
      insightRuleState: InsightRuleStates.ENABLED,
    });

    //THEN
    expect(stack).to(haveResource('AWS::CloudWatch::InsightRule', {
      RuleName: 'rule3',
      RuleBody: ruleBody,
      RuleState: 'ENABLED',
    }));

    test.done();
  },

  'In InsightRules, Testing that RuleState is ENABLED when left out with rule body' (test: Test) {
    //WHEN
    const stack = new Stack();
    new InsightRule(stack, 'rule', {
      insightRuleName: 'rule4',
      insightRuleBody: ruleBody,
      insightRuleState: InsightRuleStates.ENABLED,
    });

    //THEN
    expect(stack).to(haveResource('AWS::CloudWatch::InsightRule', {
      RuleName: 'rule4',
      RuleBody: ruleBody,
      RuleState: 'ENABLED',
    }));

    test.done();
  },

  'In InsightRules, Testing that RuleState is DISABLED when assigned so' (test: Test) {
    //WHEN
    const stack = new Stack();
    new InsightRule(stack, 'rule', {
      insightRuleName: 'rule5',
      insightRuleBody: ruleBody,
      insightRuleState: InsightRuleStates.DISABLED,
    });

    //THEN
    expect(stack).to(haveResource('AWS::CloudWatch::InsightRule', {
      RuleName: 'rule5',
      RuleBody: ruleBody,
      RuleState: 'DISABLED',
    }));

    test.done();
  },

}
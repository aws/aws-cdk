import { Template } from '../../assertions';
import { Stack } from '../../core';
import { ReceiptRule, ReceiptRuleSet, TlsPolicy } from '../lib';

/* eslint-disable @stylistic/quote-props */

describe('receipt rule', () => {
  test('can create receipt rules with second after first', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          receiptRuleName: 'FirstRule',
        },
        {
          enabled: false,
          receiptRuleName: 'SecondRule',
          recipients: ['hello@aws.com'],
          scanEnabled: true,
          tlsPolicy: TlsPolicy.REQUIRE,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'RuleSetE30C6C48': {
          'Type': 'AWS::SES::ReceiptRuleSet',
        },
        'RuleSetRule023C3B8E1': {
          'Type': 'AWS::SES::ReceiptRule',
          'Properties': {
            'Rule': {
              'Name': 'FirstRule',
              'Enabled': true,
            },
            'RuleSetName': {
              'Ref': 'RuleSetE30C6C48',
            },
          },
        },
        'RuleSetRule117041B57': {
          'Type': 'AWS::SES::ReceiptRule',
          'Properties': {
            'Rule': {
              'Enabled': false,
              'Name': 'SecondRule',
              'Recipients': [
                'hello@aws.com',
              ],
              'ScanEnabled': true,
              'TlsPolicy': 'Require',
            },
            'RuleSetName': {
              'Ref': 'RuleSetE30C6C48',
            },
            'After': {
              'Ref': 'RuleSetRule023C3B8E1',
            },
          },
        },
      },
    });
  });

  test('import receipt rule', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const receiptRule = ReceiptRule.fromReceiptRuleName(stack, 'ImportedRule', 'MyRule');
    const receiptRuleSet = new ReceiptRuleSet(stack, 'RuleSet');

    receiptRuleSet.addRule('MyRule', {
      after: receiptRule,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'RuleSetE30C6C48': {
          'Type': 'AWS::SES::ReceiptRuleSet',
        },
        'RuleSetMyRule60B1D107': {
          'Type': 'AWS::SES::ReceiptRule',
          'Properties': {
            'Rule': {
              'Enabled': true,
            },
            'RuleSetName': {
              'Ref': 'RuleSetE30C6C48',
            },
            'After': 'MyRule',
          },
        },
      },
    });
  });

  test('can add actions in rule props', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ruleSet = new ReceiptRuleSet(stack, 'RuleSet');
    ruleSet.addRule('Rule', {
      actions: [
        {
          bind: () => ({
            stopAction: {
              scope: 'RuleSet',
            },
          }),
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRule', {
      'Rule': {
        'Actions': [
          {
            'StopAction': {
              'Scope': 'RuleSet',
            },
          },
        ],
        'Enabled': true,
      },
      'RuleSetName': {
        'Ref': 'RuleSetE30C6C48',
      },
    });
  });

  test('can add action with addAction', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ruleSet = new ReceiptRuleSet(stack, 'RuleSet');
    const rule = ruleSet.addRule('Rule');
    rule.addAction({
      bind: () => ({
        stopAction: {
          scope: 'RuleSet',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRule', {
      'Rule': {
        'Actions': [
          {
            'StopAction': {
              'Scope': 'RuleSet',
            },
          },
        ],
        'Enabled': true,
      },
      'RuleSetName': {
        'Ref': 'RuleSetE30C6C48',
      },
    });
  });

  test('fails to read the rule set name of a rule imported by name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const rule = ReceiptRule.fromReceiptRuleName(stack, 'Rule', 'MyRule');

    // THEN - the rule name is still readable, only the rule set is unknown
    expect(rule.receiptRuleRef.ruleName).toEqual('MyRule');
    expect(() => rule.receiptRuleRef.ruleSetName).toThrow(
      'the rule set of a receipt rule imported by rule name is not known - import the rule set with ReceiptRuleSet.fromReceiptRuleSetName() and add the rule to it instead',
    );
  });

  test('can order a new rule after a rule imported by name', () => {
    // GIVEN
    const stack = new Stack();
    const ruleSet = new ReceiptRuleSet(stack, 'RuleSet');
    const importedRule = ReceiptRule.fromReceiptRuleName(stack, 'Imported', 'ImportedRule');

    // WHEN
    new ReceiptRule(stack, 'Rule', {
      ruleSet,
      after: importedRule,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRule', {
      'After': 'ImportedRule',
      'RuleSetName': {
        'Ref': 'RuleSetE30C6C48',
      },
    });
  });
});

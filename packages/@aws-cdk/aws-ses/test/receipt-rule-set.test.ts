import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { ReceiptRuleSet } from '../lib';

/* eslint-disable quote-props */

describe('receipt rule set', () => {
  test('can create a receipt rule set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRuleSet', {
      RuleSetName: 'MyRuleSet',
    });


  });

  test('can create a receipt rule set with drop spam', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      dropSpam: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            LambdaAction: {
              FunctionArn: {
                'Fn::GetAtt': [
                  'SingletonLambda224e77f9a32e4b4dac32983477abba164533EA15',
                  'Arn',
                ],
              },
              InvocationType: 'RequestResponse',
            },
          },
        ],
        Enabled: true,
        ScanEnabled: true,
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);


  });

  test('drop spam rule should always appear first', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      dropSpam: true,
      rules: [
        {
          scanEnabled: true,
          recipients: ['foo@example.com'],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRule', {
      Rule: {
        Enabled: true,
        Recipients: [
          'foo@example.com',
        ],
        ScanEnabled: true,
      },
      // All "regular" rules should come after the drop spam rule
      After: {
        Ref: 'RuleSetDropSpamRule5809F51B',
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);


  });

  test('import receipt rule set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const receiptRuleSet = ReceiptRuleSet.fromReceiptRuleSetName(stack, 'ImportedRuleSet', 'MyRuleSet');

    receiptRuleSet.addRule('MyRule');

    // THEN
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'ImportedRuleSetMyRule53EE2F7F': {
          'Type': 'AWS::SES::ReceiptRule',
          'Properties': {
            'Rule': {
              'Enabled': true,
            },
            'RuleSetName': 'MyRuleSet',
          },
        },
      },
    });


  });
});

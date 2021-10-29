import '@aws-cdk/assert-internal/jest';
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
    expect(stack).toHaveResource('AWS::SES::ReceiptRuleSet', {
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
    expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
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

    expect(stack).toHaveResource('AWS::Lambda::Function');


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
    expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
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

    expect(stack).toHaveResource('AWS::Lambda::Function');


  });

  test('import receipt rule set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const receiptRuleSet = ReceiptRuleSet.fromReceiptRuleSetName(stack, 'ImportedRuleSet', 'MyRuleSet');

    receiptRuleSet.addRule('MyRule');

    // THEN
    expect(stack).toMatchTemplate({
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

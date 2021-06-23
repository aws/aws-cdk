import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ReceiptRuleSet } from '../lib';

/* eslint-disable quote-props */

export = {
  'can create a receipt rule set'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRuleSet', {
      RuleSetName: 'MyRuleSet',
    }));

    test.done();
  },

  'can create a receipt rule set with drop spam'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      dropSpam: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
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
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function'));

    test.done();
  },

  'import receipt rule set'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const receiptRuleSet = ReceiptRuleSet.fromReceiptRuleSetName(stack, 'ImportedRuleSet', 'MyRuleSet');

    receiptRuleSet.addRule('MyRule');

    // THEN
    expect(stack).toMatch({
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

    test.done();
  },
};

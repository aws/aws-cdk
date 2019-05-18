import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { ReceiptRule, ReceiptRuleSet, TlsPolicy } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'can create receipt rules with second after first'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          name: 'FirstRule',
        },
        {
          enabled: false,
          name: 'SecondRule',
          recipients: ['hello@aws.com'],
          scanEnabled: true,
          tlsPolicy: TlsPolicy.Require
        }
      ]
    });

    // THEN
    expect(stack).toMatch({
      "Resources": {
        "RuleSetE30C6C48": {
          "Type": "AWS::SES::ReceiptRuleSet"
        },
        "RuleSetRule023C3B8E1": {
          "Type": "AWS::SES::ReceiptRule",
          "Properties": {
            "Rule": {
              "Name": "FirstRule",
              "Enabled": true
            },
            "RuleSetName": {
              "Ref": "RuleSetE30C6C48"
            }
          }
        },
        "RuleSetRule117041B57": {
          "Type": "AWS::SES::ReceiptRule",
          "Properties": {
            "Rule": {
              "Enabled": false,
              "Name": "SecondRule",
              "Recipients": [
                "hello@aws.com"
              ],
              "ScanEnabled": true,
              "TlsPolicy": "Require"
            },
            "RuleSetName": {
              "Ref": "RuleSetE30C6C48"
            },
            "After": {
              "Ref": "RuleSetRule023C3B8E1"
            }
          }
        }
      }
    });

    test.done();
  },

  'import receipt rule'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const receiptRule = ReceiptRule.fromReceiptRuleName(stack, 'ImportedRule', 'MyRule');
    const receiptRuleSet = new ReceiptRuleSet(stack, 'RuleSet');

    receiptRuleSet.addRule('MyRule', {
      after: receiptRule
    });

    // THEN
    expect(stack).toMatch({
      "Resources": {
        "RuleSetE30C6C48": {
          "Type": "AWS::SES::ReceiptRuleSet"
        },
        "RuleSetMyRule60B1D107": {
          "Type": "AWS::SES::ReceiptRule",
          "Properties": {
            "Rule": {
              "Enabled": true
            },
            "RuleSetName": {
              "Ref": "RuleSetE30C6C48"
            },
            "After": "MyRule"
          }
        }
      },
    });

    test.done();
  }
};

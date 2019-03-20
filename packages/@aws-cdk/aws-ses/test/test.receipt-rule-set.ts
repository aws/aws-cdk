import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { ReceiptRuleSet } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'can create a receipt rule set'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      name: 'MyRuleSet'
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRuleSet', {
      RuleSetName: 'MyRuleSet'
    }));

    test.done();
  },

  'can create a receipt rule set with drop spam'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      dropSpam: true
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
                  'Arn'
                ]
              },
              InvocationType: 'RequestResponse'
            }
          }
        ],
        Enabled: true,
        ScanEnabled: true
      }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function'));

    test.done();
  },

  'export receipt rule set'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const receiptRuleSet = new ReceiptRuleSet(stack, 'RuleSet');

    // WHEN
    receiptRuleSet.export();

    // THEN
    expect(stack).toMatch({
      "Resources": {
        "RuleSetE30C6C48": {
          "Type": "AWS::SES::ReceiptRuleSet"
        }
      },
      "Outputs": {
        "RuleSetReceiptRuleSetNameBA4266DD": {
          "Value": {
            "Ref": "RuleSetE30C6C48"
          },
          "Export": {
            "Name": "Stack:RuleSetReceiptRuleSetNameBA4266DD"
          }
        }
      }
    });

    test.done();
  },

  'import receipt rule set'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const receiptRuleSet = ReceiptRuleSet.import(stack, 'ImportedRuleSet', {
      name: 'MyRuleSet'
    });

    receiptRuleSet.addRule('MyRule');

    // THEN
    expect(stack).toMatch({
      "Resources": {
        "ImportedRuleSetMyRule53EE2F7F": {
          "Type": "AWS::SES::ReceiptRule",
          "Properties": {
            "Rule": {
              "Enabled": true
            },
            "RuleSetName": "MyRuleSet"
          }
        }
      },
    });

    test.done();
  }
};

import { Template } from '../../assertions';
import { Stack } from '../../core';
import { ReceiptRuleSet } from '../lib';

/* eslint-disable @stylistic/quote-props */

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

  test('active: true creates AwsCustomResource to set active receipt rule set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
      active: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRuleSet', {
      RuleSetName: 'MyRuleSet',
    });

    // Verify custom resource is created with correct type
    Template.fromStack(stack).resourceCountIs('Custom::AWS', 1);
  });

  test('active: false does not create AwsCustomResource', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
      active: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRuleSet', {
      RuleSetName: 'MyRuleSet',
    });

    // Verify no custom resource is created
    Template.fromStack(stack).resourceCountIs('Custom::AWS', 0);
  });

  test('active: undefined does not create AwsCustomResource', () => {
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

    // Verify no custom resource is created
    Template.fromStack(stack).resourceCountIs('Custom::AWS', 0);
  });

  test('active: true creates correct IAM permissions', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
      active: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'ses:SetActiveReceiptRuleSet',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('active: true creates custom resource with dependency on rule set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
      active: true,
    });

    // THEN
    const template = Template.fromStack(stack);

    // Verify the custom resource has a DependsOn that includes the rule set
    // The DependsOn array also includes the IAM policy
    template.hasResource('Custom::AWS', {
      DependsOn: [
        'RuleSetE30C6C48',
        'RuleSetSetActiveCustomResourcePolicyFEBA1D93',
      ],
    });
  });

  test('active: true works with dropSpam', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      receiptRuleSetName: 'MyRuleSet',
      active: true,
      dropSpam: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SES::ReceiptRuleSet', {
      RuleSetName: 'MyRuleSet',
    });

    // Verify custom resource is created
    Template.fromStack(stack).resourceCountIs('Custom::AWS', 1);

    // Verify drop spam rule is created
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
  });
});

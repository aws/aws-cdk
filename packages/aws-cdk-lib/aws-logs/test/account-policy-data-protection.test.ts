import { Template } from '../../assertions';
import { Stack } from '../../core';
import { AccountPolicy, AccountPolicyDocument, CustomDataIdentifier, DataIdentifier, DataProtectionPolicy } from '../lib';

describe('account policy - data protection', () => {
  test('trivial instantiation with a custom data identifier', () => {
    // GIVEN
    const stack = new Stack();
    const identifier = new CustomDataIdentifier('MyIdentifier', '/regex/');

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.dataProtection(
        new DataProtectionPolicy({
          name: 'test-policy-name',
          description: 'test description',
          identifiers: [identifier],
        }),
      ),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyName: 'MyAccountPolicy',
      PolicyType: 'DATA_PROTECTION_POLICY',
      PolicyDocument: JSON.stringify({
        Name: 'test-policy-name',
        Description: 'test description',
        Version: '2021-06-01',
        Statement: [
          {
            Sid: 'audit-statement-cdk',
            DataIdentifier: ['MyIdentifier'],
            Operation: {
              Audit: {
                FindingsDestination: {},
              },
            },
          },
          {
            Sid: 'redact-statement-cdk',
            DataIdentifier: ['MyIdentifier'],
            Operation: {
              Deidentify: {
                MaskConfig: {},
              },
            },
          },
        ],
        Configuration: {
          CustomDataIdentifier: [{ Name: 'MyIdentifier', Regex: '/regex/' }],
        },
      }),
    });
  });

  test('does not set a selectionCriteria', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.dataProtection(
        new DataProtectionPolicy({
          identifiers: [DataIdentifier.EMAILADDRESS],
        }),
      ),
    });

    // THEN
    const template = Template.fromStack(stack).findResources('AWS::Logs::AccountPolicy');
    const [resource] = Object.values(template);
    expect(resource.Properties.SelectionCriteria).toBeUndefined();
  });
});

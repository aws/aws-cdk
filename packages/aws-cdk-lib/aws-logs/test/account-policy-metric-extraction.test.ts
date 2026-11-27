import { Template } from '../../assertions';
import { Stack } from '../../core';
import { AccountPolicy, AccountPolicyDocument } from '../lib';

describe('account policy - metric extraction', () => {
  test('enabled: true renders an Enabled status', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.metricExtraction({
        enabled: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyName: 'MyAccountPolicy',
      PolicyType: 'METRIC_EXTRACTION_POLICY',
      PolicyDocument: JSON.stringify({
        EmbeddedMetricFormat: { Status: 'Enabled' },
      }),
    });
  });

  test('enabled: false renders a Disabled status', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.metricExtraction({
        enabled: false,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyDocument: JSON.stringify({
        EmbeddedMetricFormat: { Status: 'Disabled' },
      }),
    });
  });

  test('selectionCriteria escape hatch is passed through as-is', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.metricExtraction({
        enabled: false,
        selectionCriteria: 'LogGroupNamePrefix NOT IN ["/aws/containerinsights"]',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      SelectionCriteria: 'LogGroupNamePrefix NOT IN ["/aws/containerinsights"]',
    });
  });

  test('does not set a selectionCriteria by default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.metricExtraction({
        enabled: true,
      }),
    });

    // THEN
    const template = Template.fromStack(stack).findResources('AWS::Logs::AccountPolicy');
    const [resource] = Object.values(template);
    expect(resource.Properties.SelectionCriteria).toBeUndefined();
  });
});

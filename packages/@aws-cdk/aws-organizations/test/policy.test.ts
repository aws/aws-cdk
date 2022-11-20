import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Account, Policy, PolicyAttachmentTarget, PolicyType } from '../lib';

describe('Policy', () => {
  it('Should create a policy', () => {
    // Given
    const stack = new cdk.Stack();
    const account = Account.fromAccountAttributes(stack, 'Account', {
      accountName: 'any-account-name',
      accountId: 'any-account-id',
      accountArn: 'any-account-arn',
      email: 'any-email+any-suffix@domain.any',
      roleName: 'OrganizationAccountAccessRole',
      accountStatus: 'ACTIVE',
      accountJoinedMethod: 'CREATED',
      accountJoinedTimestamp: '2022-11-20T15:30:00-00:00Z',
    });

    // When
    new Policy(stack, 'Policy', {
      policyName: 'any-policy-name',
      description: 'any-description',
      content: {},
      targets: [PolicyAttachmentTarget.ofAccount(account)],
      policyType: PolicyType.SERVICE_CONTROL_POLICY,
    });

    // Then
    const template =Template.fromStack(stack);
    template.hasResourceProperties('AWS::Organizations::Policy', {
      Content: '{}',
      Description: 'any-description',
      Name: 'any-policy-name',
      TargetIds: ['any-account-id'],
      Type: PolicyType.SERVICE_CONTROL_POLICY,
    });
  });
});
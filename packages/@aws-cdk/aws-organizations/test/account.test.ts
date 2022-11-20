import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Account, OrganizationalUnit } from '../lib';

describe('Account', () => {
  it('Should create an account', () => {
    // Given
    const stack = new cdk.Stack();
    const parent = OrganizationalUnit.fromOrganizationalUnitAttributes(stack, 'OrganizationalUnit', {
      organizationalUnitName: 'any-organizational-unit-name',
      organizationalUnitId: 'any-organizational-unit-id',
      organizationalUnitArn: 'any-organizational-unit-arn',
    });

    // When
    new Account(stack, 'Account', {
      accountName: 'AnyAccountName',
      email: 'any-email+any-suffix@domain.any',
      parent: parent,
    });

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Organizations::Account', {
      AccountName: 'AnyAccountName',
      Email: 'any-email+any-suffix@domain.any',
      RoleName: 'OrganizationAccountAccessRole',
      ParentIds: ['any-organizational-unit-id'],
    });
  });
});
import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { OrganizationalUnit, OrganizationRoot } from '../lib';

describe('OrganizationalUnit', () => {
  it('Should create an organizational unit', () => {
    // Given
    const stack = new cdk.Stack();
    OrganizationRoot.fromOrganizationRootAttributes(stack, '@aws-cdk/aws-organizations.OrganizationRoot', {
      organizationRootId: 'any-organization-root-id',
    });

    // When
    new OrganizationalUnit(stack, 'OrganizationalUnit', {
      organizationalUnitName: 'any-organizational-unit-name',
    });

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Organizations::OrganizationalUnit', {
      Name: 'any-organizational-unit-name',
      ParentId: 'any-organization-root-id',
    });
  });
});
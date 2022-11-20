import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { OrganizationRoot } from '../lib';

describe('OrganizationRoot', () => {
  it('Should create an organization root', () => {
    // Given
    const stack = new cdk.Stack();

    // When
    OrganizationRoot.getOrCreate(stack);

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties('Custom::OrganizationRoot', {});
  });
});
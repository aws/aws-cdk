import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */

describe('Constraints', () => {
  const stack = new core.Stack();
  const portfolio = new catalog.Portfolio(stack, 'portfolio', { portfolioName: 'test', provider: 'test' });
  const product = new catalog.Product(stack, 'product', { productName: 'test', owner: 'test', templatePath: './README.md' });
  product.associateToPortfolio(portfolio);

  test('LaunchNotificationConstraint resource', () => {
    new catalog.LaunchNotificationConstraint(stack, 'launchNotificationConstraint', { portfolio: portfolio, product: product, notificationArns: ['1234'] });
    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchNotificationConstraint', { NotificationArns: ['1234'] });
  });
  test('LaunchRoleConstraint resource', () => {
    new catalog.LaunchRoleConstraint(stack, 'launchRoleConstraint', { portfolio: portfolio, product: product, localRoleName: 'myrole' });
    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchRoleConstraint', { LocalRoleName: 'myrole' });
  });
  test('LaunchTemplateConstraint resource', () => {
    new catalog.LaunchTemplateConstraint(stack, 'launchTemplateConstraint', { portfolio: portfolio, product: product, rules: 'test' });
    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchTemplateConstraint', { Rules: 'test' });
  });
  describe('ResourceUpdateConstraint', () => {
    test('TagUpdateOnProvisionedProduct NOT_ALLOWED', () => {
      new catalog.ResourceUpdateConstraint(stack, 'resourceUpdateConstraintNotAllowed', { portfolio: portfolio, product: product, allowTagUpdateOnProvisionedProduct: false });
      expect(stack).toHaveResource('AWS::ServiceCatalog::ResourceUpdateConstraint', { TagUpdateOnProvisionedProduct: 'NOT_ALLOWED' });
    });
    test('TagUpdateOnProvisionedProduct ALLOWED', () => {
      new catalog.ResourceUpdateConstraint(stack, 'resourceUpdateConstraintAllowed', { portfolio: portfolio, product: product, allowTagUpdateOnProvisionedProduct: true });
      expect(stack).toHaveResource('AWS::ServiceCatalog::ResourceUpdateConstraint', { TagUpdateOnProvisionedProduct: 'ALLOWED' });
    });
  });
  test('StackSetConstraint resource', () => {
    const role = new iam.Role(stack, 'testadminrole', { assumedBy: new iam.ServicePrincipal('aws') });
    new catalog.StackSetConstraint(stack, 'stackSetConstraint', {
      portfolio: portfolio,
      product: product,
      accounts: ['1234'],
      adminRole: role,
      executionRole: role,
      regions: ['us-west-2'],
      allowStackInstanceControl: false,
    });
    expect(stack).toHaveResource('AWS::ServiceCatalog::StackSetConstraint', {
      AccountList: ['1234'],
      AdminRole: stack.resolve(role.roleArn),
      ExecutionRole: stack.resolve(role.roleArn),
      RegionList: ['us-west-2'],
      StackInstanceControl: 'NOT_ALLOWED',
      Description: 'no description',
    });
  });
});
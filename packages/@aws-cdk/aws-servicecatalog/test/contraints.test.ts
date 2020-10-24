import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */

describe('Constraints', () => {
  let stack: core.Stack;
  let portfolio: catalog.IPortfolio;
  let product: catalog.IProduct;
  beforeEach(() => {
    stack = new core.Stack();
    portfolio = new catalog.Portfolio(stack, 'portfolio', { portfolioName: 'test', provider: 'test' });
    product = new catalog.Product(stack, 'product', { productName: 'test', owner: 'test', templatePath: './README.md' });
    product.associateToPortfolio(portfolio);
  });
  test('LaunchNotificationConstraint resource', () => {
    const topic = new sns.Topic(stack, 'topic');
    new catalog.LaunchNotificationConstraint(stack, 'launchNotificationConstraint', { portfolio: portfolio, product: product, topics: [topic] });
    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchNotificationConstraint', { NotificationArns: [stack.resolve(topic.topicArn)] });
  });
  describe('LaunchRoleConstraint resource', () => {
    test('local role', () => {
      const role = new iam.Role(stack, 'testadminrole', { assumedBy: new iam.ServicePrincipal('aws') });
      new catalog.LaunchRoleConstraint(stack, 'launchRoleConstraint', { portfolio: portfolio, product: product, role: role });
      expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchRoleConstraint', { RoleArn: stack.resolve(role.roleArn) });
    });
    test('role arn', () => {
      const role = new iam.Role(stack, 'testadminrole', { assumedBy: new iam.ServicePrincipal('aws') });
      new catalog.LaunchRoleConstraint(stack, 'launchRoleConstraint', { portfolio: portfolio, product: product, role: role });
      expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchRoleConstraint', { RoleArn: stack.resolve(role.roleArn) });
    });
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
  describe('StackSetConstraint resource', () => {
    test('StackInstanceControl ALLOWED', () => {
      const role = new iam.Role(stack, 'testadminrole', { assumedBy: new iam.ServicePrincipal('aws') });
      new catalog.StackSetConstraint(stack, 'stackSetConstraint', {
        portfolio: portfolio,
        product: product,
        accounts: ['1234'],
        adminRole: role,
        executionRole: role,
        regions: ['us-west-2'],
        allowStackInstanceControl: true,
      });
      expect(stack).toHaveResource('AWS::ServiceCatalog::StackSetConstraint', {
        AccountList: ['1234'],
        AdminRole: stack.resolve(role.roleArn),
        ExecutionRole: stack.resolve(role.roleArn),
        RegionList: ['us-west-2'],
        StackInstanceControl: 'ALLOWED',
        Description: 'no description',
      });
    });
    test('StackInstanceControl NOT_ALLOWED', () => {
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
});
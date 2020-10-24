import '@aws-cdk/assert/jest';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

describe('CDK Product Resource', () => {
  const stack = new core.Stack();
  let productApp: core.App;
  let productStack: core.Stack;
  beforeEach(() => {
    productApp = new core.App();
    productStack = new core.Stack(productApp, 'ProductStack');
  });
  test('default cdkproduct', () => {
    new catalog.CDKProduct(stack, 'CDKProduct', { productName: 'testCDKProduct', owner: 'testOwner', stack: productStack });
    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::CloudFormationProduct', { Name: 'testCDKProduct' });
  });
  test('error when stack has asset', () => {
    new assets.Asset(productStack, 'testAsset', { path: './' });
    expect(() => {
      new catalog.CDKProduct(stack, 'CDKProduct', { productName: 'testCDKProduct', owner: 'testOwner', stack: productStack });
    }).toThrowError(/cannot have assets/);
  });
});
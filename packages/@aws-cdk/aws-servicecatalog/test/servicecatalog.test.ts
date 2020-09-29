import '@aws-cdk/assert/jest';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */


describe('Portfolio Resource', () => {
  let stack: core.Stack;
  let portfolio: catalog.IPortfolio;

  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    beforeEach(() => {
      portfolio = new catalog.Portfolio(stack, 'Portfolio', { portfolioName: 'test', provider: 'test' });
    });
    test('default Portfolio', () => {
      expect(stack).toHaveResource('AWS::ServiceCatalog::Portfolio', { DisplayName: 'test', ProviderName: 'test' });
    });
    test('add product', () => {
      const product = new catalog.Product(stack, 'Product', { productName: 'testProduct', asset: new assets.Asset(stack, 'testAsset', { path: './' }), owner: 'testOwner' });
      portfolio.associateProduct(product);
      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::CloudFormationProduct', { Name: 'testProduct', Owner: 'testOwner' });
    });

  });
});

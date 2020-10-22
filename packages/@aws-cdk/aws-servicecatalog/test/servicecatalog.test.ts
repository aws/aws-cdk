import '@aws-cdk/assert/jest';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */


describe('Service Catalog resources', () => {
  let stack: core.Stack;
  beforeEach(() => {
    stack = new core.Stack();
  });
  describe('Portfolio resource', () => {
    let portfolio: catalog.IPortfolio;
    beforeEach(() => {
      portfolio = new catalog.Portfolio(stack, 'Portfolio', { portfolioName: 'testPortfolio', provider: 'testProvider' });
    });
    test('default portfolio', () => {
      expect(stack).toHaveResource('AWS::ServiceCatalog::Portfolio', { DisplayName: 'testPortfolio', ProviderName: 'testProvider' });
    });
    test('from Attributes', () => {
      const importPortfolio = catalog.Portfolio.fromPortfolioAttributes(stack, 'fromAttributes', { portfolioName: portfolio.portfolioName, porfolioArn: portfolio.portfolioArn });
      expect(importPortfolio.portfolioArn).toEqual(portfolio.portfolioArn);
      expect(importPortfolio.portfolioId).toEqual(portfolio.portfolioId);
      expect(importPortfolio.portfolioName).toEqual(portfolio.portfolioName);
    });
    test('add portfolio to product', () => {
      const product = new catalog.Product(stack, 'Product', { productName: 'testProduct', templatePath: './', owner: 'testOwner' });
      portfolio.associateProduct(product);
      const expectedProductId = stack.resolve(product.productId);
      const expectedPortfolioId = stack.resolve(portfolio.portfolioId);
      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioProductAssociation', { PortfolioId: expectedPortfolioId, ProductId: expectedProductId });
    });
  });
  describe('Product Resource', () => {
    let product: catalog.IProduct;
    beforeEach(() => {
      product = new catalog.Product(stack, 'Product', { productName: 'testProduct', templatePath: './', owner: 'testOwner' });
    });

    test('default product', () => {
      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::CloudFormationProduct', { Name: 'testProduct', Owner: 'testOwner' });
    });
    test('from Attributes', () => {
      const importProduct = catalog.Product.fromProductAttributes(stack, 'importProduct', { prouductArn: product.productArn, productName: product.productName, provisioningArtifactIds: product.provisioningArtifactId, provisioningArtifactNames: product.provisioningArtifactName });
      expect(importProduct.productArn).toEqual(product.productArn);
      expect(importProduct.productId).toEqual(product.productId);
      expect(importProduct.productName).toEqual(product.productName);
    });
    test('add product to portfolio', () => {
      const portfolio = new catalog.Portfolio(stack, 'Portfolio', { portfolioName: 'testPortfolio', provider: 'testProvider' });
      product.associateToPortfolio(portfolio);
      const expectedProductId = stack.resolve(product.productId);
      const expectedPortfolioId = stack.resolve(portfolio.portfolioId);
      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioProductAssociation', { PortfolioId: expectedPortfolioId, ProductId: expectedProductId });
    });
  });
  describe('CDK Product Resource', () => {
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
});
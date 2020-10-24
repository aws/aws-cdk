import '@aws-cdk/assert/jest';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

describe('Product Resource', () => {
  let stack: core.Stack;
  let product: catalog.IProduct;
  beforeEach(() => {
    stack = new core.Stack();
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
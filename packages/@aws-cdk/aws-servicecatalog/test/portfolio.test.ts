import '@aws-cdk/assert/jest';
import * as core from '@aws-cdk/core';
import * as catalog from '../lib';

describe('Portfolio resource', () => {
  let stack: core.Stack;
  let portfolio: catalog.IPortfolio;
  beforeEach(() => {
    stack = new core.Stack();
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
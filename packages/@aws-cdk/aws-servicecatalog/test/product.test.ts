import '@aws-cdk/assert-internal/jest';
import { App, Stack } from '@aws-cdk/core';
import { AcceptLanguage, Portfolio, Product } from '../lib';

/* eslint-disable quote-props */
describe('Product', () => {

  test('default product test', () => {
    const app = new App();
    const stack = new Stack(app);

    new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyProduct49A3C587: {
          Type: 'AWS::ServiceCatalog::CloudFormationProduct',
          Properties: {
            Name: 'testProduct',
            Owner: 'testOwner',
            ProvisioningArtifactParameters: [
              {
                Info: {
                  LoadTemplateFromURL: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template',
                },
              },
            ],
          },
        },
      },
    });
  }),

  test('product with explicit parameters', () => {
    const app = new App();
    const stack = new Stack(app);

    new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyProduct49A3C587: {
          Type: 'AWS::ServiceCatalog::CloudFormationProduct',
          Properties: {
            Name: 'testProduct',
            Owner: 'testOwner',
            ProvisioningArtifactParameters: [
              {
                Info: {
                  LoadTemplateFromURL: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template',
                },
              },
            ],
          },
        },
      },
    });
  }),

  test('product from attributes', () => {
    const app = new App();
    const stack = new Stack(app);

    const product = Product.fromProductAttributes(stack, 'MyProduct', {
      productArn: 'arn:aws:catalog:region:account-id:product/prod-djh8932wr',
      productName: 'MyProduct',
    });

    expect(product.productArn).toEqual('arn:aws:catalog:region:account-id:product/prod-djh8932wr');
  }),

  test('fails product from attributes without resource name in arn', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => {
      Product.fromProductAttributes(stack, 'MyProduct', {
        productArn: 'arn:aws:catalog:region:account-id:product',
        productName: 'MyProduct',
      });
    }).toThrowError('Product arn missing Product ID during import from attributes');
  }),

  test('product-portfolio association', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
      description: 'test portfolio description',
      acceptLanguage: AcceptLanguage.ZH,
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    product.addToPortfolio(portfolio);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioProductAssociation', {
      PortfolioId: {
        Ref: 'MyPortfolio59CCA9C9',
      },
      ProductId: {
        Ref: 'MyProduct49A3C587',
      },
    });
  });
});

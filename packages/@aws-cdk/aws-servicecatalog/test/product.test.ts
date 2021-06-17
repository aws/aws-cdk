import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

/* eslint-disable quote-props */
describe('Product', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app);
  });

  test('default product test', () => {
    new servicecatalog.Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::CloudFormationProduct', {
      Name: 'testProduct',
      Owner: 'testOwner',
      ProvisioningArtifactParameters: [
        {
          'Info': {
            'LoadTemplateFromURL': 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template',
          },
        },
      ],
    });
  }),

  test('product from attributes', () => {
    const product = servicecatalog.Product.fromProductAttributes(stack, 'MyProduct', {
      productArn: 'arn:aws:catalog:region:account-id:product/prod-djh8932wr',
      productName: 'MyProduct',
    });

    expect(product.productArn).toEqual('arn:aws:catalog:region:account-id:product/prod-djh8932wr');
  }),

  test('fails product from attributes without resource name in arn', () => {
    expect(() => {
      servicecatalog.Product.fromProductAttributes(stack, 'MyProduct', {
        productArn: 'arn:aws:catalog:region:account-id:product',
        productName: 'MyProduct',
      });
    }).toThrowError('Product arn missing Product ID during import from attributes');
  }),

  test('fails product creation with invalid email', () => {
    expect(() => {
      new servicecatalog.Product(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
        supportEmail: 'invalid email',
      });
    }).toThrowError(/Invalid support email for resource Default\/MyProduct/);
  });

  test('fails product creation with invalid url', () => {
    expect(() => {
      new servicecatalog.Product(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        provisioningArtifacts: [{ templateUrl: 'invalid url' }],
      });
    }).toThrowError(/Invalid provisioning template url for resource Default\/MyProduct/);
  });
});

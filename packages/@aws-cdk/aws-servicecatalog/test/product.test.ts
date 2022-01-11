import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
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
    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::CloudFormationProduct', {
      Name: 'testProduct',
      Owner: 'testOwner',
      ProvisioningArtifactParameters: [
        {
          'DisableTemplateValidation': false,
          'Info': {
            'LoadTemplateFromURL': 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template',
          },
        },
      ],
    });
  }),

  test('default product test with validation disabled', () => {
    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          validateTemplate: false,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::CloudFormationProduct', {
      Name: 'testProduct',
      Owner: 'testOwner',
      ProvisioningArtifactParameters: [
        {
          'DisableTemplateValidation': true,
          'Info': {
            'LoadTemplateFromURL': 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template',
          },
        },
      ],
    });
  }),

  test('product test from Asset', () => {
    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
        },
      ],
    });

    const assembly = app.synth();
    const synthesized = assembly.stacks[0];
    expect(synthesized.assets.length).toEqual(1);
  }),

  test('multiple product versions from Assets', () => {
    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
        },
        {
          productVersionName: 'v2',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product2.template.json')),
        },
      ],
    });

    const assembly = app.synth();
    const synthesized = assembly.stacks[0];
    expect(synthesized.assets.length).toEqual(2);
  }),

  test('product test from product stack', () => {
    const productStack = new servicecatalog.ProductStack(stack, 'ProductStack');

    new sns.Topic(productStack, 'SNSTopicProductStack');

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(productStack),
        },
      ],
    });

    const assembly = app.synth();
    expect(assembly.artifacts.length).toEqual(2);
    expect(assembly.stacks[0].assets.length).toBe(1);
    expect(assembly.stacks[0].assets[0].path).toEqual('ProductStack.product.template.json');
  }),

  test('multiple product versions from product stack', () => {
    const productStackVersion1 = new servicecatalog.ProductStack(stack, 'ProductStackV1');
    const productStackVersion2 = new servicecatalog.ProductStack(stack, 'ProductStackV2');

    new sns.Topic(productStackVersion1, 'SNSTopicProductStack1');

    new sns.Topic(productStackVersion2, 'SNSTopicProductStack2', {
      displayName: 'a test',
    });

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(productStackVersion1),
        },
        {
          productVersionName: 'v2',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(productStackVersion2),
        },
      ],
    });

    const assembly = app.synth();

    expect(assembly.stacks[0].assets.length).toBe(2);
    expect(assembly.stacks[0].assets[0].path).toEqual('ProductStackV1.product.template.json');
    expect(assembly.stacks[0].assets[1].path).toEqual('ProductStackV2.product.template.json');
  }),

  test('identical product versions from product stack creates one asset', () => {
    class TestProductStack extends servicecatalog.ProductStack {
      constructor(scope: any, id: string) {
        super(scope, id);

        new sns.Topic(this, 'TopicProduct');
      }
    }

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'v1')),
        },
        {
          productVersionName: 'v2',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'v2')),
        },
        {
          productVersionName: 'v3',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'v3')),
        },
      ],
    });

    const assembly = app.synth();

    expect(assembly.stacks[0].assets.length).toBe(1);
  }),

  test('product test from multiple sources', () => {
    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        {
          productVersionName: 'v1',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
        },
        {
          productVersionName: 'v2',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment-v2.template'),
        },
        {
          productVersionName: 'v3',
          cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::CloudFormationProduct', {
      Name: 'testProduct',
      Owner: 'testOwner',
      ProvisioningArtifactParameters: Match.arrayWith([
        Match.objectLike({
          'Info': {
            'LoadTemplateFromURL': 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template',
          },
        }),
      ]),
    });
  }),

  test('product from attributes', () => {
    const product = servicecatalog.Product.fromProductArn(stack, 'MyProduct', 'arn:aws:catalog:region:account-id:product/prod-djh8932wr');

    expect(product.productArn).toEqual('arn:aws:catalog:region:account-id:product/prod-djh8932wr');
  }),

  test('fails product from attributes without resource name in arn', () => {
    expect(() => {
      servicecatalog.Product.fromProductArn(stack, 'MyProduct', 'arn:aws:catalog:region:account-id:product');
    }).toThrowError('Missing required Portfolio ID from Portfolio ARN: arn:aws:catalog:region:account-id:product');
  }),

  test('fails product creation with invalid email', () => {
    expect(() => {
      new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          },
        ],
        supportEmail: 'invalid email',
      });
    }).toThrowError(/Invalid support email for resource Default\/MyProduct/);
  }),

  test('fails product creation with invalid url', () => {
    expect(() => {
      new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('invalid url'),
          },
        ],
      });
    }).toThrowError(/Invalid provisioning template url for resource Default\/MyProduct/);
  }),

  test('fails product creation with empty productVersions', () => {
    expect(() => {
      new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [],
      });
    }).toThrowError(/Invalid product versions for resource Default\/MyProduct/);
  }),

  describe('adding and associating TagOptions to a product', () => {
    let product: servicecatalog.IProduct;

    beforeEach(() => {
      product = new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          },
        ],
      });
    }),

    test('add tag options to product', () => {
      const tagOptions = new servicecatalog.TagOptions({
        key1: ['value1', 'value2'],
        key2: ['value1'],
      });

      product.associateTagOptions(tagOptions);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
    }),

    test('add tag options as input to product in props', () => {
      const tagOptions = new servicecatalog.TagOptions({
        key1: ['value1', 'value2'],
        key2: ['value1'],
      });

      new servicecatalog.CloudFormationProduct(stack, 'MyProductWithTagOptions', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          },
        ],
        tagOptions: tagOptions,
      });

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
    }),

    test('adding identical tag options to product is idempotent', () => {
      const tagOptions1 = new servicecatalog.TagOptions({
        key1: ['value1', 'value2'],
        key2: ['value1'],
      });

      const tagOptions2 = new servicecatalog.TagOptions({
        key1: ['value1', 'value2'],
      });

      product.associateTagOptions(tagOptions1);
      product.associateTagOptions(tagOptions2); // If not idempotent this would fail

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
    }),

    test('adding duplicate tag options to portfolio and product creates unique tag options and enumerated associations', () => {
      const tagOptions1 = new servicecatalog.TagOptions({
        key1: ['value1', 'value2'],
        key2: ['value1'],
      });

      const tagOptions2 = new servicecatalog.TagOptions({
        key1: ['value1', 'value2'],
        key2: ['value2'],
      });

      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      portfolio.associateTagOptions(tagOptions1);
      product.associateTagOptions(tagOptions2); // If not idempotent this would fail

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 4); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 6);
    });
  });
});

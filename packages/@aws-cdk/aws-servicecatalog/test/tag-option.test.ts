import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

describe('TagOptions', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app);
  });

  describe('creating tagOption(s)', () => {
    test('default tagOptions creation', () => {
      new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1', 'value2', 'value3'],
        },
      });

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 5);
    }),

    test('fails to create tag option with invalid minimum key length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          allowedValuesForTags: {
            '': ['value1', 'value2'],
          },
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid maxium key length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          allowedValuesForTags: {
            ['longKey'.repeat(1000)]: ['value1', 'value2'],
          },
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid value length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          allowedValuesForTags: {
            key: ['tagOptionValue'.repeat(1000)],
          },
        });
      }).toThrowError(/Invalid TagOption value for resource/);
    }),

    test('fails to create tag options with no tag keys or values', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          allowedValuesForTags: {},
        });
      }).toThrowError(/No tag option keys or values were provided/);
    }),

    test('fails to create tag options for tag key with no values', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          allowedValuesForTags: {
            key1: ['value1', 'value2'],
            key2: [],
          },
        });
      }).toThrowError(/No tag option values were provided for tag option key/);
    }),

    test('associate tag options', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1', 'value2', 'value3'],
        },
      });
      portfolio.associateTagOptions(tagOptions);

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 5);
    }),

    test('creating tag options with duplicate values is idempotent', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2', 'value2'],
          key2: ['value1', 'value2', 'value3', 'value3'],
        },
      });
      portfolio.associateTagOptions(tagOptions);

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 5);
    }),

    test('create and associate tag options to different resources', () => {
      const portfolio1 = new servicecatalog.Portfolio(stack, 'MyPortfolio1', {
        displayName: 'testPortfolio1',
        providerName: 'testProvider1',
      });

      const portfolio2 = new servicecatalog.Portfolio(stack, 'MyPortfolio2', {
        displayName: 'testPortfolio2',
        providerName: 'testProvider2',
      });

      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1', 'value2', 'value3'],
        },
      });

      portfolio1.associateTagOptions(tagOptions);
      portfolio2.associateTagOptions(tagOptions);

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 10);
    }),

    test('adding tag options to portfolio and product creates unique tag options and enumerated associations', () => {
      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1'],
        },
      });

      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      const product = new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          },
        ],
        tagOptions: tagOptions,
      });

      portfolio.associateTagOptions(tagOptions);
      product.associateTagOptions(tagOptions);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 6);
    });

    test('create and associate tag options in another stack', () => {
      const tagOptionsStack = new cdk.Stack(app, 'TagOptionsStack');
      const productStack = new cdk.Stack(app, 'ProductStack');

      const tagOptions = new servicecatalog.TagOptions(tagOptionsStack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1', 'value2', 'value3'],
        },
      });

      new servicecatalog.CloudFormationProduct(productStack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          },
        ],
        tagOptions: tagOptions,
      });

      Template.fromStack(tagOptionsStack).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(productStack).resourceCountIs('AWS::ServiceCatalog::TagOption', 0);
      Template.fromStack(productStack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 5);
    });
  });
});

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
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
      });

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 5);
    }),

    test('fails to create tag option with invalid minimum key length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          '': ['value1', 'value2'],
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid maxium key length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          ['longKey'.repeat(1000)]: ['value1', 'value2'],
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid value length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, 'TagOptions', {
          key: ['tagOptionValue'.repeat(1000)],
        });
      }).toThrowError(/Invalid TagOption value for resource/);
    }),

    test('associate tag options', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
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
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
      });

      portfolio1.associateTagOptions(tagOptions);
      portfolio2.associateTagOptions(tagOptions);

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 10);
    }),

    test('create and associate tag options in another stack', () => {
      const stack1 = new cdk.Stack(app, 'Stack1');
      const stack2 = new cdk.Stack(app, 'Stack2');

      const tagOptions = new servicecatalog.TagOptions(stack1, 'TagOptions', {
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
      });

      new servicecatalog.CloudFormationProduct(stack2, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl('https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
          },
        ],
        tagOptions: tagOptions,
      });

      Template.fromStack(stack1).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(stack2).resourceCountIs('AWS::ServiceCatalog::TagOption', 0);
      Template.fromStack(stack2).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 5);
    });
  });
});
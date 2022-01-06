import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

describe('TagOptions', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app);
  });

  describe('creating tagOption(s)', () => {
    test('default tagOption creation', () => {
      new servicecatalog.TagOption(stack, 'MyTagOption', {
        key: 'tagOptionKey',
        value: 'tagOptionValue',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::TagOption', {
        Key: 'tagOptionKey',
        Value: 'tagOptionValue',
      });
    }),

    test('default tagOptions creation', () => {
      new servicecatalog.TagOptions(stack, {
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
      });

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 5);
    }),

    test('fails to create tag option with invalid minimum key length', () => {
      expect(() => {
        new servicecatalog.TagOption(stack, 'MyTagOption', {
          key: '',
          value: 'tagOptionValue',
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid maxium key length', () => {
      expect(() => {
        new servicecatalog.TagOption(stack, 'MyTagOption', {
          key: 'tagOptionKey'.repeat(1000),
          value: 'tagOptionValue',
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid value length', () => {
      expect(() => {
        new servicecatalog.TagOption(stack, 'MyTagOption', {
          key: 'tagOptionKey',
          value: 'tagOptionValue'.repeat(1000),
        });
      }).toThrowError(/Invalid TagOption value for resource/);
    }),

    test('associate tag option', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      const tagOption = new servicecatalog.TagOption(stack, 'TagOption', {
        key: 'key',
        value: 'value',
      });
      portfolio.associateTagOption(tagOption);

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOption', 1);
      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 1);
    }),

    test('associate tag options', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      const tagOptions = new servicecatalog.TagOptions(stack, {
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
      });
      portfolio.associateTagOptions(tagOptions);

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOption', 5);
      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 5);
    }),

    test('import and associate a tagOption', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      portfolio.associateTagOption(servicecatalog.TagOption.fromTagOptionId(stack, 'ImportedTagOption', 'MyTagOptionId'));

      Template.fromStack(stack).hasResource('AWS::ServiceCatalog::TagOptionAssociation', 1);
    });
  });
});
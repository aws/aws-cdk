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
    test('default tagOptions creation', () => {
      new servicecatalog.TagOptions(stack, {
        key1: ['value1', 'value2'],
        key2: ['value1', 'value2', 'value3'],
      });

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 5);
    }),

    test('fails to create tag option with invalid minimum key length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, {
          '': ['value1', 'value2'],
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid maxium key length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, {
          ['longKey'.repeat(1000)]: ['value1', 'value2'],
        });
      }).toThrowError(/Invalid TagOption key for resource/);
    }),

    test('fails to create tag option with invalid value length', () => {
      expect(() => {
        new servicecatalog.TagOptions(stack, {
          key: ['tagOptionValue'.repeat(1000)],
        });
      }).toThrowError(/Invalid TagOption value for resource/);
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
    });
  });
});
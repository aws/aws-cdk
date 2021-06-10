import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

describe('Portfolio', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('for a Portfolio created only with portfolioName and providerName', () => {
    let portfolio: servicecatalog.Portfolio;

    beforeEach(() => {
      portfolio = new servicecatalog.Portfolio(stack, 'Portfolio', {
        portfolioName: 'my portfolio',
        providerName: 'my provider',
      });
    });

    test('portfolioId returns the Ref CFN function', () => {
      expect(stack.resolve(portfolio.portfolioId)).toStrictEqual({
        Ref: 'Portfolio856A4190',
      });
    });

    test('portolioArn renders the correct ARN', () => {
      expect(stack.resolve(portfolio.portfolioArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':servicecatalog:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':portfolio/',
          { Ref: 'Portfolio856A4190' },
        ]],
      });
    });

    test('creates a CFnPortfolio with displayName and providerName properties filled', () => {
      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::Portfolio', {
        DisplayName: 'my portfolio',
        ProviderName: 'my provider',
      });
    });
  });

  describe('for a Portfolio imported by ARN', () => {
    let portfolio: servicecatalog.IPortfolio;

    beforeEach(() => {
      portfolio = servicecatalog.Portfolio.fromPortfolioArn(stack, 'Portfolio',
        'arn:aws:catalog:us-west-2:123456789012:portfolio/port-jcb2idbzrkmdk');
    });

    test('portfolioId returns the resourceName part of the ARN', () => {
      expect(portfolio.portfolioId).toEqual('port-jcb2idbzrkmdk');
    });

    test('portolioArn renders the correct ARN', () => {
      expect(portfolio.portfolioArn).toEqual(
        'arn:aws:catalog:us-west-2:123456789012:portfolio/port-jcb2idbzrkmdk',
      );
    });

    test('the resource is in the account of the ARN', () => {
      expect(portfolio.env.account).toEqual('123456789012');
    });

    test('the resource is in the region of the ARN', () => {
      expect(portfolio.env.region).toEqual('us-west-2');
    });

    test('throws an exception when passed an ARN without the resourceName segment', () => {
      expect(() => {
        servicecatalog.Portfolio.fromPortfolioArn(stack, 'ImportedPortfolio',
          'arn:aws:catalog:us-west-2:123456789012:portfolio');
      }).toThrow(/Missing required Portfolio ID from Portfolio ARN: arn:aws:catalog:us-west-2:123456789012:portfolio/);
    });
  });
});

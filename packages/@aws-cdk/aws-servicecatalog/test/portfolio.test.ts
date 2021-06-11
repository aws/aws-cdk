import '@aws-cdk/assert-internal/jest';
import { AccountRootPrincipal, Group, Role, User } from '@aws-cdk/aws-iam';
import { App, Stack, Tags } from '@aws-cdk/core';
import { AcceptLanguage, Portfolio } from '../lib';

describe('Portfolio', () => {

  test('default portfolio creation', () => {
    const app = new App();
    const stack = new Stack(app);

    new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyPortfolio59CCA9C9: {
          Type: 'AWS::ServiceCatalog::Portfolio',
          Properties: {
            DisplayName: 'testPortfolio',
            ProviderName: 'testProvider',
          },
        },
      },
    });
  }),

  test('portfolio with explicit acceptLanguage and description', () => {
    const app = new App();
    const stack = new Stack(app);

    new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
      description: 'test portfolio description',
      acceptLanguage: AcceptLanguage.ZH,
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyPortfolio59CCA9C9: {
          Type: 'AWS::ServiceCatalog::Portfolio',
          Properties: {
            DisplayName: 'testPortfolio',
            ProviderName: 'testProvider',
            Description: 'test portfolio description',
            AcceptLanguage: AcceptLanguage.ZH,
          },
        },
      },
    });
  }),

  test('portfolio with tags', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
      description: 'test portfolio description',
    });

    Tags.of(portfolio).add('myTestKey1', 'myTestKeyValue1');
    Tags.of(portfolio).add('myTestKey2', 'myTestKeyValue2');

    expect(stack).toMatchTemplate({
      Resources: {
        MyPortfolio59CCA9C9: {
          Type: 'AWS::ServiceCatalog::Portfolio',
          Properties: {
            DisplayName: 'testPortfolio',
            ProviderName: 'testProvider',
            Description: 'test portfolio description',
            Tags: [
              {
                Key: 'myTestKey1',
                Value: 'myTestKeyValue1',
              },
              {
                Key: 'myTestKey2',
                Value: 'myTestKeyValue2',
              },
            ],
          },
        },
      },
    });
  }),

  test('portfolio from arn', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = Portfolio.fromPortfolioArn(stack, 'MyPortfolio', 'arn:aws:catalog:region:account-id:portfolio/port-djh8932wr');

    expect(portfolio.portfolioId).toEqual('port-djh8932wr');
  }),

  test('fails portfolio from arn without resource name in arn', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => {
      Portfolio.fromPortfolioArn(stack, 'MyPortfolio', 'arn:aws:catalog:region:account-id:portfolio');
    }).toThrowError(/Missing required Portfolio ID from Portfolio ARN/);
  }),

  test('portfolio share', () => {
    const app = new App();
    const stack = new Stack(app);
    const shareAccountId = '012345678901';

    const p = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    p.share(shareAccountId);

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioShare', {
      AccountId: shareAccountId,
    });
  }),

  test('portfolio share with share tagOptions', () => {
    const app = new App();
    const stack = new Stack(app);
    const shareAccountId = '012345678901';

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    portfolio.share(shareAccountId, {
      shareTagOptions: true,
      acceptLanguage: AcceptLanguage.EN,
    });

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioShare', {
      AccountId: shareAccountId,
      ShareTagOptions: true,
      AcceptLanguage: 'en',
    });
  }),

  test('portfolio share without share tagOptions', () => {
    const app = new App();
    const stack = new Stack(app);
    const shareAccountId = '012345678901';

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    portfolio.share(shareAccountId, { shareTagOptions: false });

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioShare', {
      AccountId: shareAccountId,
      ShareTagOptions: false,
    });
  }),

  test('portfolio share without explicit share tagOptions', () => {
    const app = new App();
    const stack = new Stack(app);
    const shareAccountId = '012345678901';

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    portfolio.share(shareAccountId);

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioShare', {
      AccountId: shareAccountId,
    });
  }),

  test('portfolio principal association with role type', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    const role = new Role(stack, 'TestRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    portfolio.giveAccessToRole(role);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {});
  }),

  test('portfolio principal association with user type', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    const user = new User(stack, 'TestUser', {});

    portfolio.giveAccessToUser(user);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {});
  }),

  test('portfolio principal association with group type', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      name: 'testPortfolio',
      provider: 'testProvider',
    });

    const group = new Group(stack, 'TestGroup', {});

    portfolio.giveAccessToGroup(group);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {});
  }),

  test('fails portfolio creation with invalid name', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => {
      new Portfolio(stack, 'MyPortfolio', {
        name: '',
        provider: 'testProvider',
      });
    }).toThrowError(/Invalid portfolio name length/);
  }),

  test('fails portfolio creation with invalid provider name', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => {
      new Portfolio(stack, 'MyPortfolio', {
        name: 'testPortfolio',
        provider: '',
      });
    }).toThrowError(/Invalid provider name length/);
  }),

  test('fails portfolio creation with invalid description length', () => {
    const stack = new Stack();
    const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit'.repeat(50);

    expect(() => {
      new Portfolio(stack, 'MyPortfolio', {
        name: 'testPortfolio',
        provider: 'testProvider',
        description: description,
      });
    }).toThrowError(/Invalid description length/);
  });
});

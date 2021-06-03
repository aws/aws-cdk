import '@aws-cdk/assert-internal/jest';
import { AccountRootPrincipal, Group, Role, User } from '@aws-cdk/aws-iam';
import { Topic } from '@aws-cdk/aws-sns';
import { App, Stack, Tag } from '@aws-cdk/core';
import { AcceptLanguage, Portfolio, Product } from '../lib';


/* eslint-disable quote-props */
describe('Portfolio', () => {

  test('default portfolio creation', () => {
    const app = new App();
    const stack = new Stack(app);

    new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
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
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
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

    const tag1 = new Tag('myTestKey1', 'myTestKeyValue1');
    const tag2 = new Tag('myTestKey2', 'myTestKeyValue2');

    new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
      description: 'test portfolio description',
      tags: [tag1, tag2],
    });

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

  test('portfolio from attributes', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = Portfolio.fromPortfolioAttributes(stack, 'MyPortfolio', {
      portfolioArn: 'arn:aws:catalog:region:account-id:portfolio/port-djh8932wr',
      portfolioName: 'MyPortfolio',
    });

    expect(portfolio.portfolioArn).toEqual('arn:aws:catalog:region:account-id:portfolio/port-djh8932wr');
  }),

  test('portfolio share', () => {
    const app = new App();
    const stack = new Stack(app);
    const shareAccountId = '012345678901';

    const p = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
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
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const shareTagOptions = true;

    portfolio.share(shareAccountId, shareTagOptions);

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioShare', {
      AccountId: shareAccountId,
      ShareTagOptions: true,
    });
  }),


  test('portfolio principal association with role type', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const role = new Role(stack, 'TestRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    portfolio.giveAccess(role);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {});
  }),

  test('portfolio principal association with user type', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const user = new User(stack, 'TestUser', {
    });

    portfolio.giveAccess(user);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {});
  }),

  test('portfolio principal association with group type', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const group = new Group(stack, 'TestGroup', {
    });

    portfolio.giveAccess(group);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {});
  }),

  test('portfolio product association', () => {
    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct1', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    portfolio.addProduct(product);

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioProductAssociation', {});
  }),

  test('portfolio with multiple product associations', () => {
    const app = new App();
    const stack = new Stack(app, 'portfolioWithMultipleProductAssociations');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct1', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const product2 = new Product(stack, 'MyProduct2', {
      productName: 'testProduct2',
      owner: 'testOwner2',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    portfolio.addProduct(product);
    portfolio.addProduct(product2);

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioProductAssociation', {
      PortfolioId: {
        'Ref': 'MyPortfolio59CCA9C9',
      },
      ProductId: {
        'Ref': 'MyProduct130E4C675',
      },
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioProductAssociation', {
      PortfolioId: {
        'Ref': 'MyPortfolio59CCA9C9',
      },
      ProductId: {
        'Ref': 'MyProduct2CA351636',
      },
    });

  }),

  test('multiple portfolio same product association', () => {
    const app = new App();
    const stack = new Stack(app, 'multiplePortfoliosSameProduct');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const portfolio2 = new Portfolio(stack, 'MyPortfolio2', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });


    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    portfolio.addProduct(product);
    portfolio2.addProduct(product);

    expect(stack).toMatchTemplate({
      Resources: {
        MyPortfolio59CCA9C9: {
          Type: 'AWS::ServiceCatalog::Portfolio',
          Properties: {
            DisplayName: 'testPortfolio',
            ProviderName: 'testProvider',
          },
        },
        MyPortfolioPortfolioProductAssociationaa221f0dae8e5996165b29fcb041c611AB8E6405: {
          Type: 'AWS::ServiceCatalog::PortfolioProductAssociation',
          Properties: {
            PortfolioId: {
              'Ref': 'MyPortfolio59CCA9C9',
            },
            ProductId: {
              'Ref': 'MyProduct49A3C587',
            },
          },
        },
        MyPortfolio26425F3A8: {
          Type: 'AWS::ServiceCatalog::Portfolio',
          Properties: {
            DisplayName: 'testPortfolio',
            ProviderName: 'testProvider',
          },
        },
        MyPortfolio2PortfolioProductAssociationdd95a83e7ee850c959f9fb1a9b5af6a73292AF9B: {
          Type: 'AWS::ServiceCatalog::PortfolioProductAssociation',
          Properties: {
            PortfolioId: {
              'Ref': 'MyPortfolio26425F3A8',
            },
            ProductId: {
              'Ref': 'MyProduct49A3C587',
            },
          },
        },
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

  test('portfolio product with multiple association only adds once', () => {

    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });


    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    portfolio.addProduct(product);
    portfolio.addProduct(product);

    expect(stack).toMatchTemplate({
      Resources: {
        MyPortfolio59CCA9C9: {
          Type: 'AWS::ServiceCatalog::Portfolio',
          Properties: {
            DisplayName: 'testPortfolio',
            ProviderName: 'testProvider',
          },
        },
        MyPortfolioPortfolioProductAssociation4e3fc8b48724e1e211c8ba4697d6344817BFD633: {
          Type: 'AWS::ServiceCatalog::PortfolioProductAssociation',
          Properties: {
            PortfolioId: {
              'Ref': 'MyPortfolio59CCA9C9',
            },
            ProductId: {
              'Ref': 'MyProduct49A3C587',
            },
          },
        },
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

  test('portfolio with tag options', () => {

    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const tagOptions = {
      Key1: [
        { value: 'val1' },
        { value: 'val2' },
        { value: 'val3' },
      ],
      Key2: [{ value: 'val' }],
    };

    portfolio.addTagOptions(tagOptions);

    const tagOptions2 = {
      Key2: [{ value: 'val1' }],
    };

    portfolio.addTagOptions(tagOptions2);

    expect(stack).toHaveResource('AWS::ServiceCatalog::TagOptionAssociation', {});
  }),

  // Constraints
  test('portfolio with allow tag updates (resource update constraint)', () => {

    const app = new App();
    const stack = new Stack(app, 'allowTagUpdates');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });
    portfolio.addProduct(product);
    portfolio.allowTagUpdates({ product: product });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::ResourceUpdateConstraint', {});

  }),

  test('portfolio with allow tag updates (resource update constraint) still creates without explicit association', () => {

    const app = new App();
    const stack = new Stack(app, 'allowTagUpdatesWithoutAssociation');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const description = 'resource update constraint and cast parameters';

    portfolio.allowTagUpdates({
      product: product,
      acceptLanguage: AcceptLanguage.JP,
      description: description,
      tagUpdateOnProvisionedProductAllowed: false,
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::ResourceUpdateConstraint', {
      AcceptLanguage: 'jp',
      Description: description,
      TagUpdateOnProvisionedProduct: 'NOT_ALLOWED',

    });

  }),

  test('fails to create multiple tagupdates (resource update constraint)', () => {

    const app = new App();
    const stack = new Stack(app, 'failsMultipleTagUpdates');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const description = 'resource update constraint and cast parameters';

    portfolio.allowTagUpdates({
      product: product,
      acceptLanguage: AcceptLanguage.JP,
      description: description,
      tagUpdateOnProvisionedProductAllowed: false,
    });


    expect(() => {
      portfolio.allowTagUpdates({
        product: product,
        tagUpdateOnProvisionedProductAllowed: true,
      });
    }).toThrowError(/Cannot have multiple resource update constraints/);


  }),

  test('portfolio with launch role constraint', () => {

    const app = new App();
    const stack = new Stack(app, 'launchRole');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const launchRole = new Role(stack, 'LaunchRole', {
      assumedBy: new AccountRootPrincipal(),
    });


    portfolio.addProduct(product);

    const description = 'test description for launch role';

    portfolio.addLaunchRole({
      role: launchRole,
      product: product,
      acceptLanguage: AcceptLanguage.EN,
      description: description,
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::LaunchRoleConstraint', {
      AcceptLanguage: 'en',
      Description: description,
    });


  }),

  test('portfolio with launch role constraints will still create without explicit association', () => {

    const app = new App();
    const stack = new Stack(app, 'launchRoleWithoutAssociation');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const launchRole = new Role(stack, 'LaunchRole', {
      assumedBy: new AccountRootPrincipal(),
    });


    portfolio.addLaunchRole({ role: launchRole, product: product });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::LaunchRoleConstraint', {});

  }),

  test('fails if two launch roles are added to a portfolio-product association', () => {

    const app = new App();
    const stack = new Stack(app, 'addTwoLaunchRoles');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const launchRole = new Role(stack, 'LaunchRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const launchRole2 = new Role(stack, 'LaunchRole2', {
      assumedBy: new AccountRootPrincipal(),
    });

    portfolio.addLaunchRole({ role: launchRole, product: product });

    expect(() => {
      portfolio.addLaunchRole({ role: launchRole2, product: product });
    }).toThrowError(`Cannot have multiple launch or stackset constraints on association ${portfolio.portfolioName}-${product.productName}`);
  }),

  test('portfolio with launch notification constraint', () => {

    const app = new App();
    const stack = new Stack(app, 'launchNotification');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    portfolio.addProduct(product);

    const topics = [new Topic(stack, 'topic1'), new Topic(stack, 'topic2'), new Topic(stack, 'topic3')];

    portfolio.addEventNotifications({ snsTopics: topics, product: product });

    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchNotificationConstraint', {});

  }),

  test('portfolio with launch notification constraint will still add without explicit association', () => {

    const app = new App();
    const stack = new Stack(app, 'launcConstraintWithoutAssociation');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const topics = [new Topic(stack, 'topic1'), new Topic(stack, 'topic2'), new Topic(stack, 'topic3')];

    portfolio.addEventNotifications({ snsTopics: topics, product: product });

    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchNotificationConstraint', {});
  }),

  test('fails to create notification constraint with empty topic list', () => {

    const app = new App();
    const stack = new Stack(app);

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });


    expect(() => {
      portfolio.addEventNotifications({ snsTopics: [], product: product });
    }).toThrowError(`No topics provided for launch notifications for association ${portfolio.portfolioName}-${product.productName}`);
  }),


  test('portfolio with stackset constraint', () => {

    const app = new App();
    const stack = new Stack(app, 'stacksetConstraint');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });


    portfolio.addProduct(product);

    const accountList = ['012345678901',
      '012345678902',
      '012345678903'];

    const regionList = ['us-west-1',
      'us-east-1',
      'us-west-2',
      'us-east-1'];

    const adminRole = new Role(stack, 'AdminRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const executionRole = new Role(stack, 'ExecutionRole', {
      assumedBy: new AccountRootPrincipal(),
    });


    portfolio.addStackSetConstraint({
      accountList: accountList,
      adminRole: adminRole,
      executionRole: executionRole,
      product: product,
      regionList: regionList,
    });

    expect(stack).toHaveResource('AWS::ServiceCatalog::StackSetConstraint', {});


  }),

  test('portfolio still adds stackset constraint without explicit association', () => {

    const app = new App();
    const stack = new Stack(app, 'StacksetWithoutAssociation');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    const accountList = ['012345678901',
      '012345678902',
      '012345678903'];

    const regionList = ['us-west-1',
      'us-east-1',
      'us-west-2',
      'us-east-1'];

    const adminRole = new Role(stack, 'AdminRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const executionRole = new Role(stack, 'ExectutionRole', {
      assumedBy: new AccountRootPrincipal(),
    });


    portfolio.addStackSetConstraint({
      accountList: accountList,
      adminRole: adminRole,
      executionRole: executionRole,
      product: product,
      regionList: regionList,
    });

    expect(stack).toHaveResource('AWS::ServiceCatalog::StackSetConstraint', {});
  }),

  test('fails to create launch template constraint with empty rules', () => {

    const app = new App();
    const stack = new Stack(app, 'laucnTemplateWithNoRulesFails');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });


    portfolio.addProduct(product);


    expect(() => {
      portfolio.addProvisioningRules({
        product: product,
      });
    }).toThrowError(`No rules provided for provisioning for association ${portfolio.portfolioName}-${product.productName}`);
  }),

  test('portfolio still adds launch template constraint without explicit association', () => {

    const app = new App();
    const stack = new Stack(app, 'launchTemplateWithoutAssociation');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });

    portfolio.addProvisioningRules({
      acceptLanguage: AcceptLanguage.EN,
      product: product,
      description: 'adding provisioning rules without explicit association',
      rules: {
        'Rule1': {
          'Assertions': [
            {
              'Assert': { 'Fn::Contains': [['t2.micro', 't2.small'], { 'Ref': 'InstanceType' }] },
              'AssertDescription': 'Instance type should be t2.micro or t2.small',
            },
          ],
        },
      },
    });

    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchTemplateConstraint', {});

  }),

  test('fails to create multiple stackset constraints', () => {

    const app = new App();
    const stack = new Stack(app, 'multipleStackSetConstraint');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const product = new Product(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
    });


    const accountList = ['012345678901',
      '012345678902',
      '012345678903'];

    const regionList = ['us-west-1',
      'us-east-1',
      'us-west-2',
      'us-east-1'];

    const adminRole = new Role(stack, 'AdminRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const executionRole = new Role(stack, 'ExecutionRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const description = 'stackset constraint test description';
    portfolio.addStackSetConstraint({
      accountList: accountList,
      adminRole: adminRole,
      executionRole: executionRole,
      product: product,
      regionList: regionList,
      description: description,
    });

    const newAccountList = [
      '000000000000',
      '111111111111',
    ];

    expect(() => {
      portfolio.addStackSetConstraint({
        accountList: newAccountList,
        adminRole: adminRole,
        executionRole: executionRole,
        product: product,
        regionList: regionList,
      });
    }).toThrowError(`Cannot have multiple launch or stackset constraints on association ${portfolio.portfolioName}-${product.productName}`);
  }),

  test('fails portfolio creation with invalid name', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => {
      new Portfolio(stack, 'MyPortfolio', {
        portfolioName: '',
        providerName: 'testProvider',
      });
    }).toThrowError(/Invalid portfolioName length/);
  }),

  test('fails portfolio creationg with invalid provider name', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => {
      new Portfolio(stack, 'MyPortfolio', {
        portfolioName: 'testPortfolio',
        providerName: '',
      });
    }).toThrowError(/Invalid providerName length/);
  }),

  test('fails portfolio creatio with invalid description length', () => {

    const stack = new Stack();
    const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit'.repeat(50);

    expect(() => {
      new Portfolio(stack, 'MyPortfolio', {
        portfolioName: 'testPortfolio',
        providerName: 'testProvider',
        description: description,
      });
    }).toThrowError(/Invalid description length/);
  }),

  test('fails to add invalid tagOption with invalid key', () => {

    const stack = new Stack();

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const tagOptions = {
      '': [
        { value: 'val1' },
        { value: 'val2' },
        { value: 'val3' },
      ],
    };

    expect(() => {
      portfolio.addTagOptions(tagOptions);
    }).toThrowError(/Invalid key length/);
  });


  test('fails to add tagOption with invalid value', () => {

    const app = new App();
    const stack = new Stack(app, 'invalidTagOptionValue');

    const portfolio = new Portfolio(stack, 'MyPortfolio', {
      portfolioName: 'testPortfolio',
      providerName: 'testProvider',
    });

    const tagOptions = {
      Key1: [
        { value: '' },
        { value: 'val2' },
        { value: 'val3' },
      ],
    };

    expect(() => {
      portfolio.addTagOptions(tagOptions);
    }).toThrowError(/Invalid value length/);
  });
});


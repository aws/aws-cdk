import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

describe('Portfolio', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('portfolio creation and importing', () => {
    test('default portfolio creation', () => {
      new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
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

    test('portfolio with explicit message language and description', () => {
      new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
        description: 'test portfolio description',
        messageLanguage: servicecatalog.MessageLanguage.ZH,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::Portfolio', {
        Description: 'test portfolio description',
        AcceptLanguage: servicecatalog.MessageLanguage.ZH,
      });
    }),

    test('portfolio from arn', () => {
      const portfolio = servicecatalog.Portfolio.fromPortfolioArn(stack, 'MyPortfolio', 'arn:aws:catalog:region:account-id:portfolio/port-djh8932wr');

      expect(portfolio.portfolioId).toEqual('port-djh8932wr');
    }),

    test('fails portfolio from arn without resource name in arn', () => {
      expect(() => {
        servicecatalog.Portfolio.fromPortfolioArn(stack, 'MyPortfolio', 'arn:aws:catalog:region:account-id:portfolio');
      }).toThrowError(/Missing required Portfolio ID from Portfolio ARN/);
    }),

    test('fails portfolio creation with short name', () => {
      expect(() => {
        new servicecatalog.Portfolio(stack, 'MyPortfolio', {
          displayName: '',
          providerName: 'testProvider',
        });
      }).toThrowError(/Invalid portfolio display name for resource Default\/MyPortfolio/);
    }),

    test('fails portfolio creation with long name', () => {
      expect(() => {
        new servicecatalog.Portfolio(stack, 'MyPortfolio', {
          displayName: 'DisplayName'.repeat(1000),
          providerName: 'testProvider',
        });
      }).toThrowError(/Invalid portfolio display name for resource Default\/MyPortfolio/);
    }),

    test('fails portfolio creation with invalid provider name', () => {
      expect(() => {
        new servicecatalog.Portfolio(stack, 'MyPortfolio', {
          displayName: 'testPortfolio',
          providerName: '',
        });
      }).toThrowError(/Invalid portfolio provider name for resource Default\/MyPortfolio/);
    }),

    test('fails portfolio creation with invalid description length', () => {
      const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit'.repeat(50);

      expect(() => {
        new servicecatalog.Portfolio(stack, 'MyPortfolio', {
          displayName: 'testPortfolio',
          providerName: 'testProvider',
          description: description,
        });
      }).toThrowError(/Invalid portfolio description for resource Default\/MyPortfolio/);
    }),

    test('portfolio creation with token description does not throw validation error and creates', () => {
      const tokenDescription = new cdk.CfnParameter(stack, 'Description');

      new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
        description: tokenDescription.valueAsString,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::Portfolio', {
        Description: {
          Ref: 'Description',
        },
      });
    }),

    test('portfolio creation with token display name does not throw validation error and creates', () => {
      const tokenDisplayName = new cdk.CfnParameter(stack, 'DisplayName');

      new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: tokenDisplayName.valueAsString,
        providerName: 'testProvider',
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::Portfolio', {
        DisplayName: {
          Ref: 'DisplayName',
        },
      });
    }),

    test('portfolio creation with token provider name does not throw validation error and creates', () => {
      const tokenProviderName = new cdk.CfnParameter(stack, 'ProviderName');

      new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: tokenProviderName.valueAsString,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::Portfolio', {
        ProviderName: {
          Ref: 'ProviderName',
        },
      });
    });
  });

  describe('portfolio methods and associations', () => {
    let portfolio: servicecatalog.Portfolio;

    beforeEach(() => {
      portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });
    });

    test('portfolio with tags', () => {
      cdk.Tags.of(portfolio).add('myTestKey1', 'myTestKeyValue1');
      cdk.Tags.of(portfolio).add('myTestKey2', 'myTestKeyValue2');

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::Portfolio', {
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
      });
    }),

    test('portfolio share', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId);

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
      });
    }),

    test('portfolio share with share tagOptions', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId, {
        shareTagOptions: true,
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
        ShareTagOptions: true,
        AcceptLanguage: 'en',
      });
    }),

    test('portfolio share without share tagOptions', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId, { shareTagOptions: false });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
        ShareTagOptions: false,
      });
    }),

    test('portfolio share without explicit share tagOptions', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId);

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
      });
    }),

    test('portfolio principal association with role type', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.AccountRootPrincipal(),
      });

      portfolio.giveAccessToRole(role);

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {
        PrincipalARN: { 'Fn::GetAtt': ['TestRole6C9272DF', 'Arn'] },
      });
    }),

    test('portfolio principal association with user type', () => {
      const user = new iam.User(stack, 'TestUser');

      portfolio.giveAccessToUser(user);

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {
        PrincipalARN: { 'Fn::GetAtt': ['TestUser6A619381', 'Arn'] },
      });
    }),

    test('portfolio principal association with group type', () => {
      const group = new iam.Group(stack, 'TestGroup');

      portfolio.giveAccessToGroup(group);

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {
        PrincipalARN: { 'Fn::GetAtt': ['TestGroupAF88660E', 'Arn'] },
      });
    }),

    test('portfolio duplicate principle associations are idempotent', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.AccountRootPrincipal(),
      });

      // If this were not idempotent, the second call would produce an error for duplicate construct ID.
      portfolio.giveAccessToRole(role);
      portfolio.giveAccessToRole(role);
    });
  });
});

describe('portfolio associations and product constraints', () => {
  let stack: cdk.Stack;
  let portfolio: servicecatalog.Portfolio;
  let product: servicecatalog.CloudFormationProduct;

  beforeEach(() => {
    stack = new cdk.Stack();

    portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolio', {
      displayName: 'testPortfolio',
      providerName: 'testProvider',
    });

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

  test('basic portfolio product association', () => {
    portfolio.addProduct(product);

    expect(stack).toHaveResource('AWS::ServiceCatalog::PortfolioProductAssociation');
  });

  test('portfolio product associations are idempotent', () => {
    portfolio.addProduct(product);
    portfolio.addProduct(product); // If not idempotent these calls should fail

    expect(stack).toCountResources('AWS::ServiceCatalog::PortfolioProductAssociation', 1); //check anyway
  }),

  test('add tag options to portfolio', () => {
    const tagOptions = new servicecatalog.TagOptions({
      key1: ['value1', 'value2'],
      key2: ['value1'],
    });

    portfolio.associateTagOptions(tagOptions);

    expect(stack).toCountResources('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
    expect(stack).toHaveResource('AWS::ServiceCatalog::TagOptionAssociation');
  }),

  test('add tag options to portfolio as prop', () => {
    const tagOptions = new servicecatalog.TagOptions({
      key1: ['value1', 'value2'],
      key2: ['value1'],
    });

    portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolioWithTag', {
      displayName: 'testPortfolio',
      providerName: 'testProvider',
      tagOptions: tagOptions,
    });

    expect(stack).toCountResources('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
    expect(stack).toHaveResource('AWS::ServiceCatalog::TagOptionAssociation');
  }),

  test('adding identical tag options to portfolio is idempotent', () => {
    const tagOptions1 = new servicecatalog.TagOptions({
      key1: ['value1', 'value2'],
      key2: ['value1'],
    });

    const tagOptions2 = new servicecatalog.TagOptions({
      key1: ['value1', 'value2'],
    });

    portfolio.associateTagOptions(tagOptions1);
    portfolio.associateTagOptions(tagOptions2); // If not idempotent this would fail

    expect(stack).toCountResources('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
    expect(stack).toHaveResource('AWS::ServiceCatalog::TagOptionAssociation');
  }),

  test('fails to add tag options with invalid minimum key length', () => {
    const tagOptions = new servicecatalog.TagOptions({
      '': ['value1', 'value2'],
      'key2': ['value1'],
    });
    expect(() => {
      portfolio.associateTagOptions(tagOptions);
    }).toThrowError(/Invalid TagOption key for resource/);
  });

  test('fails to add tag options with invalid maxium key length', () => {
    const tagOptions = new servicecatalog.TagOptions({
      ['key1'.repeat(1000)]: ['value1', 'value2'],
      key2: ['value1'],
    });
    expect(() => {
      portfolio.associateTagOptions(tagOptions);
    }).toThrowError(/Invalid TagOption key for resource/);
  }),

  test('fails to add tag options with invalid value length', () => {
    const tagOptions = new servicecatalog.TagOptions({
      key1: ['value1'.repeat(1000), 'value2'],
      key2: ['value1'],
    });
    expect(() => {
      portfolio.associateTagOptions(tagOptions);
    }).toThrowError(/Invalid TagOption value for resource/);
  }),

  test('add tag update constraint', () => {
    portfolio.addProduct(product);
    portfolio.constrainTagUpdates(product, {
      allow: true,
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::ResourceUpdateConstraint', {
      TagUpdateOnProvisionedProduct: 'ALLOWED',
    });
  });

  test('tag update constraint still adds without explicit association', () => {
    portfolio.constrainTagUpdates(product, {
      messageLanguage: servicecatalog.MessageLanguage.EN,
      description: 'test constraint description',
      allow: false,
    });

    expect(stack).toHaveResourceLike('AWS::ServiceCatalog::ResourceUpdateConstraint', {
      AcceptLanguage: servicecatalog.MessageLanguage.EN,
      Description: 'test constraint description',
      TagUpdateOnProvisionedProduct: 'NOT_ALLOWED',
    });
  }),

  test('fails to add multiple tag update constraints', () => {
    portfolio.constrainTagUpdates(product, {
      description: 'test constraint description',
    });

    expect(() => {
      portfolio.constrainTagUpdates(product, {
        allow: false,
        description: 'another test constraint description',
      });
    }).toThrowError(/Cannot have multiple tag update constraints for association/);
  }),

  test('add event notification constraint', () => {
    portfolio.addProduct(product);

    const topic = new sns.Topic(stack, 'Topic');
    const description = 'event notification constraint description';

    portfolio.notifyOnStackEvents(product, topic, {
      description: description,
    });

    expect(stack).toHaveResource('AWS::ServiceCatalog::LaunchNotificationConstraint', {
      NotificationArns: [{ Ref: 'TopicBFC7AF6E' }],
      Description: description,
      PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
      ProductId: { Ref: 'MyProduct49A3C587' },
    });
  }),

  test('event notification constraint will still add without explicit association', () => {
    const topic = new sns.Topic(stack, 'Topic1');

    portfolio.notifyOnStackEvents(product, topic);

    expect(stack).toCountResources('AWS::ServiceCatalog::LaunchNotificationConstraint', 1);
  }),

  test('can add multiple notifications', () => {
    const topic1 = new sns.Topic(stack, 'Topic1');
    const topic2 = new sns.Topic(stack, 'Topic2');
    const topic3 = new sns.Topic(stack, 'Topic3');

    portfolio.notifyOnStackEvents(product, topic1);
    portfolio.notifyOnStackEvents(product, topic2);
    portfolio.notifyOnStackEvents(product, topic3);

    expect(stack).toCountResources('AWS::ServiceCatalog::LaunchNotificationConstraint', 3);
  }),

  test('fails to add same topic multiple times in event notification constraint', () => {
    const topic = new sns.Topic(stack, 'Topic1');

    portfolio.notifyOnStackEvents(product, topic);

    expect(() => {
      portfolio.notifyOnStackEvents(product, topic);
    }).toThrowError(`Topic ${topic} is already subscribed to association`);
  });

  describe('portfolio constraints that have roles', () => {
    let launchRole: iam.IRole, adminRole: iam.IRole;
    beforeEach(() => {
      adminRole = new iam.Role(stack, 'AdminRole', {
        assumedBy: new iam.AccountRootPrincipal(),
      });
      launchRole = new iam.Role(stack, 'LaunchRole', {
        assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
      });
    }),

    test('set a launch role constraint', () => {
      portfolio.addProduct(product);

      portfolio.setLaunchRole(product, launchRole, {
        description: 'set launch role description',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::LaunchRoleConstraint', {
        PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
        ProductId: { Ref: 'MyProduct49A3C587' },
        Description: 'set launch role description',
        AcceptLanguage: 'en',
        RoleArn: {
          'Fn::GetAtt': ['LaunchRole2CFB2E44', 'Arn'],
        },
      });
    }),

    test('set launch role constraint still adds without explicit association', () => {
      portfolio.setLaunchRole(product, launchRole);

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::LaunchRoleConstraint');
    }),

    test('fails to add multiple set launch roles', () => {
      const otherLaunchRole = new iam.Role(stack, 'otherLaunchRole', {
        assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
      });

      portfolio.setLaunchRole(product, launchRole);

      expect(() => {
        portfolio.setLaunchRole(product, otherLaunchRole);
      }).toThrowError(/Cannot set multiple launch roles for association/);
    }),

    test('fails to set launch role if stackset rule is already defined', () => {
      portfolio.deployWithStackSets(product, {
        accounts: ['012345678901', '012345678901'],
        regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
        adminRole: adminRole,
        executionRoleName: 'StackSetExecutionRole',
        allowStackSetInstanceOperations: false,
      },
      );

      expect(() => {
        portfolio.setLaunchRole(product, launchRole);
      }).toThrowError(/Cannot set launch role when a StackSet rule is already defined for association/);
    }),

    test('deploy with stacksets constraint', () => {
      portfolio.addProduct(product);

      portfolio.deployWithStackSets(product, {
        accounts: ['012345678901', '012345678901'],
        regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
        adminRole: adminRole,
        executionRoleName: 'StackSetExecutionRole',
        description: 'stackset description',
        messageLanguage: servicecatalog.MessageLanguage.JP,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::StackSetConstraint', {
        PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
        ProductId: { Ref: 'MyProduct49A3C587' },
        AdminRole: {
          'Fn::GetAtt': [
            'AdminRole38563C57',
            'Arn',
          ],
        },
        ExecutionRole: 'StackSetExecutionRole',
        Description: 'stackset description',
        AccountList: ['012345678901', '012345678901'],
        RegionList: ['us-east-1', 'us-west-2', 'eu-west-1'],
        StackInstanceControl: 'NOT_ALLOWED',
        AcceptLanguage: 'jp',
      });
    }),

    test('deployment with stacksets still adds without explicit association', () => {
      portfolio.deployWithStackSets(product, {
        accounts: ['012345678901', '012345678901'],
        regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
        adminRole: adminRole,
        executionRoleName: 'StackSetExecutionRole',
        allowStackSetInstanceOperations: true,
      });

      expect(stack).toHaveResourceLike('AWS::ServiceCatalog::StackSetConstraint');
    }),

    test('fails to add multiple deploy with stackset constraints', () => {
      portfolio.deployWithStackSets(product, {
        accounts: ['012345678901', '012345678901'],
        regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
        adminRole: adminRole,
        executionRoleName: 'StackSetsExecutionRole',
      });

      expect(() => {
        portfolio.deployWithStackSets(product, {
          accounts: ['012345678901', '012345678901'],
          regions: ['ap-east-1', 'ap-northeast-2', 'eu-west-1'],
          adminRole: adminRole,
          executionRoleName: 'StackSetExecutionRole',
        });
      }).toThrowError(/Cannot configure multiple StackSet deployment constraints for association/);
    }),

    test('fails to configure deployment with stacksets if a launch role has been set', () => {
      portfolio.setLaunchRole(product, launchRole);

      expect(() => {
        portfolio.deployWithStackSets(product, {
          accounts: ['012345678901', '012345678901'],
          regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
          adminRole: adminRole,
          executionRoleName: 'StackSetExecutionRole',
          allowStackSetInstanceOperations: true,
        });
      }).toThrowError(/Cannot configure StackSet deployment when a launch role is already defined for association/);
    });
  });
});
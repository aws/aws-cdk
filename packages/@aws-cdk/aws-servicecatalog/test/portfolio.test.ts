import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

describe('Portfolio', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
  });

  describe('portfolio creation and importing', () => {
    test('default portfolio creation', () => {
      new servicecatalog.Portfolio(stack, 'MyPortfolio', {
        displayName: 'testPortfolio',
        providerName: 'testProvider',
      });

      Template.fromStack(stack).templateMatches({
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::Portfolio', {
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

    test('portfolio arn formatting', () => {
      const portfolio = new servicecatalog.Portfolio(stack, 'Portfolio', {
        displayName: 'MyPortfolio',
        providerName: 'testProvider',
      });
      expect(portfolio.portfolioArn).toEqual(`arn:${stack.partition}:catalog:${stack.region}:${stack.account}:portfolio/${portfolio.portfolioId}`);
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::Portfolio', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::Portfolio', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::Portfolio', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::Portfolio', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
      });
    }),

    test('portfolio share with assets', () => {
      const assetBucket = new s3.Bucket(stack, 'MyProductStackAssetBucket', {
        bucketName: 'test-asset-bucket',
      });

      const productStack = new servicecatalog.ProductStack(stack, 'MyProductStack', {
      });

      const product = new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          {
            productVersionName: 'v1',
            cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(productStack),
          },
        ],
      });

      product.assetBuckets.push(assetBucket);

      const shareAccountId = '012345678901';

      portfolio.addProduct(product);
      portfolio.shareWithAccount(shareAccountId);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'test-asset-bucket',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::012345678901:root',
                  ],
                ],
              },
            },
          }],
        },
      });
    }),

    test('portfolio share with share tagOptions', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId, {
        shareTagOptions: true,
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
        ShareTagOptions: true,
        AcceptLanguage: 'en',
      });
    }),

    test('portfolio share without share tagOptions', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId, { shareTagOptions: false });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
        ShareTagOptions: false,
      });
    }),

    test('portfolio share without explicit share tagOptions', () => {
      const shareAccountId = '012345678901';

      portfolio.shareWithAccount(shareAccountId);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioShare', {
        AccountId: shareAccountId,
      });
    }),

    test('portfolio principal association with role type', () => {
      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.AccountRootPrincipal(),
      });

      portfolio.giveAccessToRole(role);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {
        PrincipalARN: { 'Fn::GetAtt': ['TestRole6C9272DF', 'Arn'] },
      });
    }),

    test('portfolio principal association with user type', () => {
      const user = new iam.User(stack, 'TestUser');

      portfolio.giveAccessToUser(user);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {
        PrincipalARN: { 'Fn::GetAtt': ['TestUser6A619381', 'Arn'] },
      });
    }),

    test('portfolio principal association with group type', () => {
      const group = new iam.Group(stack, 'TestGroup');

      portfolio.giveAccessToGroup(group);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::PortfolioPrincipalAssociation', {
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

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::PortfolioProductAssociation', 1);
  });

  test('portfolio product associations are idempotent', () => {
    portfolio.addProduct(product);
    portfolio.addProduct(product); // If not idempotent these calls should fail

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::PortfolioProductAssociation', 1); //check anyway
  }),

  test('add tag options to portfolio', () => {
    const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
      allowedValuesForTags: {
        key1: ['value1', 'value2'],
        key2: ['value1'],
      },
    });

    portfolio.associateTagOptions(tagOptions);

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
  }),

  test('add tag options to portfolio as prop', () => {
    const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
      allowedValuesForTags: {
        key1: ['value1', 'value2'],
        key2: ['value1'],
      },
    });

    portfolio = new servicecatalog.Portfolio(stack, 'MyPortfolioWithTag', {
      displayName: 'testPortfolio',
      providerName: 'testProvider',
      tagOptions: tagOptions,
    });

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
  }),

  test('adding tag options to portfolio multiple times is idempotent', () => {
    const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
      allowedValuesForTags: {
        key1: ['value1', 'value2'],
        key2: ['value1'],
      },
    });

    portfolio.associateTagOptions(tagOptions);
    portfolio.associateTagOptions(tagOptions); // If not idempotent this would fail

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
  }),

  test('add tag update constraint', () => {
    portfolio.addProduct(product);
    portfolio.constrainTagUpdates(product, {
      allow: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::ResourceUpdateConstraint', {
      TagUpdateOnProvisionedProduct: 'ALLOWED',
    });
  });

  test('tag update constraint still adds without explicit association', () => {
    portfolio.constrainTagUpdates(product, {
      messageLanguage: servicecatalog.MessageLanguage.EN,
      description: 'test constraint description',
      allow: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::ResourceUpdateConstraint', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::LaunchNotificationConstraint', {
      NotificationArns: [{ Ref: 'TopicBFC7AF6E' }],
      Description: description,
      PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
      ProductId: { Ref: 'MyProduct49A3C587' },
    });
  }),

  test('event notification constraint will still add without explicit association', () => {
    const topic = new sns.Topic(stack, 'Topic1');

    portfolio.notifyOnStackEvents(product, topic);

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::LaunchNotificationConstraint', 1);
  }),

  test('can add multiple notifications', () => {
    const topic1 = new sns.Topic(stack, 'Topic1');
    const topic2 = new sns.Topic(stack, 'Topic2');
    const topic3 = new sns.Topic(stack, 'Topic3');

    portfolio.notifyOnStackEvents(product, topic1);
    portfolio.notifyOnStackEvents(product, topic2);
    portfolio.notifyOnStackEvents(product, topic3);

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::LaunchNotificationConstraint', 3);
  }),

  test('fails to add same topic multiple times in event notification constraint', () => {
    const topic = new sns.Topic(stack, 'Topic1');

    portfolio.notifyOnStackEvents(product, topic);

    expect(() => {
      portfolio.notifyOnStackEvents(product, topic);
    }).toThrowError(`Topic ${topic} is already subscribed to association`);
  }),

  test('creates a CloudFormation parameters constraint', () => {
    portfolio.addProduct(product);
    portfolio.constrainCloudFormationParameters(product, {
      rule: {
        ruleName: 'Rule',
        assertions: [
          {
            assert: cdk.Fn.conditionContains(['t2.micro', 't2.small'], cdk.Fn.ref('InstanceType')),
            description: 'assert description',
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::LaunchTemplateConstraint', {
      PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
      ProductId: { Ref: 'MyProduct49A3C587' },
      Rules: JSON.stringify( {
        Rule: {
          Assertions: [
            {
              Assert: { 'Fn::Contains': [['t2.micro', 't2.small'], { Ref: 'InstanceType' }] },
              AssertDescription: 'assert description',
            },
          ],
        },
      }),
    });
  }),

  test('CloudFormation parameters constraint still creates without explicit association', () => {
    portfolio.constrainCloudFormationParameters(product, {
      rule: {
        ruleName: 'Rule',
        condition: cdk.Fn.conditionContains(['a', 'b'], 'text'),
        assertions: [
          {
            assert: cdk.Fn.conditionContains(['t2.micro', 't2.small'], cdk.Fn.ref('InstanceType')),
            description: 'assert description',
          },
        ],
      },
      description: 'test description',
      messageLanguage: servicecatalog.MessageLanguage.EN,
    });

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::LaunchTemplateConstraint', 1);
  }),

  test('set multiple CloudFormation parameters constraints', () => {
    portfolio.constrainCloudFormationParameters(product, {
      rule: {
        ruleName: 'Rule01',
        assertions: [{
          assert: cdk.Fn.conditionContains(['BucketOwnerRead'], cdk.Fn.ref('AccessControl')),
          description: 'assert description',
        }],
      },
    });

    portfolio.constrainCloudFormationParameters(product, {
      rule: {
        ruleName: 'Rule02',
        assertions: [{
          assert: cdk.Fn.conditionContains(['BucketOwnerWrite'], cdk.Fn.ref('AccessControl')),
          description: 'assert description',
        }],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::LaunchTemplateConstraint', 2);
  }),

  test('fails to set a duplicate CloudFormation parameters constraint', () => {
    portfolio.constrainCloudFormationParameters(product, {
      rule: {
        ruleName: 'Rule01',
        assertions: [{
          assert: cdk.Fn.conditionContains(['BucketOwnerRead'], cdk.Fn.ref('AccessControl')),
          description: 'assert description',
        }],
      },
    });

    expect(() => {
      portfolio.constrainCloudFormationParameters(product, {
        rule: {
          ruleName: 'Rule01',
          assertions: [{
            assert: cdk.Fn.conditionContains(['BucketOwnerWrite'], cdk.Fn.ref('AccessControl')),
            description: 'assert description',
          }],
        },
      });
    }).toThrowError(/Provisioning rule Rule01 already configured on association/);
  }),

  describe('portfolio constraints that have roles', () => {
    let launchRole: iam.IRole, adminRole: iam.IRole;
    beforeEach(() => {
      adminRole = new iam.Role(stack, 'AdminRole', {
        assumedBy: new iam.AccountRootPrincipal(),
      });
      launchRole = new iam.Role(stack, 'LaunchRole', {
        roleName: 'LaunchRole',
        assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
      });
    }),

    test('set a launch role constraint', () => {
      portfolio.addProduct(product);

      portfolio.setLaunchRole(product, launchRole, {
        description: 'set launch role description',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::LaunchRoleConstraint', {
        PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
        ProductId: { Ref: 'MyProduct49A3C587' },
        Description: 'set launch role description',
        AcceptLanguage: 'en',
        RoleArn: {
          'Fn::GetAtt': ['LaunchRole2CFB2E44', 'Arn'],
        },
      });
    }),

    test('set a launch role constraint using local role name', () => {
      portfolio.addProduct(product);

      portfolio.setLocalLaunchRoleName(product, 'LocalLaunchRole', {
        description: 'set launch role description',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::LaunchRoleConstraint', {
        PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
        ProductId: { Ref: 'MyProduct49A3C587' },
        Description: 'set launch role description',
        AcceptLanguage: 'en',
        LocalRoleName: { Ref: 'MyPortfolioLaunchRoleLocalLaunchRoleB2E6E22A' },
      });
    }),

    test('set a launch role constraint using local role', () => {
      portfolio.addProduct(product);

      portfolio.setLocalLaunchRole(product, launchRole, {
        description: 'set launch role description',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::LaunchRoleConstraint', {
        PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
        ProductId: { Ref: 'MyProduct49A3C587' },
        Description: 'set launch role description',
        AcceptLanguage: 'en',
        LocalRoleName: { Ref: 'LaunchRole2CFB2E44' },
      });
    }),

    test('set a launch role constraint using imported local role', () => {
      portfolio.addProduct(product);

      const importedLaunchRole = iam.Role.fromRoleArn(portfolio.stack, 'ImportedLaunchRole', 'arn:aws:iam::123456789012:role/ImportedLaunchRole');

      portfolio.setLocalLaunchRole(product, importedLaunchRole, {
        description: 'set launch role description',
        messageLanguage: servicecatalog.MessageLanguage.EN,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::LaunchRoleConstraint', {
        PortfolioId: { Ref: 'MyPortfolio59CCA9C9' },
        ProductId: { Ref: 'MyProduct49A3C587' },
        Description: 'set launch role description',
        AcceptLanguage: 'en',
        LocalRoleName: 'ImportedLaunchRole',
      });
    }),

    test('set launch role constraint still adds without explicit association', () => {
      portfolio.setLaunchRole(product, launchRole);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::LaunchRoleConstraint', 1);
    }),

    test('fails to add multiple set launch roles', () => {
      const otherLaunchRole = new iam.Role(stack, 'otherLaunchRole', {
        assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
      });

      portfolio.setLaunchRole(product, launchRole);

      expect(() => {
        portfolio.setLaunchRole(product, otherLaunchRole);
      }).toThrow(/Cannot set multiple launch roles for association/);
    }),

    test('local launch role must have roleName explicitly set', () => {
      const otherLaunchRole = new iam.Role(stack, 'otherLaunchRole', {
        assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
      });

      expect(() => {
        portfolio.setLocalLaunchRole(product, otherLaunchRole);
      }).toThrow(/Role otherLaunchRole used for Local Launch Role must have roleName explicitly set/);
    }),

    test('fails to add multiple set launch roles - local launch role first', () => {
      portfolio.setLocalLaunchRoleName(product, 'LaunchRole');

      expect(() => {
        portfolio.setLaunchRole(product, launchRole);
      }).toThrow(/Cannot set multiple launch roles for association/);
    }),

    test('fails to add multiple set local launch roles - local launch role first', () => {
      portfolio.setLocalLaunchRoleName(product, 'LaunchRole');

      expect(() => {
        portfolio.setLocalLaunchRole(product, launchRole);
      }).toThrow(/Cannot set multiple launch roles for association/);
    }),

    test('fails to add multiple set local launch roles - local launch role name first', () => {
      portfolio.setLocalLaunchRole(product, launchRole);

      expect(() => {
        portfolio.setLocalLaunchRoleName(product, 'LaunchRole');
      }).toThrow(/Cannot set multiple launch roles for association/);
    }),

    test('fails to add multiple set launch roles - local launch role second', () => {
      portfolio.setLaunchRole(product, launchRole);

      expect(() => {
        portfolio.setLocalLaunchRole(product, launchRole);
      }).toThrow(/Cannot set multiple launch roles for association/);
    }),

    test('fails to add multiple set launch roles - local launch role second', () => {
      portfolio.setLaunchRole(product, launchRole);

      expect(() => {
        portfolio.setLocalLaunchRoleName(product, 'LaunchRole');
      }).toThrow(/Cannot set multiple launch roles for association/);
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

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalog::StackSetConstraint', {
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

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::StackSetConstraint', 1);
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

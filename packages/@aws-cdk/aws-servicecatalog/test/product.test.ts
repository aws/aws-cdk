import * as fs from 'fs';
import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';
import { DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY } from '../lib';
import { ProductStackHistory } from '../lib/product-stack-history';

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

  test('product test from product stack history', () => {
    const productStack = new servicecatalog.ProductStack(stack, 'ProductStack');

    const productStackHistory = new ProductStackHistory(stack, 'MyProductStackHistory', {
      productStack: productStack,
      currentVersionName: 'v1',
      currentVersionLocked: false,
    });

    new sns.Topic(productStack, 'SNSTopicProductStack');

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        productStackHistory.currentVersion(),
      ],
    });

    const assembly = app.synth();
    expect(assembly.artifacts.length).toEqual(2);
    expect(assembly.stacks[0].assets.length).toBe(1);
    expect(assembly.stacks[0].assets[0].path).toEqual('ProductStack.product.template.json');

    const expectedTemplateFileKey = 'MyProductStackHistory.ProductStack.v1.product.template.json';
    const snapshotExists = fs.existsSync(path.join(DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY, expectedTemplateFileKey));
    expect(snapshotExists).toBe(true);
  }),

  test('fails product test from product stack when template changes and locked', () => {
    const productStack = new servicecatalog.ProductStack(stack, 'ProductStack');

    const productStackHistory = new ProductStackHistory(stack, 'MyProductStackHistory', {
      productStack: productStack,
      currentVersionName: 'v1',
      currentVersionLocked: true,
    });

    new sns.Topic(productStack, 'SNSTopicProductStack2');

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        productStackHistory.currentVersion(),
      ],
    });
    expect(() => {
      app.synth();
    }).toThrowError('Template has changed for ProductStack Version v1');
  }),

  test('product test from product stack history when template changes and unlocked', () => {
    const productStack = new servicecatalog.ProductStack(stack, 'ProductStack');

    const productStackHistory = new ProductStackHistory(stack, 'MyProductStackHistory', {
      productStack: productStack,
      currentVersionName: 'v1',
      currentVersionLocked: false,
    });

    new sns.Topic(productStack, 'SNSTopicProductStack2');

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        productStackHistory.currentVersion(),
      ],
    });

    const assembly = app.synth();
    expect(assembly.artifacts.length).toEqual(2);
    expect(assembly.stacks[0].assets.length).toBe(1);
    expect(assembly.stacks[0].assets[0].path).toEqual('ProductStack.product.template.json');

    const expectedTemplateFileKey = 'MyProductStackHistory.ProductStack.v1.product.template.json';
    const snapshotExists = fs.existsSync(path.join(DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY, expectedTemplateFileKey));
    expect(snapshotExists).toBe(true);
  }),

  test('product test from product stack history snapshot', () => {
    const productStack = new servicecatalog.ProductStack(stack, 'ProductStack');

    const productStackHistory = new ProductStackHistory(stack, 'MyProductStackHistory', {
      productStack: productStack,
      currentVersionName: 'v2',
      currentVersionLocked: false,
    });

    new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
      productName: 'testProduct',
      owner: 'testOwner',
      productVersions: [
        productStackHistory.versionFromSnapshot('v1'),
      ],
    });

    const assembly = app.synth();
    expect(assembly.artifacts.length).toEqual(2);
    expect(assembly.stacks[0].assets.length).toBe(2);
    expect(assembly.stacks[0].assets[0].path).toEqual('asset.434625edc7e017d93f388b5f116c2ebcf11a38457cfb89a9b00d4e551c0bf731.json');
  }),

  test('fails product from product stack history snapshot not found', () => {
    const productStack = new servicecatalog.ProductStack(stack, 'ProductStack');

    const productStackHistory = new ProductStackHistory(stack, 'MyProductStackHistory', {
      productStack: productStack,
      currentVersionName: 'v2',
      currentVersionLocked: false,
    });

    expect(() => {
      new servicecatalog.CloudFormationProduct(stack, 'MyProduct', {
        productName: 'testProduct',
        owner: 'testOwner',
        productVersions: [
          productStackHistory.versionFromSnapshot('v3'),
        ],
      });
    }).toThrowError('Template MyProductStackHistory.ProductStack.v3.product.template.json cannot be found in product-stack-snapshots');
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
  });

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
    });

    test('add tag options to product', () => {
      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1'],
        },
      });

      product.associateTagOptions(tagOptions);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
    }),

    test('add tag options as input to product in props', () => {
      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1'],
        },
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

    test('adding tag options to product multiple times is idempotent', () => {
      const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
        allowedValuesForTags: {
          key1: ['value1', 'value2'],
          key2: ['value1'],
        },
      });

      product.associateTagOptions(tagOptions);
      product.associateTagOptions(tagOptions); // If not idempotent this would fail

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOption', 3); //Generates a resource for each unique key-value pair
      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalog::TagOptionAssociation', 3);
    });
  });
});

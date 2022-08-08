import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';
import { ProductStackHistory } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-product', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

class TestProductStack extends servicecatalog.ProductStack {
  constructor(scope: any, id: string) {
    super(scope, id);

    new sns.Topic(this, 'TopicProduct');

    new s3_assets.Asset(this, 'testAsset', {
      path: path.join(__dirname, 'products.template.zip'),
    });
  }
}

const productStackHistory = new ProductStackHistory(stack, 'ProductStackHistory', {
  productStack: new TestProductStack(stack, 'SNSTopicProduct3'),
  currentVersionName: 'v1',
  currentVersionLocked: true,
});

const product = new servicecatalog.CloudFormationProduct(stack, 'TestProduct', {
  productName: 'testProduct',
  owner: 'testOwner',
  productVersions: [
    {
      validateTemplate: false,
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
        'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product2.template.json')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'SNSTopicProduct1')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromProductStack(new TestProductStack(stack, 'SNSTopicProduct2')),
    },
    productStackHistory.currentVersion(),
  ],
});

const tagOptions = new servicecatalog.TagOptions(stack, 'TagOptions', {
  allowedValuesForTags: {
    key1: ['value1', 'value2'],
    key2: ['value1'],
  },
});

product.associateTagOptions(tagOptions);

app.synth();

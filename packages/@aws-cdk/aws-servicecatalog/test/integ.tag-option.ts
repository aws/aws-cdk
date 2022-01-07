import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-tag-option');

const propTagOptions = new servicecatalog.TagOptions(stack, {
  tagOptionKey2: ['value2', 'value3', 'value4'],
  tagOptionKey3: ['value4', 'value5', 'value6'],
});

const portfolio = new servicecatalog.Portfolio(stack, 'TestPortfolio', {
  displayName: 'TestPortfolio',
  providerName: 'TestProvider',
  description: 'This is our Service Catalog Portfolio',
  messageLanguage: servicecatalog.MessageLanguage.EN,
  tagOptions: propTagOptions,
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
  ],
  tagOptions: propTagOptions,
});

const tagOptions = new servicecatalog.TagOptions(stack, {
  tagOptionKey4: ['value2', 'value3', 'value4'],
  tagOptionKey5: ['value4', 'value5', 'value6'],
});

portfolio.associateTagOptions(tagOptions);
product.associateTagOptions(tagOptions);

app.synth();
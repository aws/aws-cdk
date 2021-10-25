import * as fs from 'fs';
import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

/* eslint-disable quote-props */
describe('ProductStack', () => {
  test('fails to add asset to a product stack', () => {
    // GIVEN
    const app = new cdk.App();
    const mainStack = new cdk.Stack(app, 'MyStack');
    const productStack = new servicecatalog.ProductStack(mainStack, 'MyProductStack');
    // THEN
    expect(() => new s3_assets.Asset(productStack, 'testAsset', {
      path: path.join(__dirname, 'product1.template.json'),
    })).toThrow(/Cannot add file assets to a stack that uses the ProductStackSynthesizer/);
  }),

  test('fails if defined as a root', () => {
    // THEN
    expect(() => new servicecatalog.ProductStack(undefined as any, 'ProductStack')).toThrow(/Product stacks cannot be defined as a root construct/);
  }),

  test('fails if defined without a parent stack', () => {
    // GIVEN
    const app = new cdk.App();
    const group = new cdk.Construct(app, 'group');

    // THEN
    expect(() => new servicecatalog.ProductStack(app, 'ProductStack1')).toThrow(/must be defined within scope of another non-product stack/);
    expect(() => new servicecatalog.ProductStack(group, 'ProductStack2')).toThrow(/must be defined within scope of another non-product stack/);
  }),

  test('can be defined as a direct child or an indirect child of a Stack', () => {
    // GIVEN
    const parent = new cdk.Stack();

    // THEN
    expect(() => new servicecatalog.ProductStack(parent, 'direct')).not.toThrow();
  }),

  test('product stack is not synthesized as a stack artifact into the assembly', () => {
    // GIVEN
    const app = new cdk.App();
    const parentStack = new cdk.Stack(app, 'ParentStack');
    new servicecatalog.ProductStack(parentStack, 'ProductStack');

    // WHEN
    const assembly = app.synth();

    // THEN
    expect(assembly.artifacts.length).toEqual(2);
  });

  test('the template of the nested stack is synthesized into the cloud assembly', () => {
    // GIVEN
    const app = new cdk.App();
    const parent = new cdk.Stack(app, 'ParentStack');
    const productStack = new servicecatalog.ProductStack(parent, 'ProductStack');
    new servicecatalog.Portfolio(productStack, 'MyPortfolio', {
      displayName: 'TestName',
      providerName: 'TestProvider',
    });

    // WHEN
    const assembly = app.synth();

    // THEN
    const template = JSON.parse(fs.readFileSync(path.join(assembly.directory, `${cdk.Names.uniqueId(productStack)}.product.template.json`), 'utf-8'));
    expect(template).toEqual({
      Resources: {
        MyPortfolio59CCA9C9: {
          Properties: {
            DisplayName: 'TestName',
            ProviderName: 'TestProvider',
          },
          Type: 'AWS::ServiceCatalog::Portfolio',
        },
      },
    });
  });
});

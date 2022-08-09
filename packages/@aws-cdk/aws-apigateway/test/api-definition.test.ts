import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as apigw from '../lib';

describe('api definition', () => {
  describe('apigateway.ApiDefinition.fromJson', () => {
    test('happy case', () => {
      const stack = new cdk.Stack();
      const definition = {
        key1: 'val1',
      };
      const config = apigw.ApiDefinition.fromInline(definition).bind(stack);
      expect(config.inlineDefinition).toEqual(definition);
      expect(config.s3Location).toBeUndefined();
    });

    test('fails if Json definition is empty', () => {
      expect(
        () => defineRestApi(apigw.ApiDefinition.fromInline({})))
        .toThrow(/cannot be empty/);
    });

    test('fails if definition is not an object', () => {
      expect(
        () => defineRestApi(apigw.ApiDefinition.fromInline('not-json')))
        .toThrow(/should be of type object/);
    });
  });

  describe('apigateway.ApiDefinition.fromAsset', () => {
    test('happy case', () => {
      const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new cdk.Stack(app);
      const config = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')).bind(stack);
      expect(config.inlineDefinition).toBeUndefined();
      expect(config.s3Location).toBeDefined();
      expect(stack.resolve(config.s3Location!.bucket)).toEqual({
        Ref: 'AssetParameters68497ac876de4e963fc8f7b5f1b28844c18ecc95e3f7c6e9e0bf250e03c037fbS3Bucket42039E29',
      });
    });

    test('fails if a directory is given for an asset', () => {
      // GIVEN
      const fileAsset = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'authorizers'));

      // THEN
      expect(() => defineRestApi(fileAsset)).toThrow(/Asset cannot be a \.zip file or a directory/);

    });

    test('only one Asset object gets created even if multiple functions use the same AssetApiDefinition', () => {
      // GIVEN
      const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new cdk.Stack(app, 'MyStack');
      const directoryAsset = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml'));

      // WHEN
      new apigw.SpecRestApi(stack, 'API1', {
        apiDefinition: directoryAsset,
      });

      new apigw.SpecRestApi(stack, 'API2', {
        apiDefinition: directoryAsset,
      });

      // THEN
      const assembly = app.synth();
      const synthesized = assembly.stacks[0];

      // API1 has an asset, API2 does not
      expect(synthesized.assets.length).toEqual(1);
    });

    test('asset metadata added to RestApi resource that contains Asset Api Definition', () => {
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);
      const assetApiDefinition = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml'));
      new apigw.SpecRestApi(stack, 'API', {
        apiDefinition: assetApiDefinition,
      });

      Template.fromStack(stack).hasResource('AWS::ApiGateway::RestApi', {
        Metadata: {
          'aws:asset:path': 'asset.68497ac876de4e963fc8f7b5f1b28844c18ecc95e3f7c6e9e0bf250e03c037fb.yaml',
          'aws:asset:property': 'BodyS3Location',
        },
      });

    });
  });

  describe('apigateway.ApiDefinition.fromBucket', () => {
    test('happy case', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'my-bucket');
      const config = apigw.ApiDefinition.fromBucket(bucket, 'my-key', 'my-version').bind(stack);
      expect(config.inlineDefinition).toBeUndefined();
      expect(config.s3Location).toBeDefined();
      expect(stack.resolve(config.s3Location!.bucket)).toEqual({
        Ref: 'mybucket15D133BF',
      });
      expect(config.s3Location!.key).toEqual('my-key');

    });
  });
});

function defineRestApi(definition: apigw.ApiDefinition) {
  const stack = new cdk.Stack();
  return new apigw.SpecRestApi(stack, 'API', {
    apiDefinition: definition,
  });
}

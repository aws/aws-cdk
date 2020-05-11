import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as path from 'path';
import * as apigw from '../lib';

export = {
  'apigateway.ApiDefinition.fromJson': {
    'happy case'(test: Test) {
      const stack = new cdk.Stack();
      const definition = {
        key1: 'val1',
      };
      const config = apigw.ApiDefinition.fromInline(definition).bind(stack);
      test.deepEqual(config.inlineDefinition, definition);
      test.ok(config.s3Location === undefined);
      test.done();
    },

    'fails if Json definition is empty'(test: Test) {
      test.throws(
        () => defineRestApi(apigw.ApiDefinition.fromInline({})),
        /cannot be empty/);
      test.done();
    },

    'fails if definition is not an object'(test: Test) {
      test.throws(
        () => defineRestApi(apigw.ApiDefinition.fromInline('not-json')),
        /should be of type object/);
      test.done();
    },
  },

  'apigateway.ApiDefinition.fromAsset': {
    'happy case'(test: Test) {
      const stack = new cdk.Stack();
      const config = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml')).bind(stack);
      test.ok(config.inlineDefinition === undefined);
      test.ok(config.s3Location !== undefined);
      test.deepEqual(stack.resolve(config.s3Location!.bucket), {
        Ref: 'AssetParameters68497ac876de4e963fc8f7b5f1b28844c18ecc95e3f7c6e9e0bf250e03c037fbS3Bucket42039E29',
      });
      test.done();
    },

    'fails if a directory is given for an asset'(test: Test) {
      // GIVEN
      const fileAsset = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'authorizers'));

      // THEN
      test.throws(() => defineRestApi(fileAsset), /Asset cannot be a \.zip file or a directory/);
      test.done();
    },

    'only one Asset object gets created even if multiple functions use the same AssetApiDefinition'(test: Test) {
      // GIVEN
      const app = new cdk.App();
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
      test.deepEqual(synthesized.assets.length, 1);
      test.done();
    },
  },

  'apigateway.ApiDefinition.fromBucket': {
    'happy case'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'my-bucket');
      const config = apigw.ApiDefinition.fromBucket(bucket, 'my-key', 'my-version').bind(stack);
      test.ok(config.inlineDefinition === undefined);
      test.ok(config.s3Location !== undefined);
      test.deepEqual(stack.resolve(config.s3Location!.bucket), {
        Ref: 'mybucket15D133BF',
      });
      test.equals(config.s3Location!.key, 'my-key');
      test.done();
    },
  },
};

function defineRestApi(definition: apigw.ApiDefinition) {
  const stack = new cdk.Stack();
  return new apigw.SpecRestApi(stack, 'API', {
    apiDefinition: definition,
  });
}

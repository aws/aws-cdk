import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import * as path from 'path';
import * as apigw from '../lib';

// tslint:disable:no-string-literal

export = {
  'apigateway.APIDefinition.fromInline': {
    'fails if larger than 4096 bytes or is empty'(test: Test) {
      test.throws(
        () => defineRestApi(apigw.APIDefinition.fromInline(generateRandomString(4097))),
        /too large, must be <= 4096 but is 4097/);
      test.throws(
        () => defineRestApi(apigw.APIDefinition.fromInline('')),
        /cannot be empty/
      );
      test.done();
    },
  },
  'apigateway.APIDefinition.fromAsset': {
    'fails if a directory is given for an asset'(test: Test) {
      // GIVEN
      const fileAsset = apigw.APIDefinition.fromAsset(path.join(__dirname, 'authorizers'));

      // THEN
      test.throws(() => defineRestApi(fileAsset), /Asset cannot be a \.zip file or a directory/);
      test.done();
    },

    'only one Asset object gets created even if multiple functions use the same AssetAPIDefinition'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'MyStack');
      const directoryAsset = apigw.APIDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml'));

      // WHEN
      new apigw.RestApi(stack, 'API1', {
        apiDefinition: directoryAsset
      });

      new apigw.RestApi(stack, 'API2', {
        apiDefinition: directoryAsset
      });

      // THEN
      const assembly = app.synth();
      const synthesized = assembly.stacks[0];

      // API1 has an asset, API2 does not
      test.deepEqual(synthesized.assets.length, 1);
      test.done();
    },

    'adds definition asset metadata'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

      const definition = apigw.APIDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml'));

      // WHEN
      new apigw.RestApi(stack, 'API1', {
        apiDefinition: definition
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::RestApi', {
        Metadata: {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.b4e546901387aeeb588eabec043d35a7fdbe4d304185ae7ab763bb3ae4e61d58.yaml',
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'APIDefinition'
        }
      }, ResourcePart.CompleteDefinition));
      test.done();
    }
  },

  'apigateway.APIDefinition.fromCfnParameters': {
    "automatically creates the Bucket and Key parameters when it's used in a Rest API"(test: Test) {
      const stack = new cdk.Stack();
      const definition = new apigw.CfnParametersAPIDefinition();
      new apigw.RestApi(stack, 'API', {
        apiDefinition: definition,
      });

      expect(stack).to(haveResourceLike('AWS::ApiGateway::RestApi', {
        Name: 'API',
        BodyS3Location: {
          Bucket: {
            Ref: 'APIAPIDefinitionBucketNameParameter95D18AC4',
          },
          Key: {
            Ref: 'APIAPIDefinitionObjectKeyParameterDB007608',
          },
        },
      }));

      test.equal(stack.resolve(definition.bucketNameParam), 'APIAPIDefinitionBucketNameParameter95D18AC4');
      test.equal(stack.resolve(definition.objectKeyParam), 'APIAPIDefinitionObjectKeyParameterDB007608');

      test.done();
    },

    'does not allow accessing the Parameter properties before being used in a Rest API'(test: Test) {
      const definition = new apigw.CfnParametersAPIDefinition();

      test.throws(() => {
        test.notEqual(definition.bucketNameParam, undefined);
      }, /bucketNameParam/);

      test.throws(() => {
        test.notEqual(definition.objectKeyParam, undefined);
      }, /objectKeyParam/);

      test.done();
    },

    'allows passing custom Parameters when creating it'(test: Test) {
      const stack = new cdk.Stack();
      const bucketNameParam = new cdk.CfnParameter(stack, 'BucketNameParam', {
        type: 'String',
      });
      const bucketKeyParam = new cdk.CfnParameter(stack, 'ObjectKeyParam', {
        type: 'String',
      });

      const definition = apigw.APIDefinition.fromCfnParameters({
        bucketNameParam,
        objectKeyParam: bucketKeyParam,
      });

      test.equal(stack.resolve(definition.bucketNameParam), 'BucketNameParam');
      test.equal(stack.resolve(definition.objectKeyParam), 'ObjectKeyParam');

      new apigw.RestApi(stack, 'API', {
        apiDefinition: definition
      });

      expect(stack).to(haveResourceLike('AWS::ApiGateway::RestApi', {
        BodyS3Location: {
          Bucket: {
            Ref: 'BucketNameParam',
          },
          Key: {
            Ref: 'ObjectKeyParam',
          },
        },
      }));

      test.done();
    },

    'can assign parameters'(test: Test) {
      // given
      const stack = new cdk.Stack();
      const code = new apigw.CfnParametersAPIDefinition({
        bucketNameParam: new cdk.CfnParameter(stack, 'BucketNameParam', {
          type: 'String',
        }),
        objectKeyParam: new cdk.CfnParameter(stack, 'ObjectKeyParam', {
          type: 'String',
        }),
      });

      // when
      const overrides = stack.resolve(code.assign({
        bucketName: 'SomeBucketName',
        objectKey: 'SomeObjectKey',
      }));

      // then
      test.equal(overrides['BucketNameParam'], 'SomeBucketName');
      test.equal(overrides['ObjectKeyParam'], 'SomeObjectKey');

      test.done();
    },
  },
};

function defineRestApi(definition: apigw.APIDefinition) {
  const stack = new cdk.Stack();
  return new apigw.RestApi(stack, 'API', {
    apiDefinition: definition
  });
}

function generateRandomString(bytes: number) {
  let s = '';
  for (let i = 0; i < bytes; ++i) {
    s += String.fromCharCode(Math.round(Math.random() * 256));
  }
  return s;
}

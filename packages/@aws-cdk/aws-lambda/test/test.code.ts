import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import path = require('path');
import lambda = require('../lib');

/* eslint-disable dot-notation */

export = {
  'lambda.Code.fromInline': {
    'fails if used with unsupported runtimes'(test: Test) {
      test.throws(() => defineFunction(lambda.Code.fromInline('boom'), lambda.Runtime.GO_1_X), /Inline source not allowed for go1\.x/);
      test.throws(() => defineFunction(lambda.Code.fromInline('boom'), lambda.Runtime.JAVA_8), /Inline source not allowed for java8/);
      test.done();
    },
    'fails if larger than 4096 bytes'(test: Test) {
      test.throws(
        () => defineFunction(lambda.Code.fromInline(generateRandomString(4097)), lambda.Runtime.NODEJS_8_10),
        /Lambda source is too large, must be <= 4096 but is 4097/);
      test.done();
    }
  },
  'lambda.Code.fromAsset': {
    'fails if a non-zip asset is used'(test: Test) {
      // GIVEN
      const fileAsset = lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler', 'index.py'));

      // THEN
      test.throws(() => defineFunction(fileAsset), /Asset must be a \.zip file or a directory/);
      test.done();
    },

    'only one Asset object gets created even if multiple functions use the same AssetCode'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'MyStack');
      const directoryAsset = lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler'));

      // WHEN
      new lambda.Function(stack, 'Func1', {
        handler: 'foom',
        runtime: lambda.Runtime.NODEJS_8_10,
        code: directoryAsset
      });

      new lambda.Function(stack, 'Func2', {
        handler: 'foom',
        runtime: lambda.Runtime.NODEJS_8_10,
        code: directoryAsset
      });

      // THEN
      const assembly = app.synth();
      const synthesized = assembly.stacks[0];

      // Func1 has an asset, Func2 does not
      test.deepEqual(synthesized.assets.length, 1);
      test.done();
    },

    'adds code asset metadata'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

      const location = path.join(__dirname, 'my-lambda-handler');

      // WHEN
      new lambda.Function(stack, 'Func1', {
        code: lambda.Code.fromAsset(location),
        runtime: lambda.Runtime.NODEJS_8_10,
        handler: 'foom',
      });

      // THEN
      expect(stack).to(haveResource('AWS::Lambda::Function', {
        Metadata: {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232',
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'Code'
        }
      }, ResourcePart.CompleteDefinition));
      test.done();
    }
  },

  'lambda.Code.fromCfnParameters': {
    "automatically creates the Bucket and Key parameters when it's used in a Function"(test: Test) {
      const stack = new cdk.Stack();
      const code = new lambda.CfnParametersCode();
      new lambda.Function(stack, 'Function', {
        code,
        runtime: lambda.Runtime.NODEJS_8_10,
        handler: 'index.handler',
      });

      expect(stack).to(haveResourceLike('AWS::Lambda::Function', {
        Code: {
          S3Bucket: {
            Ref: "FunctionLambdaSourceBucketNameParameter9E9E108F",
          },
          S3Key: {
            Ref: "FunctionLambdaSourceObjectKeyParameter1C7AED11",
          },
        },
      }));

      test.equal(stack.resolve(code.bucketNameParam), 'FunctionLambdaSourceBucketNameParameter9E9E108F');
      test.equal(stack.resolve(code.objectKeyParam), 'FunctionLambdaSourceObjectKeyParameter1C7AED11');

      test.done();
    },

    'does not allow accessing the Parameter properties before being used in a Function'(test: Test) {
      const code = new lambda.CfnParametersCode();

      test.throws(() => {
        test.notEqual(code.bucketNameParam, undefined);
      }, /bucketNameParam/);

      test.throws(() => {
        test.notEqual(code.objectKeyParam, undefined);
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

      const code = lambda.Code.fromCfnParameters({
        bucketNameParam,
        objectKeyParam: bucketKeyParam,
      });

      test.equal(stack.resolve(code.bucketNameParam), 'BucketNameParam');
      test.equal(stack.resolve(code.objectKeyParam), 'ObjectKeyParam');

      new lambda.Function(stack, 'Function', {
        code,
        runtime: lambda.Runtime.NODEJS_8_10,
        handler: 'index.handler',
      });

      expect(stack).to(haveResourceLike('AWS::Lambda::Function', {
        Code: {
          S3Bucket: {
            Ref: "BucketNameParam",
          },
          S3Key: {
            Ref: "ObjectKeyParam",
          },
        },
      }));

      test.done();
    },

    'can assign parameters'(test: Test) {
      // given
      const stack = new cdk.Stack();
      const code = new lambda.CfnParametersCode({
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

function defineFunction(code: lambda.Code, runtime: lambda.Runtime = lambda.Runtime.NODEJS_8_10) {
  const stack = new cdk.Stack();
  return new lambda.Function(stack, 'Func', {
    handler: 'foom',
    code, runtime
  });
}

function generateRandomString(bytes: number) {
  let s = '';
  for (let i = 0; i < bytes; ++i) {
    s += String.fromCharCode(Math.round(Math.random() * 256));
  }
  return s;
}

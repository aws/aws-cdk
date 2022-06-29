import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as ecr from '@aws-cdk/aws-ecr';
import { testLegacyBehavior } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as lambda from '../lib';

/* eslint-disable dot-notation */

describe('code', () => {
  describe('lambda.Code.fromInline', () => {
    test('fails if used with unsupported runtimes', () => {
      expect(() => defineFunction(lambda.Code.fromInline('boom'), lambda.Runtime.GO_1_X)).toThrow(/Inline source not allowed for go1\.x/);
      expect(() => defineFunction(lambda.Code.fromInline('boom'), lambda.Runtime.JAVA_8)).toThrow(/Inline source not allowed for java8/);
    });
  });

  describe('lambda.Code.fromAsset', () => {
    test('fails if a non-zip asset is used', () => {
      // GIVEN
      const fileAsset = lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler', 'index.py'));

      // THEN
      expect(() => defineFunction(fileAsset)).toThrow(/Asset must be a \.zip file or a directory/);
    });

    test('only one Asset object gets created even if multiple functions use the same AssetCode', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
        },
      });
      const stack = new cdk.Stack(app, 'MyStack');
      const directoryAsset = lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler'));

      // WHEN
      new lambda.Function(stack, 'Func1', {
        handler: 'foom',
        runtime: lambda.Runtime.NODEJS_14_X,
        code: directoryAsset,
      });

      new lambda.Function(stack, 'Func2', {
        handler: 'foom',
        runtime: lambda.Runtime.NODEJS_14_X,
        code: directoryAsset,
      });

      // THEN
      const assembly = app.synth();
      const synthesized = assembly.stacks[0];

      // Func1 has an asset, Func2 does not
      expect(synthesized.assets.length).toEqual(1);
    });

    test('adds code asset metadata', () => {
      // GIVEN
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

      const location = path.join(__dirname, 'my-lambda-handler');

      // WHEN
      new lambda.Function(stack, 'Func1', {
        code: lambda.Code.fromAsset(location),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'foom',
      });

      // THEN
      Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Metadata: {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232',
          [cxapi.ASSET_RESOURCE_METADATA_IS_BUNDLED_KEY]: false,
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'Code',
        },
      });
    });

    test('fails if asset is bound with a second stack', () => {
      // GIVEN
      const asset = lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler'));

      const app = new cdk.App();
      const stack1 = new cdk.Stack(app, 'Stack1');
      new lambda.Function(stack1, 'Func', {
        code: asset,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'foom',
      });

      const stack2 = new cdk.Stack(app, 'Stack2');
      expect(() => new lambda.Function(stack2, 'Func', {
        code: asset,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'foom',
      })).toThrow(/already associated/);
    });
  });

  describe('lambda.Code.fromCfnParameters', () => {
    test("automatically creates the Bucket and Key parameters when it's used in a Function", () => {
      const stack = new cdk.Stack();
      const code = new lambda.CfnParametersCode();
      new lambda.Function(stack, 'Function', {
        code,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Code: {
          S3Bucket: {
            Ref: 'FunctionLambdaSourceBucketNameParameter9E9E108F',
          },
          S3Key: {
            Ref: 'FunctionLambdaSourceObjectKeyParameter1C7AED11',
          },
        },
      });

      expect(stack.resolve(code.bucketNameParam)).toEqual('FunctionLambdaSourceBucketNameParameter9E9E108F');
      expect(stack.resolve(code.objectKeyParam)).toEqual('FunctionLambdaSourceObjectKeyParameter1C7AED11');
    });

    test('does not allow accessing the Parameter properties before being used in a Function', () => {
      const code = new lambda.CfnParametersCode();

      expect(() => code.bucketNameParam).toThrow(/bucketNameParam/);

      expect(() => code.objectKeyParam).toThrow(/objectKeyParam/);
    });

    test('allows passing custom Parameters when creating it', () => {
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

      expect(stack.resolve(code.bucketNameParam)).toEqual('BucketNameParam');
      expect(stack.resolve(code.objectKeyParam)).toEqual('ObjectKeyParam');

      new lambda.Function(stack, 'Function', {
        code,
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Code: {
          S3Bucket: {
            Ref: 'BucketNameParam',
          },
          S3Key: {
            Ref: 'ObjectKeyParam',
          },
        },
      });
    });

    test('can assign parameters', () => {
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
      expect(overrides['BucketNameParam']).toEqual('SomeBucketName');
      expect(overrides['ObjectKeyParam']).toEqual('SomeObjectKey');
    });
  });

  describe('lambda.Code.fromEcr', () => {
    test('repository uri is correctly identified', () => {
      // given
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromEcrImage(repo),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Code: {
          ImageUri: stack.resolve(repo.repositoryUriForTag('latest')),
        },
        ImageConfig: Match.absent(),
      });
    });

    test('props are correctly resolved', () => {
      // given
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromEcrImage(repo, {
          cmd: ['cmd', 'param1'],
          entrypoint: ['entrypoint', 'param2'],
          tagOrDigest: 'mytag',
          workingDirectory: '/some/path',
        }),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Code: {
          ImageUri: stack.resolve(repo.repositoryUriForTag('mytag')),
        },
        ImageConfig: {
          Command: ['cmd', 'param1'],
          EntryPoint: ['entrypoint', 'param2'],
          WorkingDirectory: '/some/path',
        },
      });
    });

    test('digests are interpreted correctly', () => {
      // given
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromEcrImage(repo, {
          tagOrDigest: 'sha256:afc607424cc02c92d4d6af5184a4fef46a69548e465a320808c6ff358b6a3a8d',
        }),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Code: {
          ImageUri: stack.resolve(repo.repositoryUriForDigest('sha256:afc607424cc02c92d4d6af5184a4fef46a69548e465a320808c6ff358b6a3a8d')),
        },
        ImageConfig: Match.absent(),
      });
    });

    test('permission grants', () => {
      // given
      const stack = new cdk.Stack();
      const repo = new ecr.Repository(stack, 'Repo');

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromEcrImage(repo),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
        RepositoryPolicyText: {
          Statement: [
            {
              Action: [
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
              ],
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
            },
          ],
        },
      });
    });
  });

  describe('lambda.Code.fromImageAsset', () => {
    testLegacyBehavior('repository uri is correctly identified', cdk.App, (app) => {
      // given
      const stack = new cdk.Stack(app);

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler')),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Code: {
          ImageUri: {
            'Fn::Join': ['', [
              { Ref: 'AWS::AccountId' },
              '.dkr.ecr.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/aws-cdk/assets:768d7b6c1d41b85135f498fe0cca69fea410be3c3322c69cf08690aaad29a610',
            ]],
          },
        },
        ImageConfig: Match.absent(),
      });
    });

    test('props are correctly resolved', () => {
      // given
      const stack = new cdk.Stack();

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler'), {
          cmd: ['cmd', 'param1'],
          entrypoint: ['entrypoint', 'param2'],
          workingDirectory: '/some/path',
        }),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        ImageConfig: {
          Command: ['cmd', 'param1'],
          EntryPoint: ['entrypoint', 'param2'],
          WorkingDirectory: '/some/path',
        },
      });
    });

    test('adds code asset metadata', () => {
      // given
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

      const dockerfilePath = 'Dockerfile';
      const dockerBuildTarget = 'stage';
      const dockerBuildArgs = { arg1: 'val1', arg2: 'val2' };
      const dockerBuildShell = '/bin/sh';

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler'), {
          file: dockerfilePath,
          target: dockerBuildTarget,
          buildArgs: dockerBuildArgs,
          buildShell: dockerBuildShell,
        }),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Metadata: {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.30b57ded32316be9aa6553a1d81689f1e0cb475a94306c557e05048f9f56bd79',
          [cxapi.ASSET_RESOURCE_METADATA_DOCKERFILE_PATH_KEY]: dockerfilePath,
          [cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_ARGS_KEY]: dockerBuildArgs,
          [cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_SHELL_KEY]: dockerBuildShell,
          [cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_TARGET_KEY]: dockerBuildTarget,
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'Code.ImageUri',
        },
      });
    });

    test('adds code asset metadata with default dockerfile path', () => {
      // given
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler')),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      // then
      Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Metadata: {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.768d7b6c1d41b85135f498fe0cca69fea410be3c3322c69cf08690aaad29a610',
          [cxapi.ASSET_RESOURCE_METADATA_DOCKERFILE_PATH_KEY]: 'Dockerfile',
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'Code.ImageUri',
        },
      });
    });

    test('fails if asset is bound with a second stack', () => {
      // given
      const app = new cdk.App();
      const asset = lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler'));

      // when
      const stack1 = new cdk.Stack(app, 'Stack1');
      new lambda.Function(stack1, 'Fn', {
        code: asset,
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      });

      const stack2 = new cdk.Stack(app, 'Stack2');

      // then
      expect(() => new lambda.Function(stack2, 'Fn', {
        code: asset,
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
      })).toThrow(/already associated/);
    });
  });

  describe('lambda.Code.fromDockerBuild', () => {
    let fromBuildMock: jest.SpyInstance<cdk.DockerImage>;
    let cpMock: jest.Mock<any, any>;

    beforeEach(() => {
      cpMock = jest.fn().mockReturnValue(path.join(__dirname, 'docker-build-lambda'));
      fromBuildMock = jest.spyOn(cdk.DockerImage, 'fromBuild').mockImplementation(() => ({
        cp: cpMock,
        image: 'tag',
        run: jest.fn(),
        toJSON: jest.fn(),
      }));
    });

    afterEach(() => {
      fromBuildMock.mockRestore();
    });

    test('can use the result of a Docker build as an asset', () => {
      // given
      const stack = new cdk.Stack();
      stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromDockerBuild(path.join(__dirname, 'docker-build-lambda')),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
      });

      // then
      Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
        Metadata: {
          [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.fbafdbb9ae8d1bae0def415b791a93c486d18ebc63270c748abecc3ac0ab9533',
          [cxapi.ASSET_RESOURCE_METADATA_IS_BUNDLED_KEY]: false,
          [cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY]: 'Code',
        },
      });

      expect(fromBuildMock).toHaveBeenCalledWith(path.join(__dirname, 'docker-build-lambda'), {});
      expect(cpMock).toHaveBeenCalledWith('/asset/.', undefined);
    });

    test('fromDockerBuild appends /. to an image path not ending with a /', () => {
      // given
      const stack = new cdk.Stack();

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromDockerBuild(path.join(__dirname, 'docker-build-lambda'), {
          imagePath: '/my/image/path',
        }),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
      });

      // then
      expect(cpMock).toHaveBeenCalledWith('/my/image/path/.', undefined);
    });

    test('fromDockerBuild appends . to an image path ending with a /', () => {
      // given
      const stack = new cdk.Stack();

      // when
      new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromDockerBuild(path.join(__dirname, 'docker-build-lambda'), {
          imagePath: '/my/image/path/',
        }),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
      });

      // then
      expect(cpMock).toHaveBeenCalledWith('/my/image/path/.', undefined);
    });
  });
});

function defineFunction(code: lambda.Code, runtime: lambda.Runtime = lambda.Runtime.NODEJS_14_X) {
  const stack = new cdk.Stack();
  return new lambda.Function(stack, 'Func', {
    handler: 'foom',
    code,
    runtime,
  });
}

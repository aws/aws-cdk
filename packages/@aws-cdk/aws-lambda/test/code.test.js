"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const ecr = require("@aws-cdk/aws-ecr");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lambda = require("../lib");
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
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Code: {
                    ImageUri: stack.resolve(repo.repositoryUriForTag('latest')),
                },
                ImageConfig: assertions_1.Match.absent(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Code: {
                    ImageUri: stack.resolve(repo.repositoryUriForDigest('sha256:afc607424cc02c92d4d6af5184a4fef46a69548e465a320808c6ff358b6a3a8d')),
                },
                ImageConfig: assertions_1.Match.absent(),
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
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
            const dockerBuildSecrets = { mysecret: cdk.DockerBuildSecret.fromSrc('abc.txt') };
            // when
            new lambda.Function(stack, 'Fn', {
                code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler'), {
                    file: dockerfilePath,
                    target: dockerBuildTarget,
                    buildArgs: dockerBuildArgs,
                    buildSecrets: { mysecret: 'src=abc.txt' },
                }),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.FROM_IMAGE,
            });
            // then
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
                Metadata: {
                    [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.1ef7cb20bcf698f1d6dc61fe80144ce21b11def47dd08220d3597d834d4e738f',
                    [cxapi.ASSET_RESOURCE_METADATA_DOCKERFILE_PATH_KEY]: dockerfilePath,
                    [cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_ARGS_KEY]: dockerBuildArgs,
                    [cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_SECRETS_KEY]: dockerBuildSecrets,
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
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
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
        let fromBuildMock;
        let cpMock;
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
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
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
function defineFunction(code, runtime = lambda.Runtime.NODEJS_14_X) {
    const stack = new cdk.Stack();
    return new lambda.Function(stack, 'Func', {
        handler: 'foom',
        code,
        runtime,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QyxpQ0FBaUM7QUFFakMsaUNBQWlDO0FBRWpDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDdEMsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUNuRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUNwSSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUNySSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNyQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLFFBQVE7WUFDUixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBRS9GLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFD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O2dCQUNGLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2FBQ3BDLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxjQUFjLENBQUMsSUFBaUIsRUFBRSxVQUEwQixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7SUFDN0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUN4QyxPQUFPLEVBQUUsTUFBTTtRQUNmLElBQUk7UUFDSixPQUFPO0tBQ1IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgZG90LW5vdGF0aW9uICovXG5cbmRlc2NyaWJlKCdjb2RlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbGFtYmRhLkNvZGUuZnJvbUlubGluZScsICgpID0+IHtcbiAgICB0ZXN0KCdmYWlscyBpZiB1c2VkIHdpdGggdW5zdXBwb3J0ZWQgcnVudGltZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gZGVmaW5lRnVuY3Rpb24obGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLCBsYW1iZGEuUnVudGltZS5HT18xX1gpKS50b1Rocm93KC9JbmxpbmUgc291cmNlIG5vdCBhbGxvd2VkIGZvciBnbzFcXC54Lyk7XG4gICAgICBleHBlY3QoKCkgPT4gZGVmaW5lRnVuY3Rpb24obGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLCBsYW1iZGEuUnVudGltZS5KQVZBXzgpKS50b1Rocm93KC9JbmxpbmUgc291cmNlIG5vdCBhbGxvd2VkIGZvciBqYXZhOC8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbGFtYmRhLkNvZGUuZnJvbUFzc2V0JywgKCkgPT4ge1xuICAgIHRlc3QoJ2ZhaWxzIGlmIGEgbm9uLXppcCBhc3NldCBpcyB1c2VkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGZpbGVBc3NldCA9IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInLCAnaW5kZXgucHknKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBkZWZpbmVGdW5jdGlvbihmaWxlQXNzZXQpKS50b1Rocm93KC9Bc3NldCBtdXN0IGJlIGEgXFwuemlwIGZpbGUgb3IgYSBkaXJlY3RvcnkvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29ubHkgb25lIEFzc2V0IG9iamVjdCBnZXRzIGNyZWF0ZWQgZXZlbiBpZiBtdWx0aXBsZSBmdW5jdGlvbnMgdXNlIHRoZSBzYW1lIEFzc2V0Q29kZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7XG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgICBjb25zdCBkaXJlY3RvcnlBc3NldCA9IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jMScsIHtcbiAgICAgICAgaGFuZGxlcjogJ2Zvb20nLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgY29kZTogZGlyZWN0b3J5QXNzZXQsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmMyJywge1xuICAgICAgICBoYW5kbGVyOiAnZm9vbScsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBkaXJlY3RvcnlBc3NldCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3Qgc3ludGhlc2l6ZWQgPSBhc3NlbWJseS5zdGFja3NbMF07XG5cbiAgICAgIC8vIEZ1bmMxIGhhcyBhbiBhc3NldCwgRnVuYzIgZG9lcyBub3RcbiAgICAgIGV4cGVjdChzeW50aGVzaXplZC5hc3NldHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkcyBjb2RlIGFzc2V0IG1ldGFkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0VOQUJMRURfQ09OVEVYVCwgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IGxvY2F0aW9uID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ215LWxhbWJkYS1oYW5kbGVyJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jMScsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGxvY2F0aW9uKSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGhhbmRsZXI6ICdmb29tJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BBVEhfS0VZXTogJ2Fzc2V0Ljk2NzhjMzRlY2E5MzI1OWQxMWYyZDcxNDE3NzM0N2FmZDY2YzUwMTE2ZTFlMDg5OTZlZmY4OTNkM2NhODEyMzInLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9JU19CVU5ETEVEX0tFWV06IGZhbHNlLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QUk9QRVJUWV9LRVldOiAnQ29kZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIGlmIGFzc2V0IGlzIGJvdW5kIHdpdGggYSBzZWNvbmQgc3RhY2snLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXNzZXQgPSBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LWxhbWJkYS1oYW5kbGVyJykpO1xuXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2sxLCAnRnVuYycsIHtcbiAgICAgICAgY29kZTogYXNzZXQsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBoYW5kbGVyOiAnZm9vbScsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjazInKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMiwgJ0Z1bmMnLCB7XG4gICAgICAgIGNvZGU6IGFzc2V0LFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgaGFuZGxlcjogJ2Zvb20nLFxuICAgICAgfSkpLnRvVGhyb3coL2FscmVhZHkgYXNzb2NpYXRlZC8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbGFtYmRhLkNvZGUuZnJvbUNmblBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgdGVzdChcImF1dG9tYXRpY2FsbHkgY3JlYXRlcyB0aGUgQnVja2V0IGFuZCBLZXkgcGFyYW1ldGVycyB3aGVuIGl0J3MgdXNlZCBpbiBhIEZ1bmN0aW9uXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgY29kZSA9IG5ldyBsYW1iZGEuQ2ZuUGFyYW1ldGVyc0NvZGUoKTtcbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgY29kZSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgUzNCdWNrZXQ6IHtcbiAgICAgICAgICAgIFJlZjogJ0Z1bmN0aW9uTGFtYmRhU291cmNlQnVja2V0TmFtZVBhcmFtZXRlcjlFOUUxMDhGJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFMzS2V5OiB7XG4gICAgICAgICAgICBSZWY6ICdGdW5jdGlvbkxhbWJkYVNvdXJjZU9iamVjdEtleVBhcmFtZXRlcjFDN0FFRDExJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGNvZGUuYnVja2V0TmFtZVBhcmFtKSkudG9FcXVhbCgnRnVuY3Rpb25MYW1iZGFTb3VyY2VCdWNrZXROYW1lUGFyYW1ldGVyOUU5RTEwOEYnKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGNvZGUub2JqZWN0S2V5UGFyYW0pKS50b0VxdWFsKCdGdW5jdGlvbkxhbWJkYVNvdXJjZU9iamVjdEtleVBhcmFtZXRlcjFDN0FFRDExJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBhbGxvdyBhY2Nlc3NpbmcgdGhlIFBhcmFtZXRlciBwcm9wZXJ0aWVzIGJlZm9yZSBiZWluZyB1c2VkIGluIGEgRnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb2RlID0gbmV3IGxhbWJkYS5DZm5QYXJhbWV0ZXJzQ29kZSgpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gY29kZS5idWNrZXROYW1lUGFyYW0pLnRvVGhyb3coL2J1Y2tldE5hbWVQYXJhbS8pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gY29kZS5vYmplY3RLZXlQYXJhbSkudG9UaHJvdygvb2JqZWN0S2V5UGFyYW0vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBwYXNzaW5nIGN1c3RvbSBQYXJhbWV0ZXJzIHdoZW4gY3JlYXRpbmcgaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldE5hbWVQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnQnVja2V0TmFtZVBhcmFtJywge1xuICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYnVja2V0S2V5UGFyYW0gPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ09iamVjdEtleVBhcmFtJywge1xuICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2RlID0gbGFtYmRhLkNvZGUuZnJvbUNmblBhcmFtZXRlcnMoe1xuICAgICAgICBidWNrZXROYW1lUGFyYW0sXG4gICAgICAgIG9iamVjdEtleVBhcmFtOiBidWNrZXRLZXlQYXJhbSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjb2RlLmJ1Y2tldE5hbWVQYXJhbSkpLnRvRXF1YWwoJ0J1Y2tldE5hbWVQYXJhbScpO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY29kZS5vYmplY3RLZXlQYXJhbSkpLnRvRXF1YWwoJ09iamVjdEtleVBhcmFtJyk7XG5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgICAgY29kZSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgUzNCdWNrZXQ6IHtcbiAgICAgICAgICAgIFJlZjogJ0J1Y2tldE5hbWVQYXJhbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTM0tleToge1xuICAgICAgICAgICAgUmVmOiAnT2JqZWN0S2V5UGFyYW0nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBhc3NpZ24gcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGNvZGUgPSBuZXcgbGFtYmRhLkNmblBhcmFtZXRlcnNDb2RlKHtcbiAgICAgICAgYnVja2V0TmFtZVBhcmFtOiBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ0J1Y2tldE5hbWVQYXJhbScsIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgfSksXG4gICAgICAgIG9iamVjdEtleVBhcmFtOiBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ09iamVjdEtleVBhcmFtJywge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBjb25zdCBvdmVycmlkZXMgPSBzdGFjay5yZXNvbHZlKGNvZGUuYXNzaWduKHtcbiAgICAgICAgYnVja2V0TmFtZTogJ1NvbWVCdWNrZXROYW1lJyxcbiAgICAgICAgb2JqZWN0S2V5OiAnU29tZU9iamVjdEtleScsXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIHRoZW5cbiAgICAgIGV4cGVjdChvdmVycmlkZXNbJ0J1Y2tldE5hbWVQYXJhbSddKS50b0VxdWFsKCdTb21lQnVja2V0TmFtZScpO1xuICAgICAgZXhwZWN0KG92ZXJyaWRlc1snT2JqZWN0S2V5UGFyYW0nXSkudG9FcXVhbCgnU29tZU9iamVjdEtleScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbGFtYmRhLkNvZGUuZnJvbUVjcicsICgpID0+IHtcbiAgICB0ZXN0KCdyZXBvc2l0b3J5IHVyaSBpcyBjb3JyZWN0bHkgaWRlbnRpZmllZCcsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUVjckltYWdlKHJlcG8pLFxuICAgICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZW5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIENvZGU6IHtcbiAgICAgICAgICBJbWFnZVVyaTogc3RhY2sucmVzb2x2ZShyZXBvLnJlcG9zaXRvcnlVcmlGb3JUYWcoJ2xhdGVzdCcpKSxcbiAgICAgICAgfSxcbiAgICAgICAgSW1hZ2VDb25maWc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcm9wcyBhcmUgY29ycmVjdGx5IHJlc29sdmVkJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgLy8gd2hlblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tRWNySW1hZ2UocmVwbywge1xuICAgICAgICAgIGNtZDogWydjbWQnLCAncGFyYW0xJ10sXG4gICAgICAgICAgZW50cnlwb2ludDogWydlbnRyeXBvaW50JywgJ3BhcmFtMiddLFxuICAgICAgICAgIHRhZ09yRGlnZXN0OiAnbXl0YWcnLFxuICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6ICcvc29tZS9wYXRoJyxcbiAgICAgICAgfSksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgQ29kZToge1xuICAgICAgICAgIEltYWdlVXJpOiBzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeVVyaUZvclRhZygnbXl0YWcnKSksXG4gICAgICAgIH0sXG4gICAgICAgIEltYWdlQ29uZmlnOiB7XG4gICAgICAgICAgQ29tbWFuZDogWydjbWQnLCAncGFyYW0xJ10sXG4gICAgICAgICAgRW50cnlQb2ludDogWydlbnRyeXBvaW50JywgJ3BhcmFtMiddLFxuICAgICAgICAgIFdvcmtpbmdEaXJlY3Rvcnk6ICcvc29tZS9wYXRoJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGlnZXN0cyBhcmUgaW50ZXJwcmV0ZWQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgLy8gd2hlblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tRWNySW1hZ2UocmVwbywge1xuICAgICAgICAgIHRhZ09yRGlnZXN0OiAnc2hhMjU2OmFmYzYwNzQyNGNjMDJjOTJkNGQ2YWY1MTg0YTRmZWY0NmE2OTU0OGU0NjVhMzIwODA4YzZmZjM1OGI2YTNhOGQnLFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgSW1hZ2VVcmk6IHN0YWNrLnJlc29sdmUocmVwby5yZXBvc2l0b3J5VXJpRm9yRGlnZXN0KCdzaGEyNTY6YWZjNjA3NDI0Y2MwMmM5MmQ0ZDZhZjUxODRhNGZlZjQ2YTY5NTQ4ZTQ2NWEzMjA4MDhjNmZmMzU4YjZhM2E4ZCcpKSxcbiAgICAgICAgfSxcbiAgICAgICAgSW1hZ2VDb25maWc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwZXJtaXNzaW9uIGdyYW50cycsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUVjckltYWdlKHJlcG8pLFxuICAgICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZW5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgICAgUmVwb3NpdG9yeVBvbGljeVRleHQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tSW1hZ2VBc3NldCcsICgpID0+IHtcbiAgICB0ZXN0KCdwcm9wcyBhcmUgY29ycmVjdGx5IHJlc29sdmVkJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItbGFtYmRhLWhhbmRsZXInKSwge1xuICAgICAgICAgIGNtZDogWydjbWQnLCAncGFyYW0xJ10sXG4gICAgICAgICAgZW50cnlwb2ludDogWydlbnRyeXBvaW50JywgJ3BhcmFtMiddLFxuICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6ICcvc29tZS9wYXRoJyxcbiAgICAgICAgfSksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgSW1hZ2VDb25maWc6IHtcbiAgICAgICAgICBDb21tYW5kOiBbJ2NtZCcsICdwYXJhbTEnXSxcbiAgICAgICAgICBFbnRyeVBvaW50OiBbJ2VudHJ5cG9pbnQnLCAncGFyYW0yJ10sXG4gICAgICAgICAgV29ya2luZ0RpcmVjdG9yeTogJy9zb21lL3BhdGgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRzIGNvZGUgYXNzZXQgbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRU5BQkxFRF9DT05URVhULCB0cnVlKTtcblxuICAgICAgY29uc3QgZG9ja2VyZmlsZVBhdGggPSAnRG9ja2VyZmlsZSc7XG4gICAgICBjb25zdCBkb2NrZXJCdWlsZFRhcmdldCA9ICdzdGFnZSc7XG4gICAgICBjb25zdCBkb2NrZXJCdWlsZEFyZ3MgPSB7IGFyZzE6ICd2YWwxJywgYXJnMjogJ3ZhbDInIH07XG4gICAgICBjb25zdCBkb2NrZXJCdWlsZFNlY3JldHMgPSB7IG15c2VjcmV0OiBjZGsuRG9ja2VyQnVpbGRTZWNyZXQuZnJvbVNyYygnYWJjLnR4dCcpIH07XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0SW1hZ2UocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RvY2tlci1sYW1iZGEtaGFuZGxlcicpLCB7XG4gICAgICAgICAgZmlsZTogZG9ja2VyZmlsZVBhdGgsXG4gICAgICAgICAgdGFyZ2V0OiBkb2NrZXJCdWlsZFRhcmdldCxcbiAgICAgICAgICBidWlsZEFyZ3M6IGRvY2tlckJ1aWxkQXJncyxcbiAgICAgICAgICBidWlsZFNlY3JldHM6IHsgbXlzZWNyZXQ6ICdzcmM9YWJjLnR4dCcgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWV06ICdhc3NldC4xZWY3Y2IyMGJjZjY5OGYxZDZkYzYxZmU4MDE0NGNlMjFiMTFkZWY0N2RkMDgyMjBkMzU5N2Q4MzRkNGU3MzhmJyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSRklMRV9QQVRIX0tFWV06IGRvY2tlcmZpbGVQYXRoLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJfQlVJTERfQVJHU19LRVldOiBkb2NrZXJCdWlsZEFyZ3MsXG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUl9CVUlMRF9TRUNSRVRTX0tFWV06IGRvY2tlckJ1aWxkU2VjcmV0cyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSX0JVSUxEX1RBUkdFVF9LRVldOiBkb2NrZXJCdWlsZFRhcmdldCxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUFJPUEVSVFlfS0VZXTogJ0NvZGUuSW1hZ2VVcmknLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRzIGNvZGUgYXNzZXQgbWV0YWRhdGEgd2l0aCBkZWZhdWx0IGRvY2tlcmZpbGUgcGF0aCcsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWV06ICdhc3NldC43NjhkN2I2YzFkNDFiODUxMzVmNDk4ZmUwY2NhNjlmZWE0MTBiZTNjMzMyMmM2OWNmMDg2OTBhYWFkMjlhNjEwJyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSRklMRV9QQVRIX0tFWV06ICdEb2NrZXJmaWxlJyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUFJPUEVSVFlfS0VZXTogJ0NvZGUuSW1hZ2VVcmknLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiBhc3NldCBpcyBib3VuZCB3aXRoIGEgc2Vjb25kIHN0YWNrJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBhc3NldCA9IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItbGFtYmRhLWhhbmRsZXInKSk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMSwgJ0ZuJywge1xuICAgICAgICBjb2RlOiBhc3NldCxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdGbicsIHtcbiAgICAgICAgY29kZTogYXNzZXQsXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KSkudG9UaHJvdygvYWxyZWFkeSBhc3NvY2lhdGVkLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tRG9ja2VyQnVpbGQnLCAoKSA9PiB7XG4gICAgbGV0IGZyb21CdWlsZE1vY2s6IGplc3QuU3B5SW5zdGFuY2U8Y2RrLkRvY2tlckltYWdlPjtcbiAgICBsZXQgY3BNb2NrOiBqZXN0Lk1vY2s8YW55LCBhbnk+O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjcE1vY2sgPSBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJykpO1xuICAgICAgZnJvbUJ1aWxkTW9jayA9IGplc3Quc3B5T24oY2RrLkRvY2tlckltYWdlLCAnZnJvbUJ1aWxkJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+ICh7XG4gICAgICAgIGNwOiBjcE1vY2ssXG4gICAgICAgIGltYWdlOiAndGFnJyxcbiAgICAgICAgcnVuOiBqZXN0LmZuKCksXG4gICAgICAgIHRvSlNPTjogamVzdC5mbigpLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIGZyb21CdWlsZE1vY2subW9ja1Jlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB1c2UgdGhlIHJlc3VsdCBvZiBhIERvY2tlciBidWlsZCBhcyBhbiBhc3NldCcsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Eb2NrZXJCdWlsZChwYXRoLmpvaW4oX19kaXJuYW1lLCAnZG9ja2VyLWJ1aWxkLWxhbWJkYScpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BBVEhfS0VZXTogJ2Fzc2V0LmZiYWZkYmI5YWU4ZDFiYWUwZGVmNDE1Yjc5MWE5M2M0ODZkMThlYmM2MzI3MGM3NDhhYmVjYzNhYzBhYjk1MzMnLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9JU19CVU5ETEVEX0tFWV06IGZhbHNlLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QUk9QRVJUWV9LRVldOiAnQ29kZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGZyb21CdWlsZE1vY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJyksIHt9KTtcbiAgICAgIGV4cGVjdChjcE1vY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvYXNzZXQvLicsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmcm9tRG9ja2VyQnVpbGQgYXBwZW5kcyAvLiB0byBhbiBpbWFnZSBwYXRoIG5vdCBlbmRpbmcgd2l0aCBhIC8nLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbURvY2tlckJ1aWxkKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJyksIHtcbiAgICAgICAgICBpbWFnZVBhdGg6ICcvbXkvaW1hZ2UvcGF0aCcsXG4gICAgICAgIH0pLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZW5cbiAgICAgIGV4cGVjdChjcE1vY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvbXkvaW1hZ2UvcGF0aC8uJywgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Zyb21Eb2NrZXJCdWlsZCBhcHBlbmRzIC4gdG8gYW4gaW1hZ2UgcGF0aCBlbmRpbmcgd2l0aCBhIC8nLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbURvY2tlckJ1aWxkKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJyksIHtcbiAgICAgICAgICBpbWFnZVBhdGg6ICcvbXkvaW1hZ2UvcGF0aC8nLFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBleHBlY3QoY3BNb2NrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL215L2ltYWdlL3BhdGgvLicsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGRlZmluZUZ1bmN0aW9uKGNvZGU6IGxhbWJkYS5Db2RlLCBydW50aW1lOiBsYW1iZGEuUnVudGltZSA9IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YKSB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICByZXR1cm4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmMnLCB7XG4gICAgaGFuZGxlcjogJ2Zvb20nLFxuICAgIGNvZGUsXG4gICAgcnVudGltZSxcbiAgfSk7XG59XG4iXX0=
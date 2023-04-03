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
            // when
            new lambda.Function(stack, 'Fn', {
                code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker-lambda-handler'), {
                    file: dockerfilePath,
                    target: dockerBuildTarget,
                    buildArgs: dockerBuildArgs,
                }),
                handler: lambda.Handler.FROM_IMAGE,
                runtime: lambda.Runtime.FROM_IMAGE,
            });
            // then
            assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
                Metadata: {
                    [cxapi.ASSET_RESOURCE_METADATA_PATH_KEY]: 'asset.30b57ded32316be9aa6553a1d81689f1e0cb475a94306c557e05048f9f56bd79',
                    [cxapi.ASSET_RESOURCE_METADATA_DOCKERFILE_PATH_KEY]: dockerfilePath,
                    [cxapi.ASSET_RESOURCE_METADATA_DOCKER_BUILD_ARGS_KEY]: dockerBuildArgs,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QyxpQ0FBaUM7QUFFakMsaUNBQWlDO0FBRWpDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDdEMsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUNuRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUNwSSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUNySSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNyQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLFFBQVE7WUFDUixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBRS9GLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFD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QztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLGNBQWMsQ0FBQyxJQUFpQixFQUFFLFVBQTBCLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztJQUM3RixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ3hDLE9BQU8sRUFBRSxNQUFNO1FBQ2YsSUFBSTtRQUNKLE9BQU87S0FDUixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWNyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3InO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBkb3Qtbm90YXRpb24gKi9cblxuZGVzY3JpYmUoJ2NvZGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tSW5saW5lJywgKCkgPT4ge1xuICAgIHRlc3QoJ2ZhaWxzIGlmIHVzZWQgd2l0aCB1bnN1cHBvcnRlZCBydW50aW1lcycsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBkZWZpbmVGdW5jdGlvbihsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdib29tJyksIGxhbWJkYS5SdW50aW1lLkdPXzFfWCkpLnRvVGhyb3coL0lubGluZSBzb3VyY2Ugbm90IGFsbG93ZWQgZm9yIGdvMVxcLngvKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBkZWZpbmVGdW5jdGlvbihsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdib29tJyksIGxhbWJkYS5SdW50aW1lLkpBVkFfOCkpLnRvVGhyb3coL0lubGluZSBzb3VyY2Ugbm90IGFsbG93ZWQgZm9yIGphdmE4Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tQXNzZXQnLCAoKSA9PiB7XG4gICAgdGVzdCgnZmFpbHMgaWYgYSBub24temlwIGFzc2V0IGlzIHVzZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZmlsZUFzc2V0ID0gbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS1sYW1iZGEtaGFuZGxlcicsICdpbmRleC5weScpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGRlZmluZUZ1bmN0aW9uKGZpbGVBc3NldCkpLnRvVGhyb3coL0Fzc2V0IG11c3QgYmUgYSBcXC56aXAgZmlsZSBvciBhIGRpcmVjdG9yeS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb25seSBvbmUgQXNzZXQgb2JqZWN0IGdldHMgY3JlYXRlZCBldmVuIGlmIG11bHRpcGxlIGZ1bmN0aW9ucyB1c2UgdGhlIHNhbWUgQXNzZXRDb2RlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICAgIGNvbnN0IGRpcmVjdG9yeUFzc2V0ID0gbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS1sYW1iZGEtaGFuZGxlcicpKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmMxJywge1xuICAgICAgICBoYW5kbGVyOiAnZm9vbScsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBjb2RlOiBkaXJlY3RvcnlBc3NldCxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRnVuYzInLCB7XG4gICAgICAgIGhhbmRsZXI6ICdmb29tJyxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGRpcmVjdG9yeUFzc2V0LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCBzeW50aGVzaXplZCA9IGFzc2VtYmx5LnN0YWNrc1swXTtcblxuICAgICAgLy8gRnVuYzEgaGFzIGFuIGFzc2V0LCBGdW5jMiBkb2VzIG5vdFxuICAgICAgZXhwZWN0KHN5bnRoZXNpemVkLmFzc2V0cy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRzIGNvZGUgYXNzZXQgbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRU5BQkxFRF9DT05URVhULCB0cnVlKTtcblxuICAgICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmMxJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQobG9jYXRpb24pLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgaGFuZGxlcjogJ2Zvb20nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgTWV0YWRhdGE6IHtcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUEFUSF9LRVldOiAnYXNzZXQuOTY3OGMzNGVjYTkzMjU5ZDExZjJkNzE0MTc3MzQ3YWZkNjZjNTAxMTZlMWUwODk5NmVmZjg5M2QzY2E4MTIzMicsXG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0lTX0JVTkRMRURfS0VZXTogZmFsc2UsXG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BST1BFUlRZX0tFWV06ICdDb2RlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaWYgYXNzZXQgaXMgYm91bmQgd2l0aCBhIHNlY29uZCBzdGFjaycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhc3NldCA9IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktbGFtYmRhLWhhbmRsZXInKSk7XG5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjazEgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazEsICdGdW5jJywge1xuICAgICAgICBjb2RlOiBhc3NldCxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGhhbmRsZXI6ICdmb29tJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgICAgZXhwZWN0KCgpID0+IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2syLCAnRnVuYycsIHtcbiAgICAgICAgY29kZTogYXNzZXQsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgICBoYW5kbGVyOiAnZm9vbScsXG4gICAgICB9KSkudG9UaHJvdygvYWxyZWFkeSBhc3NvY2lhdGVkLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tQ2ZuUGFyYW1ldGVycycsICgpID0+IHtcbiAgICB0ZXN0KFwiYXV0b21hdGljYWxseSBjcmVhdGVzIHRoZSBCdWNrZXQgYW5kIEtleSBwYXJhbWV0ZXJzIHdoZW4gaXQncyB1c2VkIGluIGEgRnVuY3Rpb25cIiwgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBjb2RlID0gbmV3IGxhbWJkYS5DZm5QYXJhbWV0ZXJzQ29kZSgpO1xuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgICBjb2RlLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIENvZGU6IHtcbiAgICAgICAgICBTM0J1Y2tldDoge1xuICAgICAgICAgICAgUmVmOiAnRnVuY3Rpb25MYW1iZGFTb3VyY2VCdWNrZXROYW1lUGFyYW1ldGVyOUU5RTEwOEYnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUzNLZXk6IHtcbiAgICAgICAgICAgIFJlZjogJ0Z1bmN0aW9uTGFtYmRhU291cmNlT2JqZWN0S2V5UGFyYW1ldGVyMUM3QUVEMTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY29kZS5idWNrZXROYW1lUGFyYW0pKS50b0VxdWFsKCdGdW5jdGlvbkxhbWJkYVNvdXJjZUJ1Y2tldE5hbWVQYXJhbWV0ZXI5RTlFMTA4RicpO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY29kZS5vYmplY3RLZXlQYXJhbSkpLnRvRXF1YWwoJ0Z1bmN0aW9uTGFtYmRhU291cmNlT2JqZWN0S2V5UGFyYW1ldGVyMUM3QUVEMTEnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvZXMgbm90IGFsbG93IGFjY2Vzc2luZyB0aGUgUGFyYW1ldGVyIHByb3BlcnRpZXMgYmVmb3JlIGJlaW5nIHVzZWQgaW4gYSBGdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvZGUgPSBuZXcgbGFtYmRhLkNmblBhcmFtZXRlcnNDb2RlKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBjb2RlLmJ1Y2tldE5hbWVQYXJhbSkudG9UaHJvdygvYnVja2V0TmFtZVBhcmFtLyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBjb2RlLm9iamVjdEtleVBhcmFtKS50b1Rocm93KC9vYmplY3RLZXlQYXJhbS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHBhc3NpbmcgY3VzdG9tIFBhcmFtZXRlcnMgd2hlbiBjcmVhdGluZyBpdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0TmFtZVBhcmFtID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIoc3RhY2ssICdCdWNrZXROYW1lUGFyYW0nLCB7XG4gICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBidWNrZXRLZXlQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnT2JqZWN0S2V5UGFyYW0nLCB7XG4gICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNvZGUgPSBsYW1iZGEuQ29kZS5mcm9tQ2ZuUGFyYW1ldGVycyh7XG4gICAgICAgIGJ1Y2tldE5hbWVQYXJhbSxcbiAgICAgICAgb2JqZWN0S2V5UGFyYW06IGJ1Y2tldEtleVBhcmFtLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGNvZGUuYnVja2V0TmFtZVBhcmFtKSkudG9FcXVhbCgnQnVja2V0TmFtZVBhcmFtJyk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjb2RlLm9iamVjdEtleVBhcmFtKSkudG9FcXVhbCgnT2JqZWN0S2V5UGFyYW0nKTtcblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmN0aW9uJywge1xuICAgICAgICBjb2RlLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIENvZGU6IHtcbiAgICAgICAgICBTM0J1Y2tldDoge1xuICAgICAgICAgICAgUmVmOiAnQnVja2V0TmFtZVBhcmFtJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFMzS2V5OiB7XG4gICAgICAgICAgICBSZWY6ICdPYmplY3RLZXlQYXJhbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGFzc2lnbiBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgY29kZSA9IG5ldyBsYW1iZGEuQ2ZuUGFyYW1ldGVyc0NvZGUoe1xuICAgICAgICBidWNrZXROYW1lUGFyYW06IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnQnVja2V0TmFtZVBhcmFtJywge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICB9KSxcbiAgICAgICAgb2JqZWN0S2V5UGFyYW06IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnT2JqZWN0S2V5UGFyYW0nLCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIGNvbnN0IG92ZXJyaWRlcyA9IHN0YWNrLnJlc29sdmUoY29kZS5hc3NpZ24oe1xuICAgICAgICBidWNrZXROYW1lOiAnU29tZUJ1Y2tldE5hbWUnLFxuICAgICAgICBvYmplY3RLZXk6ICdTb21lT2JqZWN0S2V5JyxcbiAgICAgIH0pKTtcblxuICAgICAgLy8gdGhlblxuICAgICAgZXhwZWN0KG92ZXJyaWRlc1snQnVja2V0TmFtZVBhcmFtJ10pLnRvRXF1YWwoJ1NvbWVCdWNrZXROYW1lJyk7XG4gICAgICBleHBlY3Qob3ZlcnJpZGVzWydPYmplY3RLZXlQYXJhbSddKS50b0VxdWFsKCdTb21lT2JqZWN0S2V5Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tRWNyJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JlcG9zaXRvcnkgdXJpIGlzIGNvcnJlY3RseSBpZGVudGlmaWVkJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgLy8gd2hlblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tRWNySW1hZ2UocmVwbyksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgICAgQ29kZToge1xuICAgICAgICAgIEltYWdlVXJpOiBzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeVVyaUZvclRhZygnbGF0ZXN0JykpLFxuICAgICAgICB9LFxuICAgICAgICBJbWFnZUNvbmZpZzogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Byb3BzIGFyZSBjb3JyZWN0bHkgcmVzb2x2ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCByZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21FY3JJbWFnZShyZXBvLCB7XG4gICAgICAgICAgY21kOiBbJ2NtZCcsICdwYXJhbTEnXSxcbiAgICAgICAgICBlbnRyeXBvaW50OiBbJ2VudHJ5cG9pbnQnLCAncGFyYW0yJ10sXG4gICAgICAgICAgdGFnT3JEaWdlc3Q6ICdteXRhZycsXG4gICAgICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy9zb21lL3BhdGgnLFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgSW1hZ2VVcmk6IHN0YWNrLnJlc29sdmUocmVwby5yZXBvc2l0b3J5VXJpRm9yVGFnKCdteXRhZycpKSxcbiAgICAgICAgfSxcbiAgICAgICAgSW1hZ2VDb25maWc6IHtcbiAgICAgICAgICBDb21tYW5kOiBbJ2NtZCcsICdwYXJhbTEnXSxcbiAgICAgICAgICBFbnRyeVBvaW50OiBbJ2VudHJ5cG9pbnQnLCAncGFyYW0yJ10sXG4gICAgICAgICAgV29ya2luZ0RpcmVjdG9yeTogJy9zb21lL3BhdGgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkaWdlc3RzIGFyZSBpbnRlcnByZXRlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCByZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21FY3JJbWFnZShyZXBvLCB7XG4gICAgICAgICAgdGFnT3JEaWdlc3Q6ICdzaGEyNTY6YWZjNjA3NDI0Y2MwMmM5MmQ0ZDZhZjUxODRhNGZlZjQ2YTY5NTQ4ZTQ2NWEzMjA4MDhjNmZmMzU4YjZhM2E4ZCcsXG4gICAgICAgIH0pLFxuICAgICAgICBoYW5kbGVyOiBsYW1iZGEuSGFuZGxlci5GUk9NX0lNQUdFLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5GUk9NX0lNQUdFLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZW5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIENvZGU6IHtcbiAgICAgICAgICBJbWFnZVVyaTogc3RhY2sucmVzb2x2ZShyZXBvLnJlcG9zaXRvcnlVcmlGb3JEaWdlc3QoJ3NoYTI1NjphZmM2MDc0MjRjYzAyYzkyZDRkNmFmNTE4NGE0ZmVmNDZhNjk1NDhlNDY1YTMyMDgwOGM2ZmYzNThiNmEzYThkJykpLFxuICAgICAgICB9LFxuICAgICAgICBJbWFnZUNvbmZpZzogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Blcm1pc3Npb24gZ3JhbnRzJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgLy8gd2hlblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tRWNySW1hZ2UocmVwbyksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgICBSZXBvc2l0b3J5UG9saWN5VGV4dDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAnZWNyOkJhdGNoQ2hlY2tMYXllckF2YWlsYWJpbGl0eScsXG4gICAgICAgICAgICAgICAgJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJyxcbiAgICAgICAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xhbWJkYS5Db2RlLmZyb21JbWFnZUFzc2V0JywgKCkgPT4ge1xuICAgIHRlc3QoJ3Byb3BzIGFyZSBjb3JyZWN0bHkgcmVzb2x2ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0SW1hZ2UocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RvY2tlci1sYW1iZGEtaGFuZGxlcicpLCB7XG4gICAgICAgICAgY21kOiBbJ2NtZCcsICdwYXJhbTEnXSxcbiAgICAgICAgICBlbnRyeXBvaW50OiBbJ2VudHJ5cG9pbnQnLCAncGFyYW0yJ10sXG4gICAgICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy9zb21lL3BhdGgnLFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBJbWFnZUNvbmZpZzoge1xuICAgICAgICAgIENvbW1hbmQ6IFsnY21kJywgJ3BhcmFtMSddLFxuICAgICAgICAgIEVudHJ5UG9pbnQ6IFsnZW50cnlwb2ludCcsICdwYXJhbTInXSxcbiAgICAgICAgICBXb3JraW5nRGlyZWN0b3J5OiAnL3NvbWUvcGF0aCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZHMgY29kZSBhc3NldCBtZXRhZGF0YScsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgICBjb25zdCBkb2NrZXJmaWxlUGF0aCA9ICdEb2NrZXJmaWxlJztcbiAgICAgIGNvbnN0IGRvY2tlckJ1aWxkVGFyZ2V0ID0gJ3N0YWdlJztcbiAgICAgIGNvbnN0IGRvY2tlckJ1aWxkQXJncyA9IHsgYXJnMTogJ3ZhbDEnLCBhcmcyOiAndmFsMicgfTtcblxuICAgICAgLy8gd2hlblxuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0ZuJywge1xuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXRJbWFnZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnZG9ja2VyLWxhbWJkYS1oYW5kbGVyJyksIHtcbiAgICAgICAgICBmaWxlOiBkb2NrZXJmaWxlUGF0aCxcbiAgICAgICAgICB0YXJnZXQ6IGRvY2tlckJ1aWxkVGFyZ2V0LFxuICAgICAgICAgIGJ1aWxkQXJnczogZG9ja2VyQnVpbGRBcmdzLFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BBVEhfS0VZXTogJ2Fzc2V0LjMwYjU3ZGVkMzIzMTZiZTlhYTY1NTNhMWQ4MTY4OWYxZTBjYjQ3NWE5NDMwNmM1NTdlMDUwNDhmOWY1NmJkNzknLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9ET0NLRVJGSUxFX1BBVEhfS0VZXTogZG9ja2VyZmlsZVBhdGgsXG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX0RPQ0tFUl9CVUlMRF9BUkdTX0tFWV06IGRvY2tlckJ1aWxkQXJncyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSX0JVSUxEX1RBUkdFVF9LRVldOiBkb2NrZXJCdWlsZFRhcmdldCxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUFJPUEVSVFlfS0VZXTogJ0NvZGUuSW1hZ2VVcmknLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRzIGNvZGUgYXNzZXQgbWV0YWRhdGEgd2l0aCBkZWZhdWx0IGRvY2tlcmZpbGUgcGF0aCcsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItbGFtYmRhLWhhbmRsZXInKSksXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWV06ICdhc3NldC43NjhkN2I2YzFkNDFiODUxMzVmNDk4ZmUwY2NhNjlmZWE0MTBiZTNjMzMyMmM2OWNmMDg2OTBhYWFkMjlhNjEwJyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRE9DS0VSRklMRV9QQVRIX0tFWV06ICdEb2NrZXJmaWxlJyxcbiAgICAgICAgICBbY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUFJPUEVSVFlfS0VZXTogJ0NvZGUuSW1hZ2VVcmknLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiBhc3NldCBpcyBib3VuZCB3aXRoIGEgc2Vjb25kIHN0YWNrJywgKCkgPT4ge1xuICAgICAgLy8gZ2l2ZW5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBhc3NldCA9IGxhbWJkYS5Db2RlLmZyb21Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItbGFtYmRhLWhhbmRsZXInKSk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrMSwgJ0ZuJywge1xuICAgICAgICBjb2RlOiBhc3NldCxcbiAgICAgICAgaGFuZGxlcjogbGFtYmRhLkhhbmRsZXIuRlJPTV9JTUFHRSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuRlJPTV9JTUFHRSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdGbicsIHtcbiAgICAgICAgY29kZTogYXNzZXQsXG4gICAgICAgIGhhbmRsZXI6IGxhbWJkYS5IYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLkZST01fSU1BR0UsXG4gICAgICB9KSkudG9UaHJvdygvYWxyZWFkeSBhc3NvY2lhdGVkLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEuQ29kZS5mcm9tRG9ja2VyQnVpbGQnLCAoKSA9PiB7XG4gICAgbGV0IGZyb21CdWlsZE1vY2s6IGplc3QuU3B5SW5zdGFuY2U8Y2RrLkRvY2tlckltYWdlPjtcbiAgICBsZXQgY3BNb2NrOiBqZXN0Lk1vY2s8YW55LCBhbnk+O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjcE1vY2sgPSBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJykpO1xuICAgICAgZnJvbUJ1aWxkTW9jayA9IGplc3Quc3B5T24oY2RrLkRvY2tlckltYWdlLCAnZnJvbUJ1aWxkJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+ICh7XG4gICAgICAgIGNwOiBjcE1vY2ssXG4gICAgICAgIGltYWdlOiAndGFnJyxcbiAgICAgICAgcnVuOiBqZXN0LmZuKCksXG4gICAgICAgIHRvSlNPTjogamVzdC5mbigpLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIGZyb21CdWlsZE1vY2subW9ja1Jlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB1c2UgdGhlIHJlc3VsdCBvZiBhIERvY2tlciBidWlsZCBhcyBhbiBhc3NldCcsICgpID0+IHtcbiAgICAgIC8vIGdpdmVuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgICAvLyB3aGVuXG4gICAgICBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Eb2NrZXJCdWlsZChwYXRoLmpvaW4oX19kaXJuYW1lLCAnZG9ja2VyLWJ1aWxkLWxhbWJkYScpKSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICAgW2N4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BBVEhfS0VZXTogJ2Fzc2V0LmZiYWZkYmI5YWU4ZDFiYWUwZGVmNDE1Yjc5MWE5M2M0ODZkMThlYmM2MzI3MGM3NDhhYmVjYzNhYzBhYjk1MzMnLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9JU19CVU5ETEVEX0tFWV06IGZhbHNlLFxuICAgICAgICAgIFtjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QUk9QRVJUWV9LRVldOiAnQ29kZScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGZyb21CdWlsZE1vY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJyksIHt9KTtcbiAgICAgIGV4cGVjdChjcE1vY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvYXNzZXQvLicsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmcm9tRG9ja2VyQnVpbGQgYXBwZW5kcyAvLiB0byBhbiBpbWFnZSBwYXRoIG5vdCBlbmRpbmcgd2l0aCBhIC8nLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbURvY2tlckJ1aWxkKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJyksIHtcbiAgICAgICAgICBpbWFnZVBhdGg6ICcvbXkvaW1hZ2UvcGF0aCcsXG4gICAgICAgIH0pLFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZW5cbiAgICAgIGV4cGVjdChjcE1vY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvbXkvaW1hZ2UvcGF0aC8uJywgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Zyb21Eb2NrZXJCdWlsZCBhcHBlbmRzIC4gdG8gYW4gaW1hZ2UgcGF0aCBlbmRpbmcgd2l0aCBhIC8nLCAoKSA9PiB7XG4gICAgICAvLyBnaXZlblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIHdoZW5cbiAgICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbURvY2tlckJ1aWxkKHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYnVpbGQtbGFtYmRhJyksIHtcbiAgICAgICAgICBpbWFnZVBhdGg6ICcvbXkvaW1hZ2UvcGF0aC8nLFxuICAgICAgICB9KSxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGVuXG4gICAgICBleHBlY3QoY3BNb2NrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL215L2ltYWdlL3BhdGgvLicsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGRlZmluZUZ1bmN0aW9uKGNvZGU6IGxhbWJkYS5Db2RlLCBydW50aW1lOiBsYW1iZGEuUnVudGltZSA9IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YKSB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICByZXR1cm4gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0Z1bmMnLCB7XG4gICAgaGFuZGxlcjogJ2Zvb20nLFxuICAgIGNvZGUsXG4gICAgcnVudGltZSxcbiAgfSk7XG59XG4iXX0=
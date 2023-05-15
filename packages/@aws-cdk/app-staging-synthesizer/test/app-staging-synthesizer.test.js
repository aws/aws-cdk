"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const evaluate_cfn_1 = require("./evaluate-cfn");
const util_1 = require("./util");
const lib_1 = require("../lib");
describe(lib_1.AppStagingSynthesizer, () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new aws_cdk_lib_1.App({
            defaultStackSynthesizer: lib_1.AppStagingSynthesizer.defaultResources({ appId: util_1.APP_ID }),
        });
        stack = new aws_cdk_lib_1.Stack(app, 'Stack', {
            env: {
                account: '000000000000',
                region: 'us-east-1',
            },
        });
    });
    test('stack template is in asset manifest', () => {
        // GIVEN
        new aws_cdk_lib_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // WHEN
        const asm = app.synth();
        // THEN -- the S3 url is advertised on the stack artifact
        const stackArtifact = asm.getStackArtifact('Stack');
        const templateObjectKey = (0, util_1.last)(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
        expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-${util_1.APP_ID}-staging-000000000000-us-east-1/${templateObjectKey}`);
        // THEN - the template is in the asset manifest
        const manifestArtifact = asm.artifacts.filter(util_1.isAssetManifest)[0];
        expect(manifestArtifact).toBeDefined();
        const manifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
        const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};
        expect(firstFile).toEqual({
            source: { path: 'Stack.template.json', packaging: 'file' },
            destinations: {
                '000000000000-us-east-1': {
                    bucketName: `cdk-${util_1.APP_ID}-staging-000000000000-us-east-1`,
                    objectKey: templateObjectKey,
                    region: 'us-east-1',
                    assumeRoleArn: `arn:\${AWS::Partition}:iam::000000000000:role/cdk-${util_1.APP_ID}-file-role-us-east-1`,
                },
            },
        });
    });
    test('stack template is in the asset manifest - environment tokens', () => {
        const app2 = new aws_cdk_lib_1.App({
            defaultStackSynthesizer: lib_1.AppStagingSynthesizer.defaultResources({ appId: util_1.APP_ID }),
        });
        const accountToken = aws_cdk_lib_1.Token.asString('111111111111');
        const regionToken = aws_cdk_lib_1.Token.asString('us-east-2');
        const stack2 = new aws_cdk_lib_1.Stack(app2, 'Stack2', {
            env: {
                account: accountToken,
                region: regionToken,
            },
        });
        // GIVEN
        new aws_cdk_lib_1.CfnResource(stack2, 'Resource', {
            type: 'Some::Resource',
        });
        // WHEN
        const asm = app2.synth();
        // THEN -- the S3 url is advertised on the stack artifact
        const stackArtifact = asm.getStackArtifact('Stack2');
        const templateObjectKey = (0, util_1.last)(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
        expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-${util_1.APP_ID}-staging-${accountToken}-${regionToken}/${templateObjectKey}`);
        // THEN - the template is in the asset manifest
        const manifestArtifact = asm.artifacts.filter(util_1.isAssetManifest)[0];
        expect(manifestArtifact).toBeDefined();
        const manifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
        const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};
        expect(firstFile).toEqual({
            source: { path: 'Stack2.template.json', packaging: 'file' },
            destinations: {
                '111111111111-us-east-2': {
                    bucketName: `cdk-${util_1.APP_ID}-staging-111111111111-us-east-2`,
                    objectKey: templateObjectKey,
                    region: 'us-east-2',
                    assumeRoleArn: `arn:\${AWS::Partition}:iam::111111111111:role/cdk-${util_1.APP_ID}-file-role-us-east-2`,
                },
            },
        });
    });
    test('stack depends on staging stack', () => {
        // WHEN
        stack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: aws_cdk_lib_1.FileAssetPackaging.FILE,
            sourceHash: 'abcdef',
        });
        // THEN - we have a stack dependency on the staging stack
        expect(stack.dependencies.length).toEqual(1);
        const depStack = stack.dependencies[0];
        expect(depStack.stackName).toEqual(`StagingStack-${util_1.APP_ID}`);
    });
    test('add file asset', () => {
        // WHEN
        const location = stack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: aws_cdk_lib_1.FileAssetPackaging.FILE,
            sourceHash: 'abcdef',
        });
        // THEN - we have a fixed asset location
        expect(evalCFN(location.bucketName)).toEqual(`cdk-${util_1.APP_ID}-staging-000000000000-us-east-1`);
        expect(evalCFN(location.httpUrl)).toEqual(`https://s3.us-east-1.domain.aws/cdk-${util_1.APP_ID}-staging-000000000000-us-east-1/abcdef.js`);
        // THEN - object key contains source hash somewhere
        expect(location.objectKey.indexOf('abcdef')).toBeGreaterThan(-1);
    });
    test('adding multiple files only creates one bucket', () => {
        // WHEN
        const location1 = stack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: aws_cdk_lib_1.FileAssetPackaging.FILE,
            sourceHash: 'abcdef',
        });
        const location2 = stack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: aws_cdk_lib_1.FileAssetPackaging.FILE,
            sourceHash: 'zyxwvu',
        });
        // THEN - assets have the same location
        expect(evalCFN(location1.bucketName)).toEqual(evalCFN(location2.bucketName));
    });
    describe('ephemeral assets', () => {
        test('ephemeral assets have the \'handoff/\' prefix', () => {
            // WHEN
            const location = stack.synthesizer.addFileAsset({
                fileName: __filename,
                packaging: aws_cdk_lib_1.FileAssetPackaging.FILE,
                sourceHash: 'abcdef',
                ephemeral: true,
            });
            // THEN - asset has bucket prefix
            expect(evalCFN(location.objectKey)).toEqual('handoff/abcdef.js');
        });
        test('ephemeral assets do not get specified bucketPrefix', () => {
            // GIVEN
            app = new aws_cdk_lib_1.App({
                defaultStackSynthesizer: lib_1.AppStagingSynthesizer.defaultResources({ appId: util_1.APP_ID }),
            });
            stack = new aws_cdk_lib_1.Stack(app, 'Stack', {
                env: {
                    account: '000000000000',
                    region: 'us-west-2',
                },
            });
            // WHEN
            const location = stack.synthesizer.addFileAsset({
                fileName: __filename,
                packaging: aws_cdk_lib_1.FileAssetPackaging.FILE,
                sourceHash: 'abcdef',
                ephemeral: true,
            });
            // THEN - asset has bucket prefix
            expect(evalCFN(location.objectKey)).toEqual('handoff/abcdef.js');
        });
        test('s3 bucket has lifecycle rule on ephemeral assets by default', () => {
            // GIVEN
            new aws_cdk_lib_1.CfnResource(stack, 'Resource', {
                type: 'Some::Resource',
            });
            // WHEN
            const asm = app.synth();
            // THEN
            assertions_1.Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::S3::Bucket', {
                LifecycleConfiguration: {
                    Rules: assertions_1.Match.arrayWith([{
                            ExpirationInDays: 30,
                            Prefix: 'handoff/',
                            Status: 'Enabled',
                        }]),
                },
            });
        });
        test('lifecycle rule on ephemeral assets can be customized', () => {
            // GIVEN
            app = new aws_cdk_lib_1.App({
                defaultStackSynthesizer: lib_1.AppStagingSynthesizer.defaultResources({
                    appId: util_1.APP_ID,
                    handoffFileAssetLifetime: aws_cdk_lib_1.Duration.days(1),
                }),
            });
            stack = new aws_cdk_lib_1.Stack(app, 'Stack', {
                env: {
                    account: '000000000000',
                    region: 'us-west-2',
                },
            });
            new aws_cdk_lib_1.CfnResource(stack, 'Resource', {
                type: 'Some::Resource',
            });
            // WHEN
            const asm = app.synth();
            // THEN
            const stagingStackArtifact = asm.getStackArtifact(`StagingStack-${util_1.APP_ID}-000000000000-us-west-2`);
            assertions_1.Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::Bucket', {
                LifecycleConfiguration: {
                    Rules: assertions_1.Match.arrayWith([{
                            ExpirationInDays: 1,
                            Prefix: 'handoff/',
                            Status: 'Enabled',
                        }]),
                },
            });
        });
    });
    test('bucket has policy referring to deploymentrolearn', () => {
        new aws_cdk_lib_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // WHEN
        const asm = app.synth();
        // THEN
        const stagingStackArtifact = asm.getStackArtifact(`StagingStack-${util_1.APP_ID}-000000000000-us-east-1`);
        assertions_1.Template.fromJSON(stagingStackArtifact.template).hasResourceProperties('AWS::S3::BucketPolicy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        Effect: 'Allow',
                        Principal: {
                            AWS: assertions_1.Match.anyValue(),
                        },
                        Action: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                        ],
                    }),
                ]),
            },
        });
    });
    test('add docker image asset', () => {
        // WHEN
        const assetName = 'abcdef';
        const location = stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
            assetName,
        });
        // THEN - we have a fixed asset location
        const repo = `${util_1.APP_ID}/${assetName}`;
        expect(evalCFN(location.repositoryName)).toEqual(repo);
        expect(evalCFN(location.imageUri)).toEqual(`000000000000.dkr.ecr.us-east-1.domain.aws/${repo}:abcdef`);
    });
    test('throws with docker image asset without assetName', () => {
        expect(() => stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
        })).toThrowError('Assets synthesized with AppScopedStagingSynthesizer must include an \'assetName\' in the asset source definition.');
    });
    test('docker image assets with different assetName have separate repos', () => {
        // WHEN
        const location1 = stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
            assetName: 'firstAsset',
        });
        const location2 = stack.synthesizer.addDockerImageAsset({
            directoryName: './hello',
            sourceHash: 'abcdef',
            assetName: 'secondAsset',
        });
        // THEN - images have different asset locations
        expect(evalCFN(location1.repositoryName)).not.toEqual(evalCFN(location2.repositoryName));
    });
    test('docker image assets with same assetName live in same repos', () => {
        // WHEN
        const assetName = 'abcdef';
        const location1 = stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
            assetName,
        });
        const location2 = stack.synthesizer.addDockerImageAsset({
            directoryName: './hello',
            sourceHash: 'abcdefg',
            assetName,
        });
        // THEN - images share same ecr repo
        expect(evalCFN(location1.repositoryName)).toEqual(`${util_1.APP_ID}/${assetName}`);
        expect(evalCFN(location1.repositoryName)).toEqual(evalCFN(location2.repositoryName));
    });
    test('docker image repositories have lifecycle rule - default', () => {
        // GIVEN
        const assetName = 'abcdef';
        stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
            assetName,
        });
        // WHEN
        const asm = app.synth();
        // THEN
        assertions_1.Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                LifecyclePolicyText: assertions_1.Match.serializedJson({
                    rules: assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            selection: assertions_1.Match.objectLike({
                                countType: 'imageCountMoreThan',
                                countNumber: 3,
                            }),
                        }),
                    ]),
                }),
            },
            RepositoryName: `${util_1.APP_ID}/${assetName}`,
        });
    });
    test('docker image repositories have lifecycle rule - specified', () => {
        // GIVEN
        app = new aws_cdk_lib_1.App({
            defaultStackSynthesizer: lib_1.AppStagingSynthesizer.defaultResources({
                appId: util_1.APP_ID,
                imageAssetVersionCount: 1,
            }),
        });
        stack = new aws_cdk_lib_1.Stack(app, 'Stack', {
            env: {
                account: '000000000000',
                region: 'us-east-1',
            },
        });
        const assetName = 'abcdef';
        stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
            assetName,
        });
        // WHEN
        const asm = app.synth();
        // THEN
        assertions_1.Template.fromJSON(getStagingResourceStack(asm).template).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                LifecyclePolicyText: assertions_1.Match.serializedJson({
                    rules: assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            selection: assertions_1.Match.objectLike({
                                countType: 'imageCountMoreThan',
                                countNumber: 1,
                            }),
                        }),
                    ]),
                }),
            },
            RepositoryName: `${util_1.APP_ID}/${assetName}`,
        });
    });
    describe('environment specifics', () => {
        test('throws if App includes env-agnostic and specific env stacks', () => {
            // GIVEN - App with Stack with specific environment
            // THEN - Expect environment agnostic stack to fail
            expect(() => new aws_cdk_lib_1.Stack(app, 'NoEnvStack')).toThrowError(/It is not safe to use AppStagingSynthesizer/);
        });
    });
    test('throws if synthesizer props have tokens', () => {
        expect(() => new aws_cdk_lib_1.App({
            defaultStackSynthesizer: lib_1.AppStagingSynthesizer.defaultResources({
                appId: aws_cdk_lib_1.Lazy.string({ produce: () => 'appId' }),
            }),
        })).toThrowError(/AppStagingSynthesizer property 'appId' may not contain tokens;/);
    });
    test('throws when staging resource stack is too large', () => {
        // WHEN
        const assetName = 'abcdef';
        for (let i = 0; i < 100; i++) {
            stack.synthesizer.addDockerImageAsset({
                directoryName: '.',
                sourceHash: 'abcdef',
                assetName: assetName + i,
            });
        }
        // THEN
        expect(() => app.synth()).toThrowError(/Staging resource template cannot be greater than 51200 bytes/);
    });
    /**
    * Evaluate a possibly string-containing value the same way CFN would do
    *
    * (Be invariant to the specific Fn::Sub or Fn::Join we would output)
    */
    function evalCFN(value) {
        return (0, evaluate_cfn_1.evaluateCFN)(stack.resolve(value), util_1.CFN_CONTEXT);
    }
    /**
     * Return the staging resource stack that is generated as part of the assembly
     */
    function getStagingResourceStack(asm) {
        return asm.getStackArtifact(`StagingStack-${util_1.APP_ID}-000000000000-us-east-1`);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0YWdpbmctc3ludGhlc2l6ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1zdGFnaW5nLXN5bnRoZXNpemVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsNkNBQWlHO0FBQ2pHLHVEQUF5RDtBQUd6RCxpREFBNkM7QUFDN0MsaUNBQW9FO0FBQ3BFLGdDQUErQztBQUUvQyxRQUFRLENBQUMsMkJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7WUFDWix1QkFBdUIsRUFBRSwyQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxhQUFNLEVBQUUsQ0FBQztTQUNuRixDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7WUFDOUIsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFBRSxjQUFjO2dCQUN2QixNQUFNLEVBQUUsV0FBVzthQUNwQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxRQUFRO1FBQ1IsSUFBSSx5QkFBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDakMsSUFBSSxFQUFFLGdCQUFnQjtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLHlEQUF5RDtRQUN6RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLFdBQUksRUFBQyxhQUFhLENBQUMsMkJBQTJC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R0FBRztnQkFDbEIsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFNBQVMsRUFBRSxTQUFTLEdBQUcsQ0FBQzthQUN6QixDQUFDLENBQUM7U0FDSjtRQUVELE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7SUFDekcsQ0FBQyxDQUFDLENBQUM7SUFFSDs7OztNQUlFO0lBQ0YsU0FBUyxPQUFPLENBQUMsS0FBVTtRQUN6QixPQUFPLElBQUEsMEJBQVcsRUFBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLGtCQUFXLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLHVCQUF1QixDQUFDLEdBQWtCO1FBQ2pELE9BQU8sR0FBRyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixhQUFNLHlCQUF5QixDQUFDLENBQUM7SUFDL0UsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgQ2ZuUmVzb3VyY2UsIEZpbGVBc3NldFBhY2thZ2luZywgVG9rZW4sIExhenksIER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdhd3MtY2RrLWxpYi9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQ2xvdWRBc3NlbWJseSB9IGZyb20gJ2F3cy1jZGstbGliL2N4LWFwaSc7XG5pbXBvcnQgeyBldmFsdWF0ZUNGTiB9IGZyb20gJy4vZXZhbHVhdGUtY2ZuJztcbmltcG9ydCB7IEFQUF9JRCwgQ0ZOX0NPTlRFWFQsIGlzQXNzZXRNYW5pZmVzdCwgbGFzdCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBBcHBTdGFnaW5nU3ludGhlc2l6ZXIgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZShBcHBTdGFnaW5nU3ludGhlc2l6ZXIsICgpID0+IHtcbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoe1xuICAgICAgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXI6IEFwcFN0YWdpbmdTeW50aGVzaXplci5kZWZhdWx0UmVzb3VyY2VzKHsgYXBwSWQ6IEFQUF9JRCB9KSxcbiAgICB9KTtcbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMDAwMDAwMDAwMDAwJyxcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIHRlbXBsYXRlIGlzIGluIGFzc2V0IG1hbmlmZXN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTiAtLSB0aGUgUzMgdXJsIGlzIGFkdmVydGlzZWQgb24gdGhlIHN0YWNrIGFydGlmYWN0XG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IGFzbS5nZXRTdGFja0FydGlmYWN0KCdTdGFjaycpO1xuXG4gICAgY29uc3QgdGVtcGxhdGVPYmplY3RLZXkgPSBsYXN0KHN0YWNrQXJ0aWZhY3Quc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsPy5zcGxpdCgnLycpKTtcbiAgICBleHBlY3Qoc3RhY2tBcnRpZmFjdC5zdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmwpLnRvRXF1YWwoYHMzOi8vY2RrLSR7QVBQX0lEfS1zdGFnaW5nLTAwMDAwMDAwMDAwMC11cy1lYXN0LTEvJHt0ZW1wbGF0ZU9iamVjdEtleX1gKTtcblxuICAgIC8vIFRIRU4gLSB0aGUgdGVtcGxhdGUgaXMgaW4gdGhlIGFzc2V0IG1hbmlmZXN0XG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGFzbS5hcnRpZmFjdHMuZmlsdGVyKGlzQXNzZXRNYW5pZmVzdClbMF07XG4gICAgZXhwZWN0KG1hbmlmZXN0QXJ0aWZhY3QpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3QgbWFuaWZlc3Q6IGN4c2NoZW1hLkFzc2V0TWFuaWZlc3QgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtYW5pZmVzdEFydGlmYWN0LmZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpO1xuXG4gICAgY29uc3QgZmlyc3RGaWxlID0gKG1hbmlmZXN0LmZpbGVzID8gbWFuaWZlc3QuZmlsZXNbT2JqZWN0LmtleXMobWFuaWZlc3QuZmlsZXMpWzBdXSA6IHVuZGVmaW5lZCkgPz8ge307XG5cbiAgICBleHBlY3QoZmlyc3RGaWxlKS50b0VxdWFsKHtcbiAgICAgIHNvdXJjZTogeyBwYXRoOiAnU3RhY2sudGVtcGxhdGUuanNvbicsIHBhY2thZ2luZzogJ2ZpbGUnIH0sXG4gICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgJzAwMDAwMDAwMDAwMC11cy1lYXN0LTEnOiB7XG4gICAgICAgICAgYnVja2V0TmFtZTogYGNkay0ke0FQUF9JRH0tc3RhZ2luZy0wMDAwMDAwMDAwMDAtdXMtZWFzdC0xYCxcbiAgICAgICAgICBvYmplY3RLZXk6IHRlbXBsYXRlT2JqZWN0S2V5LFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgYXNzdW1lUm9sZUFybjogYGFybjpcXCR7QVdTOjpQYXJ0aXRpb259OmlhbTo6MDAwMDAwMDAwMDAwOnJvbGUvY2RrLSR7QVBQX0lEfS1maWxlLXJvbGUtdXMtZWFzdC0xYCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIHRlbXBsYXRlIGlzIGluIHRoZSBhc3NldCBtYW5pZmVzdCAtIGVudmlyb25tZW50IHRva2VucycsICgpID0+IHtcbiAgICBjb25zdCBhcHAyID0gbmV3IEFwcCh7XG4gICAgICBkZWZhdWx0U3RhY2tTeW50aGVzaXplcjogQXBwU3RhZ2luZ1N5bnRoZXNpemVyLmRlZmF1bHRSZXNvdXJjZXMoeyBhcHBJZDogQVBQX0lEIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IGFjY291bnRUb2tlbiA9IFRva2VuLmFzU3RyaW5nKCcxMTExMTExMTExMTEnKTtcbiAgICBjb25zdCByZWdpb25Ub2tlbiA9IFRva2VuLmFzU3RyaW5nKCd1cy1lYXN0LTInKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwMiwgJ1N0YWNrMicsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiBhY2NvdW50VG9rZW4sXG4gICAgICAgIHJlZ2lvbjogcmVnaW9uVG9rZW4sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gR0lWRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzbSA9IGFwcDIuc3ludGgoKTtcblxuICAgIC8vIFRIRU4gLS0gdGhlIFMzIHVybCBpcyBhZHZlcnRpc2VkIG9uIHRoZSBzdGFjayBhcnRpZmFjdFxuICAgIGNvbnN0IHN0YWNrQXJ0aWZhY3QgPSBhc20uZ2V0U3RhY2tBcnRpZmFjdCgnU3RhY2syJyk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZU9iamVjdEtleSA9IGxhc3Qoc3RhY2tBcnRpZmFjdC5zdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmw/LnNwbGl0KCcvJykpO1xuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LnN0YWNrVGVtcGxhdGVBc3NldE9iamVjdFVybCkudG9FcXVhbChgczM6Ly9jZGstJHtBUFBfSUR9LXN0YWdpbmctJHthY2NvdW50VG9rZW59LSR7cmVnaW9uVG9rZW59LyR7dGVtcGxhdGVPYmplY3RLZXl9YCk7XG5cbiAgICAvLyBUSEVOIC0gdGhlIHRlbXBsYXRlIGlzIGluIHRoZSBhc3NldCBtYW5pZmVzdFxuICAgIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBhc20uYXJ0aWZhY3RzLmZpbHRlcihpc0Fzc2V0TWFuaWZlc3QpWzBdO1xuICAgIGV4cGVjdChtYW5pZmVzdEFydGlmYWN0KS50b0JlRGVmaW5lZCgpO1xuICAgIGNvbnN0IG1hbmlmZXN0OiBjeHNjaGVtYS5Bc3NldE1hbmlmZXN0ID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMobWFuaWZlc3RBcnRpZmFjdC5maWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcblxuICAgIGNvbnN0IGZpcnN0RmlsZSA9IChtYW5pZmVzdC5maWxlcyA/IG1hbmlmZXN0LmZpbGVzW09iamVjdC5rZXlzKG1hbmlmZXN0LmZpbGVzKVswXV0gOiB1bmRlZmluZWQpID8/IHt9O1xuXG4gICAgZXhwZWN0KGZpcnN0RmlsZSkudG9FcXVhbCh7XG4gICAgICBzb3VyY2U6IHsgcGF0aDogJ1N0YWNrMi50ZW1wbGF0ZS5qc29uJywgcGFja2FnaW5nOiAnZmlsZScgfSxcbiAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAnMTExMTExMTExMTExLXVzLWVhc3QtMic6IHtcbiAgICAgICAgICBidWNrZXROYW1lOiBgY2RrLSR7QVBQX0lEfS1zdGFnaW5nLTExMTExMTExMTExMS11cy1lYXN0LTJgLFxuICAgICAgICAgIG9iamVjdEtleTogdGVtcGxhdGVPYmplY3RLZXksXG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgICAgICAgICBhc3N1bWVSb2xlQXJuOiBgYXJuOlxcJHtBV1M6OlBhcnRpdGlvbn06aWFtOjoxMTExMTExMTExMTE6cm9sZS9jZGstJHtBUFBfSUR9LWZpbGUtcm9sZS11cy1lYXN0LTJgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgZGVwZW5kcyBvbiBzdGFnaW5nIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gd2UgaGF2ZSBhIHN0YWNrIGRlcGVuZGVuY3kgb24gdGhlIHN0YWdpbmcgc3RhY2tcbiAgICBleHBlY3Qoc3RhY2suZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBjb25zdCBkZXBTdGFjayA9IHN0YWNrLmRlcGVuZGVuY2llc1swXTtcbiAgICBleHBlY3QoZGVwU3RhY2suc3RhY2tOYW1lKS50b0VxdWFsKGBTdGFnaW5nU3RhY2stJHtBUFBfSUR9YCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBmaWxlIGFzc2V0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSB3ZSBoYXZlIGEgZml4ZWQgYXNzZXQgbG9jYXRpb25cbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5idWNrZXROYW1lKSkudG9FcXVhbChgY2RrLSR7QVBQX0lEfS1zdGFnaW5nLTAwMDAwMDAwMDAwMC11cy1lYXN0LTFgKTtcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5odHRwVXJsKSkudG9FcXVhbChgaHR0cHM6Ly9zMy51cy1lYXN0LTEuZG9tYWluLmF3cy9jZGstJHtBUFBfSUR9LXN0YWdpbmctMDAwMDAwMDAwMDAwLXVzLWVhc3QtMS9hYmNkZWYuanNgKTtcblxuICAgIC8vIFRIRU4gLSBvYmplY3Qga2V5IGNvbnRhaW5zIHNvdXJjZSBoYXNoIHNvbWV3aGVyZVxuICAgIGV4cGVjdChsb2NhdGlvbi5vYmplY3RLZXkuaW5kZXhPZignYWJjZGVmJykpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBtdWx0aXBsZSBmaWxlcyBvbmx5IGNyZWF0ZXMgb25lIGJ1Y2tldCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbG9jYXRpb24xID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgIH0pO1xuICAgIGNvbnN0IGxvY2F0aW9uMiA9IHN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnenl4d3Z1JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBhc3NldHMgaGF2ZSB0aGUgc2FtZSBsb2NhdGlvblxuICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uMS5idWNrZXROYW1lKSkudG9FcXVhbChldmFsQ0ZOKGxvY2F0aW9uMi5idWNrZXROYW1lKSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlcGhlbWVyYWwgYXNzZXRzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2VwaGVtZXJhbCBhc3NldHMgaGF2ZSB0aGUgXFwnaGFuZG9mZi9cXCcgcHJlZml4JywgKCkgPT4ge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbG9jYXRpb24gPSBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgICAgIGVwaGVtZXJhbDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gYXNzZXQgaGFzIGJ1Y2tldCBwcmVmaXhcbiAgICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uLm9iamVjdEtleSkpLnRvRXF1YWwoJ2hhbmRvZmYvYWJjZGVmLmpzJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdlcGhlbWVyYWwgYXNzZXRzIGRvIG5vdCBnZXQgc3BlY2lmaWVkIGJ1Y2tldFByZWZpeCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXI6IEFwcFN0YWdpbmdTeW50aGVzaXplci5kZWZhdWx0UmVzb3VyY2VzKHsgYXBwSWQ6IEFQUF9JRCB9KSxcbiAgICAgIH0pO1xuICAgICAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcwMDAwMDAwMDAwMDAnLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbG9jYXRpb24gPSBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgICAgIGVwaGVtZXJhbDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gYXNzZXQgaGFzIGJ1Y2tldCBwcmVmaXhcbiAgICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uLm9iamVjdEtleSkpLnRvRXF1YWwoJ2hhbmRvZmYvYWJjZGVmLmpzJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzMyBidWNrZXQgaGFzIGxpZmVjeWNsZSBydWxlIG9uIGVwaGVtZXJhbCBhc3NldHMgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbUpTT04oZ2V0U3RhZ2luZ1Jlc291cmNlU3RhY2soYXNtKS50ZW1wbGF0ZSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAgIExpZmVjeWNsZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBSdWxlczogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICBFeHBpcmF0aW9uSW5EYXlzOiAzMCxcbiAgICAgICAgICAgIFByZWZpeDogJ2hhbmRvZmYvJyxcbiAgICAgICAgICAgIFN0YXR1czogJ0VuYWJsZWQnLFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbGlmZWN5Y2xlIHJ1bGUgb24gZXBoZW1lcmFsIGFzc2V0cyBjYW4gYmUgY3VzdG9taXplZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBhcHAgPSBuZXcgQXBwKHtcbiAgICAgICAgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXI6IEFwcFN0YWdpbmdTeW50aGVzaXplci5kZWZhdWx0UmVzb3VyY2VzKHtcbiAgICAgICAgICBhcHBJZDogQVBQX0lELFxuICAgICAgICAgIGhhbmRvZmZGaWxlQXNzZXRMaWZldGltZTogRHVyYXRpb24uZGF5cygxKSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMDAwMDAwMDAwMDAwJyxcbiAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3Qgc3RhZ2luZ1N0YWNrQXJ0aWZhY3QgPSBhc20uZ2V0U3RhY2tBcnRpZmFjdChgU3RhZ2luZ1N0YWNrLSR7QVBQX0lEfS0wMDAwMDAwMDAwMDAtdXMtd2VzdC0yYCk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21KU09OKHN0YWdpbmdTdGFja0FydGlmYWN0LnRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgICAgTGlmZWN5Y2xlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIFJ1bGVzOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgIEV4cGlyYXRpb25JbkRheXM6IDEsXG4gICAgICAgICAgICBQcmVmaXg6ICdoYW5kb2ZmLycsXG4gICAgICAgICAgICBTdGF0dXM6ICdFbmFibGVkJyxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IGhhcyBwb2xpY3kgcmVmZXJyaW5nIHRvIGRlcGxveW1lbnRyb2xlYXJuJywgKCkgPT4ge1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBzdGFnaW5nU3RhY2tBcnRpZmFjdCA9IGFzbS5nZXRTdGFja0FydGlmYWN0KGBTdGFnaW5nU3RhY2stJHtBUFBfSUR9LTAwMDAwMDAwMDAwMC11cy1lYXN0LTFgKTtcblxuICAgIFRlbXBsYXRlLmZyb21KU09OKHN0YWdpbmdTdGFja0FydGlmYWN0LnRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgZG9ja2VyIGltYWdlIGFzc2V0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldE5hbWUgPSAnYWJjZGVmJztcbiAgICBjb25zdCBsb2NhdGlvbiA9IHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgICBhc3NldE5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gd2UgaGF2ZSBhIGZpeGVkIGFzc2V0IGxvY2F0aW9uXG4gICAgY29uc3QgcmVwbyA9IGAke0FQUF9JRH0vJHthc3NldE5hbWV9YDtcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5yZXBvc2l0b3J5TmFtZSkpLnRvRXF1YWwocmVwbyk7XG4gICAgZXhwZWN0KGV2YWxDRk4obG9jYXRpb24uaW1hZ2VVcmkpKS50b0VxdWFsKGAwMDAwMDAwMDAwMDAuZGtyLmVjci51cy1lYXN0LTEuZG9tYWluLmF3cy8ke3JlcG99OmFiY2RlZmApO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBkb2NrZXIgaW1hZ2UgYXNzZXQgd2l0aG91dCBhc3NldE5hbWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgfSkpLnRvVGhyb3dFcnJvcignQXNzZXRzIHN5bnRoZXNpemVkIHdpdGggQXBwU2NvcGVkU3RhZ2luZ1N5bnRoZXNpemVyIG11c3QgaW5jbHVkZSBhbiBcXCdhc3NldE5hbWVcXCcgaW4gdGhlIGFzc2V0IHNvdXJjZSBkZWZpbml0aW9uLicpO1xuICB9KTtcblxuICB0ZXN0KCdkb2NrZXIgaW1hZ2UgYXNzZXRzIHdpdGggZGlmZmVyZW50IGFzc2V0TmFtZSBoYXZlIHNlcGFyYXRlIHJlcG9zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2NhdGlvbjEgPSBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICcuJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgICAgYXNzZXROYW1lOiAnZmlyc3RBc3NldCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsb2NhdGlvbjIgPSBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICcuL2hlbGxvJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgICAgYXNzZXROYW1lOiAnc2Vjb25kQXNzZXQnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIGltYWdlcyBoYXZlIGRpZmZlcmVudCBhc3NldCBsb2NhdGlvbnNcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbjEucmVwb3NpdG9yeU5hbWUpKS5ub3QudG9FcXVhbChldmFsQ0ZOKGxvY2F0aW9uMi5yZXBvc2l0b3J5TmFtZSkpO1xuICB9KTtcblxuICB0ZXN0KCdkb2NrZXIgaW1hZ2UgYXNzZXRzIHdpdGggc2FtZSBhc3NldE5hbWUgbGl2ZSBpbiBzYW1lIHJlcG9zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldE5hbWUgPSAnYWJjZGVmJztcbiAgICBjb25zdCBsb2NhdGlvbjEgPSBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICcuJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgICAgYXNzZXROYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbG9jYXRpb24yID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiAnLi9oZWxsbycsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmZycsXG4gICAgICBhc3NldE5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gaW1hZ2VzIHNoYXJlIHNhbWUgZWNyIHJlcG9cbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbjEucmVwb3NpdG9yeU5hbWUpKS50b0VxdWFsKGAke0FQUF9JRH0vJHthc3NldE5hbWV9YCk7XG4gICAgZXhwZWN0KGV2YWxDRk4obG9jYXRpb24xLnJlcG9zaXRvcnlOYW1lKSkudG9FcXVhbChldmFsQ0ZOKGxvY2F0aW9uMi5yZXBvc2l0b3J5TmFtZSkpO1xuICB9KTtcblxuICB0ZXN0KCdkb2NrZXIgaW1hZ2UgcmVwb3NpdG9yaWVzIGhhdmUgbGlmZWN5Y2xlIHJ1bGUgLSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXNzZXROYW1lID0gJ2FiY2RlZic7XG4gICAgc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiAnLicsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICAgIGFzc2V0TmFtZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tSlNPTihnZXRTdGFnaW5nUmVzb3VyY2VTdGFjayhhc20pLnRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgTGlmZWN5Y2xlUG9saWN5OiB7XG4gICAgICAgIExpZmVjeWNsZVBvbGljeVRleHQ6IE1hdGNoLnNlcmlhbGl6ZWRKc29uKHtcbiAgICAgICAgICBydWxlczogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICBzZWxlY3Rpb246IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAgIGNvdW50VHlwZTogJ2ltYWdlQ291bnRNb3JlVGhhbicsXG4gICAgICAgICAgICAgICAgY291bnROdW1iZXI6IDMsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSksXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICAgIFJlcG9zaXRvcnlOYW1lOiBgJHtBUFBfSUR9LyR7YXNzZXROYW1lfWAsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvY2tlciBpbWFnZSByZXBvc2l0b3JpZXMgaGF2ZSBsaWZlY3ljbGUgcnVsZSAtIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGFwcCA9IG5ldyBBcHAoe1xuICAgICAgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXI6IEFwcFN0YWdpbmdTeW50aGVzaXplci5kZWZhdWx0UmVzb3VyY2VzKHtcbiAgICAgICAgYXBwSWQ6IEFQUF9JRCxcbiAgICAgICAgaW1hZ2VBc3NldFZlcnNpb25Db3VudDogMSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcwMDAwMDAwMDAwMDAnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzc2V0TmFtZSA9ICdhYmNkZWYnO1xuICAgIHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgICBhc3NldE5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbUpTT04oZ2V0U3RhZ2luZ1Jlc291cmNlU3RhY2soYXNtKS50ZW1wbGF0ZSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgIExpZmVjeWNsZVBvbGljeToge1xuICAgICAgICBMaWZlY3ljbGVQb2xpY3lUZXh0OiBNYXRjaC5zZXJpYWxpemVkSnNvbih7XG4gICAgICAgICAgcnVsZXM6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgICBjb3VudFR5cGU6ICdpbWFnZUNvdW50TW9yZVRoYW4nLFxuICAgICAgICAgICAgICAgIGNvdW50TnVtYmVyOiAxLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgICBSZXBvc2l0b3J5TmFtZTogYCR7QVBQX0lEfS8ke2Fzc2V0TmFtZX1gLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZW52aXJvbm1lbnQgc3BlY2lmaWNzJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Rocm93cyBpZiBBcHAgaW5jbHVkZXMgZW52LWFnbm9zdGljIGFuZCBzcGVjaWZpYyBlbnYgc3RhY2tzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU4gLSBBcHAgd2l0aCBTdGFjayB3aXRoIHNwZWNpZmljIGVudmlyb25tZW50XG5cbiAgICAgIC8vIFRIRU4gLSBFeHBlY3QgZW52aXJvbm1lbnQgYWdub3N0aWMgc3RhY2sgdG8gZmFpbFxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBTdGFjayhhcHAsICdOb0VudlN0YWNrJykpLnRvVGhyb3dFcnJvcigvSXQgaXMgbm90IHNhZmUgdG8gdXNlIEFwcFN0YWdpbmdTeW50aGVzaXplci8pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgc3ludGhlc2l6ZXIgcHJvcHMgaGF2ZSB0b2tlbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBBcHAoe1xuICAgICAgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXI6IEFwcFN0YWdpbmdTeW50aGVzaXplci5kZWZhdWx0UmVzb3VyY2VzKHtcbiAgICAgICAgYXBwSWQ6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ2FwcElkJyB9KSxcbiAgICAgIH0pLFxuICAgIH0pKS50b1Rocm93RXJyb3IoL0FwcFN0YWdpbmdTeW50aGVzaXplciBwcm9wZXJ0eSAnYXBwSWQnIG1heSBub3QgY29udGFpbiB0b2tlbnM7Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIHN0YWdpbmcgcmVzb3VyY2Ugc3RhY2sgaXMgdG9vIGxhcmdlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldE5hbWUgPSAnYWJjZGVmJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICAgICAgYXNzZXROYW1lOiBhc3NldE5hbWUgKyBpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvd0Vycm9yKC9TdGFnaW5nIHJlc291cmNlIHRlbXBsYXRlIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gNTEyMDAgYnl0ZXMvKTtcbiAgfSk7XG5cbiAgLyoqXG4gICogRXZhbHVhdGUgYSBwb3NzaWJseSBzdHJpbmctY29udGFpbmluZyB2YWx1ZSB0aGUgc2FtZSB3YXkgQ0ZOIHdvdWxkIGRvXG4gICpcbiAgKiAoQmUgaW52YXJpYW50IHRvIHRoZSBzcGVjaWZpYyBGbjo6U3ViIG9yIEZuOjpKb2luIHdlIHdvdWxkIG91dHB1dClcbiAgKi9cbiAgZnVuY3Rpb24gZXZhbENGTih2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUodmFsdWUpLCBDRk5fQ09OVEVYVCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBzdGFnaW5nIHJlc291cmNlIHN0YWNrIHRoYXQgaXMgZ2VuZXJhdGVkIGFzIHBhcnQgb2YgdGhlIGFzc2VtYmx5XG4gICAqL1xuICBmdW5jdGlvbiBnZXRTdGFnaW5nUmVzb3VyY2VTdGFjayhhc206IENsb3VkQXNzZW1ibHkpIHtcbiAgICByZXR1cm4gYXNtLmdldFN0YWNrQXJ0aWZhY3QoYFN0YWdpbmdTdGFjay0ke0FQUF9JRH0tMDAwMDAwMDAwMDAwLXVzLWVhc3QtMWApO1xuICB9XG59KTtcbiJdfQ==
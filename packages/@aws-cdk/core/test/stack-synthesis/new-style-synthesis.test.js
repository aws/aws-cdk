"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../../lib");
const evaluate_cfn_1 = require("../evaluate-cfn");
const CFN_CONTEXT = {
    'AWS::Region': 'the_region',
    'AWS::AccountId': 'the_account',
    'AWS::URLSuffix': 'domain.aws',
};
describe('new style synthesis', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new lib_1.App({
            context: {
                [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: 'true',
            },
        });
        stack = new lib_1.Stack(app, 'Stack');
    });
    test('stack template is in asset manifest', () => {
        // GIVEN
        new lib_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // WHEN
        const asm = app.synth();
        // THEN -- the S3 url is advertised on the stack artifact
        const stackArtifact = asm.getStackArtifact('Stack');
        const templateObjectKey = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
        expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-hnb659fds-assets-\${AWS::AccountId}-\${AWS::Region}/${templateObjectKey}`);
        // THEN - the template is in the asset manifest
        const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
        expect(manifestArtifact).toBeDefined();
        const manifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
        const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};
        expect(firstFile).toEqual({
            source: { path: 'Stack.template.json', packaging: 'file' },
            destinations: {
                'current_account-current_region': {
                    bucketName: 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
                    objectKey: templateObjectKey,
                    assumeRoleArn: 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-file-publishing-role-${AWS::AccountId}-${AWS::Region}',
                },
            },
        });
    });
    test('version check is added to both template and manifest artifact', () => {
        // GIVEN
        new lib_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // THEN
        const asm = app.synth();
        const manifestArtifact = getAssetManifest(asm);
        expect(manifestArtifact.requiresBootstrapStackVersion).toEqual(6);
        const template = asm.getStackByName('Stack').template;
        expect(template?.Parameters?.BootstrapVersion?.Type).toEqual('AWS::SSM::Parameter::Value<String>');
        expect(template?.Parameters?.BootstrapVersion?.Default).toEqual('/cdk-bootstrap/hnb659fds/version');
        expect(template?.Parameters?.BootstrapVersion?.Description).toContain(cxapi.SSMPARAM_NO_INVALIDATE);
        const assertions = template?.Rules?.CheckBootstrapVersion?.Assertions ?? [];
        expect(assertions.length).toEqual(1);
        expect(assertions[0].Assert).toEqual({
            'Fn::Not': [
                { 'Fn::Contains': [['1', '2', '3', '4', '5'], { Ref: 'BootstrapVersion' }] },
            ],
        });
    });
    test('version check is not added to template if disabled', () => {
        // GIVEN
        stack = new lib_1.Stack(app, 'Stack2', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                generateBootstrapVersionRule: false,
            }),
        });
        new lib_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // THEN
        const template = app.synth().getStackByName('Stack2').template;
        expect(template?.Rules?.CheckBootstrapVersion).toEqual(undefined);
    });
    test('customize version parameter', () => {
        // GIVEN
        const myapp = new lib_1.App();
        // WHEN
        const mystack = new lib_1.Stack(myapp, 'mystack', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                bootstrapStackVersionSsmParameter: 'stack-version-parameter',
            }),
        });
        mystack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: lib_1.FileAssetPackaging.FILE,
            sourceHash: 'file-asset-hash',
        });
        // THEN
        const asm = myapp.synth();
        const manifestArtifact = getAssetManifest(asm);
        // THEN - the asset manifest has an SSM parameter entry
        expect(manifestArtifact.bootstrapStackVersionSsmParameter).toEqual('stack-version-parameter');
    });
    test('contains asset but not requiring a specific version parameter', () => {
        // GIVEN
        class BootstraplessStackSynthesizer extends lib_1.DefaultStackSynthesizer {
            /**
             * Synthesize the associated bootstrap stack to the session.
             */
            synthesize(session) {
                this.synthesizeTemplate(session);
                session.assembly.addArtifact('FAKE_ARTIFACT_ID', {
                    type: cloud_assembly_schema_1.ArtifactType.ASSET_MANIFEST,
                    properties: {
                        file: 'FAKE_ARTIFACT_ID.json',
                    },
                });
                this.emitArtifact(session, {
                    additionalDependencies: ['FAKE_ARTIFACT_ID'],
                });
            }
        }
        const myapp = new lib_1.App();
        // WHEN
        new lib_1.Stack(myapp, 'mystack', {
            synthesizer: new BootstraplessStackSynthesizer(),
        });
        // THEN
        const asm = myapp.synth();
        const manifestArtifact = getAssetManifest(asm);
        // THEN - the asset manifest should not define a required bootstrap stack version
        expect(manifestArtifact.requiresBootstrapStackVersion).toEqual(undefined);
    });
    test('generates missing context with the lookup role ARN as one of the missing context properties', () => {
        // GIVEN
        stack = new lib_1.Stack(app, 'Stack2', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                generateBootstrapVersionRule: false,
            }),
            env: {
                account: '111111111111', region: 'us-east-1',
            },
        });
        lib_1.ContextProvider.getValue(stack, {
            provider: cxschema.ContextProvider.VPC_PROVIDER,
            props: {},
            dummyValue: undefined,
        }).value;
        // THEN
        const assembly = app.synth();
        expect(assembly.manifest.missing[0].props.lookupRoleArn).toEqual('arn:${AWS::Partition}:iam::111111111111:role/cdk-hnb659fds-lookup-role-111111111111-us-east-1');
    });
    test('add file asset', () => {
        // WHEN
        const location = stack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: lib_1.FileAssetPackaging.FILE,
            sourceHash: 'abcdef',
        });
        // THEN - we have a fixed asset location with region placeholders
        expect(evalCFN(location.bucketName)).toEqual('cdk-hnb659fds-assets-the_account-the_region');
        expect(evalCFN(location.s3Url)).toEqual('https://s3.the_region.domain.aws/cdk-hnb659fds-assets-the_account-the_region/abcdef.js');
        // THEN - object key contains source hash somewhere
        expect(location.objectKey.indexOf('abcdef')).toBeGreaterThan(-1);
    });
    test('add docker image asset', () => {
        // WHEN
        const location = stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
        });
        // THEN - we have a fixed asset location with region placeholders
        expect(evalCFN(location.repositoryName)).toEqual('cdk-hnb659fds-container-assets-the_account-the_region');
        expect(evalCFN(location.imageUri)).toEqual('the_account.dkr.ecr.the_region.domain.aws/cdk-hnb659fds-container-assets-the_account-the_region:abcdef');
    });
    test('dockerBuildArgs or dockerBuildSecrets without directoryName', () => {
        // WHEN
        expect(() => {
            stack.synthesizer.addDockerImageAsset({
                sourceHash: 'abcdef',
                dockerBuildArgs: {
                    ABC: '123',
                },
            });
        }).toThrowError(/Exactly one of 'directoryName' or 'executable' is required/);
        expect(() => {
            stack.synthesizer.addDockerImageAsset({
                sourceHash: 'abcdef',
                dockerBuildSecrets: {
                    DEF: '456',
                },
            });
        }).toThrowError(/Exactly one of 'directoryName' or 'executable' is required/);
    });
    test('synthesis', () => {
        // GIVEN
        stack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: lib_1.FileAssetPackaging.FILE,
            sourceHash: 'abcdef',
        });
        stack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'abcdef',
        });
        // WHEN
        const asm = app.synth();
        // THEN - we have an asset manifest with both assets and the stack template in there
        const manifestArtifact = getAssetManifest(asm);
        const manifest = readAssetManifest(manifestArtifact);
        expect(Object.keys(manifest.files || {}).length).toEqual(2);
        expect(Object.keys(manifest.dockerImages || {}).length).toEqual(1);
        // THEN - the asset manifest has an SSM parameter entry
        expect(manifestArtifact.bootstrapStackVersionSsmParameter).toEqual('/cdk-bootstrap/hnb659fds/version');
        // THEN - every artifact has an assumeRoleArn
        for (const file of Object.values(manifest.files ?? {})) {
            for (const destination of Object.values(file.destinations)) {
                expect(destination.assumeRoleArn).toEqual('arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-file-publishing-role-${AWS::AccountId}-${AWS::Region}');
            }
        }
        for (const file of Object.values(manifest.dockerImages ?? {})) {
            for (const destination of Object.values(file.destinations)) {
                expect(destination.assumeRoleArn).toEqual('arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-image-publishing-role-${AWS::AccountId}-${AWS::Region}');
            }
        }
    });
    test('customize publishing resources', () => {
        // GIVEN
        const myapp = new lib_1.App();
        // WHEN
        const mystack = new lib_1.Stack(myapp, 'mystack', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                fileAssetsBucketName: 'file-asset-bucket',
                fileAssetPublishingRoleArn: 'file:role:arn',
                fileAssetPublishingExternalId: 'file-external-id',
                imageAssetsRepositoryName: 'image-ecr-repository',
                imageAssetPublishingRoleArn: 'image:role:arn',
                imageAssetPublishingExternalId: 'image-external-id',
            }),
        });
        mystack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: lib_1.FileAssetPackaging.FILE,
            sourceHash: 'file-asset-hash',
        });
        mystack.synthesizer.addDockerImageAsset({
            directoryName: '.',
            sourceHash: 'docker-asset-hash',
        });
        // THEN
        const asm = myapp.synth();
        const manifest = readAssetManifest(getAssetManifest(asm));
        expect(manifest.files?.['file-asset-hash']?.destinations?.['current_account-current_region']).toEqual({
            bucketName: 'file-asset-bucket',
            objectKey: 'file-asset-hash.js',
            assumeRoleArn: 'file:role:arn',
            assumeRoleExternalId: 'file-external-id',
        });
        expect(manifest.dockerImages?.['docker-asset-hash']?.destinations?.['current_account-current_region']).toEqual({
            repositoryName: 'image-ecr-repository',
            imageTag: 'docker-asset-hash',
            assumeRoleArn: 'image:role:arn',
            assumeRoleExternalId: 'image-external-id',
        });
    });
    test('customize deploy role externalId', () => {
        // GIVEN
        const myapp = new lib_1.App();
        // WHEN
        const mystack = new lib_1.Stack(myapp, 'mystack', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                deployRoleExternalId: 'deploy-external-id',
            }),
        });
        // THEN
        const asm = myapp.synth();
        const stackArtifact = asm.getStackByName(mystack.stackName);
        expect(stackArtifact.assumeRoleExternalId).toEqual('deploy-external-id');
    });
    test('synthesis with bucketPrefix', () => {
        // GIVEN
        const myapp = new lib_1.App();
        // WHEN
        const mystack = new lib_1.Stack(myapp, 'mystack-bucketPrefix', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                fileAssetsBucketName: 'file-asset-bucket',
                fileAssetPublishingRoleArn: 'file:role:arn',
                fileAssetPublishingExternalId: 'file-external-id',
                bucketPrefix: '000000000000/',
            }),
        });
        mystack.synthesizer.addFileAsset({
            fileName: __filename,
            packaging: lib_1.FileAssetPackaging.FILE,
            sourceHash: 'file-asset-hash-with-prefix',
        });
        // WHEN
        const asm = myapp.synth();
        // THEN -- the S3 url is advertised on the stack artifact
        const stackArtifact = asm.getStackArtifact('mystack-bucketPrefix');
        // THEN - we have an asset manifest with both assets and the stack template in there
        const manifest = readAssetManifest(getAssetManifest(asm));
        // THEN
        expect(manifest.files?.['file-asset-hash-with-prefix']?.destinations?.['current_account-current_region']).toEqual({
            bucketName: 'file-asset-bucket',
            objectKey: '000000000000/file-asset-hash-with-prefix.js',
            assumeRoleArn: 'file:role:arn',
            assumeRoleExternalId: 'file-external-id',
        });
        const templateHash = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
        expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://file-asset-bucket/000000000000/${templateHash}`);
    });
    test('synthesis with dockerPrefix', () => {
        // GIVEN
        const myapp = new lib_1.App();
        // WHEN
        const mystack = new lib_1.Stack(myapp, 'mystack-dockerPrefix', {
            synthesizer: new lib_1.DefaultStackSynthesizer({
                dockerTagPrefix: 'test-prefix-',
            }),
        });
        mystack.synthesizer.addDockerImageAsset({
            directoryName: 'some-folder',
            sourceHash: 'docker-asset-hash',
        });
        const asm = myapp.synth();
        // THEN
        const manifest = readAssetManifest(getAssetManifest(asm));
        const imageTag = manifest.dockerImages?.['docker-asset-hash']?.destinations?.['current_account-current_region'].imageTag;
        expect(imageTag).toEqual('test-prefix-docker-asset-hash');
    });
    test('can use same synthesizer for multiple stacks', () => {
        // GIVEN
        const synthesizer = new lib_1.DefaultStackSynthesizer({
            bootstrapStackVersionSsmParameter: 'bleep',
        });
        // WHEN
        const stack1 = new lib_1.Stack(app, 'Stack1', { synthesizer });
        const stack2 = new lib_1.Stack(app, 'Stack2', { synthesizer });
        // THEN
        const asm = app.synth();
        for (const st of [stack1, stack2]) {
            const tpl = asm.getStackByName(st.stackName).template;
            expect(tpl).toEqual(expect.objectContaining({
                Parameters: expect.objectContaining({
                    BootstrapVersion: expect.objectContaining({
                        Default: 'bleep', // Assert that the settings have been applied
                    }),
                }),
            }));
        }
    });
    /**
     * Evaluate a possibly string-containing value the same way CFN would do
     *
     * (Be invariant to the specific Fn::Sub or Fn::Join we would output)
     */
    function evalCFN(value) {
        return (0, evaluate_cfn_1.evaluateCFN)(stack.resolve(value), CFN_CONTEXT);
    }
});
test('can specify synthesizer at the app level', () => {
    // GIVEN
    const app = new lib_1.App({
        defaultStackSynthesizer: new lib_1.DefaultStackSynthesizer({
            bootstrapStackVersionSsmParameter: 'bleep',
        }),
    });
    // WHEN
    const stack1 = new lib_1.Stack(app, 'Stack1');
    const stack2 = new lib_1.Stack(app, 'Stack2');
    // THEN
    const asm = app.synth();
    for (const st of [stack1, stack2]) {
        const tpl = asm.getStackByName(st.stackName).template;
        expect(tpl).toEqual(expect.objectContaining({
            Parameters: expect.objectContaining({
                BootstrapVersion: expect.objectContaining({
                    Default: 'bleep', // Assert that the settings have been applied
                }),
            }),
        }));
    }
});
test('get an exception when using tokens for parameters', () => {
    expect(() => {
        // GIVEN
        new lib_1.DefaultStackSynthesizer({
            fileAssetsBucketName: `my-bucket-${lib_1.Aws.REGION}`,
        });
    }).toThrow(/cannot contain tokens/);
});
function isAssetManifest(x) {
    return x instanceof cxapi.AssetManifestArtifact;
}
function getAssetManifest(asm) {
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    if (!manifestArtifact) {
        throw new Error('no asset manifest in assembly');
    }
    return manifestArtifact;
}
function readAssetManifest(manifestArtifact) {
    return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}
function last(xs) {
    return xs ? xs[xs.length - 1] : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXN0eWxlLXN5bnRoZXNpcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmV3LXN0eWxlLXN5bnRoZXNpcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDJEQUEyRDtBQUMzRCwwRUFBOEQ7QUFDOUQseUNBQXlDO0FBQ3pDLG1DQUF1SDtBQUV2SCxrREFBOEM7QUFFOUMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsZ0JBQWdCLEVBQUUsYUFBYTtJQUMvQixnQkFBZ0IsRUFBRSxZQUFZO0NBQy9CLENBQUM7QUFFRixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQztZQUNaLE9BQU8sRUFBRTtnQkFDUCxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLE1BQU07YUFDbEQ7U0FDRixDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWxDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxRQUFRO1FBQ1IsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDakMsSUFBSSxFQUFFLGdCQUFnQjtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLHlEQUF5RDtRQUN6RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLDJCQUEy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RCxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1YsUUFBUTtRQUNSLElBQUksNkJBQXVCLENBQUM7WUFDMUIsb0JBQW9CLEVBQUUsYUFBYSxTQUFHLENBQUMsTUFBTSxFQUFFO1NBQ2hELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxlQUFlLENBQUMsQ0FBc0I7SUFDN0MsT0FBTyxDQUFDLFlBQVksS0FBSyxDQUFDLHFCQUFxQixDQUFDO0FBQ2xELENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEdBQXdCO0lBQ2hELE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQUU7SUFDNUUsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxnQkFBNkM7SUFDdEUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUksRUFBUTtJQUN2QixPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IEFydGlmYWN0VHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQXBwLCBBd3MsIENmblJlc291cmNlLCBDb250ZXh0UHJvdmlkZXIsIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLCBGaWxlQXNzZXRQYWNrYWdpbmcsIFN0YWNrIH0gZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi4vLi4vbGliL3N0YWNrLXN5bnRoZXNpemVycy90eXBlcyc7XG5pbXBvcnQgeyBldmFsdWF0ZUNGTiB9IGZyb20gJy4uL2V2YWx1YXRlLWNmbic7XG5cbmNvbnN0IENGTl9DT05URVhUID0ge1xuICAnQVdTOjpSZWdpb24nOiAndGhlX3JlZ2lvbicsXG4gICdBV1M6OkFjY291bnRJZCc6ICd0aGVfYWNjb3VudCcsXG4gICdBV1M6OlVSTFN1ZmZpeCc6ICdkb21haW4uYXdzJyxcbn07XG5cbmRlc2NyaWJlKCduZXcgc3R5bGUgc3ludGhlc2lzJywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiAndHJ1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnc3RhY2sgdGVtcGxhdGUgaXMgaW4gYXNzZXQgbWFuaWZlc3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOIC0tIHRoZSBTMyB1cmwgaXMgYWR2ZXJ0aXNlZCBvbiB0aGUgc3RhY2sgYXJ0aWZhY3RcbiAgICBjb25zdCBzdGFja0FydGlmYWN0ID0gYXNtLmdldFN0YWNrQXJ0aWZhY3QoJ1N0YWNrJyk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZU9iamVjdEtleSA9IGxhc3Qoc3RhY2tBcnRpZmFjdC5zdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmw/LnNwbGl0KCcvJykpO1xuXG4gICAgZXhwZWN0KHN0YWNrQXJ0aWZhY3Quc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsKS50b0VxdWFsKGBzMzovL2Nkay1obmI2NTlmZHMtYXNzZXRzLVxcJHtBV1M6OkFjY291bnRJZH0tXFwke0FXUzo6UmVnaW9ufS8ke3RlbXBsYXRlT2JqZWN0S2V5fWApO1xuXG4gICAgLy8gVEhFTiAtIHRoZSB0ZW1wbGF0ZSBpcyBpbiB0aGUgYXNzZXQgbWFuaWZlc3RcbiAgICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gYXNtLmFydGlmYWN0cy5maWx0ZXIoaXNBc3NldE1hbmlmZXN0KVswXTtcbiAgICBleHBlY3QobWFuaWZlc3RBcnRpZmFjdCkudG9CZURlZmluZWQoKTtcbiAgICBjb25zdCBtYW5pZmVzdDogY3hzY2hlbWEuQXNzZXRNYW5pZmVzdCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKG1hbmlmZXN0QXJ0aWZhY3QuZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSk7XG5cbiAgICBjb25zdCBmaXJzdEZpbGUgPSAobWFuaWZlc3QuZmlsZXMgPyBtYW5pZmVzdC5maWxlc1tPYmplY3Qua2V5cyhtYW5pZmVzdC5maWxlcylbMF1dIDogdW5kZWZpbmVkKSA/PyB7fTtcblxuICAgIGV4cGVjdChmaXJzdEZpbGUpLnRvRXF1YWwoe1xuICAgICAgc291cmNlOiB7IHBhdGg6ICdTdGFjay50ZW1wbGF0ZS5qc29uJywgcGFja2FnaW5nOiAnZmlsZScgfSxcbiAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAnY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJzoge1xuICAgICAgICAgIGJ1Y2tldE5hbWU6ICdjZGstaG5iNjU5ZmRzLWFzc2V0cy0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICAgICAgb2JqZWN0S2V5OiB0ZW1wbGF0ZU9iamVjdEtleSxcbiAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstaG5iNjU5ZmRzLWZpbGUtcHVibGlzaGluZy1yb2xlLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd2ZXJzaW9uIGNoZWNrIGlzIGFkZGVkIHRvIGJvdGggdGVtcGxhdGUgYW5kIG1hbmlmZXN0IGFydGlmYWN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBnZXRBc3NldE1hbmlmZXN0KGFzbSk7XG4gICAgZXhwZWN0KG1hbmlmZXN0QXJ0aWZhY3QucmVxdWlyZXNCb290c3RyYXBTdGFja1ZlcnNpb24pLnRvRXF1YWwoNik7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzbS5nZXRTdGFja0J5TmFtZSgnU3RhY2snKS50ZW1wbGF0ZTtcbiAgICBleHBlY3QodGVtcGxhdGU/LlBhcmFtZXRlcnM/LkJvb3RzdHJhcFZlcnNpb24/LlR5cGUpLnRvRXF1YWwoJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPFN0cmluZz4nKTtcbiAgICBleHBlY3QodGVtcGxhdGU/LlBhcmFtZXRlcnM/LkJvb3RzdHJhcFZlcnNpb24/LkRlZmF1bHQpLnRvRXF1YWwoJy9jZGstYm9vdHN0cmFwL2huYjY1OWZkcy92ZXJzaW9uJyk7XG4gICAgZXhwZWN0KHRlbXBsYXRlPy5QYXJhbWV0ZXJzPy5Cb290c3RyYXBWZXJzaW9uPy5EZXNjcmlwdGlvbikudG9Db250YWluKGN4YXBpLlNTTVBBUkFNX05PX0lOVkFMSURBVEUpO1xuXG4gICAgY29uc3QgYXNzZXJ0aW9ucyA9IHRlbXBsYXRlPy5SdWxlcz8uQ2hlY2tCb290c3RyYXBWZXJzaW9uPy5Bc3NlcnRpb25zID8/IFtdO1xuICAgIGV4cGVjdChhc3NlcnRpb25zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoYXNzZXJ0aW9uc1swXS5Bc3NlcnQpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpOb3QnOiBbXG4gICAgICAgIHsgJ0ZuOjpDb250YWlucyc6IFtbJzEnLCAnMicsICczJywgJzQnLCAnNSddLCB7IFJlZjogJ0Jvb3RzdHJhcFZlcnNpb24nIH1dIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2ZXJzaW9uIGNoZWNrIGlzIG5vdCBhZGRlZCB0byB0ZW1wbGF0ZSBpZiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBnZW5lcmF0ZUJvb3RzdHJhcFZlcnNpb25SdWxlOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKCdTdGFjazInKS50ZW1wbGF0ZTtcbiAgICBleHBlY3QodGVtcGxhdGU/LlJ1bGVzPy5DaGVja0Jvb3RzdHJhcFZlcnNpb24pLnRvRXF1YWwodW5kZWZpbmVkKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbWl6ZSB2ZXJzaW9uIHBhcmFtZXRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG15YXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15c3RhY2sgPSBuZXcgU3RhY2sobXlhcHAsICdteXN0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcjogJ3N0YWNrLXZlcnNpb24tcGFyYW1ldGVyJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbXlzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogJ2ZpbGUtYXNzZXQtaGFzaCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gbXlhcHAuc3ludGgoKTtcbiAgICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gZ2V0QXNzZXRNYW5pZmVzdChhc20pO1xuXG4gICAgLy8gVEhFTiAtIHRoZSBhc3NldCBtYW5pZmVzdCBoYXMgYW4gU1NNIHBhcmFtZXRlciBlbnRyeVxuICAgIGV4cGVjdChtYW5pZmVzdEFydGlmYWN0LmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcikudG9FcXVhbCgnc3RhY2stdmVyc2lvbi1wYXJhbWV0ZXInKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29udGFpbnMgYXNzZXQgYnV0IG5vdCByZXF1aXJpbmcgYSBzcGVjaWZpYyB2ZXJzaW9uIHBhcmFtZXRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNsYXNzIEJvb3RzdHJhcGxlc3NTdGFja1N5bnRoZXNpemVyIGV4dGVuZHMgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIge1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogU3ludGhlc2l6ZSB0aGUgYXNzb2NpYXRlZCBib290c3RyYXAgc3RhY2sgdG8gdGhlIHNlc3Npb24uXG4gICAgICAgKi9cbiAgICAgIHB1YmxpYyBzeW50aGVzaXplKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3ludGhlc2l6ZVRlbXBsYXRlKHNlc3Npb24pO1xuICAgICAgICBzZXNzaW9uLmFzc2VtYmx5LmFkZEFydGlmYWN0KCdGQUtFX0FSVElGQUNUX0lEJywge1xuICAgICAgICAgIHR5cGU6IEFydGlmYWN0VHlwZS5BU1NFVF9NQU5JRkVTVCxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBmaWxlOiAnRkFLRV9BUlRJRkFDVF9JRC5qc29uJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbWl0QXJ0aWZhY3Qoc2Vzc2lvbiwge1xuICAgICAgICAgIGFkZGl0aW9uYWxEZXBlbmRlbmNpZXM6IFsnRkFLRV9BUlRJRkFDVF9JRCddLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBteWFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgU3RhY2sobXlhcHAsICdteXN0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBCb290c3RyYXBsZXNzU3RhY2tTeW50aGVzaXplcigpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IG15YXBwLnN5bnRoKCk7XG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGdldEFzc2V0TWFuaWZlc3QoYXNtKTtcblxuICAgIC8vIFRIRU4gLSB0aGUgYXNzZXQgbWFuaWZlc3Qgc2hvdWxkIG5vdCBkZWZpbmUgYSByZXF1aXJlZCBib290c3RyYXAgc3RhY2sgdmVyc2lvblxuICAgIGV4cGVjdChtYW5pZmVzdEFydGlmYWN0LnJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dlbmVyYXRlcyBtaXNzaW5nIGNvbnRleHQgd2l0aCB0aGUgbG9va3VwIHJvbGUgQVJOIGFzIG9uZSBvZiB0aGUgbWlzc2luZyBjb250ZXh0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZ2VuZXJhdGVCb290c3RyYXBWZXJzaW9uUnVsZTogZmFsc2UsXG4gICAgICB9KSxcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTExMTExMTExMTExJywgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlKHN0YWNrLCB7XG4gICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLlZQQ19QUk9WSURFUixcbiAgICAgIHByb3BzOiB7fSxcbiAgICAgIGR1bW15VmFsdWU6IHVuZGVmaW5lZCxcbiAgICB9KS52YWx1ZTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChhc3NlbWJseS5tYW5pZmVzdC5taXNzaW5nIVswXS5wcm9wcy5sb29rdXBSb2xlQXJuKS50b0VxdWFsKCdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoxMTExMTExMTExMTE6cm9sZS9jZGstaG5iNjU5ZmRzLWxvb2t1cC1yb2xlLTExMTExMTExMTExMS11cy1lYXN0LTEnKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBmaWxlIGFzc2V0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSB3ZSBoYXZlIGEgZml4ZWQgYXNzZXQgbG9jYXRpb24gd2l0aCByZWdpb24gcGxhY2Vob2xkZXJzXG4gICAgZXhwZWN0KGV2YWxDRk4obG9jYXRpb24uYnVja2V0TmFtZSkpLnRvRXF1YWwoJ2Nkay1obmI2NTlmZHMtYXNzZXRzLXRoZV9hY2NvdW50LXRoZV9yZWdpb24nKTtcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5zM1VybCkpLnRvRXF1YWwoJ2h0dHBzOi8vczMudGhlX3JlZ2lvbi5kb21haW4uYXdzL2Nkay1obmI2NTlmZHMtYXNzZXRzLXRoZV9hY2NvdW50LXRoZV9yZWdpb24vYWJjZGVmLmpzJyk7XG5cbiAgICAvLyBUSEVOIC0gb2JqZWN0IGtleSBjb250YWlucyBzb3VyY2UgaGFzaCBzb21ld2hlcmVcbiAgICBleHBlY3QobG9jYXRpb24ub2JqZWN0S2V5LmluZGV4T2YoJ2FiY2RlZicpKS50b0JlR3JlYXRlclRoYW4oLTEpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGRvY2tlciBpbWFnZSBhc3NldCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbG9jYXRpb24gPSBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICcuJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIHdlIGhhdmUgYSBmaXhlZCBhc3NldCBsb2NhdGlvbiB3aXRoIHJlZ2lvbiBwbGFjZWhvbGRlcnNcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5yZXBvc2l0b3J5TmFtZSkpLnRvRXF1YWwoJ2Nkay1obmI2NTlmZHMtY29udGFpbmVyLWFzc2V0cy10aGVfYWNjb3VudC10aGVfcmVnaW9uJyk7XG4gICAgZXhwZWN0KGV2YWxDRk4obG9jYXRpb24uaW1hZ2VVcmkpKS50b0VxdWFsKCd0aGVfYWNjb3VudC5ka3IuZWNyLnRoZV9yZWdpb24uZG9tYWluLmF3cy9jZGstaG5iNjU5ZmRzLWNvbnRhaW5lci1hc3NldHMtdGhlX2FjY291bnQtdGhlX3JlZ2lvbjphYmNkZWYnKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2RvY2tlckJ1aWxkQXJncyBvciBkb2NrZXJCdWlsZFNlY3JldHMgd2l0aG91dCBkaXJlY3RvcnlOYW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgICAgICBkb2NrZXJCdWlsZEFyZ3M6IHtcbiAgICAgICAgICBBQkM6ICcxMjMnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvd0Vycm9yKC9FeGFjdGx5IG9uZSBvZiAnZGlyZWN0b3J5TmFtZScgb3IgJ2V4ZWN1dGFibGUnIGlzIHJlcXVpcmVkLyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgICAgICBkb2NrZXJCdWlsZFNlY3JldHM6IHtcbiAgICAgICAgICBERUY6ICc0NTYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvd0Vycm9yKC9FeGFjdGx5IG9uZSBvZiAnZGlyZWN0b3J5TmFtZScgb3IgJ2V4ZWN1dGFibGUnIGlzIHJlcXVpcmVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N5bnRoZXNpcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICB9KTtcbiAgICBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICcuJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTiAtIHdlIGhhdmUgYW4gYXNzZXQgbWFuaWZlc3Qgd2l0aCBib3RoIGFzc2V0cyBhbmQgdGhlIHN0YWNrIHRlbXBsYXRlIGluIHRoZXJlXG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGdldEFzc2V0TWFuaWZlc3QoYXNtKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IHJlYWRBc3NldE1hbmlmZXN0KG1hbmlmZXN0QXJ0aWZhY3QpO1xuXG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hbmlmZXN0LmZpbGVzIHx8IHt9KS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hbmlmZXN0LmRvY2tlckltYWdlcyB8fCB7fSkubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgLy8gVEhFTiAtIHRoZSBhc3NldCBtYW5pZmVzdCBoYXMgYW4gU1NNIHBhcmFtZXRlciBlbnRyeVxuICAgIGV4cGVjdChtYW5pZmVzdEFydGlmYWN0LmJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcikudG9FcXVhbCgnL2Nkay1ib290c3RyYXAvaG5iNjU5ZmRzL3ZlcnNpb24nKTtcblxuICAgIC8vIFRIRU4gLSBldmVyeSBhcnRpZmFjdCBoYXMgYW4gYXNzdW1lUm9sZUFyblxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBPYmplY3QudmFsdWVzKG1hbmlmZXN0LmZpbGVzID8/IHt9KSkge1xuICAgICAgZm9yIChjb25zdCBkZXN0aW5hdGlvbiBvZiBPYmplY3QudmFsdWVzKGZpbGUuZGVzdGluYXRpb25zKSkge1xuICAgICAgICBleHBlY3QoZGVzdGluYXRpb24uYXNzdW1lUm9sZUFybikudG9FcXVhbCgnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstaG5iNjU5ZmRzLWZpbGUtcHVibGlzaGluZy1yb2xlLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIE9iamVjdC52YWx1ZXMobWFuaWZlc3QuZG9ja2VySW1hZ2VzID8/IHt9KSkge1xuICAgICAgZm9yIChjb25zdCBkZXN0aW5hdGlvbiBvZiBPYmplY3QudmFsdWVzKGZpbGUuZGVzdGluYXRpb25zKSkge1xuICAgICAgICBleHBlY3QoZGVzdGluYXRpb24uYXNzdW1lUm9sZUFybikudG9FcXVhbCgnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6JHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstaG5iNjU5ZmRzLWltYWdlLXB1Ymxpc2hpbmctcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScpO1xuICAgICAgfVxuICAgIH1cblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbWl6ZSBwdWJsaXNoaW5nIHJlc291cmNlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG15YXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15c3RhY2sgPSBuZXcgU3RhY2sobXlhcHAsICdteXN0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGZpbGVBc3NldHNCdWNrZXROYW1lOiAnZmlsZS1hc3NldC1idWNrZXQnLFxuICAgICAgICBmaWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybjogJ2ZpbGU6cm9sZTphcm4nLFxuICAgICAgICBmaWxlQXNzZXRQdWJsaXNoaW5nRXh0ZXJuYWxJZDogJ2ZpbGUtZXh0ZXJuYWwtaWQnLFxuXG4gICAgICAgIGltYWdlQXNzZXRzUmVwb3NpdG9yeU5hbWU6ICdpbWFnZS1lY3ItcmVwb3NpdG9yeScsXG4gICAgICAgIGltYWdlQXNzZXRQdWJsaXNoaW5nUm9sZUFybjogJ2ltYWdlOnJvbGU6YXJuJyxcbiAgICAgICAgaW1hZ2VBc3NldFB1Ymxpc2hpbmdFeHRlcm5hbElkOiAnaW1hZ2UtZXh0ZXJuYWwtaWQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBteXN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnZmlsZS1hc3NldC1oYXNoJyxcbiAgICB9KTtcblxuICAgIG15c3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiAnLicsXG4gICAgICBzb3VyY2VIYXNoOiAnZG9ja2VyLWFzc2V0LWhhc2gnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IG15YXBwLnN5bnRoKCk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSByZWFkQXNzZXRNYW5pZmVzdChnZXRBc3NldE1hbmlmZXN0KGFzbSkpO1xuXG4gICAgZXhwZWN0KG1hbmlmZXN0LmZpbGVzPy5bJ2ZpbGUtYXNzZXQtaGFzaCddPy5kZXN0aW5hdGlvbnM/LlsnY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJ10pLnRvRXF1YWwoe1xuICAgICAgYnVja2V0TmFtZTogJ2ZpbGUtYXNzZXQtYnVja2V0JyxcbiAgICAgIG9iamVjdEtleTogJ2ZpbGUtYXNzZXQtaGFzaC5qcycsXG4gICAgICBhc3N1bWVSb2xlQXJuOiAnZmlsZTpyb2xlOmFybicsXG4gICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogJ2ZpbGUtZXh0ZXJuYWwtaWQnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KG1hbmlmZXN0LmRvY2tlckltYWdlcz8uWydkb2NrZXItYXNzZXQtaGFzaCddPy5kZXN0aW5hdGlvbnM/LlsnY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJ10pLnRvRXF1YWwoe1xuICAgICAgcmVwb3NpdG9yeU5hbWU6ICdpbWFnZS1lY3ItcmVwb3NpdG9yeScsXG4gICAgICBpbWFnZVRhZzogJ2RvY2tlci1hc3NldC1oYXNoJyxcbiAgICAgIGFzc3VtZVJvbGVBcm46ICdpbWFnZTpyb2xlOmFybicsXG4gICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogJ2ltYWdlLWV4dGVybmFsLWlkJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbWl6ZSBkZXBsb3kgcm9sZSBleHRlcm5hbElkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbXlhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlzdGFjayA9IG5ldyBTdGFjayhteWFwcCwgJ215c3RhY2snLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZGVwbG95Um9sZUV4dGVybmFsSWQ6ICdkZXBsb3ktZXh0ZXJuYWwtaWQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gbXlhcHAuc3ludGgoKTtcblxuICAgIGNvbnN0IHN0YWNrQXJ0aWZhY3QgPSBhc20uZ2V0U3RhY2tCeU5hbWUobXlzdGFjay5zdGFja05hbWUpO1xuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LmFzc3VtZVJvbGVFeHRlcm5hbElkKS50b0VxdWFsKCdkZXBsb3ktZXh0ZXJuYWwtaWQnKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3N5bnRoZXNpcyB3aXRoIGJ1Y2tldFByZWZpeCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG15YXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15c3RhY2sgPSBuZXcgU3RhY2sobXlhcHAsICdteXN0YWNrLWJ1Y2tldFByZWZpeCcsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBmaWxlQXNzZXRzQnVja2V0TmFtZTogJ2ZpbGUtYXNzZXQtYnVja2V0JyxcbiAgICAgICAgZmlsZUFzc2V0UHVibGlzaGluZ1JvbGVBcm46ICdmaWxlOnJvbGU6YXJuJyxcbiAgICAgICAgZmlsZUFzc2V0UHVibGlzaGluZ0V4dGVybmFsSWQ6ICdmaWxlLWV4dGVybmFsLWlkJyxcbiAgICAgICAgYnVja2V0UHJlZml4OiAnMDAwMDAwMDAwMDAwLycsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIG15c3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6ICdmaWxlLWFzc2V0LWhhc2gtd2l0aC1wcmVmaXgnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzbSA9IG15YXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOIC0tIHRoZSBTMyB1cmwgaXMgYWR2ZXJ0aXNlZCBvbiB0aGUgc3RhY2sgYXJ0aWZhY3RcbiAgICBjb25zdCBzdGFja0FydGlmYWN0ID0gYXNtLmdldFN0YWNrQXJ0aWZhY3QoJ215c3RhY2stYnVja2V0UHJlZml4Jyk7XG5cbiAgICAvLyBUSEVOIC0gd2UgaGF2ZSBhbiBhc3NldCBtYW5pZmVzdCB3aXRoIGJvdGggYXNzZXRzIGFuZCB0aGUgc3RhY2sgdGVtcGxhdGUgaW4gdGhlcmVcbiAgICBjb25zdCBtYW5pZmVzdCA9IHJlYWRBc3NldE1hbmlmZXN0KGdldEFzc2V0TWFuaWZlc3QoYXNtKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG1hbmlmZXN0LmZpbGVzPy5bJ2ZpbGUtYXNzZXQtaGFzaC13aXRoLXByZWZpeCddPy5kZXN0aW5hdGlvbnM/LlsnY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJ10pLnRvRXF1YWwoe1xuICAgICAgYnVja2V0TmFtZTogJ2ZpbGUtYXNzZXQtYnVja2V0JyxcbiAgICAgIG9iamVjdEtleTogJzAwMDAwMDAwMDAwMC9maWxlLWFzc2V0LWhhc2gtd2l0aC1wcmVmaXguanMnLFxuICAgICAgYXNzdW1lUm9sZUFybjogJ2ZpbGU6cm9sZTphcm4nLFxuICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6ICdmaWxlLWV4dGVybmFsLWlkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRlbXBsYXRlSGFzaCA9IGxhc3Qoc3RhY2tBcnRpZmFjdC5zdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmw/LnNwbGl0KCcvJykpO1xuXG4gICAgZXhwZWN0KHN0YWNrQXJ0aWZhY3Quc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsKS50b0VxdWFsKGBzMzovL2ZpbGUtYXNzZXQtYnVja2V0LzAwMDAwMDAwMDAwMC8ke3RlbXBsYXRlSGFzaH1gKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3N5bnRoZXNpcyB3aXRoIGRvY2tlclByZWZpeCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG15YXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15c3RhY2sgPSBuZXcgU3RhY2sobXlhcHAsICdteXN0YWNrLWRvY2tlclByZWZpeCcsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBkb2NrZXJUYWdQcmVmaXg6ICd0ZXN0LXByZWZpeC0nLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBteXN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJ3NvbWUtZm9sZGVyJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdkb2NrZXItYXNzZXQtaGFzaCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc20gPSBteWFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVhZEFzc2V0TWFuaWZlc3QoZ2V0QXNzZXRNYW5pZmVzdChhc20pKTtcbiAgICBjb25zdCBpbWFnZVRhZyA9IG1hbmlmZXN0LmRvY2tlckltYWdlcz8uWydkb2NrZXItYXNzZXQtaGFzaCddPy5kZXN0aW5hdGlvbnM/LlsnY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJ10uaW1hZ2VUYWc7XG4gICAgZXhwZWN0KGltYWdlVGFnKS50b0VxdWFsKCd0ZXN0LXByZWZpeC1kb2NrZXItYXNzZXQtaGFzaCcpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIHNhbWUgc3ludGhlc2l6ZXIgZm9yIG11bHRpcGxlIHN0YWNrcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN5bnRoZXNpemVyID0gbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcjogJ2JsZWVwJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywgeyBzeW50aGVzaXplciB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywgeyBzeW50aGVzaXplciB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBmb3IgKGNvbnN0IHN0IG9mIFtzdGFjazEsIHN0YWNrMl0pIHtcbiAgICAgIGNvbnN0IHRwbCA9IGFzbS5nZXRTdGFja0J5TmFtZShzdC5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgZXhwZWN0KHRwbCkudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIFBhcmFtZXRlcnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBCb290c3RyYXBWZXJzaW9uOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBEZWZhdWx0OiAnYmxlZXAnLCAvLyBBc3NlcnQgdGhhdCB0aGUgc2V0dGluZ3MgaGF2ZSBiZWVuIGFwcGxpZWRcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICB9KSk7XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogRXZhbHVhdGUgYSBwb3NzaWJseSBzdHJpbmctY29udGFpbmluZyB2YWx1ZSB0aGUgc2FtZSB3YXkgQ0ZOIHdvdWxkIGRvXG4gICAqXG4gICAqIChCZSBpbnZhcmlhbnQgdG8gdGhlIHNwZWNpZmljIEZuOjpTdWIgb3IgRm46OkpvaW4gd2Ugd291bGQgb3V0cHV0KVxuICAgKi9cbiAgZnVuY3Rpb24gZXZhbENGTih2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIGV2YWx1YXRlQ0ZOKHN0YWNrLnJlc29sdmUodmFsdWUpLCBDRk5fQ09OVEVYVCk7XG4gIH1cbn0pO1xuXG50ZXN0KCdjYW4gc3BlY2lmeSBzeW50aGVzaXplciBhdCB0aGUgYXBwIGxldmVsJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICBkZWZhdWx0U3RhY2tTeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcjogJ2JsZWVwJyxcbiAgICB9KSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICBmb3IgKGNvbnN0IHN0IG9mIFtzdGFjazEsIHN0YWNrMl0pIHtcbiAgICBjb25zdCB0cGwgPSBhc20uZ2V0U3RhY2tCeU5hbWUoc3Quc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBleHBlY3QodHBsKS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgIFBhcmFtZXRlcnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgQm9vdHN0cmFwVmVyc2lvbjogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIERlZmF1bHQ6ICdibGVlcCcsIC8vIEFzc2VydCB0aGF0IHRoZSBzZXR0aW5ncyBoYXZlIGJlZW4gYXBwbGllZFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pKTtcbiAgfVxufSk7XG5cbnRlc3QoJ2dldCBhbiBleGNlcHRpb24gd2hlbiB1c2luZyB0b2tlbnMgZm9yIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgZmlsZUFzc2V0c0J1Y2tldE5hbWU6IGBteS1idWNrZXQtJHtBd3MuUkVHSU9OfWAsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL2Nhbm5vdCBjb250YWluIHRva2Vucy8pO1xufSk7XG5cbmZ1bmN0aW9uIGlzQXNzZXRNYW5pZmVzdCh4OiBjeGFwaS5DbG91ZEFydGlmYWN0KTogeCBpcyBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3Qge1xuICByZXR1cm4geCBpbnN0YW5jZW9mIGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdDtcbn1cblxuZnVuY3Rpb24gZ2V0QXNzZXRNYW5pZmVzdChhc206IGN4YXBpLkNsb3VkQXNzZW1ibHkpOiBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3Qge1xuICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gYXNtLmFydGlmYWN0cy5maWx0ZXIoaXNBc3NldE1hbmlmZXN0KVswXTtcbiAgaWYgKCFtYW5pZmVzdEFydGlmYWN0KSB7IHRocm93IG5ldyBFcnJvcignbm8gYXNzZXQgbWFuaWZlc3QgaW4gYXNzZW1ibHknKTsgfVxuICByZXR1cm4gbWFuaWZlc3RBcnRpZmFjdDtcbn1cblxuZnVuY3Rpb24gcmVhZEFzc2V0TWFuaWZlc3QobWFuaWZlc3RBcnRpZmFjdDogY3hhcGkuQXNzZXRNYW5pZmVzdEFydGlmYWN0KTogY3hzY2hlbWEuQXNzZXRNYW5pZmVzdCB7XG4gIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtYW5pZmVzdEFydGlmYWN0LmZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpO1xufVxuXG5mdW5jdGlvbiBsYXN0PEE+KHhzPzogQVtdKTogQSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiB4cyA/IHhzW3hzLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xufVxuIl19
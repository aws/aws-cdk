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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXN0eWxlLXN5bnRoZXNpcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmV3LXN0eWxlLXN5bnRoZXNpcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDJEQUEyRDtBQUMzRCwwRUFBOEQ7QUFDOUQseUNBQXlDO0FBQ3pDLG1DQUF1SDtBQUV2SCxrREFBOEM7QUFFOUMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsZ0JBQWdCLEVBQUUsYUFBYTtJQUMvQixnQkFBZ0IsRUFBRSxZQUFZO0NBQy9CLENBQUM7QUFFRixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQztZQUNaLE9BQU8sRUFBRTtnQkFDUCxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLE1BQU07YUFDbEQ7U0FDRixDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWxDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxRQUFRO1FBQ1IsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDakMsSUFBSSxFQUFFLGdCQUFnQjtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLHlEQUF5RDtRQUN6RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLDJCQUEy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TSxDQUFDLEdBQUcsRUFBRTtRQUNWLFFBQVE7UUFDUixJQUFJLDZCQUF1QixDQUFDO1lBQzFCLG9CQUFvQixFQUFFLGFBQWEsU0FBRyxDQUFDLE1BQU0sRUFBRTtTQUNoRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsZUFBZSxDQUFDLENBQXNCO0lBQzdDLE9BQU8sQ0FBQyxZQUFZLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztBQUNsRCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxHQUF3QjtJQUNoRCxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztLQUFFO0lBQzVFLE9BQU8sZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsZ0JBQTZDO0lBQ3RFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkYsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFJLEVBQVE7SUFDdkIsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDNUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBBcnRpZmFjdFR5cGUgfSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IEFwcCwgQXdzLCBDZm5SZXNvdXJjZSwgQ29udGV4dFByb3ZpZGVyLCBEZWZhdWx0U3RhY2tTeW50aGVzaXplciwgRmlsZUFzc2V0UGFja2FnaW5nLCBTdGFjayB9IGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBJU3ludGhlc2lzU2Vzc2lvbiB9IGZyb20gJy4uLy4uL2xpYi9zdGFjay1zeW50aGVzaXplcnMvdHlwZXMnO1xuaW1wb3J0IHsgZXZhbHVhdGVDRk4gfSBmcm9tICcuLi9ldmFsdWF0ZS1jZm4nO1xuXG5jb25zdCBDRk5fQ09OVEVYVCA9IHtcbiAgJ0FXUzo6UmVnaW9uJzogJ3RoZV9yZWdpb24nLFxuICAnQVdTOjpBY2NvdW50SWQnOiAndGhlX2FjY291bnQnLFxuICAnQVdTOjpVUkxTdWZmaXgnOiAnZG9tYWluLmF3cycsXG59O1xuXG5kZXNjcmliZSgnbmV3IHN0eWxlIHN5bnRoZXNpcycsICgpID0+IHtcbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogJ3RydWUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWNrIHRlbXBsYXRlIGlzIGluIGFzc2V0IG1hbmlmZXN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTiAtLSB0aGUgUzMgdXJsIGlzIGFkdmVydGlzZWQgb24gdGhlIHN0YWNrIGFydGlmYWN0XG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IGFzbS5nZXRTdGFja0FydGlmYWN0KCdTdGFjaycpO1xuXG4gICAgY29uc3QgdGVtcGxhdGVPYmplY3RLZXkgPSBsYXN0KHN0YWNrQXJ0aWZhY3Quc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsPy5zcGxpdCgnLycpKTtcblxuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LnN0YWNrVGVtcGxhdGVBc3NldE9iamVjdFVybCkudG9FcXVhbChgczM6Ly9jZGstaG5iNjU5ZmRzLWFzc2V0cy1cXCR7QVdTOjpBY2NvdW50SWR9LVxcJHtBV1M6OlJlZ2lvbn0vJHt0ZW1wbGF0ZU9iamVjdEtleX1gKTtcblxuICAgIC8vIFRIRU4gLSB0aGUgdGVtcGxhdGUgaXMgaW4gdGhlIGFzc2V0IG1hbmlmZXN0XG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGFzbS5hcnRpZmFjdHMuZmlsdGVyKGlzQXNzZXRNYW5pZmVzdClbMF07XG4gICAgZXhwZWN0KG1hbmlmZXN0QXJ0aWZhY3QpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3QgbWFuaWZlc3Q6IGN4c2NoZW1hLkFzc2V0TWFuaWZlc3QgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtYW5pZmVzdEFydGlmYWN0LmZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpO1xuXG4gICAgY29uc3QgZmlyc3RGaWxlID0gKG1hbmlmZXN0LmZpbGVzID8gbWFuaWZlc3QuZmlsZXNbT2JqZWN0LmtleXMobWFuaWZlc3QuZmlsZXMpWzBdXSA6IHVuZGVmaW5lZCkgPz8ge307XG5cbiAgICBleHBlY3QoZmlyc3RGaWxlKS50b0VxdWFsKHtcbiAgICAgIHNvdXJjZTogeyBwYXRoOiAnU3RhY2sudGVtcGxhdGUuanNvbicsIHBhY2thZ2luZzogJ2ZpbGUnIH0sXG4gICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgJ2N1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbic6IHtcbiAgICAgICAgICBidWNrZXROYW1lOiAnY2RrLWhuYjY1OWZkcy1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgIG9iamVjdEtleTogdGVtcGxhdGVPYmplY3RLZXksXG4gICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLWhuYjY1OWZkcy1maWxlLXB1Ymxpc2hpbmctcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndmVyc2lvbiBjaGVjayBpcyBhZGRlZCB0byBib3RoIHRlbXBsYXRlIGFuZCBtYW5pZmVzdCBhcnRpZmFjdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gZ2V0QXNzZXRNYW5pZmVzdChhc20pO1xuICAgIGV4cGVjdChtYW5pZmVzdEFydGlmYWN0LnJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uKS50b0VxdWFsKDYpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBhc20uZ2V0U3RhY2tCeU5hbWUoJ1N0YWNrJykudGVtcGxhdGU7XG4gICAgZXhwZWN0KHRlbXBsYXRlPy5QYXJhbWV0ZXJzPy5Cb290c3RyYXBWZXJzaW9uPy5UeXBlKS50b0VxdWFsKCdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxTdHJpbmc+Jyk7XG4gICAgZXhwZWN0KHRlbXBsYXRlPy5QYXJhbWV0ZXJzPy5Cb290c3RyYXBWZXJzaW9uPy5EZWZhdWx0KS50b0VxdWFsKCcvY2RrLWJvb3RzdHJhcC9obmI2NTlmZHMvdmVyc2lvbicpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZT8uUGFyYW1ldGVycz8uQm9vdHN0cmFwVmVyc2lvbj8uRGVzY3JpcHRpb24pLnRvQ29udGFpbihjeGFwaS5TU01QQVJBTV9OT19JTlZBTElEQVRFKTtcblxuICAgIGNvbnN0IGFzc2VydGlvbnMgPSB0ZW1wbGF0ZT8uUnVsZXM/LkNoZWNrQm9vdHN0cmFwVmVyc2lvbj8uQXNzZXJ0aW9ucyA/PyBbXTtcbiAgICBleHBlY3QoYXNzZXJ0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGFzc2VydGlvbnNbMF0uQXNzZXJ0KS50b0VxdWFsKHtcbiAgICAgICdGbjo6Tm90JzogW1xuICAgICAgICB7ICdGbjo6Q29udGFpbnMnOiBbWycxJywgJzInLCAnMycsICc0JywgJzUnXSwgeyBSZWY6ICdCb290c3RyYXBWZXJzaW9uJyB9XSB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmVyc2lvbiBjaGVjayBpcyBub3QgYWRkZWQgdG8gdGVtcGxhdGUgaWYgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZ2VuZXJhdGVCb290c3RyYXBWZXJzaW9uUnVsZTogZmFsc2UsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZSgnU3RhY2syJykudGVtcGxhdGU7XG4gICAgZXhwZWN0KHRlbXBsYXRlPy5SdWxlcz8uQ2hlY2tCb290c3RyYXBWZXJzaW9uKS50b0VxdWFsKHVuZGVmaW5lZCk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdjdXN0b21pemUgdmVyc2lvbiBwYXJhbWV0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBteWFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteXN0YWNrID0gbmV3IFN0YWNrKG15YXBwLCAnbXlzdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI6ICdzdGFjay12ZXJzaW9uLXBhcmFtZXRlcicsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIG15c3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6ICdmaWxlLWFzc2V0LWhhc2gnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IG15YXBwLnN5bnRoKCk7XG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGdldEFzc2V0TWFuaWZlc3QoYXNtKTtcblxuICAgIC8vIFRIRU4gLSB0aGUgYXNzZXQgbWFuaWZlc3QgaGFzIGFuIFNTTSBwYXJhbWV0ZXIgZW50cnlcbiAgICBleHBlY3QobWFuaWZlc3RBcnRpZmFjdC5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXIpLnRvRXF1YWwoJ3N0YWNrLXZlcnNpb24tcGFyYW1ldGVyJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnRhaW5zIGFzc2V0IGJ1dCBub3QgcmVxdWlyaW5nIGEgc3BlY2lmaWMgdmVyc2lvbiBwYXJhbWV0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjbGFzcyBCb290c3RyYXBsZXNzU3RhY2tTeW50aGVzaXplciBleHRlbmRzIERlZmF1bHRTdGFja1N5bnRoZXNpemVyIHtcblxuXG4gICAgICAvKipcbiAgICAgICAqIFN5bnRoZXNpemUgdGhlIGFzc29jaWF0ZWQgYm9vdHN0cmFwIHN0YWNrIHRvIHRoZSBzZXNzaW9uLlxuICAgICAgICovXG4gICAgICBwdWJsaWMgc3ludGhlc2l6ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uKTtcbiAgICAgICAgc2Vzc2lvbi5hc3NlbWJseS5hZGRBcnRpZmFjdCgnRkFLRV9BUlRJRkFDVF9JRCcsIHtcbiAgICAgICAgICB0eXBlOiBBcnRpZmFjdFR5cGUuQVNTRVRfTUFOSUZFU1QsXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgZmlsZTogJ0ZBS0VfQVJUSUZBQ1RfSUQuanNvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZW1pdEFydGlmYWN0KHNlc3Npb24sIHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzOiBbJ0ZBS0VfQVJUSUZBQ1RfSUQnXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbXlhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFN0YWNrKG15YXBwLCAnbXlzdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgQm9vdHN0cmFwbGVzc1N0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBteWFwcC5zeW50aCgpO1xuICAgIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBnZXRBc3NldE1hbmlmZXN0KGFzbSk7XG5cbiAgICAvLyBUSEVOIC0gdGhlIGFzc2V0IG1hbmlmZXN0IHNob3VsZCBub3QgZGVmaW5lIGEgcmVxdWlyZWQgYm9vdHN0cmFwIHN0YWNrIHZlcnNpb25cbiAgICBleHBlY3QobWFuaWZlc3RBcnRpZmFjdC5yZXF1aXJlc0Jvb3RzdHJhcFN0YWNrVmVyc2lvbikudG9FcXVhbCh1bmRlZmluZWQpO1xuICB9KTtcblxuICB0ZXN0KCdnZW5lcmF0ZXMgbWlzc2luZyBjb250ZXh0IHdpdGggdGhlIGxvb2t1cCByb2xlIEFSTiBhcyBvbmUgb2YgdGhlIG1pc3NpbmcgY29udGV4dCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGdlbmVyYXRlQm9vdHN0cmFwVmVyc2lvblJ1bGU6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzExMTExMTExMTExMScsIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIENvbnRleHRQcm92aWRlci5nZXRWYWx1ZShzdGFjaywge1xuICAgICAgcHJvdmlkZXI6IGN4c2NoZW1hLkNvbnRleHRQcm92aWRlci5WUENfUFJPVklERVIsXG4gICAgICBwcm9wczoge30sXG4gICAgICBkdW1teVZhbHVlOiB1bmRlZmluZWQsXG4gICAgfSkudmFsdWU7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoYXNzZW1ibHkubWFuaWZlc3QubWlzc2luZyFbMF0ucHJvcHMubG9va3VwUm9sZUFybikudG9FcXVhbCgnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6MTExMTExMTExMTExOnJvbGUvY2RrLWhuYjY1OWZkcy1sb29rdXAtcm9sZS0xMTExMTExMTExMTEtdXMtZWFzdC0xJyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdhZGQgZmlsZSBhc3NldCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbG9jYXRpb24gPSBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gd2UgaGF2ZSBhIGZpeGVkIGFzc2V0IGxvY2F0aW9uIHdpdGggcmVnaW9uIHBsYWNlaG9sZGVyc1xuICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uLmJ1Y2tldE5hbWUpKS50b0VxdWFsKCdjZGstaG5iNjU5ZmRzLWFzc2V0cy10aGVfYWNjb3VudC10aGVfcmVnaW9uJyk7XG4gICAgZXhwZWN0KGV2YWxDRk4obG9jYXRpb24uczNVcmwpKS50b0VxdWFsKCdodHRwczovL3MzLnRoZV9yZWdpb24uZG9tYWluLmF3cy9jZGstaG5iNjU5ZmRzLWFzc2V0cy10aGVfYWNjb3VudC10aGVfcmVnaW9uL2FiY2RlZi5qcycpO1xuXG4gICAgLy8gVEhFTiAtIG9iamVjdCBrZXkgY29udGFpbnMgc291cmNlIGhhc2ggc29tZXdoZXJlXG4gICAgZXhwZWN0KGxvY2F0aW9uLm9iamVjdEtleS5pbmRleE9mKCdhYmNkZWYnKSkudG9CZUdyZWF0ZXJUaGFuKC0xKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBkb2NrZXIgaW1hZ2UgYXNzZXQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxvY2F0aW9uID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiAnLicsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSB3ZSBoYXZlIGEgZml4ZWQgYXNzZXQgbG9jYXRpb24gd2l0aCByZWdpb24gcGxhY2Vob2xkZXJzXG4gICAgZXhwZWN0KGV2YWxDRk4obG9jYXRpb24ucmVwb3NpdG9yeU5hbWUpKS50b0VxdWFsKCdjZGstaG5iNjU5ZmRzLWNvbnRhaW5lci1hc3NldHMtdGhlX2FjY291bnQtdGhlX3JlZ2lvbicpO1xuICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uLmltYWdlVXJpKSkudG9FcXVhbCgndGhlX2FjY291bnQuZGtyLmVjci50aGVfcmVnaW9uLmRvbWFpbi5hd3MvY2RrLWhuYjY1OWZkcy1jb250YWluZXItYXNzZXRzLXRoZV9hY2NvdW50LXRoZV9yZWdpb246YWJjZGVmJyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdkb2NrZXJCdWlsZEFyZ3Mgb3IgZG9ja2VyQnVpbGRTZWNyZXRzIHdpdGhvdXQgZGlyZWN0b3J5TmFtZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICAgICAgZG9ja2VyQnVpbGRBcmdzOiB7XG4gICAgICAgICAgQUJDOiAnMTIzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3dFcnJvcigvRXhhY3RseSBvbmUgb2YgJ2RpcmVjdG9yeU5hbWUnIG9yICdleGVjdXRhYmxlJyBpcyByZXF1aXJlZC8pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICAgICAgZG9ja2VyQnVpbGRTZWNyZXRzOiB7XG4gICAgICAgICAgREVGOiAnNDU2JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3dFcnJvcigvRXhhY3RseSBvbmUgb2YgJ2RpcmVjdG9yeU5hbWUnIG9yICdleGVjdXRhYmxlJyBpcyByZXF1aXJlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdzeW50aGVzaXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgfSk7XG4gICAgc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiAnLicsXG4gICAgICBzb3VyY2VIYXNoOiAnYWJjZGVmJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU4gLSB3ZSBoYXZlIGFuIGFzc2V0IG1hbmlmZXN0IHdpdGggYm90aCBhc3NldHMgYW5kIHRoZSBzdGFjayB0ZW1wbGF0ZSBpbiB0aGVyZVxuICAgIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBnZXRBc3NldE1hbmlmZXN0KGFzbSk7XG4gICAgY29uc3QgbWFuaWZlc3QgPSByZWFkQXNzZXRNYW5pZmVzdChtYW5pZmVzdEFydGlmYWN0KTtcblxuICAgIGV4cGVjdChPYmplY3Qua2V5cyhtYW5pZmVzdC5maWxlcyB8fCB7fSkubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChPYmplY3Qua2V5cyhtYW5pZmVzdC5kb2NrZXJJbWFnZXMgfHwge30pLmxlbmd0aCkudG9FcXVhbCgxKTtcblxuICAgIC8vIFRIRU4gLSB0aGUgYXNzZXQgbWFuaWZlc3QgaGFzIGFuIFNTTSBwYXJhbWV0ZXIgZW50cnlcbiAgICBleHBlY3QobWFuaWZlc3RBcnRpZmFjdC5ib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXIpLnRvRXF1YWwoJy9jZGstYm9vdHN0cmFwL2huYjY1OWZkcy92ZXJzaW9uJyk7XG5cbiAgICAvLyBUSEVOIC0gZXZlcnkgYXJ0aWZhY3QgaGFzIGFuIGFzc3VtZVJvbGVBcm5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgT2JqZWN0LnZhbHVlcyhtYW5pZmVzdC5maWxlcyA/PyB7fSkpIHtcbiAgICAgIGZvciAoY29uc3QgZGVzdGluYXRpb24gb2YgT2JqZWN0LnZhbHVlcyhmaWxlLmRlc3RpbmF0aW9ucykpIHtcbiAgICAgICAgZXhwZWN0KGRlc3RpbmF0aW9uLmFzc3VtZVJvbGVBcm4pLnRvRXF1YWwoJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLWhuYjY1OWZkcy1maWxlLXB1Ymxpc2hpbmctcm9sZS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBPYmplY3QudmFsdWVzKG1hbmlmZXN0LmRvY2tlckltYWdlcyA/PyB7fSkpIHtcbiAgICAgIGZvciAoY29uc3QgZGVzdGluYXRpb24gb2YgT2JqZWN0LnZhbHVlcyhmaWxlLmRlc3RpbmF0aW9ucykpIHtcbiAgICAgICAgZXhwZWN0KGRlc3RpbmF0aW9uLmFzc3VtZVJvbGVBcm4pLnRvRXF1YWwoJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLWhuYjY1OWZkcy1pbWFnZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICB9KTtcblxuICB0ZXN0KCdjdXN0b21pemUgcHVibGlzaGluZyByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBteWFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteXN0YWNrID0gbmV3IFN0YWNrKG15YXBwLCAnbXlzdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBmaWxlQXNzZXRzQnVja2V0TmFtZTogJ2ZpbGUtYXNzZXQtYnVja2V0JyxcbiAgICAgICAgZmlsZUFzc2V0UHVibGlzaGluZ1JvbGVBcm46ICdmaWxlOnJvbGU6YXJuJyxcbiAgICAgICAgZmlsZUFzc2V0UHVibGlzaGluZ0V4dGVybmFsSWQ6ICdmaWxlLWV4dGVybmFsLWlkJyxcblxuICAgICAgICBpbWFnZUFzc2V0c1JlcG9zaXRvcnlOYW1lOiAnaW1hZ2UtZWNyLXJlcG9zaXRvcnknLFxuICAgICAgICBpbWFnZUFzc2V0UHVibGlzaGluZ1JvbGVBcm46ICdpbWFnZTpyb2xlOmFybicsXG4gICAgICAgIGltYWdlQXNzZXRQdWJsaXNoaW5nRXh0ZXJuYWxJZDogJ2ltYWdlLWV4dGVybmFsLWlkJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbXlzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogJ2ZpbGUtYXNzZXQtaGFzaCcsXG4gICAgfSk7XG5cbiAgICBteXN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgc291cmNlSGFzaDogJ2RvY2tlci1hc3NldC1oYXNoJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBteWFwcC5zeW50aCgpO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVhZEFzc2V0TWFuaWZlc3QoZ2V0QXNzZXRNYW5pZmVzdChhc20pKTtcblxuICAgIGV4cGVjdChtYW5pZmVzdC5maWxlcz8uWydmaWxlLWFzc2V0LWhhc2gnXT8uZGVzdGluYXRpb25zPy5bJ2N1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbiddKS50b0VxdWFsKHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdmaWxlLWFzc2V0LWJ1Y2tldCcsXG4gICAgICBvYmplY3RLZXk6ICdmaWxlLWFzc2V0LWhhc2guanMnLFxuICAgICAgYXNzdW1lUm9sZUFybjogJ2ZpbGU6cm9sZTphcm4nLFxuICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6ICdmaWxlLWV4dGVybmFsLWlkJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChtYW5pZmVzdC5kb2NrZXJJbWFnZXM/LlsnZG9ja2VyLWFzc2V0LWhhc2gnXT8uZGVzdGluYXRpb25zPy5bJ2N1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbiddKS50b0VxdWFsKHtcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiAnaW1hZ2UtZWNyLXJlcG9zaXRvcnknLFxuICAgICAgaW1hZ2VUYWc6ICdkb2NrZXItYXNzZXQtaGFzaCcsXG4gICAgICBhc3N1bWVSb2xlQXJuOiAnaW1hZ2U6cm9sZTphcm4nLFxuICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6ICdpbWFnZS1leHRlcm5hbC1pZCcsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdjdXN0b21pemUgZGVwbG95IHJvbGUgZXh0ZXJuYWxJZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG15YXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15c3RhY2sgPSBuZXcgU3RhY2sobXlhcHAsICdteXN0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGRlcGxveVJvbGVFeHRlcm5hbElkOiAnZGVwbG95LWV4dGVybmFsLWlkJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IG15YXBwLnN5bnRoKCk7XG5cbiAgICBjb25zdCBzdGFja0FydGlmYWN0ID0gYXNtLmdldFN0YWNrQnlOYW1lKG15c3RhY2suc3RhY2tOYW1lKTtcbiAgICBleHBlY3Qoc3RhY2tBcnRpZmFjdC5hc3N1bWVSb2xlRXh0ZXJuYWxJZCkudG9FcXVhbCgnZGVwbG95LWV4dGVybmFsLWlkJyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdzeW50aGVzaXMgd2l0aCBidWNrZXRQcmVmaXgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBteWFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteXN0YWNrID0gbmV3IFN0YWNrKG15YXBwLCAnbXlzdGFjay1idWNrZXRQcmVmaXgnLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZmlsZUFzc2V0c0J1Y2tldE5hbWU6ICdmaWxlLWFzc2V0LWJ1Y2tldCcsXG4gICAgICAgIGZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuOiAnZmlsZTpyb2xlOmFybicsXG4gICAgICAgIGZpbGVBc3NldFB1Ymxpc2hpbmdFeHRlcm5hbElkOiAnZmlsZS1leHRlcm5hbC1pZCcsXG4gICAgICAgIGJ1Y2tldFByZWZpeDogJzAwMDAwMDAwMDAwMC8nLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBteXN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnZmlsZS1hc3NldC1oYXNoLXdpdGgtcHJlZml4JyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc20gPSBteWFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTiAtLSB0aGUgUzMgdXJsIGlzIGFkdmVydGlzZWQgb24gdGhlIHN0YWNrIGFydGlmYWN0XG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IGFzbS5nZXRTdGFja0FydGlmYWN0KCdteXN0YWNrLWJ1Y2tldFByZWZpeCcpO1xuXG4gICAgLy8gVEhFTiAtIHdlIGhhdmUgYW4gYXNzZXQgbWFuaWZlc3Qgd2l0aCBib3RoIGFzc2V0cyBhbmQgdGhlIHN0YWNrIHRlbXBsYXRlIGluIHRoZXJlXG4gICAgY29uc3QgbWFuaWZlc3QgPSByZWFkQXNzZXRNYW5pZmVzdChnZXRBc3NldE1hbmlmZXN0KGFzbSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChtYW5pZmVzdC5maWxlcz8uWydmaWxlLWFzc2V0LWhhc2gtd2l0aC1wcmVmaXgnXT8uZGVzdGluYXRpb25zPy5bJ2N1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbiddKS50b0VxdWFsKHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdmaWxlLWFzc2V0LWJ1Y2tldCcsXG4gICAgICBvYmplY3RLZXk6ICcwMDAwMDAwMDAwMDAvZmlsZS1hc3NldC1oYXNoLXdpdGgtcHJlZml4LmpzJyxcbiAgICAgIGFzc3VtZVJvbGVBcm46ICdmaWxlOnJvbGU6YXJuJyxcbiAgICAgIGFzc3VtZVJvbGVFeHRlcm5hbElkOiAnZmlsZS1leHRlcm5hbC1pZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUhhc2ggPSBsYXN0KHN0YWNrQXJ0aWZhY3Quc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsPy5zcGxpdCgnLycpKTtcblxuICAgIGV4cGVjdChzdGFja0FydGlmYWN0LnN0YWNrVGVtcGxhdGVBc3NldE9iamVjdFVybCkudG9FcXVhbChgczM6Ly9maWxlLWFzc2V0LWJ1Y2tldC8wMDAwMDAwMDAwMDAvJHt0ZW1wbGF0ZUhhc2h9YCk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdzeW50aGVzaXMgd2l0aCBkb2NrZXJQcmVmaXgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBteWFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteXN0YWNrID0gbmV3IFN0YWNrKG15YXBwLCAnbXlzdGFjay1kb2NrZXJQcmVmaXgnLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZG9ja2VyVGFnUHJlZml4OiAndGVzdC1wcmVmaXgtJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbXlzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICdzb21lLWZvbGRlcicsXG4gICAgICBzb3VyY2VIYXNoOiAnZG9ja2VyLWFzc2V0LWhhc2gnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNtID0gbXlhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBtYW5pZmVzdCA9IHJlYWRBc3NldE1hbmlmZXN0KGdldEFzc2V0TWFuaWZlc3QoYXNtKSk7XG4gICAgY29uc3QgaW1hZ2VUYWcgPSBtYW5pZmVzdC5kb2NrZXJJbWFnZXM/LlsnZG9ja2VyLWFzc2V0LWhhc2gnXT8uZGVzdGluYXRpb25zPy5bJ2N1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbiddLmltYWdlVGFnO1xuICAgIGV4cGVjdChpbWFnZVRhZykudG9FcXVhbCgndGVzdC1wcmVmaXgtZG9ja2VyLWFzc2V0LWhhc2gnKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBzYW1lIHN5bnRoZXNpemVyIGZvciBtdWx0aXBsZSBzdGFja3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzeW50aGVzaXplciA9IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI6ICdibGVlcCcsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHsgc3ludGhlc2l6ZXIgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHsgc3ludGhlc2l6ZXIgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG4gICAgZm9yIChjb25zdCBzdCBvZiBbc3RhY2sxLCBzdGFjazJdKSB7XG4gICAgICBjb25zdCB0cGwgPSBhc20uZ2V0U3RhY2tCeU5hbWUoc3Quc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGV4cGVjdCh0cGwpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBQYXJhbWV0ZXJzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgQm9vdHN0cmFwVmVyc2lvbjogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgRGVmYXVsdDogJ2JsZWVwJywgLy8gQXNzZXJ0IHRoYXQgdGhlIHNldHRpbmdzIGhhdmUgYmVlbiBhcHBsaWVkXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgfSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIGEgcG9zc2libHkgc3RyaW5nLWNvbnRhaW5pbmcgdmFsdWUgdGhlIHNhbWUgd2F5IENGTiB3b3VsZCBkb1xuICAgKlxuICAgKiAoQmUgaW52YXJpYW50IHRvIHRoZSBzcGVjaWZpYyBGbjo6U3ViIG9yIEZuOjpKb2luIHdlIHdvdWxkIG91dHB1dClcbiAgICovXG4gIGZ1bmN0aW9uIGV2YWxDRk4odmFsdWU6IGFueSkge1xuICAgIHJldHVybiBldmFsdWF0ZUNGTihzdGFjay5yZXNvbHZlKHZhbHVlKSwgQ0ZOX0NPTlRFWFQpO1xuICB9XG59KTtcblxudGVzdCgnY2FuIHNwZWNpZnkgc3ludGhlc2l6ZXIgYXQgdGhlIGFwcCBsZXZlbCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgZGVmYXVsdFN0YWNrU3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI6ICdibGVlcCcsXG4gICAgfSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgLy8gVEhFTlxuICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcbiAgZm9yIChjb25zdCBzdCBvZiBbc3RhY2sxLCBzdGFjazJdKSB7XG4gICAgY29uc3QgdHBsID0gYXNtLmdldFN0YWNrQnlOYW1lKHN0LnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgZXhwZWN0KHRwbCkudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICBQYXJhbWV0ZXJzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIEJvb3RzdHJhcFZlcnNpb246IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBEZWZhdWx0OiAnYmxlZXAnLCAvLyBBc3NlcnQgdGhhdCB0aGUgc2V0dGluZ3MgaGF2ZSBiZWVuIGFwcGxpZWRcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KSk7XG4gIH1cbn0pO1xuXG50ZXN0KCdnZXQgYW4gZXhjZXB0aW9uIHdoZW4gdXNpbmcgdG9rZW5zIGZvciBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgIGZpbGVBc3NldHNCdWNrZXROYW1lOiBgbXktYnVja2V0LSR7QXdzLlJFR0lPTn1gLFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9jYW5ub3QgY29udGFpbiB0b2tlbnMvKTtcbn0pO1xuXG5mdW5jdGlvbiBpc0Fzc2V0TWFuaWZlc3QoeDogY3hhcGkuQ2xvdWRBcnRpZmFjdCk6IHggaXMgY3hhcGkuQXNzZXRNYW5pZmVzdEFydGlmYWN0IHtcbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3Q7XG59XG5cbmZ1bmN0aW9uIGdldEFzc2V0TWFuaWZlc3QoYXNtOiBjeGFwaS5DbG91ZEFzc2VtYmx5KTogY3hhcGkuQXNzZXRNYW5pZmVzdEFydGlmYWN0IHtcbiAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGFzbS5hcnRpZmFjdHMuZmlsdGVyKGlzQXNzZXRNYW5pZmVzdClbMF07XG4gIGlmICghbWFuaWZlc3RBcnRpZmFjdCkgeyB0aHJvdyBuZXcgRXJyb3IoJ25vIGFzc2V0IG1hbmlmZXN0IGluIGFzc2VtYmx5Jyk7IH1cbiAgcmV0dXJuIG1hbmlmZXN0QXJ0aWZhY3Q7XG59XG5cbmZ1bmN0aW9uIHJlYWRBc3NldE1hbmlmZXN0KG1hbmlmZXN0QXJ0aWZhY3Q6IGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdCk6IGN4c2NoZW1hLkFzc2V0TWFuaWZlc3Qge1xuICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMobWFuaWZlc3RBcnRpZmFjdC5maWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcbn1cblxuZnVuY3Rpb24gbGFzdDxBPih4cz86IEFbXSk6IEEgfCB1bmRlZmluZWQge1xuICByZXR1cm4geHMgPyB4c1t4cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbn1cbiJdfQ==
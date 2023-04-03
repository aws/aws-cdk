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
                        Default: 'bleep',
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
        return evaluate_cfn_1.evaluateCFN(stack.resolve(value), CFN_CONTEXT);
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
                    Default: 'bleep',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXN0eWxlLXN5bnRoZXNpcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmV3LXN0eWxlLXN5bnRoZXNpcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDJEQUEyRDtBQUMzRCwwRUFBOEQ7QUFDOUQseUNBQXlDO0FBQ3pDLG1DQUF1SDtBQUV2SCxrREFBOEM7QUFFOUMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsYUFBYSxFQUFFLFlBQVk7SUFDM0IsZ0JBQWdCLEVBQUUsYUFBYTtJQUMvQixnQkFBZ0IsRUFBRSxZQUFZO0NBQy9CLENBQUM7QUFFRixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFFakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQztZQUNaLE9BQU8sRUFBRTtnQkFDUCxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLE1BQU07YUFDbEQ7U0FDRixDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWxDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxRQUFRO1FBQ1IsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDakMsSUFBSSxFQUFFLGdCQUFnQjtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLHlEQUF5RDtRQUN6RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLDJCQUEy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Q1IsSUFBSSw2QkFBdUIsQ0FBQztZQUMxQixvQkFBb0IsRUFBRSxhQUFhLFNBQUcsQ0FBQyxNQUFNLEVBQUU7U0FDaEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLGVBQWUsQ0FBQyxDQUFzQjtJQUM3QyxPQUFPLENBQUMsWUFBWSxLQUFLLENBQUMscUJBQXFCLENBQUM7QUFDbEQsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsR0FBd0I7SUFDaEQsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7S0FBRTtJQUM1RSxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLGdCQUE2QztJQUN0RSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFFRCxTQUFTLElBQUksQ0FBSSxFQUFRO0lBQ3ZCLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQXJ0aWZhY3RUeXBlIH0gZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBBcHAsIEF3cywgQ2ZuUmVzb3VyY2UsIENvbnRleHRQcm92aWRlciwgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIsIEZpbGVBc3NldFBhY2thZ2luZywgU3RhY2sgfSBmcm9tICcuLi8uLi9saWInO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24gfSBmcm9tICcuLi8uLi9saWIvc3RhY2stc3ludGhlc2l6ZXJzL3R5cGVzJztcbmltcG9ydCB7IGV2YWx1YXRlQ0ZOIH0gZnJvbSAnLi4vZXZhbHVhdGUtY2ZuJztcblxuY29uc3QgQ0ZOX0NPTlRFWFQgPSB7XG4gICdBV1M6OlJlZ2lvbic6ICd0aGVfcmVnaW9uJyxcbiAgJ0FXUzo6QWNjb3VudElkJzogJ3RoZV9hY2NvdW50JyxcbiAgJ0FXUzo6VVJMU3VmZml4JzogJ2RvbWFpbi5hd3MnLFxufTtcblxuZGVzY3JpYmUoJ25ldyBzdHlsZSBzeW50aGVzaXMnLCAoKSA9PiB7XG4gIGxldCBhcHA6IEFwcDtcbiAgbGV0IHN0YWNrOiBTdGFjaztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06ICd0cnVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICB9KTtcblxuICB0ZXN0KCdzdGFjayB0ZW1wbGF0ZSBpcyBpbiBhc3NldCBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc20gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU4gLS0gdGhlIFMzIHVybCBpcyBhZHZlcnRpc2VkIG9uIHRoZSBzdGFjayBhcnRpZmFjdFxuICAgIGNvbnN0IHN0YWNrQXJ0aWZhY3QgPSBhc20uZ2V0U3RhY2tBcnRpZmFjdCgnU3RhY2snKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlT2JqZWN0S2V5ID0gbGFzdChzdGFja0FydGlmYWN0LnN0YWNrVGVtcGxhdGVBc3NldE9iamVjdFVybD8uc3BsaXQoJy8nKSk7XG5cbiAgICBleHBlY3Qoc3RhY2tBcnRpZmFjdC5zdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmwpLnRvRXF1YWwoYHMzOi8vY2RrLWhuYjY1OWZkcy1hc3NldHMtXFwke0FXUzo6QWNjb3VudElkfS1cXCR7QVdTOjpSZWdpb259LyR7dGVtcGxhdGVPYmplY3RLZXl9YCk7XG5cbiAgICAvLyBUSEVOIC0gdGhlIHRlbXBsYXRlIGlzIGluIHRoZSBhc3NldCBtYW5pZmVzdFxuICAgIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBhc20uYXJ0aWZhY3RzLmZpbHRlcihpc0Fzc2V0TWFuaWZlc3QpWzBdO1xuICAgIGV4cGVjdChtYW5pZmVzdEFydGlmYWN0KS50b0JlRGVmaW5lZCgpO1xuICAgIGNvbnN0IG1hbmlmZXN0OiBjeHNjaGVtYS5Bc3NldE1hbmlmZXN0ID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMobWFuaWZlc3RBcnRpZmFjdC5maWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcblxuICAgIGNvbnN0IGZpcnN0RmlsZSA9IChtYW5pZmVzdC5maWxlcyA/IG1hbmlmZXN0LmZpbGVzW09iamVjdC5rZXlzKG1hbmlmZXN0LmZpbGVzKVswXV0gOiB1bmRlZmluZWQpID8/IHt9O1xuXG4gICAgZXhwZWN0KGZpcnN0RmlsZSkudG9FcXVhbCh7XG4gICAgICBzb3VyY2U6IHsgcGF0aDogJ1N0YWNrLnRlbXBsYXRlLmpzb24nLCBwYWNrYWdpbmc6ICdmaWxlJyB9LFxuICAgICAgZGVzdGluYXRpb25zOiB7XG4gICAgICAgICdjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nOiB7XG4gICAgICAgICAgYnVja2V0TmFtZTogJ2Nkay1obmI2NTlmZHMtYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgICBvYmplY3RLZXk6IHRlbXBsYXRlT2JqZWN0S2V5LFxuICAgICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay1obmI2NTlmZHMtZmlsZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3ZlcnNpb24gY2hlY2sgaXMgYWRkZWQgdG8gYm90aCB0ZW1wbGF0ZSBhbmQgbWFuaWZlc3QgYXJ0aWZhY3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGdldEFzc2V0TWFuaWZlc3QoYXNtKTtcbiAgICBleHBlY3QobWFuaWZlc3RBcnRpZmFjdC5yZXF1aXJlc0Jvb3RzdHJhcFN0YWNrVmVyc2lvbikudG9FcXVhbCg2KTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gYXNtLmdldFN0YWNrQnlOYW1lKCdTdGFjaycpLnRlbXBsYXRlO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZT8uUGFyYW1ldGVycz8uQm9vdHN0cmFwVmVyc2lvbj8uVHlwZSkudG9FcXVhbCgnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicpO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZT8uUGFyYW1ldGVycz8uQm9vdHN0cmFwVmVyc2lvbj8uRGVmYXVsdCkudG9FcXVhbCgnL2Nkay1ib290c3RyYXAvaG5iNjU5ZmRzL3ZlcnNpb24nKTtcbiAgICBleHBlY3QodGVtcGxhdGU/LlBhcmFtZXRlcnM/LkJvb3RzdHJhcFZlcnNpb24/LkRlc2NyaXB0aW9uKS50b0NvbnRhaW4oY3hhcGkuU1NNUEFSQU1fTk9fSU5WQUxJREFURSk7XG5cbiAgICBjb25zdCBhc3NlcnRpb25zID0gdGVtcGxhdGU/LlJ1bGVzPy5DaGVja0Jvb3RzdHJhcFZlcnNpb24/LkFzc2VydGlvbnMgPz8gW107XG4gICAgZXhwZWN0KGFzc2VydGlvbnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChhc3NlcnRpb25zWzBdLkFzc2VydCkudG9FcXVhbCh7XG4gICAgICAnRm46Ok5vdCc6IFtcbiAgICAgICAgeyAnRm46OkNvbnRhaW5zJzogW1snMScsICcyJywgJzMnLCAnNCcsICc1J10sIHsgUmVmOiAnQm9vdHN0cmFwVmVyc2lvbicgfV0gfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZlcnNpb24gY2hlY2sgaXMgbm90IGFkZGVkIHRvIHRlbXBsYXRlIGlmIGRpc2FibGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGdlbmVyYXRlQm9vdHN0cmFwVmVyc2lvblJ1bGU6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoJ1N0YWNrMicpLnRlbXBsYXRlO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZT8uUnVsZXM/LkNoZWNrQm9vdHN0cmFwVmVyc2lvbikudG9FcXVhbCh1bmRlZmluZWQpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9taXplIHZlcnNpb24gcGFyYW1ldGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbXlhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlzdGFjayA9IG5ldyBTdGFjayhteWFwcCwgJ215c3RhY2snLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyOiAnc3RhY2stdmVyc2lvbi1wYXJhbWV0ZXInLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBteXN0YWNrLnN5bnRoZXNpemVyLmFkZEZpbGVBc3NldCh7XG4gICAgICBmaWxlTmFtZTogX19maWxlbmFtZSxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUsXG4gICAgICBzb3VyY2VIYXNoOiAnZmlsZS1hc3NldC1oYXNoJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBteWFwcC5zeW50aCgpO1xuICAgIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBnZXRBc3NldE1hbmlmZXN0KGFzbSk7XG5cbiAgICAvLyBUSEVOIC0gdGhlIGFzc2V0IG1hbmlmZXN0IGhhcyBhbiBTU00gcGFyYW1ldGVyIGVudHJ5XG4gICAgZXhwZWN0KG1hbmlmZXN0QXJ0aWZhY3QuYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyKS50b0VxdWFsKCdzdGFjay12ZXJzaW9uLXBhcmFtZXRlcicpO1xuICB9KTtcblxuICB0ZXN0KCdjb250YWlucyBhc3NldCBidXQgbm90IHJlcXVpcmluZyBhIHNwZWNpZmljIHZlcnNpb24gcGFyYW1ldGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY2xhc3MgQm9vdHN0cmFwbGVzc1N0YWNrU3ludGhlc2l6ZXIgZXh0ZW5kcyBEZWZhdWx0U3RhY2tTeW50aGVzaXplciB7XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBTeW50aGVzaXplIHRoZSBhc3NvY2lhdGVkIGJvb3RzdHJhcCBzdGFjayB0byB0aGUgc2Vzc2lvbi5cbiAgICAgICAqL1xuICAgICAgcHVibGljIHN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbik7XG4gICAgICAgIHNlc3Npb24uYXNzZW1ibHkuYWRkQXJ0aWZhY3QoJ0ZBS0VfQVJUSUZBQ1RfSUQnLCB7XG4gICAgICAgICAgdHlwZTogQXJ0aWZhY3RUeXBlLkFTU0VUX01BTklGRVNULFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGZpbGU6ICdGQUtFX0FSVElGQUNUX0lELmpzb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmVtaXRBcnRpZmFjdChzZXNzaW9uLCB7XG4gICAgICAgICAgYWRkaXRpb25hbERlcGVuZGVuY2llczogWydGQUtFX0FSVElGQUNUX0lEJ10sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG15YXBwID0gbmV3IEFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBTdGFjayhteWFwcCwgJ215c3RhY2snLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IEJvb3RzdHJhcGxlc3NTdGFja1N5bnRoZXNpemVyKCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gbXlhcHAuc3ludGgoKTtcbiAgICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gZ2V0QXNzZXRNYW5pZmVzdChhc20pO1xuXG4gICAgLy8gVEhFTiAtIHRoZSBhc3NldCBtYW5pZmVzdCBzaG91bGQgbm90IGRlZmluZSBhIHJlcXVpcmVkIGJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uXG4gICAgZXhwZWN0KG1hbmlmZXN0QXJ0aWZhY3QucmVxdWlyZXNCb290c3RyYXBTdGFja1ZlcnNpb24pLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2VuZXJhdGVzIG1pc3NpbmcgY29udGV4dCB3aXRoIHRoZSBsb29rdXAgcm9sZSBBUk4gYXMgb25lIG9mIHRoZSBtaXNzaW5nIGNvbnRleHQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBnZW5lcmF0ZUJvb3RzdHJhcFZlcnNpb25SdWxlOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMTEnLCByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc3RhY2ssIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuVlBDX1BST1ZJREVSLFxuICAgICAgcHJvcHM6IHt9LFxuICAgICAgZHVtbXlWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0pLnZhbHVlO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGFzc2VtYmx5Lm1hbmlmZXN0Lm1pc3NpbmchWzBdLnByb3BzLmxvb2t1cFJvbGVBcm4pLnRvRXF1YWwoJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OjExMTExMTExMTExMTpyb2xlL2Nkay1obmI2NTlmZHMtbG9va3VwLXJvbGUtMTExMTExMTExMTExLXVzLWVhc3QtMScpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGZpbGUgYXNzZXQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxvY2F0aW9uID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIHdlIGhhdmUgYSBmaXhlZCBhc3NldCBsb2NhdGlvbiB3aXRoIHJlZ2lvbiBwbGFjZWhvbGRlcnNcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5idWNrZXROYW1lKSkudG9FcXVhbCgnY2RrLWhuYjY1OWZkcy1hc3NldHMtdGhlX2FjY291bnQtdGhlX3JlZ2lvbicpO1xuICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uLnMzVXJsKSkudG9FcXVhbCgnaHR0cHM6Ly9zMy50aGVfcmVnaW9uLmRvbWFpbi5hd3MvY2RrLWhuYjY1OWZkcy1hc3NldHMtdGhlX2FjY291bnQtdGhlX3JlZ2lvbi9hYmNkZWYuanMnKTtcblxuICAgIC8vIFRIRU4gLSBvYmplY3Qga2V5IGNvbnRhaW5zIHNvdXJjZSBoYXNoIHNvbWV3aGVyZVxuICAgIGV4cGVjdChsb2NhdGlvbi5vYmplY3RLZXkuaW5kZXhPZignYWJjZGVmJykpLnRvQmVHcmVhdGVyVGhhbigtMSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdhZGQgZG9ja2VyIGltYWdlIGFzc2V0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gd2UgaGF2ZSBhIGZpeGVkIGFzc2V0IGxvY2F0aW9uIHdpdGggcmVnaW9uIHBsYWNlaG9sZGVyc1xuICAgIGV4cGVjdChldmFsQ0ZOKGxvY2F0aW9uLnJlcG9zaXRvcnlOYW1lKSkudG9FcXVhbCgnY2RrLWhuYjY1OWZkcy1jb250YWluZXItYXNzZXRzLXRoZV9hY2NvdW50LXRoZV9yZWdpb24nKTtcbiAgICBleHBlY3QoZXZhbENGTihsb2NhdGlvbi5pbWFnZVVyaSkpLnRvRXF1YWwoJ3RoZV9hY2NvdW50LmRrci5lY3IudGhlX3JlZ2lvbi5kb21haW4uYXdzL2Nkay1obmI2NTlmZHMtY29udGFpbmVyLWFzc2V0cy10aGVfYWNjb3VudC10aGVfcmVnaW9uOmFiY2RlZicpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZG9ja2VyQnVpbGRBcmdzIG9yIGRvY2tlckJ1aWxkU2VjcmV0cyB3aXRob3V0IGRpcmVjdG9yeU5hbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgICAgIGRvY2tlckJ1aWxkQXJnczoge1xuICAgICAgICAgIEFCQzogJzEyMycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93RXJyb3IoL0V4YWN0bHkgb25lIG9mICdkaXJlY3RvcnlOYW1lJyBvciAnZXhlY3V0YWJsZScgaXMgcmVxdWlyZWQvKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgICAgIGRvY2tlckJ1aWxkU2VjcmV0czoge1xuICAgICAgICAgIERFRjogJzQ1NicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93RXJyb3IoL0V4YWN0bHkgb25lIG9mICdkaXJlY3RvcnlOYW1lJyBvciAnZXhlY3V0YWJsZScgaXMgcmVxdWlyZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3ludGhlc2lzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6ICdhYmNkZWYnLFxuICAgIH0pO1xuICAgIHN0YWNrLnN5bnRoZXNpemVyLmFkZERvY2tlckltYWdlQXNzZXQoe1xuICAgICAgZGlyZWN0b3J5TmFtZTogJy4nLFxuICAgICAgc291cmNlSGFzaDogJ2FiY2RlZicsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOIC0gd2UgaGF2ZSBhbiBhc3NldCBtYW5pZmVzdCB3aXRoIGJvdGggYXNzZXRzIGFuZCB0aGUgc3RhY2sgdGVtcGxhdGUgaW4gdGhlcmVcbiAgICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gZ2V0QXNzZXRNYW5pZmVzdChhc20pO1xuICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVhZEFzc2V0TWFuaWZlc3QobWFuaWZlc3RBcnRpZmFjdCk7XG5cbiAgICBleHBlY3QoT2JqZWN0LmtleXMobWFuaWZlc3QuZmlsZXMgfHwge30pLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMobWFuaWZlc3QuZG9ja2VySW1hZ2VzIHx8IHt9KS5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICAvLyBUSEVOIC0gdGhlIGFzc2V0IG1hbmlmZXN0IGhhcyBhbiBTU00gcGFyYW1ldGVyIGVudHJ5XG4gICAgZXhwZWN0KG1hbmlmZXN0QXJ0aWZhY3QuYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyKS50b0VxdWFsKCcvY2RrLWJvb3RzdHJhcC9obmI2NTlmZHMvdmVyc2lvbicpO1xuXG4gICAgLy8gVEhFTiAtIGV2ZXJ5IGFydGlmYWN0IGhhcyBhbiBhc3N1bWVSb2xlQXJuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIE9iamVjdC52YWx1ZXMobWFuaWZlc3QuZmlsZXMgPz8ge30pKSB7XG4gICAgICBmb3IgKGNvbnN0IGRlc3RpbmF0aW9uIG9mIE9iamVjdC52YWx1ZXMoZmlsZS5kZXN0aW5hdGlvbnMpKSB7XG4gICAgICAgIGV4cGVjdChkZXN0aW5hdGlvbi5hc3N1bWVSb2xlQXJuKS50b0VxdWFsKCdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay1obmI2NTlmZHMtZmlsZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgT2JqZWN0LnZhbHVlcyhtYW5pZmVzdC5kb2NrZXJJbWFnZXMgPz8ge30pKSB7XG4gICAgICBmb3IgKGNvbnN0IGRlc3RpbmF0aW9uIG9mIE9iamVjdC52YWx1ZXMoZmlsZS5kZXN0aW5hdGlvbnMpKSB7XG4gICAgICAgIGV4cGVjdChkZXN0aW5hdGlvbi5hc3N1bWVSb2xlQXJuKS50b0VxdWFsKCdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay1obmI2NTlmZHMtaW1hZ2UtcHVibGlzaGluZy1yb2xlLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259Jyk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9taXplIHB1Ymxpc2hpbmcgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbXlhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlzdGFjayA9IG5ldyBTdGFjayhteWFwcCwgJ215c3RhY2snLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZmlsZUFzc2V0c0J1Y2tldE5hbWU6ICdmaWxlLWFzc2V0LWJ1Y2tldCcsXG4gICAgICAgIGZpbGVBc3NldFB1Ymxpc2hpbmdSb2xlQXJuOiAnZmlsZTpyb2xlOmFybicsXG4gICAgICAgIGZpbGVBc3NldFB1Ymxpc2hpbmdFeHRlcm5hbElkOiAnZmlsZS1leHRlcm5hbC1pZCcsXG5cbiAgICAgICAgaW1hZ2VBc3NldHNSZXBvc2l0b3J5TmFtZTogJ2ltYWdlLWVjci1yZXBvc2l0b3J5JyxcbiAgICAgICAgaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuOiAnaW1hZ2U6cm9sZTphcm4nLFxuICAgICAgICBpbWFnZUFzc2V0UHVibGlzaGluZ0V4dGVybmFsSWQ6ICdpbWFnZS1leHRlcm5hbC1pZCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIG15c3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgcGFja2FnaW5nOiBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSxcbiAgICAgIHNvdXJjZUhhc2g6ICdmaWxlLWFzc2V0LWhhc2gnLFxuICAgIH0pO1xuXG4gICAgbXlzdGFjay5zeW50aGVzaXplci5hZGREb2NrZXJJbWFnZUFzc2V0KHtcbiAgICAgIGRpcmVjdG9yeU5hbWU6ICcuJyxcbiAgICAgIHNvdXJjZUhhc2g6ICdkb2NrZXItYXNzZXQtaGFzaCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNtID0gbXlhcHAuc3ludGgoKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IHJlYWRBc3NldE1hbmlmZXN0KGdldEFzc2V0TWFuaWZlc3QoYXNtKSk7XG5cbiAgICBleHBlY3QobWFuaWZlc3QuZmlsZXM/LlsnZmlsZS1hc3NldC1oYXNoJ10/LmRlc3RpbmF0aW9ucz8uWydjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nXSkudG9FcXVhbCh7XG4gICAgICBidWNrZXROYW1lOiAnZmlsZS1hc3NldC1idWNrZXQnLFxuICAgICAgb2JqZWN0S2V5OiAnZmlsZS1hc3NldC1oYXNoLmpzJyxcbiAgICAgIGFzc3VtZVJvbGVBcm46ICdmaWxlOnJvbGU6YXJuJyxcbiAgICAgIGFzc3VtZVJvbGVFeHRlcm5hbElkOiAnZmlsZS1leHRlcm5hbC1pZCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3QobWFuaWZlc3QuZG9ja2VySW1hZ2VzPy5bJ2RvY2tlci1hc3NldC1oYXNoJ10/LmRlc3RpbmF0aW9ucz8uWydjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nXSkudG9FcXVhbCh7XG4gICAgICByZXBvc2l0b3J5TmFtZTogJ2ltYWdlLWVjci1yZXBvc2l0b3J5JyxcbiAgICAgIGltYWdlVGFnOiAnZG9ja2VyLWFzc2V0LWhhc2gnLFxuICAgICAgYXNzdW1lUm9sZUFybjogJ2ltYWdlOnJvbGU6YXJuJyxcbiAgICAgIGFzc3VtZVJvbGVFeHRlcm5hbElkOiAnaW1hZ2UtZXh0ZXJuYWwtaWQnLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9taXplIGRlcGxveSByb2xlIGV4dGVybmFsSWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBteWFwcCA9IG5ldyBBcHAoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteXN0YWNrID0gbmV3IFN0YWNrKG15YXBwLCAnbXlzdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBkZXBsb3lSb2xlRXh0ZXJuYWxJZDogJ2RlcGxveS1leHRlcm5hbC1pZCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc20gPSBteWFwcC5zeW50aCgpO1xuXG4gICAgY29uc3Qgc3RhY2tBcnRpZmFjdCA9IGFzbS5nZXRTdGFja0J5TmFtZShteXN0YWNrLnN0YWNrTmFtZSk7XG4gICAgZXhwZWN0KHN0YWNrQXJ0aWZhY3QuYXNzdW1lUm9sZUV4dGVybmFsSWQpLnRvRXF1YWwoJ2RlcGxveS1leHRlcm5hbC1pZCcpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnc3ludGhlc2lzIHdpdGggYnVja2V0UHJlZml4JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbXlhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlzdGFjayA9IG5ldyBTdGFjayhteWFwcCwgJ215c3RhY2stYnVja2V0UHJlZml4Jywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGZpbGVBc3NldHNCdWNrZXROYW1lOiAnZmlsZS1hc3NldC1idWNrZXQnLFxuICAgICAgICBmaWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybjogJ2ZpbGU6cm9sZTphcm4nLFxuICAgICAgICBmaWxlQXNzZXRQdWJsaXNoaW5nRXh0ZXJuYWxJZDogJ2ZpbGUtZXh0ZXJuYWwtaWQnLFxuICAgICAgICBidWNrZXRQcmVmaXg6ICcwMDAwMDAwMDAwMDAvJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbXlzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgICAgc291cmNlSGFzaDogJ2ZpbGUtYXNzZXQtaGFzaC13aXRoLXByZWZpeCcsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNtID0gbXlhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU4gLS0gdGhlIFMzIHVybCBpcyBhZHZlcnRpc2VkIG9uIHRoZSBzdGFjayBhcnRpZmFjdFxuICAgIGNvbnN0IHN0YWNrQXJ0aWZhY3QgPSBhc20uZ2V0U3RhY2tBcnRpZmFjdCgnbXlzdGFjay1idWNrZXRQcmVmaXgnKTtcblxuICAgIC8vIFRIRU4gLSB3ZSBoYXZlIGFuIGFzc2V0IG1hbmlmZXN0IHdpdGggYm90aCBhc3NldHMgYW5kIHRoZSBzdGFjayB0ZW1wbGF0ZSBpbiB0aGVyZVxuICAgIGNvbnN0IG1hbmlmZXN0ID0gcmVhZEFzc2V0TWFuaWZlc3QoZ2V0QXNzZXRNYW5pZmVzdChhc20pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobWFuaWZlc3QuZmlsZXM/LlsnZmlsZS1hc3NldC1oYXNoLXdpdGgtcHJlZml4J10/LmRlc3RpbmF0aW9ucz8uWydjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nXSkudG9FcXVhbCh7XG4gICAgICBidWNrZXROYW1lOiAnZmlsZS1hc3NldC1idWNrZXQnLFxuICAgICAgb2JqZWN0S2V5OiAnMDAwMDAwMDAwMDAwL2ZpbGUtYXNzZXQtaGFzaC13aXRoLXByZWZpeC5qcycsXG4gICAgICBhc3N1bWVSb2xlQXJuOiAnZmlsZTpyb2xlOmFybicsXG4gICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogJ2ZpbGUtZXh0ZXJuYWwtaWQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGVtcGxhdGVIYXNoID0gbGFzdChzdGFja0FydGlmYWN0LnN0YWNrVGVtcGxhdGVBc3NldE9iamVjdFVybD8uc3BsaXQoJy8nKSk7XG5cbiAgICBleHBlY3Qoc3RhY2tBcnRpZmFjdC5zdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmwpLnRvRXF1YWwoYHMzOi8vZmlsZS1hc3NldC1idWNrZXQvMDAwMDAwMDAwMDAwLyR7dGVtcGxhdGVIYXNofWApO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnc3ludGhlc2lzIHdpdGggZG9ja2VyUHJlZml4JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbXlhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlzdGFjayA9IG5ldyBTdGFjayhteWFwcCwgJ215c3RhY2stZG9ja2VyUHJlZml4Jywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGRvY2tlclRhZ1ByZWZpeDogJ3Rlc3QtcHJlZml4LScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIG15c3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBkaXJlY3RvcnlOYW1lOiAnc29tZS1mb2xkZXInLFxuICAgICAgc291cmNlSGFzaDogJ2RvY2tlci1hc3NldC1oYXNoJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFzbSA9IG15YXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgbWFuaWZlc3QgPSByZWFkQXNzZXRNYW5pZmVzdChnZXRBc3NldE1hbmlmZXN0KGFzbSkpO1xuICAgIGNvbnN0IGltYWdlVGFnID0gbWFuaWZlc3QuZG9ja2VySW1hZ2VzPy5bJ2RvY2tlci1hc3NldC1oYXNoJ10/LmRlc3RpbmF0aW9ucz8uWydjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nXS5pbWFnZVRhZztcbiAgICBleHBlY3QoaW1hZ2VUYWcpLnRvRXF1YWwoJ3Rlc3QtcHJlZml4LWRvY2tlci1hc3NldC1oYXNoJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2Ugc2FtZSBzeW50aGVzaXplciBmb3IgbXVsdGlwbGUgc3RhY2tzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3ludGhlc2l6ZXIgPSBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyOiAnYmxlZXAnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7IHN5bnRoZXNpemVyIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7IHN5bnRoZXNpemVyIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzbSA9IGFwcC5zeW50aCgpO1xuICAgIGZvciAoY29uc3Qgc3Qgb2YgW3N0YWNrMSwgc3RhY2syXSkge1xuICAgICAgY29uc3QgdHBsID0gYXNtLmdldFN0YWNrQnlOYW1lKHN0LnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBleHBlY3QodHBsKS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgUGFyYW1ldGVyczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIEJvb3RzdHJhcFZlcnNpb246IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIERlZmF1bHQ6ICdibGVlcCcsIC8vIEFzc2VydCB0aGF0IHRoZSBzZXR0aW5ncyBoYXZlIGJlZW4gYXBwbGllZFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZSBhIHBvc3NpYmx5IHN0cmluZy1jb250YWluaW5nIHZhbHVlIHRoZSBzYW1lIHdheSBDRk4gd291bGQgZG9cbiAgICpcbiAgICogKEJlIGludmFyaWFudCB0byB0aGUgc3BlY2lmaWMgRm46OlN1YiBvciBGbjo6Sm9pbiB3ZSB3b3VsZCBvdXRwdXQpXG4gICAqL1xuICBmdW5jdGlvbiBldmFsQ0ZOKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZSh2YWx1ZSksIENGTl9DT05URVhUKTtcbiAgfVxufSk7XG5cbnRlc3QoJ2NhbiBzcGVjaWZ5IHN5bnRoZXNpemVyIGF0IHRoZSBhcHAgbGV2ZWwnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgIGRlZmF1bHRTdGFja1N5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyOiAnYmxlZXAnLFxuICAgIH0pLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuXG4gIC8vIFRIRU5cbiAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG4gIGZvciAoY29uc3Qgc3Qgb2YgW3N0YWNrMSwgc3RhY2syXSkge1xuICAgIGNvbnN0IHRwbCA9IGFzbS5nZXRTdGFja0J5TmFtZShzdC5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGV4cGVjdCh0cGwpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgUGFyYW1ldGVyczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBCb290c3RyYXBWZXJzaW9uOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgRGVmYXVsdDogJ2JsZWVwJywgLy8gQXNzZXJ0IHRoYXQgdGhlIHNldHRpbmdzIGhhdmUgYmVlbiBhcHBsaWVkXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSkpO1xuICB9XG59KTtcblxudGVzdCgnZ2V0IGFuIGV4Y2VwdGlvbiB3aGVuIHVzaW5nIHRva2VucyBmb3IgcGFyYW1ldGVycycsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICBmaWxlQXNzZXRzQnVja2V0TmFtZTogYG15LWJ1Y2tldC0ke0F3cy5SRUdJT059YCxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvY2Fubm90IGNvbnRhaW4gdG9rZW5zLyk7XG59KTtcblxuZnVuY3Rpb24gaXNBc3NldE1hbmlmZXN0KHg6IGN4YXBpLkNsb3VkQXJ0aWZhY3QpOiB4IGlzIGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdCB7XG4gIHJldHVybiB4IGluc3RhbmNlb2YgY3hhcGkuQXNzZXRNYW5pZmVzdEFydGlmYWN0O1xufVxuXG5mdW5jdGlvbiBnZXRBc3NldE1hbmlmZXN0KGFzbTogY3hhcGkuQ2xvdWRBc3NlbWJseSk6IGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdCB7XG4gIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBhc20uYXJ0aWZhY3RzLmZpbHRlcihpc0Fzc2V0TWFuaWZlc3QpWzBdO1xuICBpZiAoIW1hbmlmZXN0QXJ0aWZhY3QpIHsgdGhyb3cgbmV3IEVycm9yKCdubyBhc3NldCBtYW5pZmVzdCBpbiBhc3NlbWJseScpOyB9XG4gIHJldHVybiBtYW5pZmVzdEFydGlmYWN0O1xufVxuXG5mdW5jdGlvbiByZWFkQXNzZXRNYW5pZmVzdChtYW5pZmVzdEFydGlmYWN0OiBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3QpOiBjeHNjaGVtYS5Bc3NldE1hbmlmZXN0IHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKG1hbmlmZXN0QXJ0aWZhY3QuZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSk7XG59XG5cbmZ1bmN0aW9uIGxhc3Q8QT4oeHM/OiBBW10pOiBBIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHhzID8geHNbeHMubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG59XG4iXX0=
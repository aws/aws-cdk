import * as fs from 'fs';
import * as cxschema from '../../../cloud-assembly-schema';
import { ArtifactType } from '../../../cloud-assembly-schema';
import * as cxapi from '../../../cx-api';
import { App, Aws, CfnResource, ContextProvider, DefaultStackSynthesizer, FileAssetPackaging, Stack, NestedStack, DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource, SynthesizeStackArtifactOptions } from '../../lib';
import { ISynthesisSession } from '../../lib/stack-synthesizers/types';
import { evaluateCFN } from '../evaluate-cfn';

const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};

describe('new style synthesis', () => {
  let app: App;
  let stack: Stack;
  let nestedStack: NestedStack;

  beforeEach(() => {
    app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: 'true',
      },
    });
    stack = new Stack(app, 'Stack');

  });

  test('stack template is in asset manifest', () => {
    // GIVEN
    new CfnResource(stack, 'Resource', {
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
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

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
    new CfnResource(stack, 'Resource', {
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
    stack = new Stack(app, 'Stack2', {
      synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
      }),
    });
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // THEN
    const template = app.synth().getStackByName('Stack2').template;
    expect(template?.Rules?.CheckBootstrapVersion).toEqual(undefined);

  });

  test('can set role additional options tags on default stack synthesizer', () => {
    // GIVEN
    stack = new Stack(app, 'SessionTagsStack', {
      synthesizer: new DefaultStackSynthesizer({
        deployRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering-DeployRoleTag' }],
        },
        fileAssetPublishingRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering-FileAssetTag' }],
        },
        imageAssetPublishingRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering-ImageAssetTag' }],
        },
        lookupRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering-LookupRoleTag' }],
        },
      }),
      env: {
        account: '111111111111', region: 'us-east-1',
      },
    });

    stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'fileHash',
    });

    stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'dockerHash',
    });

    ContextProvider.getValue(stack, {
      provider: cxschema.ContextProvider.VPC_PROVIDER,
      props: {},
      dummyValue: undefined,
    }).value;

    // THEN
    const asm = app.synth();
    const manifest = asm.getStackByName('SessionTagsStack').manifest;
    // Validates that the deploy and lookup role session tags were set in the Manifest:
    expect((manifest.properties as cxschema.AwsCloudFormationStackProperties).assumeRoleAdditionalOptions?.Tags).toEqual([{ Key: 'Department', Value: 'Engineering-DeployRoleTag' }]);
    expect((manifest.properties as cxschema.AwsCloudFormationStackProperties).lookupRole?.assumeRoleAdditionalOptions?.Tags).toEqual([{ Key: 'Department', Value: 'Engineering-LookupRoleTag' }]);

    const assetManifest = getAssetManifest(asm);
    const assetManifestJSON = readAssetManifest(assetManifest);

    // Validates that the image and file asset session tags were set in the asset manifest:
    expect(assetManifestJSON.dockerImages?.dockerHash.destinations['111111111111-us-east-1'].assumeRoleAdditionalOptions?.Tags).toEqual([{ Key: 'Department', Value: 'Engineering-ImageAssetTag' }]);
    expect(assetManifestJSON.files?.fileHash.destinations['111111111111-us-east-1'].assumeRoleAdditionalOptions?.Tags).toEqual([{ Key: 'Department', Value: 'Engineering-FileAssetTag' }]);

    // assert that lookup role options are added to the missing lookup context
    expect(asm.manifest.missing![0].props.assumeRoleAdditionalOptions).toEqual({
      Tags: [{ Key: 'Department', Value: 'Engineering-LookupRoleTag' }],
    });

  });

  test('customize version parameter', () => {
    // GIVEN
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack', {
      synthesizer: new DefaultStackSynthesizer({
        bootstrapStackVersionSsmParameter: 'stack-version-parameter',
      }),
    });

    mystack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
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
    class BootstraplessStackSynthesizer extends DefaultStackSynthesizer {

      /**
       * Synthesize the associated bootstrap stack to the session.
       */
      public synthesize(session: ISynthesisSession): void {
        this.synthesizeTemplate(session);
        session.assembly.addArtifact('FAKE_ARTIFACT_ID', {
          type: ArtifactType.ASSET_MANIFEST,
          properties: {
            file: 'FAKE_ARTIFACT_ID.json',
          },
        });
        this.emitArtifact(session, {
          additionalDependencies: ['FAKE_ARTIFACT_ID'],
        });
      }
    }

    const myapp = new App();

    // WHEN
    new Stack(myapp, 'mystack', {
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
    stack = new Stack(app, 'Stack2', {
      synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
      }),
      env: {
        account: '111111111111', region: 'us-east-1',
      },
    });
    ContextProvider.getValue(stack, {
      provider: cxschema.ContextProvider.VPC_PROVIDER,
      props: {},
      dummyValue: undefined,
    }).value;

    // THEN
    const assembly = app.synth();
    expect(assembly.manifest.missing![0].props.lookupRoleArn).toEqual('arn:${AWS::Partition}:iam::111111111111:role/cdk-hnb659fds-lookup-role-111111111111-us-east-1');

  });

  test('generates missing context with the lookup role external id as one of the missing context properties', () => {
    // GIVEN
    stack = new Stack(app, 'Stack2', {
      synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
        lookupRoleExternalId: 'External',
      }),
      env: {
        account: '111111111111', region: 'us-east-1',
      },
    });
    ContextProvider.getValue(stack, {
      provider: cxschema.ContextProvider.VPC_PROVIDER,
      props: {},
      dummyValue: undefined,
    }).value;

    // THEN
    const assembly = app.synth();
    expect(assembly.manifest.missing![0].props.lookupRoleExternalId).toEqual('External');

  });

  test('nested Stack uses the lookup role ARN of the parent stack', () => {
    // GIVEN
    const myapp = new App();
    const mystack = new Stack(myapp, 'mystack', {
      synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
      }),
      env: {
        account: '111111111111', region: 'us-east-1',
      },
    });
    nestedStack = new NestedStack(mystack, 'nestedStack');

    // THEN
    expect(nestedStack.synthesizer.lookupRole).toEqual('arn:${AWS::Partition}:iam::111111111111:role/cdk-hnb659fds-lookup-role-111111111111-us-east-1');

  });

  test('add file asset', () => {
    // WHEN
    const ext = __filename.match(/\.([tj]s)$/)?.[1];
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location with region placeholders
    expect(evalCFN(location.bucketName)).toEqual('cdk-hnb659fds-assets-the_account-the_region');
    expect(evalCFN(location.s3Url)).toEqual(`https://s3.the_region.domain.aws/cdk-hnb659fds-assets-the_account-the_region/abcdef.${ext}`);

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
    }).toThrow(/Exactly one of 'directoryName' or 'executable' is required/);

    expect(() => {
      stack.synthesizer.addDockerImageAsset({
        sourceHash: 'abcdef',
        dockerBuildSecrets: {
          DEF: '456',
        },
      });
    }).toThrow(/Exactly one of 'directoryName' or 'executable' is required/);
  });

  test('synthesis', () => {
    // GIVEN
    stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
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
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack', {
      synthesizer: new DefaultStackSynthesizer({
        fileAssetsBucketName: 'file-asset-bucket',
        fileAssetPublishingRoleArn: 'file:role:arn',
        fileAssetPublishingExternalId: 'file-external-id',

        imageAssetsRepositoryName: 'image-ecr-repository',
        imageAssetPublishingRoleArn: 'image:role:arn',
        imageAssetPublishingExternalId: 'image-external-id',
      }),
    });

    const ext = __filename.match(/\.([tj]s)$/)?.[1];
    mystack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
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
      objectKey: `file-asset-hash.${ext}`,
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
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack', {
      synthesizer: new DefaultStackSynthesizer({
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
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack-bucketPrefix', {
      synthesizer: new DefaultStackSynthesizer({
        fileAssetsBucketName: 'file-asset-bucket',
        fileAssetPublishingRoleArn: 'file:role:arn',
        fileAssetPublishingExternalId: 'file-external-id',
        bucketPrefix: '000000000000/',
      }),
    });

    mystack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
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
      objectKey: '000000000000/file-asset-hash-with-prefix.ts',
      assumeRoleArn: 'file:role:arn',
      assumeRoleExternalId: 'file-external-id',
    });

    const templateHash = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));

    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://file-asset-bucket/000000000000/${templateHash}`);

  });

  test('synthesis with dockerPrefix', () => {
    // GIVEN
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack-dockerPrefix', {
      synthesizer: new DefaultStackSynthesizer({
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
    const synthesizer = new DefaultStackSynthesizer({
      bootstrapStackVersionSsmParameter: 'bleep',
    });

    // WHEN
    const stack1 = new Stack(app, 'Stack1', { synthesizer });
    const stack2 = new Stack(app, 'Stack2', { synthesizer });

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
  function evalCFN(value: any) {
    return evaluateCFN(stack.resolve(value), CFN_CONTEXT);
  }
});

test('can specify synthesizer at the app level', () => {
  // GIVEN
  const app = new App({
    defaultStackSynthesizer: new DefaultStackSynthesizer({
      bootstrapStackVersionSsmParameter: 'bleep',
    }),
  });

  // WHEN
  const stack1 = new Stack(app, 'Stack1');
  const stack2 = new Stack(app, 'Stack2');

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
    new DefaultStackSynthesizer({
      fileAssetsBucketName: `my-bucket-${Aws.REGION}`,
    });
  }).toThrow(/cannot contain tokens/);
});

function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

function getAssetManifest(asm: cxapi.CloudAssembly): cxapi.AssetManifestArtifact {
  const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
  if (!manifestArtifact) { throw new Error('no asset manifest in assembly'); }
  return manifestArtifact;
}

function readAssetManifest(manifestArtifact: cxapi.AssetManifestArtifact): cxschema.AssetManifest {
  return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}

function last<A>(xs?: A[]): A | undefined {
  return xs ? xs[xs.length - 1] : undefined;
}

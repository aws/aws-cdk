import * as fs from 'fs';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { App, Aws, CfnResource, CliCredentialsStackSynthesizer, FileAssetPackaging, Stack } from '../../lib';
import { evaluateCFN } from '../evaluate-cfn';

const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};

let app: App;
let stack: Stack;
describe('CLI creds synthesis', () => {
  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      synthesizer: new CliCredentialsStackSynthesizer(),
    });
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
        },
      },
    });
  });

  test('add file asset', () => {
    // WHEN
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
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
  });

  test('customize publishing resources', () => {
    // GIVEN
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack', {
      synthesizer: new CliCredentialsStackSynthesizer({
        fileAssetsBucketName: 'file-asset-bucket',
        imageAssetsRepositoryName: 'image-ecr-repository',
      }),
    });

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
      objectKey: 'file-asset-hash.js',
    });

    expect(manifest.dockerImages?.['docker-asset-hash']?.destinations?.['current_account-current_region']).toEqual({
      repositoryName: 'image-ecr-repository',
      imageTag: 'docker-asset-hash',
    });
  });

  test('synthesis with bucketPrefix', () => {
    // GIVEN
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack-bucketPrefix', {
      synthesizer: new CliCredentialsStackSynthesizer({
        fileAssetsBucketName: 'file-asset-bucket',
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
      objectKey: '000000000000/file-asset-hash-with-prefix.js',
    });

    const templateHash = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));

    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://file-asset-bucket/000000000000/${templateHash}`);
  });

  test('synthesis with dockerPrefix', () => {
    // GIVEN
    const myapp = new App();

    // WHEN
    const mystack = new Stack(myapp, 'mystack-dockerPrefix', {
      synthesizer: new CliCredentialsStackSynthesizer({
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
    const synthesizer = new CliCredentialsStackSynthesizer();

    // WHEN
    new Stack(app, 'Stack2', { synthesizer });
    new Stack(app, 'Stack3', { synthesizer });

    app.synth();
  });
});

test('get an exception when using tokens for parameters', () => {
  expect(() => {
    // GIVEN
    new CliCredentialsStackSynthesizer({
      fileAssetsBucketName: `my-bucket-${Aws.REGION}`,
    });
  }).toThrow(/cannot contain tokens/);
});

/**
 * Evaluate a possibly string-containing value the same way CFN would do
 *
 * (Be invariant to the specific Fn::Sub or Fn::Join we would output)
 */
function evalCFN(value: any) {
  return evaluateCFN(stack.resolve(value), CFN_CONTEXT);
}

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

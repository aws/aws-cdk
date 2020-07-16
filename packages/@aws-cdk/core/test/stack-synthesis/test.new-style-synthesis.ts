import * as fs from 'fs';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { App, CfnResource, DefaultStackSynthesizer, FileAssetPackaging, Stack } from '../../lib';
import { evaluateCFN } from '../evaluate-cfn';

const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};

let app: App;
let stack: Stack;
export = {
  'setUp'(cb: () => void) {
    app = new App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: 'true',
      },
    });
    stack = new Stack(app, 'Stack');
    cb();
  },

  'stack template is in asset manifest'(test: Test) {
    // GIVEN
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    const asm = app.synth();

    // THEN -- the S3 url is advertised on the stack artifact
    const stackArtifact = asm.getStackArtifact('Stack');
    test.equals(stackArtifact.stackTemplateAssetObjectUrl, 's3://cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/4bdae6e3b1b15f08c889d6c9133f24731ee14827a9a9ab9b6b6a9b42b6d34910');

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    test.ok(manifestArtifact);
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    test.deepEqual(firstFile, {
      source: { path: 'Stack.template.json', packaging: 'file' },
      destinations: {
        'current_account-current_region': {
          bucketName: 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
          objectKey: '4bdae6e3b1b15f08c889d6c9133f24731ee14827a9a9ab9b6b6a9b42b6d34910',
          assumeRoleArn: 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-file-publishing-role-${AWS::AccountId}-${AWS::Region}',
        },
      },
    });

    test.done();
  },

  'add file asset'(test: Test) {
    // WHEN
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location with region placeholders
    test.equals(evalCFN(location.bucketName), 'cdk-hnb659fds-assets-the_account-the_region');
    test.equals(evalCFN(location.s3Url), 'https://s3.the_region.domain.aws/cdk-hnb659fds-assets-the_account-the_region/abcdef');

    // THEN - object key contains source hash somewhere
    test.ok(location.objectKey.indexOf('abcdef') > -1);

    test.done();
  },

  'add docker image asset'(test: Test) {
    // WHEN
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location with region placeholders
    test.equals(evalCFN(location.repositoryName), 'cdk-hnb659fds-container-assets-the_account-the_region');
    test.equals(evalCFN(location.imageUri), 'the_account.dkr.ecr.the_region.domain.aws/cdk-hnb659fds-container-assets-the_account-the_region:abcdef');

    test.done();
  },

  'synthesis'(test: Test) {
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
    const manifest = readAssetManifest(asm);

    test.equals(Object.keys(manifest.files || {}).length, 2);
    test.equals(Object.keys(manifest.dockerImages || {}).length, 1);

    // THEN - every artifact has an assumeRoleArn
    for (const file of Object.values(manifest.files ?? {})) {
      for (const destination of Object.values(file.destinations)) {
        test.deepEqual(destination.assumeRoleArn, 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-file-publishing-role-${AWS::AccountId}-${AWS::Region}');
      }
    }

    for (const file of Object.values(manifest.dockerImages ?? {})) {
      for (const destination of Object.values(file.destinations)) {
        test.deepEqual(destination.assumeRoleArn, 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-image-publishing-role-${AWS::AccountId}-${AWS::Region}');
      }
    }

    test.done();
  },

  'customize publishing resources'(test: Test) {
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
    const manifest = readAssetManifest(asm);

    test.deepEqual(manifest.files?.['file-asset-hash']?.destinations?.['current_account-current_region'], {
      bucketName: 'file-asset-bucket',
      objectKey: 'file-asset-hash',
      assumeRoleArn: 'file:role:arn',
      assumeRoleExternalId: 'file-external-id',
    });

    test.deepEqual(manifest.dockerImages?.['docker-asset-hash']?.destinations?.['current_account-current_region'] , {
      repositoryName: 'image-ecr-repository',
      imageTag: 'docker-asset-hash',
      assumeRoleArn: 'image:role:arn',
      assumeRoleExternalId: 'image-external-id',
    });

    test.done();
  },
};

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

function readAssetManifest(asm: cxapi.CloudAssembly): cxschema.AssetManifest {
  const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
  if (!manifestArtifact) { throw new Error('no asset manifest in assembly'); }

  return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}
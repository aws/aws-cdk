import * as asset_schema from '@aws-cdk/cdk-assets-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import { App, FileAssetPackaging, Stack } from '../../lib';
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
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    test.ok(manifestArtifact);
    const manifest: asset_schema.ManifestFile = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    test.equals(Object.keys(manifest.files || {}).length, 2);
    test.equals(Object.keys(manifest.dockerImages || {}).length, 1);

    // THEN - every artifact has an assumeRoleArn
    for (const file of Object.values({...manifest.files, ...manifest.dockerImages})) {
      for (const destination of Object.values(file.destinations)) {
        test.ok(destination.assumeRoleArn);
      }
    }

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
import { FileAssetPackaging } from '@aws-cdk/cloud-assembly-schema';
import { getAssetManifest, readAssetManifest } from './_helpers';
import { Aws, CliCredentialsStackSynthesizer, LegacyStackSynthesizer } from '../../lib';
import { App } from '../../lib/app';
import { Stack } from '../../lib/stack';
import { DefaultStackSynthesizer } from '../../lib/stack-synthesizers/default-synthesizer';

test.each([
  ['DefaultStackSynthesizer', () => new DefaultStackSynthesizer()],
  ['CliCredentialsStackSynthesizer', () => new CliCredentialsStackSynthesizer()],
])('%p: displayName is reflected in stack manifest', (_name, factory) => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    synthesizer: factory(),
    env: {
      account: '111111111111', region: 'us-east-1',
    },
  });

  stack.synthesizer.addFileAsset({
    fileName: __filename,
    packaging: FileAssetPackaging.FILE,
    sourceHash: 'fileHash',
    displayName: 'Some file asset',
  });

  stack.synthesizer.addDockerImageAsset({
    directoryName: '.',
    sourceHash: 'dockerHash',
    displayName: 'Some docker image asset',
  });

  // THEN
  const asm = app.synth();
  const assetManifest = getAssetManifest(asm);
  const assetManifestJSON = readAssetManifest(assetManifest);

  // Validates that the image and file asset session tags were set in the asset manifest:
  expect(assetManifestJSON.dockerImages?.dockerHash).toMatchObject({
    displayName: 'Some docker image asset',
  });
  expect(assetManifestJSON.files?.fileHash).toMatchObject({
    displayName: 'Some file asset',
  });
});

test.each([
  ['DefaultStackSynthesizer', () => new DefaultStackSynthesizer()],
  ['CliCredentialsStackSynthesizer', () => new CliCredentialsStackSynthesizer()],
])('%p: displayName may not contain tokens', (_name, factory) => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    synthesizer: factory(),
    env: {
      account: '111111111111', region: 'us-east-1',
    },
  });

  expect(() => stack.synthesizer.addFileAsset({
    fileName: __filename,
    packaging: FileAssetPackaging.FILE,
    sourceHash: 'fileHash',
    displayName: Aws.STACK_NAME,
  })).toThrow(/may not contain a Token/);

  expect(() => stack.synthesizer.addDockerImageAsset({
    directoryName: '.',
    sourceHash: 'dockerHash',
    displayName: Aws.STACK_NAME,
  })).toThrow(/may not contain a Token/);
});

import * as fs from 'fs';
import * as path from 'path';
import { AssetManifest } from '@aws-cdk/cloud-assembly-schema';
import { App, Stack } from '@aws-cdk/core';
import { AssetManifestArtifact, CloudArtifact, CloudAssembly } from '@aws-cdk/cx-api';
import { DockerImageAsset } from '../lib';

describe('build cache', () => {
  test('manifest contains cache from options ', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);
    const asset = new DockerImageAsset(stack, 'DockerImage6', {
      directory: path.join(__dirname, 'demo-image'),
      cacheFrom: [{ type: 'registry', params: { image: 'foo' } }],
    });

    // WHEN
    const asm = app.synth();

    // THEN
    const manifestArtifact = getAssetManifest(asm);
    const manifest = readAssetManifest(manifestArtifact);

    expect(Object.keys(manifest.dockerImages ?? {}).length).toBe(1);
    expect(manifest.dockerImages?.[asset.assetHash]?.source.cacheFrom?.length).toBe(1);
    expect(manifest.dockerImages?.[asset.assetHash]?.source.cacheFrom?.[0]).toStrictEqual({
      type: 'registry',
      params: { image: 'foo' },
    });
  });
  test('manifest contains cache to options ', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);
    const asset = new DockerImageAsset(stack, 'DockerImage6', {
      directory: path.join(__dirname, 'demo-image'),
      cacheTo: { type: 'inline' },
    });

    // WHEN
    const asm = app.synth();

    // THEN
    const manifestArtifact = getAssetManifest(asm);
    const manifest = readAssetManifest(manifestArtifact);

    expect(Object.keys(manifest.dockerImages ?? {}).length).toBe(1);
    expect(manifest.dockerImages?.[asset.assetHash]?.source.cacheTo).toStrictEqual({
      type: 'inline',
    });
  });

  test('manifest does not contain options when not specified', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);
    const asset = new DockerImageAsset(stack, 'DockerImage6', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // WHEN
    const asm = app.synth();

    // THEN
    const manifestArtifact = getAssetManifest(asm);
    const manifest = readAssetManifest(manifestArtifact);
    expect(Object.keys(manifest.dockerImages ?? {}).length).toBe(1);
    expect(manifest.dockerImages?.[asset.assetHash]?.source.cacheFrom).toBeUndefined();
    expect(manifest.dockerImages?.[asset.assetHash]?.source.cacheTo).toBeUndefined();
  });
});

function isAssetManifest(x: CloudArtifact): x is AssetManifestArtifact {
  return x instanceof AssetManifestArtifact;
}

function getAssetManifest(asm: CloudAssembly): AssetManifestArtifact {
  const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
  if (!manifestArtifact) {
    throw new Error('no asset manifest in assembly');
  }
  return manifestArtifact;
}

function readAssetManifest(manifestArtifact: AssetManifestArtifact): AssetManifest {
  return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}

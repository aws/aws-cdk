import * as os from 'os';
import { IntegManifest, Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs-extra';
import { IntegManifestWriter } from '../lib/manifest-writer';

describe(IntegManifestWriter, () => {
  const tmpDir = fs.mkdtempSync(os.tmpdir());
  const manifest: IntegManifest = {
    version: 'does not matter',
    testCases: {
      test1: {
        stacks: ['MyStack'],
        diffAssets: false,
      },
      test2: {
        stacks: ['MyOtherStack'],
        diffAssets: true,
      },
    },
  };

  beforeEach(() => {
    fs.emptyDirSync(tmpDir);
  });

  it('writes manifests to default location in the specified directory', () => {
    IntegManifestWriter.write(manifest, tmpDir);

    const loaded = Manifest.loadIntegManifest(`${tmpDir}/integ.json`);

    expect(loaded).toEqual({ ...manifest, version: Manifest.version() });
  });

  it('writes manifests to the chosen location', () => {
    IntegManifestWriter.write(manifest, `${tmpDir}/custom-name.json`);

    const loaded = Manifest.loadIntegManifest(`${tmpDir}/custom-name.json`);

    expect(loaded).toEqual({ ...manifest, version: Manifest.version() });
  });
});
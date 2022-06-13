import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { IntegManifest, Manifest } from '@aws-cdk/cloud-assembly-schema';
import { IntegManifestWriter } from '../lib/manifest-writer';

describe(IntegManifestWriter, () => {
  let tmpDir: string;
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
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));
  });

  afterEach(() => {
    deleteFolderRecursive(tmpDir);
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

function deleteFolderRecursive(directoryPath: string) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

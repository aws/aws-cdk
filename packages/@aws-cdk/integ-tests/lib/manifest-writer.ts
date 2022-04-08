import * as path from 'path';
import { IntegManifest, Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs-extra';

export class IntegManifestWriter {
  public static readonly DEFAULT_FILENAME = 'integ.json';

  public static write(manifest: IntegManifest, filePath: string) {
    Manifest.saveIntegManifest(manifest, getFinalLocation(filePath));
  }
}

function getFinalLocation(filePath: string): string {
  try {
    const st = fs.statSync(filePath);
    return st.isDirectory()
      ? path.join(filePath, IntegManifestWriter.DEFAULT_FILENAME)
      : filePath;
  } catch (e) {
    if (e.code === 'ENOENT') {
      fs.ensureFileSync(filePath);
      return filePath;
    }
    throw new Error(`Cannot write integ manifest to '${filePath}': ${e.message}`);
  }
}

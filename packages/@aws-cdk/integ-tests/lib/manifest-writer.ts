import * as fs from 'fs';
import * as path from 'path';
import { IntegManifest, Manifest } from '@aws-cdk/cloud-assembly-schema';

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
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return filePath;
    }
    throw new Error(`Cannot write integ manifest to '${filePath}': ${e.message}`);
  }
}

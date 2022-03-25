import * as path from 'path';
import { IntegManifest, Manifest, TestCase } from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs-extra';

export class IntegManifestReader {
  public static readonly DEFAULT_FILENAME = 'integ.json';

  public static fromFile(fileName: string): IntegManifestReader {
    try {
      const obj = Manifest.loadIntegManifest(fileName);
      return new IntegManifestReader(path.dirname(fileName), obj);

    } catch (e) {
      throw new Error(`Cannot read integ manifest '${fileName}': ${e.message}`);
    }
  }

  public static fromPath(filePath: string): IntegManifestReader {
    let st;
    try {
      st = fs.statSync(filePath);
    } catch (e) {
      throw new Error(`Cannot read integ manifest at '${filePath}': ${e.message}`);
    }
    if (st.isDirectory()) {
      return IntegManifestReader.fromFile(path.join(filePath, IntegManifestReader.DEFAULT_FILENAME));
    }
    return IntegManifestReader.fromFile(filePath);
  }

  /**
   * The directory where the manifest was found
   */
  public readonly directory: string;
  constructor(directory: string, private readonly manifest: IntegManifest) {
    this.directory = directory;
  }

  /**
   * List of tests
   */
  public get tests(): { [testCaseName: string]: TestCase } {
    return this.manifest.testCases;
  }
}

import * as path from 'path';
import { IntegManifest, Manifest, TestCase } from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs-extra';

/**
 * Test case configuration read from the integ manifest
 */
export interface IntegTestConfig {
  /**
   * Test cases contained in this integration test
   */
  readonly testCases: { [testCaseName: string]: TestCase };

  /**
   * Whether to enable lookups for this test
   *
   * @default false
   */
  readonly enableLookups: boolean;

  /**
   * Additional context to use when performing
   * a synth. Any context provided here will override
   * any default context
   *
   * @default - no additional context
   */
  readonly synthContext?: { [name: string]: string };
}

/**
 * Reads an integration tests manifest
 */
export class IntegManifestReader {
  public static readonly DEFAULT_FILENAME = 'integ.json';

  /**
   * Reads an integration test manifest from the specified file
   */
  public static fromFile(fileName: string): IntegManifestReader {
    try {
      const obj = Manifest.loadIntegManifest(fileName);
      return new IntegManifestReader(path.dirname(fileName), obj);

    } catch (e: any) {
      throw new Error(`Cannot read integ manifest '${fileName}': ${e.message}`);
    }
  }

  /**
   * Reads a Integration test manifest from a file or a directory
   * If the given filePath is a directory then it will look for
   * a file within the directory with the DEFAULT_FILENAME
   */
  public static fromPath(filePath: string): IntegManifestReader {
    let st;
    try {
      st = fs.statSync(filePath);
    } catch (e: any) {
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
   * List of integration tests in the manifest
   */
  public get tests(): IntegTestConfig {
    return {
      testCases: this.manifest.testCases,
      enableLookups: this.manifest.enableLookups ?? false,
      synthContext: this.manifest.synthContext,
    };
  }
}

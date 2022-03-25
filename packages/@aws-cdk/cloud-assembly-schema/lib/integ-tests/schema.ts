import { TestCase } from './test-case';
/**
 * Definitions for the integration testing manifest
 */
export interface IntegManifest {
  /**
   * Version of the manifest
   */
  readonly version: string;

  /**
   * test cases
   */
  readonly testCases: { [testName: string]: TestCase };
}


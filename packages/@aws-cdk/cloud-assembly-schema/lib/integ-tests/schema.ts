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
   * Enable lookups for this test. If lookups are enabled
   * then `stackUpdateWorkflow` must be set to false.
   * Lookups should only be enabled when you are explicitely testing
   * lookups.
   *
   * @default false
   */
  readonly enableLookups?: boolean;

  /**
   * test cases
   */
  readonly testCases: { [testName: string]: TestCase };
}


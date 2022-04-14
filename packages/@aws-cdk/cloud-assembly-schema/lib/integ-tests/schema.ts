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
   * Run update workflow on this integration test
   * This should only be set to false to test scenarios
   * that are not possible to test as part of the update workflow
   *
   * @default true
   */
  readonly stackUpdateWorkflow?: boolean;

  /**
   * test cases
   */
  readonly testCases: { [testName: string]: TestCase };
}


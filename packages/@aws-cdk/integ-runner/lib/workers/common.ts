import * as chalk from 'chalk';
import * as logger from '../logger';
import { IntegTestConfig } from '../runner/integ-tests';

/**
 * Integration test results
 */
export interface IntegBatchResponse {
  failedTests: IntegTestConfig[];
}

/**
 * Common options for running integration tests
 */
export interface IntegTestOptions {
  /**
   * A list of integration tests to run
   * in this batch
   */
  readonly tests: IntegTestConfig[];

  /**
   * Whether or not to destroy the stacks at the
   * end of the test
   *
   * @default true
   */
  readonly clean?: boolean;

  /**
   * When this is set to `true` the snapshot will
   * be created _without_ running the integration test
   * The resulting snapshot SHOULD NOT be checked in
   *
   * @default false
   */
  readonly dryRun?: boolean;

  /**
   * Whether to enable verbose logging
   *
   * @default false
   */
  readonly verbose?: boolean;
}

/**
 * Represents possible reasons for a diagnostic
 */
export enum DiagnosticReason {
  /**
   * The integration test failed because there
   * is not existing snapshot
   */
  NO_SNAPSHOT = 'NO_SNAPSHOT',

  /**
   * The integration test failed
   */
  TEST_FAILED = 'TEST_FAILED',

  /**
   * The snapshot test failed because the actual
   * snapshot was different than the expected snapshot
   */
  SNAPSHOT_FAILED = 'SNAPSHOT_FAILED',

  /**
   * The snapshot test succeeded
   */
  SNAPSHOT_SUCCESS = 'SNAPSHOT_SUCCESS',

  /**
   * The integration test succeeded
   */
  TEST_SUCCESS = 'TEST_SUCCESS',
}

/**
 * Integration test diagnostics
 * This is used to report back the status of each test
 */
export interface Diagnostic {
  /**
   * The name of the test
   */
  readonly testName: string;

  /**
   * The diagnostic message
   */
  readonly message: string;

  /**
   * The reason for the diagnostic
   */
  readonly reason: DiagnosticReason;
}

export function printSummary(total: number, failed: number): void {
  if (failed > 0) {
    logger.print('%s:    %s %s, %s total', chalk.bold('Tests'), chalk.red(failed), chalk.red('failed'), total);
  } else {
    logger.print('%s:    %s %s, %s total', chalk.bold('Tests'), chalk.green(total), chalk.green('passed'), total);
  }
}

/**
 * Print out the results from tests
 */
export function printResults(diagnostic: Diagnostic): void {
  switch (diagnostic.reason) {
    case DiagnosticReason.SNAPSHOT_SUCCESS:
      logger.success('  %s No Change!', diagnostic.testName);
      break;
    case DiagnosticReason.TEST_SUCCESS:
      logger.success('  %s Test Succeeded!', diagnostic.testName);
      break;
    case DiagnosticReason.NO_SNAPSHOT:
      logger.error('  %s - No Snapshot!', diagnostic.testName);
      break;
    case DiagnosticReason.SNAPSHOT_FAILED:
      logger.error('  %s - Snapshot changed!\n%s', diagnostic.testName, diagnostic.message);
      break;
    case DiagnosticReason.TEST_FAILED:
      logger.error('  %s - Failed!\n%s', diagnostic.testName, diagnostic.message);
  }
}

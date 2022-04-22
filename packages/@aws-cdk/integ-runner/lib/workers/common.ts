import { ResourceImpact } from '@aws-cdk/cloudformation-diff';
import * as chalk from 'chalk';
import * as logger from '../logger';
import { IntegTestConfig } from '../runner/integration-tests';

/**
 * Config for an integration test
 */
export interface IntegTestWorkerConfig extends IntegTestConfig {
  /**
   * A list of any destructive changes
   *
   * @default []
   */
  readonly destructiveChanges?: DestructiveChange[];
}

/**
 * Information on any destructive changes
 */
export interface DestructiveChange {
  /**
   * The logicalId of the resource with a destructive change
   */
  readonly logicalId: string;

  /**
   * The name of the stack that contains the destructive change
   */
  readonly stackName: string;

  /**
   * The impact of the destructive change
   */
  readonly impact: ResourceImpact;
}


/**
 * Represents integration tests metrics for a given worker
 */
export interface IntegRunnerMetrics {
  /**
   * The region the test was run in
   */
  readonly region: string;

  /**
   * The total duration of the worker.
   * This will be the sum of all individual test durations
   */
  readonly duration: number;

  /**
   * Contains the duration of individual tests that the
   * worker executed.
   *
   * Map of testName to duration.
   */
  readonly tests: { [testName: string]: number };

  /**
   * The profile that was used to run the test
   *
   * @default - default profile
   */
  readonly profile?: string;
}

/**
 * Integration test results
 */
export interface IntegBatchResponse {
  /**
   * List of failed tests
   */
  readonly failedTests: IntegTestConfig[];

  /**
   * List of Integration test metrics. Each entry in the
   * list represents metrics from a single worker (account + region).
   */
  readonly metrics: IntegRunnerMetrics[];
}

/**
 * Common options for running integration tests
 */
export interface IntegTestOptions {
  /**
   * A list of integration tests to run
   * in this batch
   */
  readonly tests: IntegTestWorkerConfig[];

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

  /**
   * If this is set to true then the stack update workflow will be disabled
   *
   * @default true
   */
  readonly updateWorkflow?: boolean;
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
   * The time it took to run the test
   */
  readonly duration?: number;

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
      logger.success('  %s No Change! %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`));
      break;
    case DiagnosticReason.TEST_SUCCESS:
      logger.success('  %s Test Succeeded! %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`));
      break;
    case DiagnosticReason.NO_SNAPSHOT:
      logger.error('  %s - No Snapshot! %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`));
      break;
    case DiagnosticReason.SNAPSHOT_FAILED:
      logger.error('  %s - Snapshot changed! %s\n%s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
      break;
    case DiagnosticReason.TEST_FAILED:
      logger.error('  %s - Failed! %s\n%s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
  }
}

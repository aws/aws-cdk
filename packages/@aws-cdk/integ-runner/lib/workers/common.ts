import { format } from 'util';
import { ResourceImpact } from '@aws-cdk/cloudformation-diff';
import * as chalk from 'chalk';
import * as logger from '../logger';
import { IntegTestInfo } from '../runner/integration-tests';

/**
 * The aggregate results from running assertions on a test case
 */
export type AssertionResults = { [id: string]: AssertionResult };

/**
 * The result of an individual assertion
 */
export interface AssertionResult {
  /**
   * The assertion message. If the assertion failed, this will
   * include the reason.
   */
  readonly message: string;

  /**
   * Whether the assertion succeeded or failed
   */
  readonly status: 'success' | 'fail';
}

/**
 * Config for an integration test
 */
export interface IntegTestWorkerConfig extends IntegTestInfo {
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

export interface SnapshotVerificationOptions {
  /**
   * Retain failed snapshot comparisons
   *
   * @default false
   */
  readonly retain?: boolean;

  /**
   * Verbose mode
   *
   * @default false
   */
  readonly verbose?: boolean;
}

/**
 * Integration test results
 */
export interface IntegBatchResponse {
  /**
   * List of failed tests
   */
  readonly failedTests: IntegTestInfo[];

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
   * The level of verbosity for logging.
   * Higher number means more output.
   *
   * @default 0
   */
  readonly verbosity?: number;

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
   * There was an error running the integration test
   */
  TEST_ERROR = 'TEST_ERROR',

  /**
   * The snapshot test failed because the actual
   * snapshot was different than the expected snapshot
   */
  SNAPSHOT_FAILED = 'SNAPSHOT_FAILED',

  /**
   * The snapshot test failed because there was an error executing it
   */
  SNAPSHOT_ERROR = 'SNAPSHOT_ERROR',

  /**
   * The snapshot test succeeded
   */
  SNAPSHOT_SUCCESS = 'SNAPSHOT_SUCCESS',

  /**
   * The integration test succeeded
   */
  TEST_SUCCESS = 'TEST_SUCCESS',

  /**
   * The assertion failed
   */
  ASSERTION_FAILED = 'ASSERTION_FAILED',
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
   * The name of the stack
   */
  readonly stackName: string;

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

  /**
   * Additional messages to print
   */
  readonly additionalMessages?: string[];

  /**
   * Relevant config options that were used for the integ test
   */
  readonly config?: Record<string, any>;
}

export function printSummary(total: number, failed: number): void {
  if (failed > 0) {
    logger.print('%s:    %s %s, %s total', chalk.bold('Tests'), chalk.red(failed), chalk.red('failed'), total);
  } else {
    logger.print('%s:    %s %s, %s total', chalk.bold('Tests'), chalk.green(total), chalk.green('passed'), total);
  }
}

/**
 * Format the assertion results so that the results can be
 * printed
 */
export function formatAssertionResults(results: AssertionResults): string {
  return Object.entries(results)
    .map(([id, result]) => format('%s%s', id, result.status === 'success' ? ` - ${result.status}` : `\n${result.message}`))
    .join('\n      ');
}

/**
 * Print out the results from tests
 */
export function printResults(diagnostic: Diagnostic): void {
  switch (diagnostic.reason) {
    case DiagnosticReason.SNAPSHOT_SUCCESS:
      logger.success('  UNCHANGED  %s %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`));
      break;
    case DiagnosticReason.TEST_SUCCESS:
      logger.success('  SUCCESS    %s %s\n      ', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
      break;
    case DiagnosticReason.NO_SNAPSHOT:
      logger.error('  NEW        %s %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`));
      break;
    case DiagnosticReason.SNAPSHOT_FAILED:
      logger.error('  CHANGED    %s %s\n      %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
      break;
    case DiagnosticReason.SNAPSHOT_ERROR:
    case DiagnosticReason.TEST_ERROR:
      logger.error('  ERROR      %s %s\n      %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
      break;
    case DiagnosticReason.TEST_FAILED:
      logger.error('  FAILED     %s %s\n      %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
      break;
    case DiagnosticReason.ASSERTION_FAILED:
      logger.error('  ASSERT     %s %s\n      %s', diagnostic.testName, chalk.gray(`${diagnostic.duration}s`), diagnostic.message);
      break;
  }
  for (const addl of diagnostic.additionalMessages ?? []) {
    logger.print(`      ${addl}`);
  }
}

export function printLaggards(testNames: Set<string>) {
  const parts = [
    '  ',
    `Waiting for ${testNames.size} more`,
    testNames.size < 10 ? ['(', Array.from(testNames).join(', '), ')'].join('') : '',
  ];

  logger.print(chalk.grey(parts.filter(x => x).join(' ')));
}

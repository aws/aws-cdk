import * as workerpool from 'workerpool';
import { IntegSnapshotRunner, IntegTestRunner } from '../../runner';
import { IntegTest, IntegTestInfo } from '../../runner/integration-tests';
import { DiagnosticReason, IntegTestWorkerConfig, SnapshotVerificationOptions, Diagnostic, formatAssertionResults } from '../common';
import { IntegTestBatchRequest } from '../integ-test-worker';

/**
 * Runs a single integration test batch request.
 * If the test does not have an existing snapshot,
 * this will first generate a snapshot and then execute
 * the integration tests.
 *
 * If the tests succeed it will then save the snapshot
 */
export function integTestWorker(request: IntegTestBatchRequest): IntegTestWorkerConfig[] {
  const failures: IntegTestInfo[] = [];
  const verbosity = request.verbosity ?? 0;

  for (const testInfo of request.tests) {
    const test = new IntegTest(testInfo); // Hydrate from data
    const start = Date.now();

    try {
      const runner = new IntegTestRunner({
        test,
        profile: request.profile,
        env: {
          AWS_REGION: request.region,
          CDK_DOCKER: process.env.CDK_DOCKER ?? 'docker',
        },
        showOutput: verbosity >= 2,
      }, testInfo.destructiveChanges);

      const tests = runner.actualTests();

      if (!tests || Object.keys(tests).length === 0) {
        throw new Error(`No tests defined for ${runner.testName}`);
      }
      for (const testCaseName of Object.keys(tests)) {
        try {
          const results = runner.runIntegTestCase({
            testCaseName,
            clean: request.clean,
            dryRun: request.dryRun,
            updateWorkflow: request.updateWorkflow,
            verbosity,
          });
          if (results && Object.values(results).some(result => result.status === 'fail')) {
            failures.push(testInfo);
            workerpool.workerEmit({
              reason: DiagnosticReason.ASSERTION_FAILED,
              testName: `${runner.testName}-${testCaseName} (${request.profile}/${request.region})`,
              message: formatAssertionResults(results),
              duration: (Date.now() - start) / 1000,
            });
          } else {
            workerpool.workerEmit({
              reason: DiagnosticReason.TEST_SUCCESS,
              testName: `${runner.testName}-${testCaseName}`,
              message: results ? formatAssertionResults(results) : 'NO ASSERTIONS',
              duration: (Date.now() - start) / 1000,
            });
          }
        } catch (e) {
          failures.push(testInfo);
          workerpool.workerEmit({
            reason: DiagnosticReason.TEST_FAILED,
            testName: `${runner.testName}-${testCaseName} (${request.profile}/${request.region})`,
            message: `Integration test failed: ${e}`,
            duration: (Date.now() - start) / 1000,
          });
        }
      }
    } catch (e) {
      failures.push(testInfo);
      workerpool.workerEmit({
        reason: DiagnosticReason.TEST_ERROR,
        testName: `${testInfo.fileName} (${request.profile}/${request.region})`,
        message: `Error during integration test: ${e}`,
        duration: (Date.now() - start) / 1000,
      });
    }
  }

  return failures;
}

/**
 * Runs a single snapshot test batch request.
 * For each integration test this will check to see
 * if there is an existing snapshot, and if there is will
 * check if there are any changes
 */
export function snapshotTestWorker(testInfo: IntegTestInfo, options: SnapshotVerificationOptions = {}): IntegTestWorkerConfig[] {
  const failedTests = new Array<IntegTestWorkerConfig>();
  const start = Date.now();
  const test = new IntegTest(testInfo); // Hydrate the data record again

  const timer = setTimeout(() => {
    workerpool.workerEmit({
      reason: DiagnosticReason.SNAPSHOT_ERROR,
      testName: test.testName,
      message: 'Test is taking a very long time',
      duration: (Date.now() - start) / 1000,
    });
  }, 60_000);

  try {
    const runner = new IntegSnapshotRunner({ test });
    if (!runner.hasSnapshot()) {
      workerpool.workerEmit({
        reason: DiagnosticReason.NO_SNAPSHOT,
        testName: test.testName,
        message: 'No Snapshot',
        duration: (Date.now() - start) / 1000,
      });
      failedTests.push(test.info);
    } else {
      const { diagnostics, destructiveChanges } = runner.testSnapshot(options);
      if (diagnostics.length > 0) {
        diagnostics.forEach(diagnostic => workerpool.workerEmit({
          ...diagnostic,
          duration: (Date.now() - start) / 1000,
        } as Diagnostic));
        failedTests.push({
          ...test.info,
          destructiveChanges,
        });
      } else {
        workerpool.workerEmit({
          reason: DiagnosticReason.SNAPSHOT_SUCCESS,
          testName: test.testName,
          message: 'Success',
          duration: (Date.now() - start) / 1000,
        } as Diagnostic);
      }
    }
  } catch (e: any) {
    failedTests.push(test.info);
    workerpool.workerEmit({
      message: e.message,
      testName: test.testName,
      reason: DiagnosticReason.SNAPSHOT_ERROR,
      duration: (Date.now() - start) / 1000,
    } as Diagnostic);
  } finally {
    clearTimeout(timer);
  }

  return failedTests;
}

workerpool.worker({
  snapshotTestWorker,
  integTestWorker,
});

// Exercise all integ stacks and if they deploy, update the expected synth files
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import * as workerpool from 'workerpool';
import * as logger from './logger';
import { IntegrationTests, IntegTestInfo } from './runner/integration-tests';
import { runSnapshotTests, runIntegrationTests, IntegRunnerMetrics, IntegTestWorkerConfig, DestructiveChange } from './workers';

// https://github.com/yargs/yargs/issues/1929
// https://github.com/evanw/esbuild/issues/1492
// eslint-disable-next-line @typescript-eslint/no-require-imports
const yargs = require('yargs');

export function parseCliArgs(args: string[] = []) {
  const argv = yargs
    .usage('Usage: integ-runner [TEST...]')
    .option('config', {
      config: true,
      configParser: configFromFile,
      default: 'integ.config.json',
      desc: 'Load options from a JSON config file. Options provided as CLI arguments take precedent.',
    })
    .option('list', { type: 'boolean', default: false, desc: 'List tests instead of running them' })
    .option('clean', { type: 'boolean', default: true, desc: 'Skips stack clean up after test is completed (use --no-clean to negate)' })
    .option('verbose', { type: 'boolean', default: false, alias: 'v', count: true, desc: 'Verbose logs and metrics on integration tests durations (specify multiple times to increase verbosity)' })
    .option('dry-run', { type: 'boolean', default: false, desc: 'do not actually deploy the stack. just update the snapshot (not recommended!)' })
    .option('update-on-failed', { type: 'boolean', default: false, desc: 'rerun integration tests and update snapshots for failed tests.' })
    .option('force', { type: 'boolean', default: false, desc: 'Rerun all integration tests even if tests are passing' })
    .option('parallel-regions', { type: 'array', desc: 'Tests are run in parallel across these regions. To prevent tests from running in parallel, provide only a single region', default: [] })
    .options('directory', { type: 'string', default: 'test', desc: 'starting directory to discover integration tests. Tests will be discovered recursively from this directory' })
    .options('profiles', { type: 'array', desc: 'list of AWS profiles to use. Tests will be run in parallel across each profile+regions', default: [] })
    .options('max-workers', { type: 'number', desc: 'The max number of workerpool workers to use when running integration tests in parallel', default: 16 })
    .options('exclude', { type: 'boolean', desc: 'Run all tests in the directory, except the specified TESTs', default: false })
    .options('from-file', { type: 'string', desc: 'Read TEST names from a file (one TEST per line)' })
    .option('inspect-failures', { type: 'boolean', desc: 'Keep the integ test cloud assembly if a failure occurs for inspection', default: false })
    .option('disable-update-workflow', { type: 'boolean', default: false, desc: 'If this is "true" then the stack update workflow will be disabled' })
    .option('language', {
      alias: 'l',
      default: ['javascript', 'typescript', 'python', 'go'],
      choices: ['javascript', 'typescript', 'python', 'go'],
      type: 'array',
      desc: 'Use these presets to run integration tests for the selected languages',
    })
    .option('app', { type: 'string', default: undefined, desc: 'The custom CLI command that will be used to run the test files. You can include {filePath} to specify where in the command the test file path should be inserted. Example: --app="python3.8 {filePath}".' })
    .option('test-regex', { type: 'array', desc: 'Detect integration test files matching this JavaScript regex pattern. If used multiple times, all files matching any one of the patterns are detected.', default: [] })
    .strict()
    .parse(args);

  const tests: string[] = argv._;
  const parallelRegions = arrayFromYargs(argv['parallel-regions']);
  const testRegions: string[] = parallelRegions ?? ['us-east-1', 'us-east-2', 'us-west-2'];
  const profiles = arrayFromYargs(argv.profiles);
  const fromFile: string | undefined = argv['from-file'];
  const maxWorkers: number = argv['max-workers'];
  const verbosity: number = argv.verbose;
  const verbose: boolean = verbosity >= 1;

  const numTests = testRegions.length * (profiles ?? [1]).length;
  if (maxWorkers < numTests) {
    logger.warning('You are attempting to run %s tests in parallel, but only have %s workers. Not all of your profiles+regions will be utilized', numTests, maxWorkers);
  }

  if (tests.length > 0 && fromFile) {
    throw new Error('A list of tests cannot be provided if "--from-file" is provided');
  }
  const requestedTests = fromFile
    ? (fs.readFileSync(fromFile, { encoding: 'utf8' })).split('\n').filter(x => x)
    : (tests.length > 0 ? tests : undefined); // 'undefined' means no request

  return {
    tests: requestedTests,
    app: argv.app as (string | undefined),
    testRegex: arrayFromYargs(argv['test-regex']),
    testRegions,
    profiles,
    runUpdateOnFailed: (argv['update-on-failed'] ?? false) as boolean,
    fromFile,
    exclude: argv.exclude as boolean,
    maxWorkers,
    list: argv.list as boolean,
    directory: argv.directory as string,
    inspectFailures: argv['inspect-failures'] as boolean,
    verbosity,
    verbose,
    clean: argv.clean as boolean,
    force: argv.force as boolean,
    dryRun: argv['dry-run'] as boolean,
    disableUpdateWorkflow: argv['disable-update-workflow'] as boolean,
    language: arrayFromYargs(argv.language),
  };
}


export async function main(args: string[]) {
  const options = parseCliArgs(args);

  const testsFromArgs = await new IntegrationTests(path.resolve(options.directory)).fromCliOptions(options);

  // List only prints the discoverd tests
  if (options.list) {
    process.stdout.write(testsFromArgs.map(t => t.discoveryRelativeFileName).join('\n') + '\n');
    return;
  }

  const pool = workerpool.pool(path.join(__dirname, '../lib/workers/extract/index.js'), {
    maxWorkers: options.maxWorkers,
  });

  const testsToRun: IntegTestWorkerConfig[] = [];
  const destructiveChanges: DestructiveChange[] = [];
  let failedSnapshots: IntegTestWorkerConfig[] = [];
  let testsSucceeded = false;

  try {
    // always run snapshot tests, but if '--force' is passed then
    // run integration tests on all failed tests, not just those that
    // failed snapshot tests
    failedSnapshots = await runSnapshotTests(pool, testsFromArgs, {
      retain: options.inspectFailures,
      verbose: options.verbose,
    });
    for (const failure of failedSnapshots) {
      destructiveChanges.push(...failure.destructiveChanges ?? []);
    }
    if (!options.force) {
      testsToRun.push(...failedSnapshots);
    } else {
      // if any of the test failed snapshot tests, keep those results
      // and merge with the rest of the tests from args
      testsToRun.push(...mergeTests(testsFromArgs.map(t => t.info), failedSnapshots));
    }

    // run integration tests if `--update-on-failed` OR `--force` is used
    if (options.runUpdateOnFailed || options.force) {
      const { success, metrics } = await runIntegrationTests({
        pool,
        tests: testsToRun,
        regions: options.testRegions,
        profiles: options.profiles,
        clean: options.clean,
        dryRun: options.dryRun,
        verbosity: options.verbosity,
        updateWorkflow: !options.disableUpdateWorkflow,
      });
      testsSucceeded = success;


      if (options.clean === false) {
        logger.warning('Not cleaning up stacks since "--no-clean" was used');
      }

      if (Boolean(options.verbose)) {
        printMetrics(metrics);
      }

      if (!success) {
        throw new Error('Some integration tests failed!');
      }
    }
  } finally {
    void pool.terminate();
  }

  if (destructiveChanges.length > 0) {
    printDestructiveChanges(destructiveChanges);
    throw new Error('Some changes were destructive!');
  }
  if (failedSnapshots.length > 0) {
    let message = '';
    if (!options.runUpdateOnFailed) {
      message = 'To re-run failed tests run: integ-runner --update-on-failed';
    }
    if (!testsSucceeded) {
      throw new Error(`Some tests failed!\n${message}`);
    }
  }

}

function printDestructiveChanges(changes: DestructiveChange[]): void {
  if (changes.length > 0) {
    logger.warning('!!! This test contains %s !!!', chalk.bold('destructive changes'));
    changes.forEach(change => {
      logger.warning('    Stack: %s - Resource: %s - Impact: %s', change.stackName, change.logicalId, change.impact);
    });
    logger.warning('!!! If these destructive changes are necessary, please indicate this on the PR !!!');
  }
}

function printMetrics(metrics: IntegRunnerMetrics[]): void {
  logger.highlight('   --- Integration test metrics ---');
  const sortedMetrics = metrics.sort((a, b) => a.duration - b.duration);
  sortedMetrics.forEach(metric => {
    logger.print('Profile %s + Region %s total time: %s', metric.profile, metric.region, metric.duration);
    const sortedTests = Object.entries(metric.tests).sort((a, b) => a[1] - b[1]);
    sortedTests.forEach(test => logger.print('  %s: %s', test[0], test[1]));
  });
}

/**
 * Translate a Yargs input array to something that makes more sense in a programming language
 * model (telling the difference between absence and an empty array)
 *
 * - An empty array is the default case, meaning the user didn't pass any arguments. We return
 *   undefined.
 * - If the user passed a single empty string, they did something like `--array=`, which we'll
 *   take to mean they passed an empty array.
 */
function arrayFromYargs(xs: string[]): string[] | undefined {
  if (xs.length === 0) { return undefined; }
  return xs.filter(x => x !== '');
}

/**
 * Merge the tests we received from command line arguments with
 * tests that failed snapshot tests. The failed snapshot tests have additional
 * information that we want to keep so this should override any test from args
 */
function mergeTests(testFromArgs: IntegTestInfo[], failedSnapshotTests: IntegTestWorkerConfig[]): IntegTestWorkerConfig[] {
  const failedTestNames = new Set(failedSnapshotTests.map(test => test.fileName));
  const final: IntegTestWorkerConfig[] = failedSnapshotTests;
  final.push(...testFromArgs.filter(test => !failedTestNames.has(test.fileName)));
  return final;
}

export function cli(args: string[] = process.argv.slice(2)) {
  main(args).then().catch(err => {
    logger.error(err);
    process.exitCode = 1;
  });
}

/**
 * Read CLI options from a config file if provided.
 *
 * @param fileName
 * @returns parsed CLI config options
 */
function configFromFile(fileName?: string): Record<string, any> {
  if (!fileName) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }));
  } catch {
    return {};
  }
}

import * as path from 'path';
import { DeployOptions, DestroyOptions, HotswapMode, StackActivityProgress } from '@aws-cdk/cdk-cli-wrapper';
import { RequireApproval } from '@aws-cdk/cloud-assembly-schema';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as workerpool from 'workerpool';
import { IntegRunnerOptions, IntegRunner, DEFAULT_SYNTH_OPTIONS } from './runner-base';
import * as logger from '../logger';
import { chunks, exec } from '../utils';
import { DestructiveChange, AssertionResults, AssertionResult, DiagnosticReason, formatAssertionResults } from '../workers/common';

export interface CommonOptions {
  /**
   * The name of the test case
   */
  readonly testCaseName: string;

  /**
   * The level of verbosity for logging.
   *
   * @default 0
   */
  readonly verbosity?: number;
}

export interface WatchOptions extends CommonOptions { }

/**
 * Options for the integration test runner
 */
export interface RunOptions extends CommonOptions {
  /**
   * Whether or not to run `cdk destroy` and cleanup the
   * integration test stacks.
   *
   * Set this to false if you need to perform any validation
   * or troubleshooting after deployment.
   *
   * @default true
   */
  readonly clean?: boolean;

  /**
   * If set to true, the integration test will not deploy
   * anything and will simply update the snapshot.
   *
   * You should NOT use this method since you are essentially
   * bypassing the integration test.
   *
   * @default false
   */
  readonly dryRun?: boolean;

  /**
   * If this is set to false then the stack update workflow will
   * not be run
   *
   * The update workflow exists to check for cases where a change would cause
   * a failure to an existing stack, but not for a newly created stack.
   *
   * @default true
   */
  readonly updateWorkflow?: boolean;
}

/**
 * An integration test runner that orchestrates executing
 * integration tests
 */
export class IntegTestRunner extends IntegRunner {
  constructor(options: IntegRunnerOptions, destructiveChanges?: DestructiveChange[]) {
    super(options);
    this._destructiveChanges = destructiveChanges;

    // We don't want new tests written in the legacy mode.
    // If there is no existing snapshot _and_ this is a legacy
    // test then point the user to the new `IntegTest` construct
    if (!this.hasSnapshot() && this.isLegacyTest) {
      throw new Error(`${this.testName} is a new test. Please use the IntegTest construct ` +
        'to configure the test\n' +
        'https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/integ-tests-alpha',
      );
    }
  }

  public createCdkContextJson(): void {
    if (!fs.existsSync(this.cdkContextPath)) {
      fs.writeFileSync(this.cdkContextPath, JSON.stringify({
        watch: { },
      }, undefined, 2));
    }
  }

  /**
   * When running integration tests with the update path workflow
   * it is important that the snapshot that is deployed is the current snapshot
   * from the upstream branch. In order to guarantee that, first checkout the latest
   * (to the user) snapshot from upstream
   *
   * It is not straightforward to figure out what branch the current
   * working branch was created from. This is a best effort attempt to do so.
   * This assumes that there is an 'origin'. `git remote show origin` returns a list of
   * all branches and we then search for one that starts with `HEAD branch: `
   */
  private checkoutSnapshot(): void {
    const cwd = this.directory;

    // https://git-scm.com/docs/git-merge-base
    let baseBranch: string | undefined = undefined;
    // try to find the base branch that the working branch was created from
    try {
      const origin: string = exec(['git', 'remote', 'show', 'origin'], {
        cwd,
      });
      const originLines = origin.split('\n');
      for (const line of originLines) {
        if (line.trim().startsWith('HEAD branch: ')) {
          baseBranch = line.trim().split('HEAD branch: ')[1];
        }
      }
    } catch (e) {
      logger.warning('%s\n%s',
        'Could not determine git origin branch.',
        `You need to manually checkout the snapshot directory ${this.snapshotDir}` +
        'from the merge-base (https://git-scm.com/docs/git-merge-base)',
      );
      logger.warning('error: %s', e);
    }

    // if we found the base branch then get the merge-base (most recent common commit)
    // and checkout the snapshot using that commit
    if (baseBranch) {
      const relativeSnapshotDir = path.relative(this.directory, this.snapshotDir);

      try {
        const base = exec(['git', 'merge-base', 'HEAD', baseBranch], {
          cwd,
        });
        exec(['git', 'checkout', base, '--', relativeSnapshotDir], {
          cwd,
        });
      } catch (e) {
        logger.warning('%s\n%s',
          `Could not checkout snapshot directory '${this.snapshotDir}'. Please verify the following command completes correctly:`,
          `git checkout $(git merge-base HEAD ${baseBranch}) -- ${relativeSnapshotDir}`,
          '',
        );
        logger.warning('error: %s', e);
      }
    }
  }

  /**
   * Runs cdk deploy --watch for an integration test
   *
   * This is meant to be run on a single test and will not create a snapshot
   */
  public async watchIntegTest(options: WatchOptions): Promise<void> {
    const actualTestCase = this.actualTestSuite.testSuite[options.testCaseName];
    if (!actualTestCase) {
      throw new Error(`Did not find test case name '${options.testCaseName}' in '${Object.keys(this.actualTestSuite.testSuite)}'`);
    }
    const enableForVerbosityLevel = (needed = 1) => {
      const verbosity = options.verbosity ?? 0;
      return (verbosity >= needed) ? true : undefined;
    };
    try {
      await this.watch(
        {
          ...this.defaultArgs,
          progress: StackActivityProgress.BAR,
          hotswap: HotswapMode.FALL_BACK,
          deploymentMethod: 'direct',
          profile: this.profile,
          requireApproval: RequireApproval.NEVER,
          traceLogs: enableForVerbosityLevel(2) ?? false,
          verbose: enableForVerbosityLevel(3),
          debug: enableForVerbosityLevel(4),
          watch: true,
        },
        options.testCaseName,
        options.verbosity ?? 0,
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * Orchestrates running integration tests. Currently this includes
   *
   * 1. (if update workflow is enabled) Deploying the snapshot test stacks
   * 2. Deploying the integration test stacks
   * 2. Saving the snapshot (if successful)
   * 3. Destroying the integration test stacks (if clean=false)
   *
   * The update workflow exists to check for cases where a change would cause
   * a failure to an existing stack, but not for a newly created stack.
   */
  public runIntegTestCase(options: RunOptions): AssertionResults | undefined {
    let assertionResults: AssertionResults | undefined;
    const actualTestCase = this.actualTestSuite.testSuite[options.testCaseName];
    if (!actualTestCase) {
      throw new Error(`Did not find test case name '${options.testCaseName}' in '${Object.keys(this.actualTestSuite.testSuite)}'`);
    }
    const clean = options.clean ?? true;
    const updateWorkflowEnabled = (options.updateWorkflow ?? true)
      && (actualTestCase.stackUpdateWorkflow ?? true);
    const enableForVerbosityLevel = (needed = 1) => {
      const verbosity = options.verbosity ?? 0;
      return (verbosity >= needed) ? true : undefined;
    };

    try {
      if (!options.dryRun && (actualTestCase.cdkCommandOptions?.deploy?.enabled ?? true)) {
        assertionResults = this.deploy(
          {
            ...this.defaultArgs,
            profile: this.profile,
            requireApproval: RequireApproval.NEVER,
            verbose: enableForVerbosityLevel(3),
            debug: enableForVerbosityLevel(4),
          },
          updateWorkflowEnabled,
          options.testCaseName,
        );
      } else {
        const env: Record<string, any> = {
          ...DEFAULT_SYNTH_OPTIONS.env,
          CDK_CONTEXT_JSON: JSON.stringify(this.getContext({
            ...this.actualTestSuite.enableLookups ? DEFAULT_SYNTH_OPTIONS.context : {},
          })),
        };
        this.cdk.synthFast({
          execCmd: this.cdkApp.split(' '),
          env,
          output: path.relative(this.directory, this.cdkOutDir),
        });
      }
      // only create the snapshot if there are no failed assertion results
      // (i.e. no failures)
      if (!assertionResults || !Object.values(assertionResults).some(result => result.status === 'fail')) {
        this.createSnapshot();
      }
    } catch (e) {
      throw e;
    } finally {
      if (!options.dryRun) {
        if (clean && (actualTestCase.cdkCommandOptions?.destroy?.enabled ?? true)) {
          this.destroy(options.testCaseName, {
            ...this.defaultArgs,
            profile: this.profile,
            all: true,
            force: true,
            app: this.cdkApp,
            output: path.relative(this.directory, this.cdkOutDir),
            ...actualTestCase.cdkCommandOptions?.destroy?.args,
            context: this.getContext(actualTestCase.cdkCommandOptions?.destroy?.args?.context),
            verbose: enableForVerbosityLevel(3),
            debug: enableForVerbosityLevel(4),
          });
        }
      }
      this.cleanup();
    }
    return assertionResults;
  }

  /**
   * Perform a integ test case stack destruction
   */
  private destroy(testCaseName: string, destroyArgs: DestroyOptions) {
    const actualTestCase = this.actualTestSuite.testSuite[testCaseName];
    try {
      if (actualTestCase.hooks?.preDestroy) {
        actualTestCase.hooks.preDestroy.forEach(cmd => {
          exec(chunks(cmd), {
            cwd: path.dirname(this.snapshotDir),
          });
        });
      }
      this.cdk.destroy({
        ...destroyArgs,
      });

      if (actualTestCase.hooks?.postDestroy) {
        actualTestCase.hooks.postDestroy.forEach(cmd => {
          exec(chunks(cmd), {
            cwd: path.dirname(this.snapshotDir),
          });
        });
      }
    } catch (e) {
      this.parseError(e,
        actualTestCase.cdkCommandOptions?.destroy?.expectError ?? false,
        actualTestCase.cdkCommandOptions?.destroy?.expectedMessage,
      );
    }
  }

  private async watch(watchArgs: DeployOptions, testCaseName: string, verbosity: number): Promise<void> {
    const actualTestCase = this.actualTestSuite.testSuite[testCaseName];
    if (actualTestCase.hooks?.preDeploy) {
      actualTestCase.hooks.preDeploy.forEach(cmd => {
        exec(chunks(cmd), {
          cwd: path.dirname(this.snapshotDir),
        });
      });
    }
    const deployArgs = {
      ...watchArgs,
      lookups: this.actualTestSuite.enableLookups,
      stacks: [
        ...actualTestCase.stacks,
        ...actualTestCase.assertionStack ? [actualTestCase.assertionStack] : [],
      ],
      output: path.relative(this.directory, this.cdkOutDir),
      outputsFile: path.relative(this.directory, path.join(this.cdkOutDir, 'assertion-results.json')),
      ...actualTestCase?.cdkCommandOptions?.deploy?.args,
      context: {
        ...this.getContext(actualTestCase?.cdkCommandOptions?.deploy?.args?.context),
      },
      app: this.cdkApp,
    };
    const destroyMessage = {
      additionalMessages: [
        'After you are done you must manually destroy the deployed stacks',
        `  ${[
          ...process.env.AWS_REGION ? [`AWS_REGION=${process.env.AWS_REGION}`] : [],
          'cdk destroy',
          `-a '${this.cdkApp}'`,
          deployArgs.stacks.join(' '),
          `--profile ${deployArgs.profile}`,
        ].join(' ')}`,
      ],
    };
    workerpool.workerEmit(destroyMessage);
    if (watchArgs.verbose) {
      // if `-vvv` (or above) is used then print out the command that was used
      // this allows users to manually run the command
      workerpool.workerEmit({
        additionalMessages: [
          'Repro:',
          `  ${[
            'cdk synth',
            `-a '${this.cdkApp}'`,
            `-o '${this.cdkOutDir}'`,
            ...Object.entries(this.getContext()).flatMap(([k, v]) => typeof v !== 'object' ? [`-c '${k}=${v}'`] : []),
            deployArgs.stacks.join(' '),
            `--outputs-file ${deployArgs.outputsFile}`,
            `--profile ${deployArgs.profile}`,
            '--hotswap-fallback',
          ].join(' ')}`,
        ],
      });
    }

    const assertionResults = path.join(this.cdkOutDir, 'assertion-results.json');
    const watcher = chokidar.watch([this.cdkOutDir], {
      cwd: this.directory,
    });
    watcher.on('all', (event: 'add' | 'change', file: string) => {
      // we only care about changes to the `assertion-results.json` file. If there
      // are assertions then this will change on every deployment
      if (assertionResults.endsWith(file) && (event === 'add' || event === 'change')) {
        const start = Date.now();
        if (actualTestCase.hooks?.postDeploy) {
          actualTestCase.hooks.postDeploy.forEach(cmd => {
            exec(chunks(cmd), {
              cwd: path.dirname(this.snapshotDir),
            });
          });
        }

        if (actualTestCase.assertionStack && actualTestCase.assertionStackName) {
          const res = this.processAssertionResults(
            assertionResults,
            actualTestCase.assertionStackName,
            actualTestCase.assertionStack,
          );
          if (res && Object.values(res).some(r => r.status === 'fail')) {
            workerpool.workerEmit({
              reason: DiagnosticReason.ASSERTION_FAILED,
              testName: `${testCaseName} (${watchArgs.profile}`,
              message: formatAssertionResults(res),
              duration: (Date.now() - start) / 1000,
            });
          } else {
            workerpool.workerEmit({
              reason: DiagnosticReason.TEST_SUCCESS,
              testName: `${testCaseName}`,
              message: res ? formatAssertionResults(res) : 'NO ASSERTIONS',
              duration: (Date.now() - start) / 1000,
            });
          }
          // emit the destroy message after every run
          // so that it's visible to the user
          workerpool.workerEmit(destroyMessage);
        }
      }
    });
    await new Promise(resolve => {
      watcher.on('ready', async () => {
        resolve({});
      });
    });

    const child = this.cdk.watch(deployArgs);
    // if `-v` (or above) is passed then stream the logs
    child.stdout?.on('data', (message) => {
      if (verbosity > 0) {
        process.stdout.write(message);
      }
    });
    child.stderr?.on('data', (message) => {
      if (verbosity > 0) {
        process.stderr.write(message);
      }
    });

    await new Promise(resolve => {
      child.on('close', async (code) => {
        if (code !== 0) {
          throw new Error('Watch exited with error');
        }
        child.stdin?.end();
        await watcher.close();
        resolve(code);
      });
    });
  }

  /**
   * Perform a integ test case deployment, including
   * peforming the update workflow
   */
  private deploy(
    deployArgs: DeployOptions,
    updateWorkflowEnabled: boolean,
    testCaseName: string,
  ): AssertionResults | undefined {
    const actualTestCase = this.actualTestSuite.testSuite[testCaseName];
    try {
      if (actualTestCase.hooks?.preDeploy) {
        actualTestCase.hooks.preDeploy.forEach(cmd => {
          exec(chunks(cmd), {
            cwd: path.dirname(this.snapshotDir),
          });
        });
      }
      // if the update workflow is not disabled, first
      // perform a deployment with the exising snapshot
      // then perform a deployment (which will be a stack update)
      // with the current integration test
      // We also only want to run the update workflow if there is an existing
      // snapshot (otherwise there is nothing to update)
      if (updateWorkflowEnabled && this.hasSnapshot() &&
        (this.expectedTestSuite && testCaseName in this.expectedTestSuite?.testSuite)) {
        // make sure the snapshot is the latest from 'origin'
        this.checkoutSnapshot();
        const expectedTestCase = this.expectedTestSuite.testSuite[testCaseName];
        this.cdk.deploy({
          ...deployArgs,
          stacks: expectedTestCase.stacks,
          ...expectedTestCase?.cdkCommandOptions?.deploy?.args,
          context: this.getContext(expectedTestCase?.cdkCommandOptions?.deploy?.args?.context),
          app: path.relative(this.directory, this.snapshotDir),
          lookups: this.expectedTestSuite?.enableLookups,
        });
      }
      // now deploy the "actual" test.
      this.cdk.deploy({
        ...deployArgs,
        lookups: this.actualTestSuite.enableLookups,
        stacks: [
          ...actualTestCase.stacks,
        ],
        output: path.relative(this.directory, this.cdkOutDir),
        ...actualTestCase?.cdkCommandOptions?.deploy?.args,
        context: this.getContext(actualTestCase?.cdkCommandOptions?.deploy?.args?.context),
        app: this.cdkApp,
      });

      // If there are any assertions
      // deploy the assertion stack as well
      // This is separate from the above deployment because we want to
      // set `rollback: false`. This allows the assertion stack to deploy all the
      // assertions instead of failing at the first failed assertion
      // combining it with the above deployment would prevent any replacement updates
      if (actualTestCase.assertionStack) {
        this.cdk.deploy({
          ...deployArgs,
          lookups: this.actualTestSuite.enableLookups,
          stacks: [
            actualTestCase.assertionStack,
          ],
          rollback: false,
          output: path.relative(this.directory, this.cdkOutDir),
          ...actualTestCase?.cdkCommandOptions?.deploy?.args,
          outputsFile: path.relative(this.directory, path.join(this.cdkOutDir, 'assertion-results.json')),
          context: this.getContext(actualTestCase?.cdkCommandOptions?.deploy?.args?.context),
          app: this.cdkApp,
        });
      }

      if (actualTestCase.hooks?.postDeploy) {
        actualTestCase.hooks.postDeploy.forEach(cmd => {
          exec(chunks(cmd), {
            cwd: path.dirname(this.snapshotDir),
          });
        });
      }

      if (actualTestCase.assertionStack && actualTestCase.assertionStackName) {
        return this.processAssertionResults(
          path.join(this.cdkOutDir, 'assertion-results.json'),
          actualTestCase.assertionStackName,
          actualTestCase.assertionStack,
        );
      }
    } catch (e) {
      this.parseError(e,
        actualTestCase.cdkCommandOptions?.deploy?.expectError ?? false,
        actualTestCase.cdkCommandOptions?.deploy?.expectedMessage,
      );
    }
    return;
  }

  /**
   * Process the outputsFile which contains the assertions results as stack
   * outputs
   */
  private processAssertionResults(file: string, assertionStackName: string, assertionStackId: string): AssertionResults | undefined {
    const results: AssertionResults = {};
    if (fs.existsSync(file)) {
      try {
        const outputs: { [key: string]: { [key: string]: string } } = fs.readJSONSync(file);

        if (assertionStackName in outputs) {
          for (const [assertionId, result] of Object.entries(outputs[assertionStackName])) {
            if (assertionId.startsWith('AssertionResults')) {
              const assertionResult: AssertionResult = JSON.parse(result.replace(/\n/g, '\\n'));
              if (assertionResult.status === 'fail' || assertionResult.status === 'success') {
                results[assertionId] = assertionResult;
              }
            }
          }
        }
      } catch (e) {
        // if there are outputs, but they cannot be processed, then throw an error
        // so that the test fails
        results[assertionStackId] = {
          status: 'fail',
          message: `error processing assertion results: ${e}`,
        };
      } finally {
        // remove the outputs file so it is not part of the snapshot
        // it will contain env specific information from values
        // resolved at deploy time
        fs.unlinkSync(file);
      }
    }
    return Object.keys(results).length > 0 ? results : undefined;
  }

  /**
   * Parses an error message returned from a CDK command
   */
  private parseError(e: unknown, expectError: boolean, expectedMessage?: string) {
    if (expectError) {
      if (expectedMessage) {
        const message = (e as Error).message;
        if (!message.match(expectedMessage)) {
          throw (e);
        }
      }
    } else {
      throw e;
    }
  }
}

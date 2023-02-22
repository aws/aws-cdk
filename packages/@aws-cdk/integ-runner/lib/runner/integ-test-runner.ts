import * as path from 'path';
import { RequireApproval } from '@aws-cdk/cloud-assembly-schema';
import { DeployOptions, DestroyOptions } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegRunnerOptions, IntegRunner, DEFAULT_SYNTH_OPTIONS } from './runner-base';
import * as logger from '../logger';
import { chunks, exec } from '../utils';
import { DestructiveChange, AssertionResults, AssertionResult } from '../workers/common';

/**
 * Options for the integration test runner
 */
export interface RunOptions {
  /**
   * The name of the test case
   */
  readonly testCaseName: string;

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

  /**
   * The level of verbosity for logging.
   *
   * @default 0
   */
  readonly verbosity?: number;
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
        'https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/integ-tests',
      );
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
          `Could not checkout snapshot directory ${this.snapshotDir} using these commands: `,
          `git merge-base HEAD ${baseBranch} && git checkout {merge-base} -- ${relativeSnapshotDir}`,
        );
        logger.warning('error: %s', e);
      }
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
      // now deploy the "actual" test. If there are any assertions
      // deploy the assertion stack as well
      this.cdk.deploy({
        ...deployArgs,
        lookups: this.actualTestSuite.enableLookups,
        stacks: [
          ...actualTestCase.stacks,
          ...actualTestCase.assertionStack ? [actualTestCase.assertionStack] : [],
        ],
        rollback: false,
        output: path.relative(this.directory, this.cdkOutDir),
        ...actualTestCase?.cdkCommandOptions?.deploy?.args,
        ...actualTestCase.assertionStack ? { outputsFile: path.relative(this.directory, path.join(this.cdkOutDir, 'assertion-results.json')) } : undefined,
        context: this.getContext(actualTestCase?.cdkCommandOptions?.deploy?.args?.context),
        app: this.cdkApp,
      });

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

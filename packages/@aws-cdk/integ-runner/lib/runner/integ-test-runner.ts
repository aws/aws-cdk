import * as path from 'path';
import { RequireApproval } from '@aws-cdk/cloud-assembly-schema';
import { DeployOptions, DestroyOptions } from 'cdk-cli-wrapper';
import * as logger from '../logger';
import { chain, exec } from '../utils';
import { DestructiveChange } from '../workers/common';
import { IntegRunnerOptions, IntegRunner, DEFAULT_SYNTH_OPTIONS } from './runner-base';

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
}

/**
 * An integration test runner that orchestrates executing
 * integration tests
 */
export class IntegTestRunner extends IntegRunner {
  constructor(options: IntegRunnerOptions, destructiveChanges?: DestructiveChange[]) {
    super(options);
    this._destructiveChanges = destructiveChanges;
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
    const cwd = path.dirname(this.snapshotDir);
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
      try {
        const base = exec(['git', 'merge-base', 'HEAD', baseBranch], {
          cwd,
        });
        exec(['git', 'checkout', base, '--', this.relativeSnapshotDir], {
          cwd,
        });
      } catch (e) {
        logger.warning('%s\n%s',
          `Could not checkout snapshot directory ${this.snapshotDir} using these commands: `,
          `git merge-base HEAD ${baseBranch} && git checkout {merge-base} -- ${this.relativeSnapshotDir}`,
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
  public runIntegTestCase(options: RunOptions): void {
    const actualTestCase = this.actualTestSuite.testSuite[options.testCaseName];
    const clean = options.clean ?? true;
    const updateWorkflowEnabled = (options.updateWorkflow ?? true)
      && (actualTestCase.stackUpdateWorkflow ?? true);
    try {
      if (!options.dryRun && (actualTestCase.cdkCommandOptions?.deploy?.enabled ?? true)) {
        this.deploy(
          {
            ...this.defaultArgs,
            profile: this.profile,
            requireApproval: RequireApproval.NEVER,
          },
          updateWorkflowEnabled,
          options.testCaseName,
        );
      } else {
        const env: Record<string, any> = {
          ...DEFAULT_SYNTH_OPTIONS.env,
          CDK_CONTEXT_JSON: JSON.stringify(this.getContext()),
        };
        this.cdk.synthFast({
          execCmd: this.cdkApp.split(' '),
          env,
          output: this.cdkOutDir,
        });
      }
      this.createSnapshot();
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
            output: this.cdkOutDir,
            ...actualTestCase.cdkCommandOptions?.destroy?.args,
            context: this.getContext(actualTestCase.cdkCommandOptions?.destroy?.args?.context),
          });
        }
      }
      this.cleanup();
    }
  }

  /**
   * Perform a integ test case stack destruction
   */
  private destroy(testCaseName: string, destroyArgs: DestroyOptions) {
    const actualTestCase = this.actualTestSuite.testSuite[testCaseName];
    try {
      if (actualTestCase.hooks?.preDestroy) {
        exec([chain(actualTestCase.hooks.preDestroy)], {
          cwd: path.dirname(this.snapshotDir),
        });
      }
      this.cdk.destroy({
        ...destroyArgs,
      });

      if (actualTestCase.hooks?.postDestroy) {
        exec([chain(actualTestCase.hooks.postDestroy)], {
          cwd: path.dirname(this.snapshotDir),
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
  ): void {
    const actualTestCase = this.actualTestSuite.testSuite[testCaseName];
    try {
      if (actualTestCase.hooks?.preDeploy) {
        exec([chain(actualTestCase.hooks?.preDeploy)], {
          cwd: path.dirname(this.snapshotDir),
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
          app: this.relativeSnapshotDir,
          lookups: this.expectedTestSuite?.enableLookups,
        });
      }
      this.cdk.deploy({
        ...deployArgs,
        lookups: this.actualTestSuite.enableLookups,
        stacks: actualTestCase.stacks,
        output: this.cdkOutDir,
        ...actualTestCase?.cdkCommandOptions?.deploy?.args,
        context: this.getContext(actualTestCase?.cdkCommandOptions?.deploy?.args?.context),
        app: this.hasTmpActualSnapshot() ? this.cdkOutDir : this.cdkApp,
      });
      if (actualTestCase.hooks?.postDeploy) {
        exec([chain(actualTestCase.hooks?.postDeploy)], {
          cwd: path.dirname(this.snapshotDir),
        });
      }
    } catch (e) {
      this.parseError(e,
        actualTestCase.cdkCommandOptions?.deploy?.expectError ?? false,
        actualTestCase.cdkCommandOptions?.deploy?.expectedMessage,
      );
    }
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


import cxapi = require('@aws-cdk/cx-api');
import { data, deserializeStructure, error, highlight, print, success } from '@aws-cdk/toolchain-common';
import colors = require('colors/safe');
import fs = require('fs-extra');
import { format, promisify } from 'util';
import { IDeploymentTarget } from './api/deployment-target';
import { printSecurityDiff, printStackDiff, RequireApproval } from './diff';

// tslint:disable-next-line:no-var-requires
const promptly = require('promptly');
const confirm = promisify(promptly.confirm);

export interface CdkToolkitProps {
  /**
   * The (stacks of the) CDK application
   */
  stacks: SelectedStack[];

  /**
   * The provisioning engine used to apply changes to the cloud
   */
  provisioner: IDeploymentTarget;
}

/**
 * Diffs and deploys an application's stacks.
 *
 * // TODO: rename?
 */
export class CDKToolkit {
  private readonly stacks: SelectedStack[];
  private readonly provisioner: IDeploymentTarget;

  constructor(props: CdkToolkitProps) {
    this.stacks = props.stacks;
    this.provisioner = props.provisioner;
  }

  public async diff(options: DiffOptions): Promise<number> {
    const strict = !!options.strict;
    const contextLines = options.contextLines || 3;
    const stream = options.stream || process.stderr;

    let ret = 0;
    if (options.templatePath !== undefined) {
      // Compare single stack against fixed template
      if (this.stacks.length !== 1) {
        throw new Error('Can only select one stack when comparing to fixed template. Use --excusively to avoid selecting multiple stacks.');
      }

      if (!await fs.pathExists(options.templatePath)) {
        throw new Error(`There is no file at ${options.templatePath}`);
      }
      const template = deserializeStructure(await fs.readFile(options.templatePath, { encoding: 'UTF-8' }));
      ret = printStackDiff(template, this.stacks[0], strict, contextLines, options.stream);
    } else {
      // Compare N stacks against deployed templates
      for (const stack of this.stacks) {
        stream.write(format('Stack %s\n', colors.bold(stack.name)));
        const currentTemplate = await this.provisioner.readCurrentTemplate(stack);
        if (printStackDiff(currentTemplate, stack, !!options.strict, options.contextLines || 3, stream) !== 0) {
          ret = 1;
        }
      }
    }

    return ret;
  }

  public async deploy(options: DeployOptions) {
    const requireApproval = options.requireApproval !== undefined ? options.requireApproval : RequireApproval.Broadening;

    for (const stack of this.stacks) {
      if (this.stacks.length !== 1) { highlight(stack.name); }
      if (!stack.environment) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Stack ${stack.name} does not define an environment, and AWS credentials could not be obtained from standard locations or no region was configured.`);
      }

      if (requireApproval !== RequireApproval.Never) {
        const currentTemplate = await this.provisioner.readCurrentTemplate(stack);
        if (printSecurityDiff(currentTemplate, stack, requireApproval)) {

          // only talk to user if STDIN is a terminal (otherwise, fail)
          if (!process.stdin.isTTY) {
            throw new Error(
              '"--require-approval" is enabled and stack includes security-sensitive updates, ' +
              'but terminal (TTY) is not attached so we are unable to get a confirmation from the user');
          }

          const confirmed = await confirm(`Do you wish to deploy these changes (y/n)?`);
          if (!confirmed) { throw new Error('Aborted by user'); }
        }
      }

      if (stack.name !== stack.originalName) {
        print('%s: deploying... (was %s)', colors.bold(stack.name), colors.bold(stack.originalName));
      } else {
        print('%s: deploying...', colors.bold(stack.name));
      }

      try {
        const result = await this.provisioner.deployStack({
          stack,
          deployName: stack.name,
          roleArn: options.roleArn,
          ci: options.ci,
          reuseAssets: options.reuseAssets,
        });

        const message = result.noOp
          ? ` ✅  %s (no changes)`
          : ` ✅  %s`;

        success('\n' + message, stack.name);

        if (Object.keys(result.outputs).length > 0) {
          print('\nOutputs:');
        }

        for (const name of Object.keys(result.outputs)) {
          const value = result.outputs[name];
          print('%s.%s = %s', colors.cyan(stack.name), colors.cyan(name), colors.underline(colors.cyan(value)));
        }

        print('\nStack ARN:');

        data(result.stackArn);
      } catch (e) {
        error('\n ❌  %s failed: %s', colors.bold(stack.name), e);
        throw e;
      }
    }
  }
}

export interface DiffOptions {
  /**
   * Stack names to diff
   */
  stackNames: string[];

  /**
   * Only select the given stack
   *
   * @default false
   */
  exclusively?: boolean;

  /**
   * Used a template from disk instead of from the server
   *
   * @default Use from the server
   */
  templatePath?: string;

  /**
   * Strict diff mode
   *
   * @default false
   */
  strict?: boolean;

  /**
   * How many lines of context to show in the diff
   *
   * @default 3
   */
  contextLines?: number;

  /**
   * Where to write the default
   *
   * @default stderr
   */
  stream?: NodeJS.WritableStream;
}

export interface DeployOptions {
  /**
   * Stack names to deploy
   */
  stackNames: string[];

  /**
   * Only select the given stack
   *
   * @default false
   */
  exclusively?: boolean;

  /**
   * Name of the toolkit stack to use/deploy
   *
   * @default CDKToolkit
   */
  toolkitStackName?: string;

  /**
   * Role to pass to CloudFormation for deployment
   */
  roleArn?: string;

  /**
   * What kind of security changes require approval
   *
   * @default RequireApproval.Broadening
   */
  requireApproval?: RequireApproval;

  /**
   * Wheter we're in CI mode
   *
   * @default false
   */
  ci?: boolean;

  /**
   * Reuse the assets with the given asset IDs
   */
  reuseAssets?: string[];
}

export interface SelectedStack extends cxapi.SynthesizedStack {
  /**
   * The original name of the stack before renaming
   */
  originalName: string;
}

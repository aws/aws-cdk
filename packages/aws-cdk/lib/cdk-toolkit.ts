import colors = require('colors/safe');
import fs = require('fs-extra');
import { format } from 'util';
import { Mode } from './api/aws-auth/credentials';
import { AppStacks, DefaultSelection, ExtendedStackSelection, Tag } from "./api/cxapp/stacks";
import { destroyStack } from './api/deploy-stack';
import { IDeploymentTarget } from './api/deployment-target';
import { stackExists } from './api/util/cloudformation';
import { ISDK } from './api/util/sdk';
import { printSecurityDiff, printStackDiff, RequireApproval } from './diff';
import { data, error, highlight, print, success, warning } from './logging';
import { deserializeStructure } from './serialize';

// tslint:disable-next-line:no-var-requires
const promptly = require('promptly');

export interface CdkToolkitProps {
  /**
   * The (stacks of the) CDK application
   */
  appStacks: AppStacks;

  /**
   * The provisioning engine used to apply changes to the cloud
   */
  provisioner: IDeploymentTarget;
}

/**
 * Toolkit logic
 *
 * The toolkit takes CDK app models from the `appStacks`
 * object and applies them to the `provisioner`.
 */
export class CdkToolkit {
  private readonly appStacks: AppStacks;
  private readonly provisioner: IDeploymentTarget;

  constructor(props: CdkToolkitProps) {
    this.appStacks = props.appStacks;
    this.provisioner = props.provisioner;
  }

  public async diff(options: DiffOptions): Promise<number> {
    const stacks = await this.appStacks.selectStacks(options.stackNames, {
      extend: options.exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream,
      defaultBehavior: DefaultSelection.AllStacks
    });

    const strict = !!options.strict;
    const contextLines = options.contextLines || 3;
    const stream = options.stream || process.stderr;

    let ret = 0;
    if (options.templatePath !== undefined) {
      // Compare single stack against fixed template
      if (stacks.length !== 1) {
        throw new Error('Can only select one stack when comparing to fixed template. Use --excusively to avoid selecting multiple stacks.');
      }

      if (!await fs.pathExists(options.templatePath)) {
        throw new Error(`There is no file at ${options.templatePath}`);
      }
      const template = deserializeStructure(await fs.readFile(options.templatePath, { encoding: 'UTF-8' }));
      ret = printStackDiff(template, stacks[0], strict, contextLines, options.stream);
    } else {
      // Compare N stacks against deployed templates
      for (const stack of stacks) {
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

    const stacks = await this.appStacks.selectStacks(options.stackNames, {
      extend: options.exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream,
      defaultBehavior: DefaultSelection.OnlySingle
    });

    this.appStacks.processMetadata(stacks);

    for (const stack of stacks) {
      if (stacks.length !== 1) { highlight(stack.name); }
      if (!stack.environment) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Stack ${stack.name} does not define an environment, and AWS credentials could not be obtained from standard locations or no region was configured.`);
      }

      if (Object.keys(stack.template.Resources || {}).length === 0) { // The generated stack has no resources
        const cfn = await options.sdk.cloudFormation(stack.environment.account, stack.environment.region, Mode.ForReading);
        if (!await stackExists(cfn, stack.name)) {
          warning('%s: stack has no resources, skipping deployment.', colors.bold(stack.name));
        } else {
          warning('%s: stack has no resources, deleting existing stack.', colors.bold(stack.name));
          await this.destroy({
            stackNames: [stack.name],
            exclusively: true,
            force: true,
            roleArn: options.roleArn,
            sdk: options.sdk,
            fromDeploy: true,
          });
        }
        continue;
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

          const confirmed = await promptly.confirm(`Do you wish to deploy these changes (y/n)?`);
          if (!confirmed) { throw new Error('Aborted by user'); }
        }
      }

      if (stack.name !== stack.originalName) {
        print('%s: deploying... (was %s)', colors.bold(stack.name), colors.bold(stack.originalName));
      } else {
        print('%s: deploying...', colors.bold(stack.name));
      }

      let tags = options.tags;
      if (!tags || tags.length === 0) {
        tags = this.appStacks.getTagsFromStackMetadata(stack);
      }

      try {
        const result = await this.provisioner.deployStack({
          stack,
          deployName: stack.name,
          roleArn: options.roleArn,
          ci: options.ci,
          toolkitStackName: options.toolkitStackName,
          reuseAssets: options.reuseAssets,
          tags
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

  public async destroy(options: DestroyOptions) {
    const stacks = await this.appStacks.selectStacks(options.stackNames, {
      extend: options.exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Downstream,
      defaultBehavior: DefaultSelection.OnlySingle
    });

    // The stacks will have been ordered for deployment, so reverse them for deletion.
    stacks.reverse();

    if (!options.force) {
      // tslint:disable-next-line:max-line-length
      const confirmed = await promptly.confirm(`Are you sure you want to delete: ${colors.blue(stacks.map(s => s.name).join(', '))} (y/n)?`);
      if (!confirmed) {
        return;
      }
    }

    const action = options.fromDeploy ? 'deploy' : 'destroy';
    for (const stack of stacks) {
      success('%s: destroying...', colors.blue(stack.name));
      try {
        await destroyStack({ stack, sdk: options.sdk, deployName: stack.name, roleArn: options.roleArn });
        success(`\n ✅  %s: ${action}ed`, colors.blue(stack.name));
      } catch (e) {
        error(`\n ❌  %s: ${action} failed`, colors.blue(stack.name), e);
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

  /**
   * Tags to pass to CloudFormation for deployment
   */
  tags?: Tag[];

  /**
   * AWS SDK
   */
  sdk: ISDK;
}

export interface DestroyOptions {
  /**
   * The names of the stacks to delete
   */
  stackNames: string[];

  /**
   * Whether to exclude stacks that depend on the stacks to be deleted
   */
  exclusively: boolean;

  /**
   * Whether to skip prompting for confirmation
   */
  force: boolean;

  /**
   * The arn of the IAM role to use
   */
  roleArn?: string;

  /**
   * AWS SDK
   */
  sdk: ISDK;

  /**
   * Whether the destroy request came from a deploy.
   */
  fromDeploy?: boolean
}

import colors = require('colors/safe');
import fs = require('fs-extra');
import { format } from 'util';
import { AppStacks, ExtendedStackSelection } from "./api/cxapp/stacks";
import { IProvisioner } from './api/provisioner';
import { printStackDiff } from './diff';
import { deserializeStructure } from './serialize';

export interface CdkToolkitProps {
  /**
   * The (stacks of the) CDK application
   */
  appStacks: AppStacks;

  /**
   * The provisioning engine used to apply changes to the cloud
   */
  provisioner: IProvisioner;
}

/**
 * Toolkit logic
 *
 * The toolkit takes CDK app models from the `appStacks`
 * object and applies them to the `provisioner`.
 */
export class CdkToolkit {
  constructor(private readonly props: CdkToolkitProps) {
  }

  public async diff(options: DiffOptions): Promise<number> {
    const stacks = await this.props.appStacks.selectStacks(
      options.stackNames,
      options.exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream);

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
        const currentTemplate = await this.props.provisioner.readCurrentTemplate(stack);
        if (printStackDiff(currentTemplate, stack, !!options.strict, options.contextLines || 3, stream) !== 0) {
          ret = 1;
        }
      }
    }

    return ret;
  }
}

export interface DiffOptions {
  /**
   * Stack names to diff
   */
  stackNames: string[];

  /**
   * Only select the given stack
   */
  exclusively?: boolean;

  /**
   * Used a template from disk instead of from the server
   */
  templatePath?: string;

  /**
   * Strict diff mode
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

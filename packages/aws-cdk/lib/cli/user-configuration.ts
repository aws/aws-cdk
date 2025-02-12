import { Context, PROJECT_CONTEXT } from '../api/context';
import { Settings } from '../api/settings';
import { Tag } from '../api/tags';
import { debug, warning } from '../logging';
import { ToolkitError } from '../toolkit/error';

export const PROJECT_CONFIG = 'cdk.json';
export { PROJECT_CONTEXT } from '../api/context';
export const USER_DEFAULTS = '~/.cdk.json';
const CONTEXT_KEY = 'context';

/**
 * All available CDK commands.
 */
export enum Command {
  // List operations
  LS = 'ls',
  LIST = 'list',

  // Stack modification operations
  DIFF = 'diff',
  DEPLOY = 'deploy',
  SYNTHESIZE = 'synthesize',
  SYNTH = 'synth',
  WATCH = 'watch',
  IMPORT = 'import',

  // Management operations
  BOOTSTRAP = 'bootstrap',
  DESTROY = 'destroy',
  METADATA = 'metadata',
  INIT = 'init',
  VERSION = 'version',
  GC = 'gc',
  ROLLBACK = 'rollback',
  ACKNOWLEDGE = 'acknowledge',
  ACK = 'ack',
  NOTICES = 'notices',
  MIGRATE = 'migrate',
  CONTEXT = 'context',
  DOCS = 'docs',
  DOC = 'doc',
  DOCTOR = 'doctor',
}

interface ConfiguredCommand {
  bundling: boolean;
}

type CommandType = {
  [K in Command]: ConfiguredCommand;
};

/**
 * Available commands and their bundling configurations.
 * The bundling property is determined by the command's categorization.
 *
 * @example
 * ConfiguredCommands[Command.DEPLOY].bundling; // true
 * ConfiguredCommands[Command.LS].bundling; // false
 */
const ConfiguredCommands: CommandType = {
  // List operations (no bundling)
  [Command.LS]: { bundling: false },
  [Command.LIST]: { bundling: false },

  // Stack modification operations (require bundling)
  [Command.DIFF]: { bundling: true },
  [Command.DEPLOY]: { bundling: true },
  [Command.SYNTHESIZE]: { bundling: true },
  [Command.SYNTH]: { bundling: true },
  [Command.WATCH]: { bundling: true },
  [Command.IMPORT]: { bundling: true },

  // Management operations (no bundling)
  [Command.BOOTSTRAP]: { bundling: false },
  [Command.DESTROY]: { bundling: false },
  [Command.METADATA]: { bundling: false },
  [Command.INIT]: { bundling: false },
  [Command.VERSION]: { bundling: false },
  [Command.GC]: { bundling: false },
  [Command.ROLLBACK]: { bundling: false },
  [Command.ACKNOWLEDGE]: { bundling: false },
  [Command.ACK]: { bundling: false },
  [Command.NOTICES]: { bundling: false },
  [Command.MIGRATE]: { bundling: false },
  [Command.CONTEXT]: { bundling: false },
  [Command.DOCS]: { bundling: false },
  [Command.DOC]: { bundling: false },
  [Command.DOCTOR]: { bundling: false },
};

export type Arguments = {
  readonly _: [keyof typeof ConfiguredCommands, ...string[]];
  readonly exclusively?: boolean;
  readonly STACKS?: string[];
  readonly lookups?: boolean;
  readonly [name: string]: unknown;
};

export interface ConfigurationProps {
  /**
   * Configuration passed via command line arguments
   *
   * @default - Nothing passed
   */
  readonly commandLineArguments?: Arguments;

  /**
   * Whether or not to use context from `.cdk.json` in user home directory
   *
   * @default true
   */
  readonly readUserContext?: boolean;
}

/**
 * All sources of settings combined
 */
export class Configuration {
  public settings = new Settings();
  public context = new Context();

  public readonly defaultConfig = new Settings({
    versionReporting: true,
    assetMetadata: true,
    pathMetadata: true,
    output: 'cdk.out',
  });

  private readonly commandLineArguments: Settings;
  private readonly commandLineContext: Settings;
  private _projectConfig?: Settings;
  private _projectContext?: Settings;
  private loaded = false;

  constructor(private readonly props: ConfigurationProps = {}) {
    this.commandLineArguments = props.commandLineArguments
      ? commandLineArgumentsToSettings(props.commandLineArguments)
      : new Settings();
    this.commandLineContext = this.commandLineArguments
      .subSettings([CONTEXT_KEY])
      .makeReadOnly();
  }

  private get projectConfig() {
    if (!this._projectConfig) {
      throw new ToolkitError('#load has not been called yet!');
    }
    return this._projectConfig;
  }

  public get projectContext() {
    if (!this._projectContext) {
      throw new ToolkitError('#load has not been called yet!');
    }
    return this._projectContext;
  }

  /**
   * Load all config
   */
  public async load(): Promise<this> {
    const userConfig = await loadAndLog(USER_DEFAULTS);
    this._projectConfig = await loadAndLog(PROJECT_CONFIG);
    this._projectContext = await loadAndLog(PROJECT_CONTEXT);

    // @todo cannot currently be disabled by cli users
    const readUserContext = this.props.readUserContext ?? true;

    if (userConfig.get(['build'])) {
      throw new ToolkitError(
        'The `build` key cannot be specified in the user config (~/.cdk.json), specify it in the project config (cdk.json) instead',
      );
    }

    const contextSources = [
      { bag: this.commandLineContext },
      {
        fileName: PROJECT_CONFIG,
        bag: this.projectConfig.subSettings([CONTEXT_KEY]).makeReadOnly(),
      },
      { fileName: PROJECT_CONTEXT, bag: this.projectContext },
    ];
    if (readUserContext) {
      contextSources.push({
        fileName: USER_DEFAULTS,
        bag: userConfig.subSettings([CONTEXT_KEY]).makeReadOnly(),
      });
    }

    this.context = new Context(...contextSources);

    // Build settings from what's left
    this.settings = this.defaultConfig
      .merge(userConfig)
      .merge(this.projectConfig)
      .merge(this.commandLineArguments)
      .makeReadOnly();

    debug('merged settings:', this.settings.all);

    this.loaded = true;

    return this;
  }

  /**
   * Save the project context
   */
  public async saveContext(): Promise<this> {
    if (!this.loaded) {
      return this;
    } // Avoid overwriting files with nothing

    await this.projectContext.save(PROJECT_CONTEXT);

    return this;
  }
}

async function loadAndLog(fileName: string): Promise<Settings> {
  const ret = new Settings();
  await ret.load(fileName);
  if (!ret.empty) {
    debug(fileName + ':', JSON.stringify(ret.all, undefined, 2));
  }
  return ret;
}

/**
 * Parse CLI arguments into Settings
 *
 * CLI arguments in must be accessed in the CLI code via
 * `configuration.settings.get(['argName'])` instead of via `args.argName`.
 *
 * The advantage is that they can be configured via `cdk.json` and
 * `$HOME/.cdk.json`. Arguments not listed below and accessed via this object
 * can only be specified on the command line.
 *
 * @param argv the received CLI arguments.
 * @returns a new Settings object.
 */
export function commandLineArgumentsToSettings(argv: Arguments): Settings {
  const context = parseStringContextListToObject(argv);
  const tags = parseStringTagsListToObject(expectStringList(argv.tags));

  // Determine bundling stacks
  let bundlingStacks: string[];
  const command = argv._[0];
  if (ConfiguredCommands[command].bundling) {
    // If we deploy, diff, synth or watch a list of stacks exclusively we skip
    // bundling for all other stacks.
    bundlingStacks = argv.exclusively ? argv.STACKS ?? ['**'] : ['**'];
  } else {
    // Skip bundling for all stacks
    bundlingStacks = [];
  }

  return new Settings({
    app: argv.app,
    browser: argv.browser,
    build: argv.build,
    caBundlePath: argv.caBundlePath,
    context,
    debug: argv.debug,
    tags,
    language: argv.language,
    pathMetadata: argv.pathMetadata,
    assetMetadata: argv.assetMetadata,
    profile: argv.profile,
    plugin: argv.plugin,
    requireApproval: argv.requireApproval,
    toolkitStackName: argv.toolkitStackName,
    toolkitBucket: {
      bucketName: argv.bootstrapBucketName,
      kmsKeyId: argv.bootstrapKmsKeyId,
    },
    versionReporting: argv.versionReporting,
    staging: argv.staging,
    output: argv.output,
    outputsFile: argv.outputsFile,
    progress: argv.progress,
    proxy: argv.proxy,
    bundlingStacks,
    lookups: argv.lookups,
    rollback: argv.rollback,
    notices: argv.notices,
    assetParallelism: argv['asset-parallelism'],
    assetPrebuild: argv['asset-prebuild'],
    ignoreNoStacks: argv['ignore-no-stacks'],
    hotswap: {
      ecs: {
        minimumEcsHealthyPercent: argv.minimumEcsHealthyPercent,
        maximumEcsHealthyPercent: argv.maximumEcsHealthyPercent,
      },
    },
    unstable: argv.unstable,
  });
}

function expectStringList(x: unknown): string[] | undefined {
  if (x === undefined) {
    return undefined;
  }
  if (!Array.isArray(x)) {
    throw new ToolkitError(`Expected array, got '${x}'`);
  }
  const nonStrings = x.filter((e) => typeof e !== 'string');
  if (nonStrings.length > 0) {
    throw new ToolkitError(`Expected list of strings, found ${nonStrings}`);
  }
  return x;
}

function parseStringContextListToObject(argv: Arguments): any {
  const context: any = {};

  for (const assignment of (argv as any).context || []) {
    const parts = assignment.split(/=(.*)/, 2);
    if (parts.length === 2) {
      debug('CLI argument context: %s=%s', parts[0], parts[1]);
      if (parts[0].match(/^aws:.+/)) {
        throw new ToolkitError(
          `User-provided context cannot use keys prefixed with 'aws:', but ${parts[0]} was provided.`,
        );
      }
      context[parts[0]] = parts[1];
    } else {
      warning(
        'Context argument is not an assignment (key=value): %s',
        assignment,
      );
    }
  }
  return context;
}

/**
 * Parse tags out of arguments
 *
 * Return undefined if no tags were provided, return an empty array if only empty
 * strings were provided
 */
function parseStringTagsListToObject(
  argTags: string[] | undefined,
): Tag[] | undefined {
  if (argTags === undefined) {
    return undefined;
  }
  if (argTags.length === 0) {
    return undefined;
  }
  const nonEmptyTags = argTags.filter((t) => t !== '');
  if (nonEmptyTags.length === 0) {
    return [];
  }

  const tags: Tag[] = [];

  for (const assignment of nonEmptyTags) {
    const parts = assignment.split(/=(.*)/, 2);
    if (parts.length === 2) {
      debug('CLI argument tags: %s=%s', parts[0], parts[1]);
      tags.push({
        Key: parts[0],
        Value: parts[1],
      });
    } else {
      warning('Tags argument is not an assignment (key=value): %s', assignment);
    }
  }
  return tags.length > 0 ? tags : undefined;
}

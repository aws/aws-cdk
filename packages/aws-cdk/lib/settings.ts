import * as os from 'os';
import * as fs_path from 'path';
import * as fs from 'fs-extra';
import { Command } from './command';
import { convertConfigToUserInput } from './convert-to-user-input';
import { debug, warning } from './logging';
import { ToolkitError } from './toolkit/error';
import { UserInput } from './user-input';
import * as util from './util';

export type SettingsMap = {[key: string]: any};

export const PROJECT_CONFIG = 'cdk.json';
export const PROJECT_CONTEXT = 'cdk.context.json';
export const USER_DEFAULTS = '~/.cdk.json';

/**
 * If a context value is an object with this key set to a truthy value, it won't be saved to cdk.context.json
 */
export const TRANSIENT_CONTEXT_KEY = '$dontSaveContext';

const CONTEXT_KEY = 'context';

export interface ConfigurationProps {
  /**
   * Configuration passed via command line arguments
   *
   * @default - Nothing passed
   */
  readonly commandLineArguments?: UserInput;

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
  public settings = new ArgumentSettings();
  public context = new Context();
  public command?: Command;

  public readonly defaultConfig = new ArgumentSettings({
    globalOptions: {
      versionReporting: true,
      assetMetadata: true,
      pathMetadata: true,
      output: 'cdk.out',
    },
  });

  private readonly commandLineArguments: ArgumentSettings;
  private readonly commandLineContext: Settings;
  private _projectConfig?: Settings;
  private _projectContext?: Settings;
  private loaded = false;

  constructor(private readonly props: ConfigurationProps = {}) {
    this.command = props.commandLineArguments?.command;
    this.commandLineArguments = props.commandLineArguments
      ? ArgumentSettings.fromCommandLineArguments(props.commandLineArguments)
      : new ArgumentSettings();
    this.commandLineContext = this.commandLineArguments.subSettings([CONTEXT_KEY]).makeReadOnly();
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

    const readUserContext = this.props.readUserContext ?? true;

    const contextSources = [
      { bag: this.commandLineContext },
      { fileName: PROJECT_CONFIG, bag: this.projectConfig.subSettings([CONTEXT_KEY]).makeReadOnly() },
      { fileName: PROJECT_CONTEXT, bag: this.projectContext },
    ];

    if (readUserContext) {
      contextSources.push({ fileName: USER_DEFAULTS, bag: userConfig.subSettings([CONTEXT_KEY]).makeReadOnly() });
    }

    this.context = new Context(...contextSources);

    // Build settings from what's left
    this.settings = this.defaultConfig
      .merge(new ArgumentSettings(convertConfigToUserInput(userConfig.all)))
      .merge(new ArgumentSettings(convertConfigToUserInput(this.projectConfig.all)))
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
    if (!this.loaded) { return this; } // Avoid overwriting files with nothing

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

interface ContextBag {
  /**
   * The file name of the context. Will be used to potentially
   * save new context back to the original file.
   */
  fileName?: string;

  /**
   * The context values.
   */
  bag: Settings;
}

/**
 * Class that supports overlaying property bags
 *
 * Reads come from the first property bag that can has the given key,
 * writes go to the first property bag that is not readonly. A write
 * will remove the value from all property bags after the first
 * writable one.
 */
export class Context {
  private readonly bags: Settings[];
  private readonly fileNames: (string|undefined)[];

  constructor(...bags: ContextBag[]) {
    this.bags = bags.length > 0 ? bags.map(b => b.bag) : [new Settings()];
    this.fileNames = bags.length > 0 ? bags.map(b => b.fileName) : ['default'];
  }

  public get keys(): string[] {
    return Object.keys(this.all);
  }

  public has(key: string) {
    return this.keys.indexOf(key) > -1;
  }

  public get all(): {[key: string]: any} {
    let ret = new Settings();

    // In reverse order so keys to the left overwrite keys to the right of them
    for (const bag of [...this.bags].reverse()) {
      ret = ret.merge(bag);
    }

    return ret.all;
  }

  public get(key: string): any {
    for (const bag of this.bags) {
      const v = bag.get([key]);
      if (v !== undefined) { return v; }
    }
    return undefined;
  }

  public set(key: string, value: any) {
    for (const bag of this.bags) {
      if (bag.readOnly) { continue; }

      // All bags past the first one have the value erased
      bag.set([key], value);
      value = undefined;
    }
  }

  public unset(key: string) {
    this.set(key, undefined);
  }

  public clear() {
    for (const key of this.keys) {
      this.unset(key);
    }
  }

  /**
   * Save a specific context file
   */
  public async save(fileName: string): Promise<this> {
    const index = this.fileNames.indexOf(fileName);

    // File not found, don't do anything in this scenario
    if (index === -1) {
      return this;
    }

    const bag = this.bags[index];
    if (bag.readOnly) {
      throw new Error(`Context file ${fileName} is read only!`);
    }

    await bag.save(fileName);
    return this;
  }
}

// cdk.json is gonna look like this:
// {
//   'someGlobalOption': true,
//   'deploy': {
//     'someDeployOption': true,
//   }
// }
// for backwards compat we will allow existing options to be specified at the base rather than within command
// this will translate to
// UserInput: {
//   command: Command.ALL,
//   globalOptions: {
//     someGlobalOption: true,
//   }
//   deploy: {
//     someDeployOption: true,
//   }
// }

/**
 * A single bag of settings
 */
export class Settings {
  public static mergeAll(...settings: Settings[]): Settings {
    let ret = new Settings();
    for (const setting of settings) {
      ret = ret.merge(setting);
    }
    return ret;
  }

  constructor(protected settings: SettingsMap = {}, public readonly readOnly = false) {}

  public async load(fileName: string): Promise<this> {
    if (this.readOnly) {
      throw new ToolkitError(`Can't load ${fileName}: settings object is readonly`);
    }
    this.settings = {};

    const expanded = expandHomeDir(fileName);
    if (await fs.pathExists(expanded)) {
      this.settings = await fs.readJson(expanded);
    }

    // See https://github.com/aws/aws-cdk/issues/59
    this.prohibitContextKey('default-account', fileName);
    this.prohibitContextKey('default-region', fileName);
    this.warnAboutContextKey('aws:', fileName);

    return this;
  }

  public async save(fileName: string): Promise<this> {
    const expanded = expandHomeDir(fileName);
    await fs.writeJson(expanded, stripTransientValues(this.settings), { spaces: 2 });
    return this;
  }

  public get all(): any {
    return this.get([]);
  }

  public merge(other: Settings): Settings {
    return new Settings(util.deepMerge(this.settings, other.settings));
  }

  public subSettings(keyPrefix: string[]) {
    return new Settings(this.get(keyPrefix) || {}, false);
  }

  public makeReadOnly(): Settings {
    return new Settings(this.settings, true);
  }

  public clear() {
    if (this.readOnly) {
      throw new ToolkitError('Cannot clear(): settings are readonly');
    }
    this.settings = {};
  }

  public get empty(): boolean {
    return Object.keys(this.settings).length === 0;
  }

  public get(path: string[]): any {
    return util.deepClone(util.deepGet(this.settings, path));
  }

  public set(path: string[], value: any): Settings {
    if (this.readOnly) {
      throw new ToolkitError(`Can't set ${path}: settings object is readonly`);
    }
    if (path.length === 0) {
      // deepSet can't handle this case
      this.settings = value;
    } else {
      util.deepSet(this.settings, path, value);
    }
    return this;
  }

  public unset(path: string[]) {
    this.set(path, undefined);
  }

  private prohibitContextKey(key: string, fileName: string) {
    if (!this.settings.context) { return; }
    if (key in this.settings.context) {
      // eslint-disable-next-line max-len
      throw new ToolkitError(`The 'context.${key}' key was found in ${fs_path.resolve(fileName)}, but it is no longer supported. Please remove it.`);
    }
  }

  private warnAboutContextKey(prefix: string, fileName: string) {
    if (!this.settings.context) { return; }
    for (const contextKey of Object.keys(this.settings.context)) {
      if (contextKey.startsWith(prefix)) {
        // eslint-disable-next-line max-len
        warning(`A reserved context key ('context.${prefix}') key was found in ${fs_path.resolve(fileName)}, it might cause surprising behavior and should be removed.`);
      }
    }
  }
}

/**
 * A specific bag of settings related to Arguments specified via CLI or cdk.json
 */
export class ArgumentSettings extends Settings {
  /**
   * Parse Settings out of CLI arguments.
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
  public static fromCommandLineArguments(argv: UserInput): ArgumentSettings {
    return new ArgumentSettings(argv);
  }

  public static fromConfigFileArguments(argv: UserInput): ArgumentSettings {
    return new ArgumentSettings(argv);
  }

  public constructor(args: UserInput = {}) {
    super(args);
  }

  public merge(other: ArgumentSettings): ArgumentSettings {
    return new ArgumentSettings(util.deepMerge(this.settings, other.settings));
  }

  public get all(): UserInput {
    return this.get([]);
  }
}

function expandHomeDir(x: string) {
  if (x.startsWith('~')) {
    return fs_path.join(os.homedir(), x.slice(1));
  }
  return x;
}

/**
 * Return all context value that are not transient context values
 */
function stripTransientValues(obj: {[key: string]: any}) {
  const ret: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!isTransientValue(value)) {
      ret[key] = value;
    }
  }
  return ret;
}

/**
 * Return whether the given value is a transient context value
 *
 * Values that are objects with a magic key set to a truthy value are considered transient.
 */
function isTransientValue(value: any) {
  return typeof value === 'object' && value !== null && (value as any)[TRANSIENT_CONTEXT_KEY];
}

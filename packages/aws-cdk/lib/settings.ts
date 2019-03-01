import fs = require('fs-extra');
import os = require('os');
import fs_path = require('path');
import yargs = require('yargs');
import { debug, warning } from './logging';
import util = require('./util');

export type SettingsMap = {[key: string]: any};

export const PROJECT_CONFIG = 'cdk.json';
export const PROJECT_CONTEXT = 'cdk.context.json';
export const USER_DEFAULTS = '~/.cdk.json';

const CONTEXT_KEY = 'context';

/**
 * All sources of settings combined
 */
export class Configuration {
  public settings = new Settings();
  public context = new Context(new Settings(), [], new Settings());

  private readonly defaultConfig = new Settings({ versionReporting: true, pathMetadata: true });
  private readonly commandLineArguments: Settings;
  private projectConfig: Settings;
  private projectContext: Settings;
  private loaded = false;

  constructor(commandLineArguments?: yargs.Arguments) {
    this.commandLineArguments = commandLineArguments
                              ? Settings.fromCommandLineArguments(commandLineArguments)
                              : new Settings();
  }

  /**
   * Load all config
   */
  public async load(): Promise<this> {
    const userConfig = await loadAndLog(USER_DEFAULTS);
    this.projectConfig = await loadAndLog(PROJECT_CONFIG);
    this.projectContext = await loadAndLog(PROJECT_CONTEXT);

    this.context = new Context(this.projectConfig, [CONTEXT_KEY], this.projectContext);

    // Build settings from what's left
    this.settings = this.defaultConfig
      .merge(userConfig)
      .merge(this.projectConfig)
      .merge(this.commandLineArguments)
      .makeReadOnly();

    this.loaded = true;

    return this;
  }

  /**
   * Save the project config
   */
  public async saveContext(): Promise<this> {
    if (!this.loaded) { return this; }

    if (this.context.modifiedBottom) {
      await this.projectConfig.save(PROJECT_CONFIG);
    }
    await this.projectContext.save(PROJECT_CONTEXT);

    return this;
  }
}

async function loadAndLog(fileName: string): Promise<Settings> {
  const ret = new Settings();
  await ret.load(fileName);
  if (!ret.empty) {
    debug(fileName + ':', JSON.stringify(ret.get([]), undefined, 2));
  }
  return ret;
}

/**
 * Class that supports overlaying 2 property bags
 *
 * Writes go to the topmost property bag, but if any writes collide between
 * them the value will be deleted from the underlying property bag.
 */
export class Context {
  public modifiedBottom = false;

  constructor(private readonly bottom: Settings, private readonly bottomPrefixPath: string[], private readonly top: Settings) {
  }

  public get keys(): string[] {
    return Object.keys(this.everything());
  }

  public has(key: string) {
    return this.keys.indexOf(key) > -1;
  }

  public everything(): {[key: string]: any} {
    const b = this.bottom.get(this.bottomPrefixPath) || {};
    const t = this.top.get([]) || {};
    return Object.assign(b, t);
  }

  public get(key: string): any {
    let x = this.top.get([key]);
    if (x === undefined) { x = this.bottom.get(this.bottomPrefixPath.concat([key])); }
    return x;
  }

  public set(key: string, value: any) {
    this.top.set([key], value);
    if (this.bottom.get(this.bottomPrefixPath.concat([key])) !== undefined) {
      this.bottom.unset(this.bottomPrefixPath.concat([key]));
      this.modifiedBottom = true;
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
}

/**
 * A single bag of settings
 */
export class Settings {
  /**
   * Parse Settings out of CLI arguments.
   * @param argv the received CLI arguments.
   * @returns a new Settings object.
   */
  public static fromCommandLineArguments(argv: yargs.Arguments): Settings {
    const context: any = {};

    // Turn list of KEY=VALUE strings into an object
    for (const assignment of ((argv as any).context || [])) {
      const parts = assignment.split('=', 2);
      if (parts.length === 2) {
        debug('CLI argument context: %s=%s', parts[0], parts[1]);
        if (parts[0].match(/^aws:.+/)) {
          throw new Error(`User-provided context cannot use keys prefixed with 'aws:', but ${parts[0]} was provided.`);
        }
        context[parts[0]] = parts[1];
      } else {
        warning('Context argument is not an assignment (key=value): %s', assignment);
      }
    }

    return new Settings({
      app: argv.app,
      browser: argv.browser,
      context,
      language: argv.language,
      pathMetadata: argv.pathMetadata,
      assetMetadata: argv.assetMetadata,
      plugin: argv.plugin,
      requireApproval: argv.requireApproval,
      toolkitStackName: argv.toolkitStackName,
      versionReporting: argv.versionReporting,
    });
  }

  public static mergeAll(...settings: Settings[]): Settings {
    let ret = new Settings();
    for (const setting of settings) {
      ret = ret.merge(setting);
    }
    return ret;
  }

  constructor(private settings: SettingsMap = {}, private readOnly = false) {}

  public async load(fileName: string): Promise<this> {
    if (this.readOnly) {
      throw new Error(`Can't load ${fileName}: settings object is readonly`);
    }
    this.settings = {};

    const expanded = expandHomeDir(fileName);
    if (await fs.pathExists(expanded)) {
      this.settings = await fs.readJson(expanded);
    }

    // See https://github.com/awslabs/aws-cdk/issues/59
    this.prohibitContextKey('default-account', fileName);
    this.prohibitContextKey('default-region', fileName);
    this.warnAboutContextKey('aws:', fileName);

    return this;
  }

  public async save(fileName: string): Promise<this> {
    const expanded = expandHomeDir(fileName);
    await fs.writeJson(expanded, this.settings, { spaces: 2 });

    return this;
  }

  public merge(other: Settings): Settings {
    return new Settings(util.deepMerge(this.settings, other.settings));
  }

  public makeReadOnly(): Settings {
    const ret = this.clone();
    ret.readOnly = true;
    return ret;
  }

  public clear() {
    if (this.readOnly) {
      throw new Error('Cannot clear(): settings are readonly');
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
      throw new Error(`Can't set ${path}: settings object is readonly`);
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

  public clone() {
    return new Settings({ ...this.settings });
  }

  private prohibitContextKey(key: string, fileName: string) {
    if (!this.settings.context) { return; }
    if (key in this.settings.context) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`The 'context.${key}' key was found in ${fs_path.resolve(fileName)}, but it is no longer supported. Please remove it.`);
    }
  }

  private warnAboutContextKey(prefix: string, fileName: string) {
    if (!this.settings.context) { return; }
    for (const contextKey of Object.keys(this.settings.context)) {
      if (contextKey.startsWith(prefix)) {
        // tslint:disable-next-line:max-line-length
        warning(`A reserved context key ('context.${prefix}') key was found in ${fs_path.resolve(fileName)}, it might cause surprising behavior and should be removed.`);
      }
    }
  }
}

function expandHomeDir(x: string) {
  if (x.startsWith('~')) {
    return fs_path.join(os.homedir(), x.substr(1));
  }
  return x;
}

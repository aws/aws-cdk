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
  public context = new Context();

  private readonly defaultConfig = new Settings({ versionReporting: true, pathMetadata: true });
  private readonly commandLineArguments: Settings;
  private readonly commandLineContext: Settings;
  private projectConfig: Settings;
  private projectContext: Settings;
  private loaded = false;

  constructor(commandLineArguments?: yargs.Arguments) {
    this.commandLineArguments = commandLineArguments
                              ? Settings.fromCommandLineArguments(commandLineArguments)
                              : new Settings();
    this.commandLineContext = this.commandLineArguments.subSettings([CONTEXT_KEY]).makeReadOnly();
  }

  /**
   * Load all config
   */
  public async load(): Promise<this> {
    const userConfig = await loadAndLog(USER_DEFAULTS);
    this.projectConfig = await loadAndLog(PROJECT_CONFIG);
    this.projectContext = await loadAndLog(PROJECT_CONTEXT);

    await this.migrateLegacyContext();

    this.context = new Context(
        this.commandLineContext,
        this.projectConfig.subSettings([CONTEXT_KEY]).makeReadOnly(),
        this.projectContext);

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
   * Save the project context
   */
  public async saveContext(): Promise<this> {
    if (!this.loaded) { return this; }  // Avoid overwriting files with nothing

    await this.projectContext.save(PROJECT_CONTEXT);

    return this;
  }

  /**
   * Migrate context from the 'context' field in the projectConfig object to the dedicated object
   *
   * Only migrate context whose key contains a ':', to migrate only context generated
   * by context providers.
   */
  private async migrateLegacyContext() {
    const legacyContext = this.projectConfig.get([CONTEXT_KEY]);
    if (legacyContext === undefined) { return; }

    const toMigrate = Object.keys(legacyContext).filter(k => k.indexOf(':') > -1);
    if (toMigrate.length === 0) { return; }

    for (const key of toMigrate) {
      this.projectContext.set([key], legacyContext[key]);
      this.projectConfig.unset([CONTEXT_KEY, key]);
    }

    // If the source object is empty now, completely remove it
    if (Object.keys(this.projectConfig.get([CONTEXT_KEY])).length === 0) {
      this.projectConfig.unset([CONTEXT_KEY]);
    }

    // Save back
    await this.projectConfig.save(PROJECT_CONFIG);
    await this.projectContext.save(PROJECT_CONTEXT);
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
 * Class that supports overlaying property bags
 *
 * Reads come from the first property bag that can has the given key,
 * writes go to the first property bag that is not readonly. A write
 * will remove the value from all property bags after the first
 * writable one.
 */
export class Context {
  private readonly bags: Settings[];

  constructor(...bags: Settings[]) {
    this.bags = bags.length > 0 ? bags : [new Settings()];
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

  constructor(private settings: SettingsMap = {}, public readonly readOnly = false) {}

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

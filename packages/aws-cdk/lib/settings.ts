import fs = require('fs-extra');
import os = require('os');
import fs_path = require('path');
import yargs = require('yargs');
import { debug, warning } from './logging';
import util = require('./util');

export type SettingsMap = {[key: string]: any};

export const DEFAULTS = 'cdk.json';
export const PER_USER_DEFAULTS = '~/.cdk.json';

/**
 * All sources of settings combined
 */
export class Configuration {
  public readonly commandLineArguments: Settings;
  public readonly defaultConfig = new Settings({ versionReporting: true, pathMetadata: true });
  public readonly userConfig = new Settings();
  public readonly projectConfig = new Settings();

  constructor(commandLineArguments?: yargs.Arguments) {
    this.commandLineArguments = commandLineArguments
                              ? Settings.fromCommandLineArguments(commandLineArguments)
                              : new Settings();
  }

  /**
   * Load all config
   */
  public async load(): Promise<this> {
    await this.userConfig.load(PER_USER_DEFAULTS);
    await this.projectConfig.load(DEFAULTS);
    return this;
  }

  /**
   * Save the project config
   */
  public async saveProjectConfig(): Promise<this> {
    await this.projectConfig.save(DEFAULTS);
    return this;
  }

  /**
   * Log the loaded defaults
   */
  public logDefaults() {
    if (!this.userConfig.empty()) {
      debug(PER_USER_DEFAULTS + ':', JSON.stringify(this.userConfig.settings, undefined, 2));
    }

    if (!this.projectConfig.empty()) {
      debug(DEFAULTS + ':', JSON.stringify(this.projectConfig.settings, undefined, 2));
    }
  }

  /**
   * Return the combined config from all config sources
   */
  public get combined(): Settings {
    return this.defaultConfig.merge(this.userConfig).merge(this.projectConfig).merge(this.commandLineArguments);
  }
}

/**
 * A single set of settings
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
    for (const assignment of (argv.context || [])) {
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

  constructor(public settings: SettingsMap = {}) {}

  public async load(fileName: string): Promise<this> {
    this.settings = {};

    const expanded = expandHomeDir(fileName);
    if (await fs.pathExists(expanded)) {
      this.settings = await fs.readJson(expanded);
    }

    // See https://github.com/awslabs/aws-cdk/issues/59
    prohibitContextKey(this, 'default-account');
    prohibitContextKey(this, 'default-region');
    warnAboutContextKey(this, 'aws:');

    return this;

    function prohibitContextKey(self: Settings, key: string) {
      if (!self.settings.context) { return; }
      if (key in self.settings.context) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`The 'context.${key}' key was found in ${fs_path.resolve(fileName)}, but it is no longer supported. Please remove it.`);
      }
    }

    function warnAboutContextKey(self: Settings, prefix: string) {
      if (!self.settings.context) { return; }
      for (const contextKey of Object.keys(self.settings.context)) {
        if (contextKey.startsWith(prefix)) {
          // tslint:disable-next-line:max-line-length
          warning(`A reserved context key ('context.${prefix}') key was found in ${fs_path.resolve(fileName)}, it might cause surprising behavior and should be removed.`);
        }
      }
    }
  }

  public async save(fileName: string): Promise<this> {
    const expanded = expandHomeDir(fileName);
    await fs.writeJson(expanded, this.settings, { spaces: 2 });

    return this;
  }

  public merge(other: Settings): Settings {
    return new Settings(util.deepMerge(this.settings, other.settings));
  }

  public empty(): boolean {
    return Object.keys(this.settings).length === 0;
  }

  public get(path: string[]): any {
    return util.deepClone(util.deepGet(this.settings, path));
  }

  public set(path: string[], value: any): Settings {
    util.deepSet(this.settings, path, value);
    return this;
  }
}

function expandHomeDir(x: string) {
  if (x.startsWith('~')) {
    return fs_path.join(os.homedir(), x.substr(1));
  }
  return x;
}

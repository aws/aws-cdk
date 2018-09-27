import fs = require('fs-extra');
import os = require('os');
import fs_path = require('path');
import { warning } from './logging';
import util = require('./util');

export type SettingsMap = {[key: string]: any};

export class Settings {
  public static mergeAll(...settings: Settings[]): Settings {
    let ret = new Settings();
    for (const setting of settings) {
      ret = ret.merge(setting);
    }
    return ret;
  }

  public settings: SettingsMap = {};

  constructor(settings?: SettingsMap) {
    this.settings = settings || {};
  }

  public async load(fileName: string) {
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

  public async save(fileName: string) {
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

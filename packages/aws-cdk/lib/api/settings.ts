import * as os from 'os';
import * as fs_path from 'path';
import * as fs from 'fs-extra';
import { warning } from '../logging';
import { ToolkitError } from '../toolkit/error';
import * as util from '../util/objects';

export type SettingsMap = { [key: string]: any };

/**
 * If a context value is an object with this key set to a truthy value, it won't be saved to cdk.context.json
 */
export const TRANSIENT_CONTEXT_KEY = '$dontSaveContext';

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

  constructor(
    private settings: SettingsMap = {},
    public readonly readOnly = false,
  ) {}

  public async load(fileName: string): Promise<this> {
    if (this.readOnly) {
      throw new ToolkitError(
        `Can't load ${fileName}: settings object is readonly`,
      );
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
    await fs.writeJson(expanded, stripTransientValues(this.settings), {
      spaces: 2,
    });
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
    if (!this.settings.context) {
      return;
    }
    if (key in this.settings.context) {
      // eslint-disable-next-line max-len
      throw new ToolkitError(
        `The 'context.${key}' key was found in ${fs_path.resolve(
          fileName,
        )}, but it is no longer supported. Please remove it.`,
      );
    }
  }

  private warnAboutContextKey(prefix: string, fileName: string) {
    if (!this.settings.context) {
      return;
    }
    for (const contextKey of Object.keys(this.settings.context)) {
      if (contextKey.startsWith(prefix)) {
        // eslint-disable-next-line max-len
        warning(
          `A reserved context key ('context.${prefix}') key was found in ${fs_path.resolve(
            fileName,
          )}, it might cause surprising behavior and should be removed.`,
        );
      }
    }
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
function stripTransientValues(obj: { [key: string]: any }) {
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
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as any)[TRANSIENT_CONTEXT_KEY]
  );
}

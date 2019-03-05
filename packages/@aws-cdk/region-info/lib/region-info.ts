import os = require('os');
import path = require('path');
import process = require('process');
import { IRegionInfo } from './region-info-api';
import builtIns = require('./static.generated');
import { loadUserData } from './user-data';

const CDK_REGION_INFO_PATH_VARIABLE = 'CDK_REGION_INFO_PATH';
const CDK_REGION_INFO_PATH_DEFAULT = path.resolve(os.homedir(), '.cdk', 'region-info.json');

/**
 * Allows accessing region information configured in this process. The library provides built)in configuration for
 * AWS region information, however newer regions might be missing unless they have been properly configured in the
 * system. In such cases, a user can provide their own configuration entries in a JSON document thait is located in
 * the path denoted by `RegionInfo.userDataPath`.
 */
export class RegionInfo {
  /**
   * The path from which user-defined region information is loaded. User-defined information always has precedence
   * over built-in data (this guarantees consistent behavior across updates to this library). The default value for
   * this property is `~/.cdk/region-info.json`, or the value of the environment variable `CDK_REGION_INFO_PATH` if it
   * is set.
   */
  public static get userDataPath(): string {
    return this._userDataPath;
  }

  /**
   * Changes the path from which user-defined region information is loaded.
   *
   * @param newPath the new path in which to look for user-defined region information. When empty, resets the load path
   *                to it's default value (`~/.cdk/region-info.json`, or the value of the environment variable
   *                `CDK_REGION_INFO_PATH`)
   */
  public static set userDataPath(newPath: string) {
    if (!newPath) {
      newPath = process.env[CDK_REGION_INFO_PATH_VARIABLE] || CDK_REGION_INFO_PATH_DEFAULT;
    }
    this._userDataPath = path.resolve(newPath);
    delete this._userData;
  }

  /**
   * Obtain region information for a given name.
   *
   * @param name the name of the region being looked up (e.g: us-east-1)
   *
   * @throws if no information is found for the given region name.
   */
  public static forRegion(name: string): IRegionInfo {
    if (name in this.userData) {
      return this.userData[name];
    }
    if (name in builtIns) {
      return builtIns[name];
    }
    throw new Error(`Unknown region: ${name}. You can configure it by adding an entry in ${RegionInfo.userDataPath}`);
  }

  private static _userDataPath = process.env[CDK_REGION_INFO_PATH_VARIABLE] || CDK_REGION_INFO_PATH_DEFAULT;
  private static _userData?: { [name: string]: IRegionInfo };

  private static get userData(): { [name: string]: IRegionInfo } {
    if (this._userData == null) {
      this._userData = loadUserData(this._userDataPath);
    }
    return this._userData;
  }

  private constructor() {
    throw new Error('Use RegionInfo.forName instead!');
  }
}

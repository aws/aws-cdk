import * as fs from 'fs';
import * as path from 'path';
import { findUp } from './util';

/**
 * A package.json manager to act on the closest package.json file.
 *
 * Configuring the bundler requires to manipulate the package.json and then
 * restore it.
 */
export class PackageJsonManager {
  private readonly pkgPath: string;
  private readonly pkg: Buffer;
  private readonly pkgJson: PackageJson;

  constructor(directory: string) {
    const pkgPath = findUp('package.json', directory);
    if (!pkgPath) {
      throw new Error('Cannot find a `package.json` in this project.');
    }
    this.pkgPath = path.join(pkgPath, 'package.json');
    this.pkg = fs.readFileSync(this.pkgPath);
    this.pkgJson = JSON.parse(this.pkg.toString());
  }

  /**
   * Update the package.json
   */
  public update(data: any) {
    fs.writeFileSync(this.pkgPath, JSON.stringify({
      ...this.pkgJson,
      ...data,
    }, null, 2));
  }

  /**
   * Restore the package.json to the original
   */
  public restore() {
    fs.writeFileSync(this.pkgPath, this.pkg);
  }

  /**
   * Extract versions for a list of modules
   */
  public getVersions(modules: string[]): { [key: string]: string } {
    const dependencies: { [key: string]: string } = {};

    const allDependencies = {
      ...this.pkgJson.dependencies ?? {},
      ...this.pkgJson.devDependencies ?? {},
      ...this.pkgJson.peerDependencies ?? {},
    };

    for (const mod of modules) {
      if (!allDependencies[mod]) {
        throw new Error(`Cannot extract version for ${mod} in package.json`);
      }
      dependencies[mod] = allDependencies[mod];
    }

    return dependencies;

  }
}

interface PackageJson {
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
}

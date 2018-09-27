import fs = require('fs-extra');
import path = require('path');

export class PackageVersion {
  constructor(public readonly name: string,
              public readonly maxVersion: string,
              public readonly allVersions: string[]) {}

  public toString() {
    return `${this.name}@${this.maxVersion}`;
  }
}

export async function findAllPackages(dir: string): Promise<PackageVersion[]> {
  const packages = new Array<PackageVersion>();
  for (const file of await fs.readdir(dir)) {
    const fullPath = path.join(dir, file);
    if (file === 'package.json') {
      const pkgInfo = require(fullPath);
      const versions = Object.keys(pkgInfo.versions);
      packages.push(new PackageVersion(pkgInfo.name, versions.sort()[0], versions));
    } else if ((await fs.stat(fullPath)).isDirectory()) {
      for (const pkg of await findAllPackages(fullPath)) {
        packages.push(pkg);
      }
    }
  }
  return [...packages];
}

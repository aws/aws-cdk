import fs = require('fs-extra');
import path = require('path');
import { storedInGit } from './gitignore';
import { AllBuildInputs, BuildInputs, MonoRepo } from "./types";
import { asyncFilter, asyncMapValues, partition } from './util';

export async function findAllBuildInputs(monoRepo: MonoRepo): Promise<AllBuildInputs> {
  return asyncMapValues(monoRepo.packages, pkg => findInputs(pkg.directory));

  async function findInputs(root: string): Promise<BuildInputs> {
    const pj = await parsePackageJson(root);
    const [internalNames, externalNames] = partition(pj.dependencyNames, n => n in monoRepo.packages);

    return {
      rootDirectory: root,
      sourceFiles: await nonIgnoredSourceFiles(root),
      internalDependencyNames: internalNames,
      externalDependencyVersion: await findDependencyVersions(root, externalNames),
    };
  }
}

export async function nonIgnoredSourceFiles(root: string) {
  return asyncFilter(await sourceFiles(root), storedInGit);
}

async function sourceFiles(root: string): Promise<string[]> {
  // Need to do something to ignore build files here.
  // Probably by using .gitignore??
  const ret: string[] = [];

  const stack = [root];
  while (stack.length > 0) {
    const dirName = stack.pop()!;
    for (const fileName of await fs.readdir(dirName)) {
      const fullPath = path.join(dirName, fileName);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        // Don't recurse into node_modules
        if (fileName !== 'node_modules') {
          stack.push(fullPath);
        }
      } else {
        ret.push(fullPath);
      }
    }
  }

  return ret;
}

async function parsePackageJson(root: string): Promise<PackageJson> {
  const pj = await fs.readJson(path.join(root, 'package.json'));
  const dependencyNames: string[] = [];

  for (const deps of [pj.dependencies || {}, pj.devDependencies || {}]) {
    dependencyNames.push(...Object.keys(deps));
  }

  return { dependencyNames };
}

interface PackageJson {
  dependencyNames: string[];
}

/**
 * Resolve every dependency to where it's actually stored, and return the version
 *
 * This will be a good enough proxy for the unique identifier, as NPM package versions
 * will only ever have one version.
 */
async function findDependencyVersions(root: string, packages: string[]): Promise<{[key: string]: string}> {
  const ret: {[key: string]: string} = {};

  for (const pack of packages) {
    const dep = require.resolve(`${pack}/package.json`, { paths: [root] });
    const depPj = await fs.readJson(dep);
    ret[pack] = depPj.version;
  }

  return ret;
}
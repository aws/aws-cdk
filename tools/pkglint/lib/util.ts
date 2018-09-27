import fs = require('fs');
import path = require('path');
import { PackageJson } from "./packagejson";

/**
 * Expect a particular JSON key to be a given value
 */
export function expectJSON(pkg: PackageJson, jsonPath: string, expected: any, ignore?: RegExp, caseInsensitive: boolean = false) {
  const parts = jsonPath.split('.');
  const actual = deepGet(pkg.json, parts);
  if (applyCaseInsensitive(applyIgnore(actual)) !== applyCaseInsensitive(applyIgnore(expected))) {
    pkg.report({
      message: `${jsonPath} should be ${JSON.stringify(expected)}${ignore ? ` (ignoring ${ignore})` : ''}, is ${JSON.stringify(actual)}`,
      fix: () => { deepSet(pkg.json, parts, expected); }
    });
  }

  function applyIgnore(val: any): string {
    if (!ignore || val == null) { return JSON.stringify(val); }
    const str = JSON.stringify(val);
    return str.replace(ignore, '');
  }

  function applyCaseInsensitive(val: any): string {
    if (!caseInsensitive || val == null) { return JSON.stringify(val); }
    const str = JSON.stringify(val);
    return str.toLowerCase();
  }
}

/**
 * Export a package-level file to contain a given line
 */
export function fileShouldContain(pkg: PackageJson, fileName: string, ...lines: string[]) {
  for (const line of lines) {
    const doesContain = pkg.fileContainsSync(fileName, line);
    if (!doesContain) {
      pkg.report({
        message: `${fileName} should contain '${line}'`,
        fix: () => pkg.addToFileSync(fileName, line)
      });
    }
  }
}

/**
 * Export a package-level file to contain specific content
 */
export function fileShouldBe(pkg: PackageJson, fileName: string, content: string) {
  const isContent = pkg.fileIsSync(fileName, content);
  if (!isContent) {
    pkg.report({
      message: `${fileName} should contain exactly '${content}'`,
      fix: () => pkg.writeFileSync(fileName, content)
    });
  }
}

/**
 * Enforce a dev dependency
 */
export function expectDevDependency(pkg: PackageJson, packageName: string, version: string) {
  const actualVersion = pkg.getDevDependency(packageName);
  if (version !== actualVersion) {
    pkg.report({
      message: `Missing devDependency: ${packageName} @ ${version}`,
      fix: () => pkg.addDevDependency(packageName, version)
    });
  }
}

/**
 * Return whether the given value is an object
 *
 * Even though arrays technically are objects, we usually want to treat them differently,
 * so we return false in those cases.
 */
export function isObject(x: any) {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

/**
 * Deep get a value from a tree of nested objects
 *
 * Returns undefined if any part of the path was unset or
 * not an object.
 */
export function deepGet(x: any, jsonPath: string[]): any {
  jsonPath = jsonPath.slice();

  while (jsonPath.length > 0 && isObject(x)) {
    const key = jsonPath.shift()!;
    x = x[key];
  }
  return jsonPath.length === 0 ? x : undefined;
}

/**
 * Deep set a value in a tree of nested objects
 *
 * Throws an error if any part of the path is not an object.
 */
export function deepSet(x: any, jsonPath: string[], value: any) {
  jsonPath = jsonPath.slice();

  if (jsonPath.length === 0) {
    throw new Error('Path may not be empty');
  }

  while (jsonPath.length > 1 && isObject(x)) {
    const key = jsonPath.shift()!;
    if (!(key in x)) { x[key] = {}; }
    x = x[key];
  }

  if (!isObject(x)) {
    throw new Error(`Expected an object, got '${x}'`);
  }

  x[jsonPath[0]] = value;
}

/**
 * Find 'lerna.json' and read the global package version from there
 */
export function monoRepoVersion() {
  const found = findLernaJSON();
  const lernaJson = require(found);
  return lernaJson.version;
}

function findLernaJSON() {
  let dir = process.cwd();
  while (true) {
    const fullPath = path.join(dir, 'lerna.json');
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Could not find lerna.json');
    }

    dir = parent;
  }
}

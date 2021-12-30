
/**
 * Apply a JSON patch set into the given target file
 *
 * The sources can be taken from one or more directories.
 */
import * as path from 'path';
import * as fastJsonPatch from 'fast-json-patch';
import * as fs from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sortJson = require('sort-json');

export interface PatchOptions {
  readonly quiet?: boolean;
}

/**
 * Load a patch set from a directory
 */
export async function loadPatchSet(sourceDirectory: string, options: PatchOptions = {}) {
  const targetObject: any = {};

  const files = await fs.readdir(sourceDirectory);
  for (const file of files.sort()) {
    const fullFile = path.join(sourceDirectory, file);
    const relName = path.relative(process.cwd(), fullFile);

    let data;
    if ((await fs.stat(fullFile)).isDirectory()) {
      data = await loadPatchSet(fullFile, options);
    } else if (file.endsWith('.json')) {
      data = await fs.readJson(fullFile);
    } else {
      continue;
    }

    if (file.indexOf('patch') === -1) {
      if (!options.quiet) {
        // eslint-disable-next-line no-console
        console.log(relName);
      }

      // Copy properties from current object into structure, adding/overwriting whatever is found
      merge(targetObject, data, []);
    } else {
      // Apply the loaded file as a patch onto the current structure
      patch(targetObject, data, (x) => {
        if (!options.quiet) {
          // eslint-disable-next-line no-console
          console.log(`${relName}: ${x}`);
        }
      });
    }
  }
  return targetObject;
}

/**
 * Load a patch set and write it out to a file
 */
export async function resolvePatchSet(targetFile: string, sourceDirectory: string, options: PatchOptions = {}) {
  const model = await loadPatchSet(sourceDirectory, options);
  await writeSorted(targetFile, model);
}

export async function writeSorted(targetFile: string, data: any) {
  await fs.mkdirp(path.dirname(targetFile));
  await fs.writeJson(targetFile, sortJson(data), { spaces: 2 });
}

function printSorted(data: any) {
  process.stdout.write(JSON.stringify(sortJson(data), undefined, 2));
}

function merge(target: any, fragment: any, jsonPath: string[]) {
  if (!fragment) { return; }
  for (const key of Object.keys(fragment)) {
    if (key.startsWith('$')) { continue; }

    if (key in target) {
      const specVal = target[key];
      const fragVal = fragment[key];
      if (typeof specVal !== typeof fragVal) {
        // eslint-disable-next-line max-len
        throw new Error(`Attempted to merge ${JSON.stringify(fragVal)} into incompatible ${JSON.stringify(specVal)} at path ${jsonPath.join('/')}/${key}`);
      }
      if (typeof specVal !== 'object' && specVal !== fragVal) {
        // eslint-disable-next-line max-len
        throw new Error(`Conflict when attempting to merge ${JSON.stringify(fragVal)} into ${JSON.stringify(specVal)} at path ${jsonPath.join('/')}/${key}`);
      }
      merge(specVal, fragVal, [...jsonPath, key]);
    } else {
      target[key] = fragment[key];
    }
  }
}

function patch(target: any, fragment: any, log: (x: string) => void) {
  if (!fragment) { return; }

  const patches = findPatches(target, fragment);
  for (const p of patches) {
    log(p.description ?? '');

    try {
      fastJsonPatch.applyPatch(target, p.operations);
    } catch (e) {
      throw new Error(`error applying patch: ${JSON.stringify(p, undefined, 2)}: ${e.message}`);
    }
  }
}

interface Patch {
  readonly description?: string;
  readonly operations: Operation[];
}

type Operation =
  | { readonly op: 'add'; readonly path: string; readonly value: any }
  | { readonly op: 'remove'; readonly path: string }
  | { readonly op: 'replace'; readonly path: string; readonly value: any }
  | { readonly op: 'copy'; readonly path: string; readonly from: string }
  | { readonly op: 'move'; readonly path: string; readonly from: string }
  | { readonly op: 'test'; readonly path: string; readonly value: any }
  ;

/**
 * Find the sets of patches to apply in a document
 *
 * Adjusts paths to be root-relative, which makes it possible to have paths
 * point outside the patch scope.
 */
function findPatches(data: any, patchSource: any): Patch[] {
  const ret: Patch[] = [];
  recurse(data, patchSource, []);
  return ret;

  function recurse(actualData: any, fragment: any, jsonPath: string[]) {
    if (!fragment) { return; }

    if ('patch' in fragment) {
      ret.push({
        description: fragment.patch.description,
        operations: fragment.patch.operations.map((op: any) => adjustPaths(op, jsonPath)),
      });
    } else if ('patch:each' in fragment) {
      const p = fragment['patch:each'];
      if (typeof actualData !== 'object') {
        throw new Error(`Patch ${p.description}: expecting object in data, found '${actualData}'`);
      }
      for (const key in actualData) {
        ret.push({
          description: `${key}: ${p.description}`,
          operations: p.operations.map((op: any) => adjustPaths(op, [...jsonPath, key])),
        });
      }
    } else {
      for (const key of Object.keys(fragment)) {
        if (!(key in actualData)) {
          actualData[key] = {};
        }
        recurse(actualData[key], fragment[key], [...jsonPath, key]);
      }
    }
  }

  function adjustPaths(op: any, jsonPath: string[]): Operation {
    return {
      ...op,
      ...op.path ? { path: adjustPath(op.path, jsonPath) } : undefined,
      ...op.from ? { from: adjustPath(op.from, jsonPath) } : undefined,
    };
  }

  /**
   * Adjust path
   *
   * '$/' means from the root, otherwise interpret as relative path.
   */
  function adjustPath(originalPath: string, jsonPath: string[]): string {
    if (typeof originalPath !== 'string') {
      throw new Error(`adjustPath: expected string, got ${JSON.stringify(originalPath)}`);
    }
    if (originalPath.startsWith('$/')) {
      return originalPath.substr(1);
    }
    return jsonPath.map(p => `/${p}`).join('') + originalPath;
  }
}


/**
 * Run this file as a CLI tool, to apply a patch set from the command line
 */
async function main(args: string[]) {
  const quiet = eatArg('-q', args) || eatArg('--quiet', args);

  if (args.length < 1) {
    throw new Error('Usage: patch-set <DIR> [<FILE>]');
  }

  const [dir, targetFile] = args;

  const model = await loadPatchSet(dir, { quiet });
  if (targetFile) {
    await writeSorted(targetFile, model);
  } else {
    printSorted(model);
  }
}

function eatArg(arg: string, args: string[]) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === arg) {
      args.splice(i, 1);
      return true;
    }
  }
  return false;
}

if (require.main === module) {
  main(process.argv.slice(2)).catch(e => {
    process.exitCode = 1;
    // eslint-disable-next-line no-console
    console.error(e.message);
  });
}

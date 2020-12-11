import { basename, dirname } from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { major as nodeMajorVersion } from './node-version';

// list of NPM scopes included in version reporting e.g. @aws-cdk and @aws-solutions-konstruk
const WHITELIST_SCOPES = ['@aws-cdk', '@aws-cdk-containers', '@aws-solutions-konstruk', '@aws-solutions-constructs', '@amzn'];
// list of NPM packages included in version reporting
const WHITELIST_PACKAGES = ['aws-rfdk', 'aws-cdk-lib'];

/**
 * Returns a list of loaded modules and their versions.
 */
export function collectRuntimeInformation(): cxschema.RuntimeInfo {
  const libraries: { [name: string]: string } = {};

  for (const fileName of Object.keys(require.cache)) {
    const pkg = findNpmPackage(fileName);
    if (pkg && !pkg.private) {
      libraries[pkg.name] = pkg.version;
    }
  }

  // include only libraries that are in the whitelistLibraries list
  for (const name of Object.keys(libraries)) {
    let foundMatch = false;
    for (const scope of WHITELIST_SCOPES) {
      if (name.startsWith(`${scope}/`)) {
        foundMatch = true;
      }
    }
    foundMatch = foundMatch || WHITELIST_PACKAGES.includes(name);

    if (!foundMatch) {
      delete libraries[name];
    }
  }

  // add jsii runtime version
  libraries['jsii-runtime'] = getJsiiAgentVersion();

  return { libraries };
}

/**
 * Determines which NPM module a given loaded javascript file is from.
 *
 * The only infromation that is available locally is a list of Javascript files,
 * and every source file is associated with a search path to resolve the further
 * ``require`` calls made from there, which includes its own directory on disk,
 * and parent directories - for example:
 *
 * [ '...repo/packages/aws-cdk-resources/lib/cfn/node_modules',
 *   '...repo/packages/aws-cdk-resources/lib/node_modules',
 *   '...repo/packages/aws-cdk-resources/node_modules',
 *   '...repo/packages/node_modules',
 *   // etc...
 * ]
 *
 * We are looking for ``package.json`` that is anywhere in the tree, except it's
 * in the parent directory, not in the ``node_modules`` directory. For this
 * reason, we strip the ``/node_modules`` suffix off each path and use regular
 * module resolution to obtain a reference to ``package.json``.
 *
 * @param fileName a javascript file name.
 * @returns the NPM module infos (aka ``package.json`` contents), or
 *      ``undefined`` if the lookup was unsuccessful.
 */
function findNpmPackage(fileName: string): { name: string, version: string, private?: boolean } | undefined {
  const mod = require.cache[fileName];

  if (!mod?.paths) {
    // sometimes this can be undefined. for example when querying for .json modules
    // inside a jest runtime environment.
    // see https://github.com/aws/aws-cdk/issues/7657
    // potentially we can remove this if it turns out to be a bug in how jest implemented the 'require' module.
    return undefined;
  }

  // For any path in ``mod.paths`` that is a node_modules folder, use its parent directory instead.
  const paths = mod?.paths.map((path: string) => basename(path) === 'node_modules' ? dirname(path) : path);

  try {
    const packagePath = require.resolve(
      // Resolution behavior changed in node 12.0.0 - https://github.com/nodejs/node/issues/27583
      nodeMajorVersion >= 12 ? './package.json' : 'package.json',
      { paths },
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(packagePath);
  } catch (e) {
    return undefined;
  }
}

function getJsiiAgentVersion() {
  let jsiiAgent = process.env.JSII_AGENT;

  // if JSII_AGENT is not specified, we will assume this is a node.js runtime
  // and plug in our node.js version
  if (!jsiiAgent) {
    jsiiAgent = `node.js/${process.version}`;
  }

  return jsiiAgent;
}

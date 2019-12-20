import * as cxapi from '@aws-cdk/cx-api';
import { major as nodeMajorVersion } from './node-version';

/**
 * Returns a list of loaded modules and their versions.
 */
export function collectRuntimeInformation(): cxapi.RuntimeInfo {
  const libraries: { [name: string]: string } = {};

  for (const fileName of Object.keys(require.cache)) {
    const pkg = findNpmPackage(fileName);
    if (pkg && !pkg.private) {
      libraries[pkg.name] = pkg.version;
    }
  }

  // include only libraries that are in the @aws-cdk npm scope
  for (const name of Object.keys(libraries)) {
    if (!name.startsWith('@aws-cdk/')) {
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
  const paths = mod.paths.map(stripNodeModules);

  try {
    const packagePath = require.resolve(
      // Resolution behavior changed in node 12.0.0 - https://github.com/nodejs/node/issues/27583
      nodeMajorVersion >= 12 ? './package.json' : 'package.json',
      { paths }
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(packagePath);
  } catch (e) {
    return undefined;
  }

  /**
   * @param s a path.
   * @returns ``s`` with any terminating ``/node_modules``
   *      (or ``\\node_modules``) stripped off.)
   */
  function stripNodeModules(s: string): string {
    if (s.endsWith('/node_modules') || s.endsWith('\\node_modules')) {
      // /node_modules is 13 characters
      return s.substr(0, s.length - 13);
    }
    return s;
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

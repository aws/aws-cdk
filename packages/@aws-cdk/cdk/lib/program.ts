import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { IConstruct, Root } from './core/construct';
import { merge } from './util/json';
import { validateAndThrow } from './util/validation';

/**
 * Represents a CDK program.
 */
export class Program extends Root {
  /**
   * Return the default singleton Program instance
   */
  public static defaultInstance(): Program {
    if (Program.DefaultInstance === undefined) {
      Program.DefaultInstance = new Program();
      Program.DefaultInstance.initializeDefaultProgram();
    }
    return Program.DefaultInstance;
  }

  private static DefaultInstance?: Program;

  protected _isProgram = true;

  constructor() {
    super();

    this.loadContext();
  }

  /**
   * Runs the program. Output is written to output directory as specified in the request.
   */
  public run(): void {
    const outdir = process.env[cxapi.OUTDIR_ENV];
    if (!outdir) {
      process.stderr.write(`ERROR: The environment variable "${cxapi.OUTDIR_ENV}" is not defined\n`);
      process.stderr.write('AWS CDK Toolkit (>= 0.11.0) is required in order to interact with this program.\n');
      process.exit(1);
      return;
    }

    const result = this.synthesizeAll();

    const outfile = path.join(outdir, cxapi.OUTFILE_NAME);
    fs.writeFileSync(outfile, JSON.stringify(result, undefined, 2));
  }

  /**
   * Calculate the CDK app response
   */
  public synthesizeAll(): cxapi.SynthesizeResponse {
    this.node.prepareTree();

    // first, validate this stack and stop if there are errors.
    validateAndThrow(this);

    const result: any = {
      version: cxapi.PROTO_RESPONSE_VERSION,
      runtime: this.collectRuntimeInformation()
    };

    for (const synthesizable of this.node.findAll().filter(isSynthesizable)) {
      merge(result, synthesizable.synthesize(), true);
    }

    return result;
  }

  /**
   * Initialize the default Program instance
   */
  private initializeDefaultProgram() {
    process.once('beforeExit', () => this.run());
  }

  private collectRuntimeInformation(): cxapi.AppRuntime {
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

  private loadContext() {
    const contextJson = process.env[cxapi.CONTEXT_ENV];
    const context = !contextJson ? { } : JSON.parse(contextJson);
    for (const key of Object.keys(context)) {
      this.node.setContext(key, context[key]);
    }
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
    const packagePath = require.resolve('package.json', { paths });
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

interface ISynthesizable extends IConstruct {
  synthesize(): any;
}

function isSynthesizable(x: IConstruct): x is ISynthesizable {
  return (x as any).synthesize !== undefined;
}
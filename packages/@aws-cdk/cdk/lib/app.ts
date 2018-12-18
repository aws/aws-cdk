import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { Stack } from './cloudformation/stack';
import { Construct, MetadataEntry, PATH_SEP, Root } from './core/construct';
import { resolve } from './core/tokens';

/**
 * Represents a CDK program.
 */
export class App extends Root {
  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor() {
    super();
    this.loadContext();
  }

  private get stacks() {
    const out: { [name: string]: Stack } = { };
    for (const child of this.children) {
      if (!Stack.isStack(child)) {
        throw new Error(`The child ${child.toString()} of App must be a Stack`);
      }

      out[child.id] = child as Stack;
    }
    return out;
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

    const result: cxapi.SynthesizeResponse = {
      version: cxapi.PROTO_RESPONSE_VERSION,
      stacks: this.synthesizeStacks(Object.keys(this.stacks)),
      runtime: this.collectRuntimeInformation()
    };

    const outfile = path.join(outdir, cxapi.OUTFILE_NAME);
    fs.writeFileSync(outfile, JSON.stringify(result, undefined, 2));
  }

  /**
   * Synthesize and validate a single stack
   * @param stackName The name of the stack to synthesize
   */
  public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
    const stack = this.getStack(stackName);

    // first, validate this stack and stop if there are errors.
    const errors = stack.validateTree();
    if (errors.length > 0) {
      const errorList = errors.map(e => `[${e.source.path}] ${e.message}`).join('\n  ');
      throw new Error(`Stack validation failed with the following errors:\n  ${errorList}`);
    }

    const account = stack.env.account || 'unknown-account';
    const region = stack.env.region || 'unknown-region';

    const environment: cxapi.Environment = {
      name: `${account}/${region}`,
      account,
      region
    };

    const missing = Object.keys(stack.missingContext).length ? stack.missingContext : undefined;
    return {
      name: stack.id,
      environment,
      missing,
      template: stack.toCloudFormation(),
      metadata: this.collectMetadata(stack)
    };
  }

  /**
   * Synthesizes multiple stacks
   */
  public synthesizeStacks(stackNames: string[]): cxapi.SynthesizedStack[] {
    const ret: cxapi.SynthesizedStack[] = [];
    for (const stackName of stackNames) {
      ret.push(this.synthesizeStack(stackName));
    }
    return ret;
  }

  /**
   * Returns metadata for all constructs in the stack.
   */
  public collectMetadata(stack: Stack) {
    const output: { [id: string]: MetadataEntry[] } = { };

    visit(stack);

    // add app-level metadata under "."
    if (this.metadata.length > 0) {
      output[PATH_SEP] = this.metadata;
    }

    return output;

    function visit(node: Construct) {
      if (node.metadata.length > 0) {
        // Make the path absolute
        output[PATH_SEP + node.path] = node.metadata.map(md => resolve(md) as MetadataEntry);
      }

      for (const child of node.children) {
        visit(child);
      }
    }
  }

  public applyCrossEnvironmentReferences() {
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

  private getStack(stackname: string) {
    if (stackname == null) {
      throw new Error('Stack name must be defined');
    }

    const stack = this.stacks[stackname];
    if (!stack) {
      throw new Error(`Cannot find stack ${stackname}`);
    }
    return stack;
  }

  private loadContext() {
    const contextJson = process.env[cxapi.CONTEXT_ENV];
    const context = !contextJson ? { } : JSON.parse(contextJson);
    for (const key of Object.keys(context)) {
      this.setContext(key, context[key]);
    }
  }
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

function getJsiiAgentVersion() {
  let jsiiAgent = process.env.JSII_AGENT;

  // if JSII_AGENT is not specified, we will assume this is a node.js runtime
  // and plug in our node.js version
  if (!jsiiAgent) {
    jsiiAgent = `node.js/${process.version}`;
  }

  return jsiiAgent;
}
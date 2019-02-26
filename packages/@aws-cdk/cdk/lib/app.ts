import cxapi = require('@aws-cdk/cx-api');
import { Stack } from './cloudformation/stack';
import { Root } from './core/construct';
import { InMemorySynthesisSession, ISynthesisSession, SynthesisSession } from './synthesis';

/**
 * Represents a CDK program.
 */
export class App extends Root {
  private _session?: ISynthesisSession;

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
    for (const child of this.node.children) {
      if (!Stack.isStack(child)) {
        throw new Error(`The child ${child.toString()} of App must be a Stack`);
      }

      out[child.node.id] = child as Stack;
    }
    return out;
  }

  /**
   * Runs the program. Output is written to output directory as specified in the request.
   */
  public run(): ISynthesisSession {
    // this app has already been executed, no-op for you
    if (this._session) {
      return this._session;
    }

    const outdir = process.env[cxapi.OUTDIR_ENV];
    if (outdir) {
      this._session = new SynthesisSession({ outdir });
    } else {
      this._session = new InMemorySynthesisSession();
    }

    // the three holy phases of synthesis: prepare, validate and synthesize

    // prepare
    this.node.prepareTree();

    // validate
    const errors = this.node.validateTree();
    if (errors.length > 0) {
      const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
      throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
    }

    // synthesize
    this.node.synthesizeTree(this._session);

    // lock session - cannot emit more artifacts
    this._session.finalize();

    return this._session;
  }

  /**
   * Synthesize and validate a single stack
   * @param stackName The name of the stack to synthesize
   */
  public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
    const stack = this.getStack(stackName);
    const artifact = this.run().readFile(stack.artifactName);
    return JSON.parse(artifact);
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
   * Synthesize the app manifest (the root file which the toolkit reads)
   */
  protected synthesize(session: ISynthesisSession) {
    const manifest: cxapi.SynthesizeResponse = {
      version: cxapi.PROTO_RESPONSE_VERSION,
      stacks: this.synthesizeStacks(Object.keys(this.stacks)),
      runtime: this.collectRuntimeInformation()
    };

    session.writeFile(cxapi.OUTFILE_NAME, JSON.stringify(manifest, undefined, 2));
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
      this.node.setContext(key, context[key]);
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

import cxapi = require('@aws-cdk/cx-api');
import { ConstructOrder, Root } from './construct';
import { FileSystemStore, InMemoryStore, ISynthesisSession, SynthesisSession } from './synthesis';

/**
 * Custom construction properties for a CDK program
 */
export interface AppProps {
  /**
   * Automatically call run before the application exits
   *
   * If you set this, you don't have to call `run()` anymore.
   *
   * @default true if running via CDK toolkit, false otherwise
   */
  autoRun?: boolean;

  /**
   * Additional context values for the application
   *
   * @default No additional context
   */
  context?: { [key: string]: string };
}

/**
 * Represents a CDK program.
 */
export class App extends Root {
  private _session?: ISynthesisSession;
  private readonly legacyManifest: boolean;
  private readonly runtimeInformation: boolean;

  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor(props: AppProps = {}) {
    super();
    this.loadContext(props.context);

    // both are reverse logic
    this.legacyManifest = this.node.getContext(cxapi.DISABLE_LEGACY_MANIFEST_CONTEXT) ? false : true;
    this.runtimeInformation = this.node.getContext(cxapi.DISABLE_VERSION_REPORTING) ? false : true;

    const autoRun = props.autoRun !== undefined ? props.autoRun : cxapi.OUTDIR_ENV in process.env;

    if (autoRun) {
      // run() guarantuees it will only execute once, so a default of 'true' doesn't bite manual calling
      // of the function.
      process.once('beforeExit', () => this.run());
    }
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
    let store;
    if (outdir) {
      store = new FileSystemStore({ outdir });
    } else {
      store = new InMemoryStore();
    }

    const session = this._session = new SynthesisSession({
      store,
      legacyManifest: this.legacyManifest,
      runtimeInformation: this.runtimeInformation
    });

    // the three holy phases of synthesis: prepare, validate and synthesize

    // prepare
    this.node.prepareTree();

    // validate
    const errors = this.node.validateTree();
    if (errors.length > 0) {
      const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
      throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
    }

    // synthesize (leaves first)
    for (const c of this.node.findAll(ConstructOrder.PostOrder)) {
      if (SynthesisSession.isSynthesizable(c)) {
        c.synthesize(session);
      }
    }

    // write session manifest and lock store
    session.close();

    return session;
  }

  /**
   * Synthesize and validate a single stack.
   * @param stackName The name of the stack to synthesize
   * @deprecated This method is going to be deprecated in a future version of the CDK
   */
  public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
    if (!this.legacyManifest) {
      throw new Error('No legacy manifest available, return an old-style stack output');
    }

    const session = this.run();
    const legacy: cxapi.SynthesizeResponse = session.store.readJson(cxapi.OUTFILE_NAME);

    const res = legacy.stacks.find(s => s.name === stackName);
    if (!res) {
      throw new Error(`Stack "${stackName}" not found`);
    }

    return res;
  }

  /**
   * Synthesizes multiple stacks
   * @deprecated This method is going to be deprecated in a future version of the CDK
   */
  public synthesizeStacks(stackNames: string[]): cxapi.SynthesizedStack[] {
    const ret: cxapi.SynthesizedStack[] = [];
    for (const stackName of stackNames) {
      ret.push(this.synthesizeStack(stackName));
    }
    return ret;
  }

  private loadContext(defaults: { [key: string]: string } = { }) {
    // prime with defaults passed through constructor
    for (const [ k, v ] of Object.entries(defaults)) {
      this.node.setContext(k, v);
    }

    // read from environment
    const contextJson = process.env[cxapi.CONTEXT_ENV];
    const contextFromEnvironment = contextJson
      ? JSON.parse(contextJson)
      : { };

    for (const [ k, v ] of Object.entries(contextFromEnvironment)) {
      this.node.setContext(k, v);
    }
  }
}

import cxapi = require('@aws-cdk/cx-api');
import { ConstructOrder, Root } from './core/construct';
import { FileSystemStore, InMemoryStore, ISynthesisSession, SynthesisSession } from './synthesis';

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

    const session = this._session = new SynthesisSession(store);

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
   * Synthesize and validate a single stack
   * @param stackName The name of the stack to synthesize
   * @deprecated This method is going to be deprecated in a future version of the CDK
   */
  public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
    const session = this.run();
    const res = session.manifest.stacks.find(s => s.name === stackName);
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

  private loadContext() {
    const contextJson = process.env[cxapi.CONTEXT_ENV];
    const context = !contextJson ? { } : JSON.parse(contextJson);
    for (const key of Object.keys(context)) {
      this.node.setContext(key, context[key]);
    }
  }
}

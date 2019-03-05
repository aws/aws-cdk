import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import os = require('os');
import { ConstructOrder, Root } from './core/construct';
import { FileSystemStore, ISynthesisSession, SynthesisSession } from './synthesis';

export interface AppProps {
  /**
   * App-level context key/value pairs.
   *
   * If the environment variable `CDK_CONTEXT_JSON` is set, it is parsed as a JSON object
   * and merged with this hash to form the application's context.
   */
  context?: { [key: string]: string };

  /**
   * Output directory for the CDK application (takes precedence on `CDK_OUTDIR`)
   *
   * @default if the environment variable `CDK_OUTDIR` is set, it will be used
   * as the default value. Otherwise a temporary directory will be used.
   */
  outdir?: string;
}

/**
 * Represents a CDK program.
 */
export class App extends Root {
  private _session?: ISynthesisSession;
  private readonly legacyManifest: boolean;
  private readonly runtimeInformation: boolean;
  private readonly outdir: string;

  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor(props: AppProps = { }) {
    super();
    this.loadContext(props.context);

    // both are reverse logic
    this.legacyManifest = this.node.getContext(cxapi.DISABLE_LEGACY_MANIFEST_CONTEXT) ? false : true;
    this.runtimeInformation = this.node.getContext(cxapi.DISABLE_VERSION_REPORTING) ? false : true;
    this.outdir = props.outdir || process.env[cxapi.OUTDIR_ENV] || fs.mkdtempSync(os.tmpdir());
  }

  /**
   * Runs the program. Output is written to output directory as specified in the request.
   */
  public run(): ISynthesisSession {
    // this app has already been executed, no-op for you
    if (this._session) {
      return this._session;
    }

    const store = new FileSystemStore({ path: this.outdir });

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

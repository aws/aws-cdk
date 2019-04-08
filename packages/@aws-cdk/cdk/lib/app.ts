import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import os = require('os');
import { Root } from './construct';
import { FileSystemStore, ISynthesisSession, Synthesizer } from './synthesis';

export interface AppProps {
  /**
   * App-level context key/value pairs.
   *
   * If the environment variable `CDK_CONTEXT_JSON` is set, it is parsed as a JSON object
   * and merged with this hash to form the application's context.
   */
  readonly context?: { [key: string]: string };

  /**
   * Output directory for the CDK application (takes precedence on `CDK_OUTDIR`)
   *
   * @default if the environment variable `CDK_OUTDIR` is set, it will be used
   * as the default value. Otherwise a temporary directory will be used.
   */
  readonly outdir?: string;

  /**
   * Automatically call run before the application exits
   *
   * If you set this, you don't have to call `run()` anymore.
   *
   * @default true if running via CDK toolkit (CDK_OUTDIR is set), false otherwise
   */
  readonly autoRun?: boolean;
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
  constructor(props: AppProps = {}) {
    super();
    this.loadContext(props.context);

    // both are reverse logic
    this.legacyManifest = this.node.getContext(cxapi.DISABLE_LEGACY_MANIFEST_CONTEXT) ? false : true;
    this.runtimeInformation = this.node.getContext(cxapi.DISABLE_VERSION_REPORTING) ? false : true;
    this.outdir = props.outdir || process.env[cxapi.OUTDIR_ENV] || fs.mkdtempSync(os.tmpdir());

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

    const store = new FileSystemStore({ path: this.outdir });

    const synth = new Synthesizer();

    this._session = synth.synthesize(this, {
      store,
      legacyManifest: this.legacyManifest,
      runtimeInformation: this.runtimeInformation
    });

    return this._session;
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

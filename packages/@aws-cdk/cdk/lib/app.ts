import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { Construct } from './construct';
import { ISynthesisSession, Synthesizer } from './synthesis';

/**
 * Custom construction properties for a CDK program
 */
export interface AppProps {
  /**
   * Automatically call run before the application exits
   *
   * If you set this, you don't have to call `run()` anymore.
   *
   * @default true if running via CDK toolkit (CDK_OUTDIR is set), false otherwise
   */
  readonly autoRun?: boolean;

  /**
   * The output directory into which to emit synthesized artifacts.
   *
   * @default - If this value is _not_ set, considers the environment variable `CDK_OUTDIR`.
   *            If `CDK_OUTDIR` is not defined, uses a temp directory.
   */
  readonly outdir?: string;

  /**
   * Additional context values for the application
   *
   * @default No additional context
   */
  readonly context?: { [key: string]: string };
}

/**
 * Represents a CDK program.
 */
export class App extends Construct {
  private _session?: ISynthesisSession;
  private readonly legacyManifest: boolean;
  private readonly runtimeInformation: boolean;
  private readonly outdir?: string;

  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor(props: AppProps = {}) {
    super(undefined as any, '');

    this.loadContext(props.context);

    // both are reverse logic
    this.legacyManifest = this.node.getContext(cxapi.DISABLE_LEGACY_MANIFEST_CONTEXT) ? false : true;
    this.runtimeInformation = this.node.getContext(cxapi.DISABLE_VERSION_REPORTING) ? false : true;
    this.outdir = props.outdir || process.env[cxapi.OUTDIR_ENV];

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

    const synth = new Synthesizer();

    this._session = synth.synthesize(this, {
      outdir: this.outdir,
      legacyManifest: this.legacyManifest,
      runtimeInformation: this.runtimeInformation
    });

    return this._session;
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
    const legacyManifestFile = path.join(session.outdir, cxapi.OUTFILE_NAME);
    const legacy: cxapi.SynthesizeResponse = JSON.parse(fs.readFileSync(legacyManifestFile, 'utf-8'));

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

import cxapi = require('@aws-cdk/cx-api');
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
   * Include stack traces in construct metadata entries.
   * @default true stack traces are included
   */
  readonly stackTraces?: boolean;

  /**
   * Include runtime versioning information in cloud assembly manifest
   * @default true runtime info is included
   */
  readonly runtimeInfo?: boolean;

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
  private readonly runtimeInformation: boolean;
  private readonly outdir?: string;

  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor(props: AppProps = {}) {
    super(undefined as any, '');

    this.loadContext(props.context);

    if (props.stackTraces === false) {
      this.node.setContext(cxapi.DISABLE_METADATA_STACK_TRACE, true);
    }

    if (props.runtimeInfo === false) {
      this.node.setContext(cxapi.DISABLE_VERSION_REPORTING, true);
    }

    // both are reverse logic
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

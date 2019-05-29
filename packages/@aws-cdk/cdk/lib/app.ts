import cxapi = require('@aws-cdk/cx-api');
import { CloudAssembly } from '@aws-cdk/cx-api';
import { Construct } from './construct';
import { collectRuntimeInformation } from './runtime-info';
import { Synthesizer } from './synthesis';

const APP_SYMBOL = Symbol.for('@aws-cdk/cdk.App');

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

  public static isApp(obj: any): obj is App {
    return APP_SYMBOL in obj;
  }

  private _assembly?: CloudAssembly;
  private readonly runtimeInfo: boolean;
  private readonly outdir?: string;

  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor(props: AppProps = {}) {
    super(undefined as any, '');

    Object.defineProperty(this, APP_SYMBOL, { value: true });

    this.loadContext(props.context);

    if (props.stackTraces === false) {
      this.node.setContext(cxapi.DISABLE_METADATA_STACK_TRACE, true);
    }

    if (props.runtimeInfo === false) {
      this.node.setContext(cxapi.DISABLE_VERSION_REPORTING, true);
    }

    // both are reverse logic
    this.runtimeInfo = this.node.getContext(cxapi.DISABLE_VERSION_REPORTING) ? false : true;
    this.outdir = props.outdir || process.env[cxapi.OUTDIR_ENV];

    const autoRun = props.autoRun !== undefined ? props.autoRun : cxapi.OUTDIR_ENV in process.env;

    if (autoRun) {
      // run() guarantuees it will only execute once, so a default of 'true' doesn't bite manual calling
      // of the function.
      process.once('beforeExit', () => this.run());
    }
  }

  /**
   * Runs the program. Output is written to output directory as specified in the
   * request.
   *
   * @returns a `CloudAssembly` which includes all the synthesized artifacts
   * such as CloudFormation templates and assets.
   */
  public run(): CloudAssembly {
    // this app has already been executed, no-op for you
    if (this._assembly) {
      return this._assembly;
    }

    const synth = new Synthesizer();

    const assembly = synth.synthesize(this, {
      outdir: this.outdir,
      runtimeInfo: this.runtimeInfo ? collectRuntimeInformation() : undefined
    });

    this._assembly = assembly;
    return assembly;
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

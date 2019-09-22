import cxapi = require('@aws-cdk/cx-api');
import { CloudAssembly } from '@aws-cdk/cx-api';
import { Construct, ConstructNode } from './construct';
import { ConstructTreeMetadata } from './private/construct-tree-metadata';
import { collectRuntimeInformation } from './private/runtime-info';

const APP_SYMBOL = Symbol.for('@aws-cdk/core.App');

/**
 * Initialization props for apps.
 */
export interface AppProps {
  /**
   * Automatically call `synth()` before the program exits.
   *
   * If you set this, you don't have to call `synth()` explicitly. Note that
   * this feature is only available for certain programming languages, and
   * calling `synth()` is still recommended.
   *
   * @default true if running via CDK CLI (`CDK_OUTDIR` is set), `false`
   * otherwise
   */
  readonly autoSynth?: boolean;

  /**
   * The output directory into which to emit synthesized artifacts.
   *
   * @default - If this value is _not_ set, considers the environment variable `CDK_OUTDIR`.
   *            If `CDK_OUTDIR` is not defined, uses a temp directory.
   */
  readonly outdir?: string;

  /**
   * Include construct creation stack trace in the `aws:cdk:trace` metadata key of all constructs.
   * @default true stack traces are included unless `aws:cdk:disable-stack-trace` is set in the context.
   */
  readonly stackTraces?: boolean;

  /**
   * Include runtime versioning information in cloud assembly manifest
   * @default true runtime info is included unless `aws:cdk:disable-runtime-info` is set in the context.
   */
  readonly runtimeInfo?: boolean;

  /**
   * Additional context values for the application.
   *
   * Context can be read from any construct using `node.getContext(key)`.
   *
   * @default - no additional context
   */
  readonly context?: { [key: string]: string };

  /**
   * Include construct tree metadata as part of the Cloud Assembly.
   *
   * @default true
   */
  readonly constructTreeMetadata?: boolean;
}

/**
 * A construct which represents an entire CDK app. This construct is normally
 * the root of the construct tree.
 *
 * You would normally define an `App` instance in your program's entrypoint,
 * then define constructs where the app is used as the parent scope.
 *
 * After all the child constructs are defined within the app, you should call
 * `app.synth()` which will emit a "cloud assembly" from this app into the
 * directory specified by `outdir`. Cloud assemblies includes artifacts such as
 * CloudFormation templates and assets that are needed to deploy this app into
 * the AWS cloud.
 *
 * @see https://docs.aws.amazon.com/cdk/latest/guide/apps_and_stacks.html
 */
export class App extends Construct {

  /**
   * Checks if an object is an instance of the `App` class.
   * @returns `true` if `obj` is an `App`.
   * @param obj The object to evaluate
   */
  public static isApp(obj: any): obj is App {
    return APP_SYMBOL in obj;
  }

  private _assembly?: CloudAssembly;
  private readonly runtimeInfo: boolean;
  private readonly outdir?: string;
  private readonly constructTreeMetadata: boolean;

  /**
   * Initializes a CDK application.
   * @param props initialization properties
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
    this.runtimeInfo = this.node.tryGetContext(cxapi.DISABLE_VERSION_REPORTING) ? false : true;
    this.outdir = props.outdir || process.env[cxapi.OUTDIR_ENV];
    this.constructTreeMetadata = props.constructTreeMetadata === undefined ? true : props.constructTreeMetadata;

    const autoSynth = props.autoSynth !== undefined ? props.autoSynth : cxapi.OUTDIR_ENV in process.env;
    if (autoSynth) {
      // synth() guarantuees it will only execute once, so a default of 'true'
      // doesn't bite manual calling of the function.
      process.once('beforeExit', () => this.synth());
    }
  }

  /**
   * Synthesizes a cloud assembly for this app. Emits it to the directory
   * specified by `outdir`.
   *
   * @returns a `CloudAssembly` which can be used to inspect synthesized
   * artifacts such as CloudFormation templates and assets.
   */
  public synth(): CloudAssembly {
    // we already have a cloud assembly, no-op for you
    if (this._assembly) {
      return this._assembly;
    }

    const assembly = ConstructNode.synth(this.node, {
      outdir: this.outdir,
      runtimeInfo: this.runtimeInfo ? collectRuntimeInformation() : undefined
    });

    this._assembly = assembly;
    return assembly;
  }

  protected prepare(): void {
    // Add internal constructs here
    if (this.constructTreeMetadata) {
      new ConstructTreeMetadata(this);
    }
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

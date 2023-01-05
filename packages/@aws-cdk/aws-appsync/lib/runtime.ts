/**
 * Config for binding runtime to a function or resolver
 */
export interface RuntimeConfig {
  /**
   * The name of the runtime
   */
  readonly name: string;

  /**
   * The version string of the runtime
   */
  readonly runtimeVersion: string;
}

/**
 * Appsync supported runtimes. Only JavaScript as of now
 */
export enum FunctionRuntimeFamily {
  /**
   * AppSync JavaScript runtime
   */
  JS = 'APPSYNC_JS',
}

/**
 * Utility class for specifying specific appsync runtime versions
 */
export class FunctionRuntime {
  /**
   * APPSYNC_JS v1.0.0 runtime
   */
  public static readonly JS_1_0_0 = new FunctionRuntime(FunctionRuntimeFamily.JS, '1.0.0');

  /**
   * The name of the runtime
   */
  public readonly name: string;

  /**
   * The runtime version
   */
  public readonly version: string;

  public constructor(family: FunctionRuntimeFamily, version: string) {
    this.name = family;
    this.version = version;
  }

  /**
   * Convert to Cfn runtime configuration property format
   */
  public toProperties(): RuntimeConfig {
    return {
      name: this.name,
      runtimeVersion: this.version,
    };
  }
}


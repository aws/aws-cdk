import { CfnFunctionConfiguration } from './appsync.generated';

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
  public toProperties(): CfnFunctionConfiguration.AppSyncRuntimeProperty {
    return {
      name: this.name,
      runtimeVersion: this.version,
    };
  }
}


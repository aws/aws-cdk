import { EngineVersion } from './engine-version';

/**
 * A common interface for database engines.
 * Don't implement this interface directly,
 * instead implement one of the known sub-interfaces,
 * like IClusterEngine and IInstanceEngine.
 */
export interface IEngine {
  /** The type of the engine, for example "mysql". */
  readonly engineType: string;

  /**
   * The exact version of the engine that is used,
   * for example "5.1.42".
   *
   * @default - use the default version for this engine type
   */
  readonly engineVersion?: EngineVersion;

  /**
   * The family to use for ParameterGroups using this engine.
   * This is usually equal to "<engineType><engineMajorVersion>",
   * but can sometimes be a variation of that.
   * You can pass this property when creating new ParameterGroup.
   *
   * @default - the ParameterGroup family is not known
   *   (which means the major version of the engine is also not known)
   */
  readonly parameterGroupFamily?: string;
}

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

  /**
   * The family this engine belongs to,
   * like "MYSQL", or "POSTGRESQL".
   * This property is used when creating a Database Proxy.
   * Most engines don't belong to any family
   * (and because of that, you can't create Database Proxies for their Clusters or Instances).
   *
   * @default - the engine doesn't belong to any family
   */
  readonly engineFamily?: string;

  /**
   * The default name of the master database user if one was not provided explicitly.
   * The global default of 'admin' will be used if this is `undefined`.
   * Note that 'admin' is a reserved word in PostgreSQL and cannot be used.
   */
  readonly defaultUsername?: string;
}

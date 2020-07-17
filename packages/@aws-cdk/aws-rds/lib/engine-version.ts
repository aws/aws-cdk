/**
 * A version of an engine -
 * for either a cluster, or instance.
 */
export interface EngineVersion {
  /**
   * The full version string of the engine,
   * for example, "5.6.mysql_aurora.1.22.1".
   * It can be undefined,
   * which means RDS should use whatever version it deems appropriate for the given engine type.
   *
   * @default - no version specified
   */
  readonly fullVersion?: string;

  /**
   * The major version of the engine,
   * for example, "5.6".
   * Used in specifying the ParameterGroup family
   * and OptionGroup version for this engine.
   */
  readonly majorVersion: string;
}

/**
 * Engine type for ElastiCache users and user groups.
 *
 * Use the named static members for the engines currently supported by ElastiCache
 * user/user-group resources. To target an engine not yet represented by a named
 * instance, use `UserEngine.of(engineType)`.
 */
export class UserEngine {
  /**
   * Valkey engine.
   */
  public static readonly VALKEY = UserEngine.of('valkey');

  /**
   * Redis engine.
   */
  public static readonly REDIS = UserEngine.of('redis');

  /**
   * Create a new `UserEngine` with an arbitrary engine type.
   *
   * @param engineType the engine type (for example, `'valkey'` or `'redis'`)
   */
  public static of(engineType: string): UserEngine {
    return new UserEngine(engineType);
  }

  /**
   * The engine type, for example `'valkey'` or `'redis'`.
   * Maps directly to the `Engine` property of `AWS::ElastiCache::User` and
   * `AWS::ElastiCache::UserGroup`.
   */
  public readonly engineType: string;

  private constructor(engineType: string) {
    this.engineType = engineType;
  }

  /**
   * Returns the engine type as a string (for example, `'valkey'`).
   */
  public toString(): string {
    return this.engineType;
  }
}

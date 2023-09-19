/**
 * Properties for looking up an existing Key.
 */
export interface KeyLookupOptions {
  /**
   * The alias name of the Key
   *
   * Must be in the format `alias/<AliasName>`.
   */
  readonly aliasName: string;

  /**
   * When the key is cached in cdk.context.json, adds an additional discriminator to the
   * cache key so that separate lookups with the same parameters can have separate cache lifecycles
   */
  readonly additionalCacheKey?: string;
}

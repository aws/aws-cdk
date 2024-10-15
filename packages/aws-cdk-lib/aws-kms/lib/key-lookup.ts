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
   * Whether to return a dummy key if the key was not found.
   *
   * If it is set to `true` and the key was not found, a dummy
   * key with a key id '1234abcd-12ab-34cd-56ef-1234567890ab'
   * will be returned. The value of the dummy key id can also
   * be referenced using the `Key.DEFAULT_DUMMY_KEY_ID` variable,
   * and you can check if the key is a dummy key by using the
   * `Key.isLookupDummy()` method.
   *
   * @default false
   */
  readonly returnDummyKeyOnMissing?: boolean;
}

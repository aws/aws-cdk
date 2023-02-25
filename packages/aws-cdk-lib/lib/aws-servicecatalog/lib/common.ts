/**
 * Constant for the default directory to store ProductStack snapshots.
 */
export const DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY = 'product-stack-snapshots';

/**
 * The language code.
 * Used for error and logging messages for end users.
 * The default behavior if not specified is English.
 */
export enum MessageLanguage {
  /**
   * English
   */
  EN = 'en',

  /**
   * Japanese
   */
  JP = 'jp',

  /**
   * Chinese
   */
  ZH = 'zh'
}

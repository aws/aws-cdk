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

/**
 * The types of cloudFormationTemplates for product versions.
 * Used to determine the source of a cloudFormationTemplate and apply logic accordingly.
 */
export enum TemplateType {
  /**
   * AssetTemplate
   */
  ASSET = 'AssetTemplate',

  /**
   * UrlTemplate
   */
  URL = 'UrlTemplate',

  /**
   * ProductStackTemplate
   */
  PRODUCT_STACK = 'ProductStackTemplate',

  /**
   * ProductStackSnapshotTemplate
   */
  PRODUCT_STACK_SNAPSHOT = 'ProductStackSnapshotTemplate'
}

/**
 * A wrapper class containing useful metadata about the product version.
 */
export class ProductVersionDetails {
  /**
   * Id of a ProductStack
   */
  readonly productStackId?: string;

  /**
   * Directory to store snapshots
   */
  readonly directory?: string;

  /**
   * Unique id denoting the stack path of a product.
   */
  productPathUniqueId?: string;
}

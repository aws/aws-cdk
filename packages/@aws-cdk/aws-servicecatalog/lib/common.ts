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
   * Unique id denoting the stack path of a product.
   */
  public productPathUniqueId?: string;

  /**
   * Id of a ProductStack
   */
  public productStackId?: string;

  /**
   * Name of a productVersion
   */
  public productVersionName?: string;

  /**
   * Directory to store snapshots
   */
  public directory?: string;

  /**
   * Whether to overwrite existing version
   */
  public locked?: boolean;
}

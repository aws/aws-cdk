/**
 * Constant for the context directory to store retained ProductStack templates.
 */
export const PRODUCT_STACK_CONTEXT_DIRECTORY = 'product-stack-context';

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
 * Used to determine the source of a cloudFormationTemplate and apply logic accordingly
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
   * ProductStackContextTemplate
   */
  PRODUCT_STACK_CONTEXT = 'ProductStackContextTemplate'
}

/**
   * The strategy to use for a ProductStack deployment.
   * Determines how a productVersion is saved and deployed.
   */
export enum VersioningStrategy {
  /**
   * Default Strategy for ProductStack deployment.
   * This strategy will overwrite existing versions when deployed.
   */
  DEFAULT = 'Default',

  /**
   * Retain previously deployed ProductStacks in a local context directory.
   * This strategy will not overwrite existing versions when deployed.
   */
  RETAIN_PREVIOUS_VERSIONS = 'RetainPreviousVersions',
}

/**
 * A wrapper class containing useful metadata about the product version
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
   * Versioning strategy to use for a ProductStack deployment.
   */
  public versioningStrategy?: VersioningStrategy
}

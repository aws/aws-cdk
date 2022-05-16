import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { ProductVersionDetails, TemplateType, RetentionStrategy } from './common';
import { hashValues } from './private/util';
import { ProductStack } from './product-stack';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Represents the Product Provisioning Artifact Template.
 */
export abstract class CloudFormationTemplate {
  /**
   * Template from URL
   * @param url The url that points to the provisioning artifacts template
   */
  public static fromUrl(url: string): CloudFormationTemplate {
    return new CloudFormationUrlTemplate(url);
  }

  /**
   * Loads the provisioning artifacts template from a local disk path.
   *
   * @param path A file containing the provisioning artifacts
   */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): CloudFormationTemplate {
    return new CloudFormationAssetTemplate(path, options);
  }

  /**
   * Creates a product with the resources defined in the given product stack.
   */
  public static fromProductStack(productStack: ProductStack, retentionStrategy?: RetentionStrategy): CloudFormationTemplate {
    return new CloudFormationProductStackTemplate(productStack, retentionStrategy);
  }

  /**
   * Creates a product from a previously deployed productStack template.
   * The previous template must have been retained using RetentionStrategy.RETAIN
   */
  public static fromProductStackSnapshot(baseProductStackId: string): CloudFormationTemplate {
    return new CloudFormationProductStackContextTemplate(baseProductStackId);
  }

  /**
   * Called when the product is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: Construct): CloudFormationTemplateConfig;
}

/**
 * Result of binding `Template` into a `Product`.
 */
export interface CloudFormationTemplateConfig {
  /**
    * The http url of the template in S3.
    */
  readonly httpUrl: string;
  /**
   * Additional metadata about the product version.
   * @default - No additional details provided
   */
  readonly productVersionDetails?: ProductVersionDetails;
  /**
   * The type of the template source.
   */
  readonly templateType: TemplateType;
  /**
   * Versioning Strategy to use for deployment
   * @default DEFAULT
   */
  readonly retentionStrategy?: RetentionStrategy
}

/**
 * Template code from a Url.
 */
class CloudFormationUrlTemplate extends CloudFormationTemplate {
  constructor(private readonly url: string) {
    super();
  }

  public bind(_scope: Construct): CloudFormationTemplateConfig {
    return {
      httpUrl: this.url,
      templateType: TemplateType.URL,
    };
  }
}

/**
 * Template from a local file.
 */
class CloudFormationAssetTemplate extends CloudFormationTemplate {
  private asset?: s3_assets.Asset;

  /**
   * @param path The path to the asset file.
   */
  constructor(public readonly path: string, private readonly options: s3_assets.AssetOptions = { }) {
    super();
  }

  public bind(scope: Construct): CloudFormationTemplateConfig {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, `Template${hashValues(this.path)}`, {
        path: this.path,
        ...this.options,
      });
    }

    return {
      httpUrl: this.asset.httpUrl,
      templateType: TemplateType.ASSET,
    };
  }
}

/**
 * Template from a CDK defined product stack.
 */
class CloudFormationProductStackTemplate extends CloudFormationTemplate {
  /**
   * @param stack A service catalog product stack.
  */
  constructor(public readonly productStack: ProductStack, public readonly retentionStrategy?: RetentionStrategy) {
    super();
  }

  public bind(_scope: Construct): CloudFormationTemplateConfig {
    return {
      productVersionDetails: this.productStack._getProductVersionDetails(),
      httpUrl: this.productStack._getTemplateUrl(),
      templateType: TemplateType.PRODUCT_STACK,
      retentionStrategy: this.retentionStrategy,
    };
  }
}

/**
 * Template from a previously deployed product stack.
 */
class CloudFormationProductStackContextTemplate extends CloudFormationTemplate {
  private readonly productVersionDetails: ProductVersionDetails;
  /**
   * @param baseProductStackId The id of the product stack where the version was deployed from.
   */
  constructor(public readonly baseProductStackId: string) {
    super();
    this.productVersionDetails = new ProductVersionDetails();
    this.productVersionDetails.productStackId = this.baseProductStackId;
  }

  public bind(_scope: Construct): CloudFormationTemplateConfig {
    return {
      httpUrl: '',
      productVersionDetails: this.productVersionDetails,
      templateType: TemplateType.PRODUCT_STACK_CONTEXT,
    };
  }
}

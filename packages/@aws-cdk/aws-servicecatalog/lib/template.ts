import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';

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
    return new UrlTemplate(url);
  }

  /**
   * Loads the provisioning artifacts template from a local disk path.
   *
   * @param path A file containing the provisioning artifacts
   */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): CloudFormationTemplate {
    return new AssetTemplate(path, options);
  }

  /**
   * Called when the product is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: Construct): TemplateConfig;
}

/**
 * Result of binding `Template` into a `Product`.
 */
export interface TemplateConfig {
  /**
    * The http url of the template in S3.
    */
  readonly httpUrl: string;
}

/**
 * Template code from a Url.
 */
class UrlTemplate extends CloudFormationTemplate {
  constructor(private url: string) {
    super();
  }

  public bind(_scope: Construct): TemplateConfig {
    return {
      httpUrl: this.url,
    };
  }
}

/**
 * Template from a local file.
 */
class AssetTemplate extends CloudFormationTemplate {
  private asset?: s3_assets.Asset;

  /**
   * @param path The path to the asset file.
   */
  constructor(public readonly path: string, private readonly options: s3_assets.AssetOptions = { }) {
    super();
  }

  public bind(scope: Construct): TemplateConfig {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Template', {
        path: this.path,
        ...this.options,
      });
    } else if (cdk.Stack.of(this.asset) !== cdk.Stack.of(scope)) {
      throw new Error(`Template is already associated with another stack '${cdk.Stack.of(this.asset).stackName}'. ` +
        'Create a new Template instance for every stack.');
    }

    return {
      httpUrl: this.asset.httpUrl,
    };
  }
}

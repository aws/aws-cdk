import { IBucket } from '@aws-cdk/aws-s3';
import { ArnFormat, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CloudFormationTemplate } from './cloudformation-template';
import { MessageLanguage } from './common';
import { AssociationManager } from './private/association-manager';
import { InputValidator } from './private/validation';
import { CfnCloudFormationProduct } from './servicecatalog.generated';
import { TagOptions } from './tag-options';

/**
 * A Service Catalog product, currently only supports type CloudFormationProduct
 */
export interface IProduct extends IResource {
  /**
   * The ARN of the product.
   * @attribute
   */
  readonly productArn: string;

  /**
   * The id of the product
   * @attribute
   */
  readonly productId: string;

  /**
   * The asset buckets of a product created via product stack.
   * @attribute
   */
  readonly assetBuckets: IBucket[];

  /**
   * Associate Tag Options.
   * A TagOption is a key-value pair managed in AWS Service Catalog.
   * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
   */
  associateTagOptions(tagOptions: TagOptions): void;
}

abstract class ProductBase extends Resource implements IProduct {
  public abstract readonly productArn: string;
  public abstract readonly productId: string;
  public abstract readonly assetBuckets: IBucket[];

  public associateTagOptions(tagOptions: TagOptions) {
    AssociationManager.associateTagOptions(this, this.productId, tagOptions);
  }
}

/**
 * Properties of product version (also known as a provisioning artifact).
 */
export interface CloudFormationProductVersion {
  /**
   * The description of the product version
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * Whether the specified product template will be validated by CloudFormation.
   * If turned off, an invalid template configuration can be stored.
   * @default true
   */
  readonly validateTemplate?: boolean;

  /**
   * The S3 template that points to the provisioning version template
   */
  readonly cloudFormationTemplate: CloudFormationTemplate;

  /**
   * The name of the product version.
   * @default - No product version name provided
   */
  readonly productVersionName?: string;
}

/**
 * Properties for a Cloudformation Product
 */
export interface CloudFormationProductProps {
  /**
   * The owner of the product.
   */
  readonly owner: string;

  /**
   * The name of the product.
   */
  readonly productName: string;

  /**
   * The configuration of the product version.
   */
  readonly productVersions: CloudFormationProductVersion[];

  /**
   * The language code.
   * Controls language for logging and errors.
   *
   * @default - English
   */
  readonly messageLanguage?: MessageLanguage;

  /**
   * The description of the product.
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * The distributor of the product.
   * @default - No distributor provided
   */
  readonly distributor?: string;

  /**
   * Whether to give provisioning artifacts a new unique identifier when the product attributes or provisioning artifacts is updated
   * @default false
   */
  readonly replaceProductVersionIds?: boolean;

  /**
   * The support information about the product
   * @default - No support description provided
   */
  readonly supportDescription?: string;

  /**
   * The contact email for product support.
   * @default - No support email provided
   */
  readonly supportEmail?: string;

  /**
   * The contact URL for product support.
   * @default - No support URL provided
   */
  readonly supportUrl?: string;

  /**
   * TagOptions associated directly to a product.
   *
   * @default - No tagOptions provided
   */
  readonly tagOptions?: TagOptions;
}

/**
 * Abstract class for Service Catalog Product.
 */
export abstract class Product extends ProductBase {
  /**
   * Creates a Product construct that represents an external product.
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param productArn Product Arn
   */
  public static fromProductArn(scope: Construct, id: string, productArn: string): IProduct {
    const arn = Stack.of(scope).splitArn(productArn, ArnFormat.SLASH_RESOURCE_NAME);
    const productId = arn.resourceName;

    if (!productId) {
      throw new Error('Missing required Portfolio ID from Portfolio ARN: ' + productArn);
    }

    return new class extends ProductBase {
      public readonly productId = productId!;
      public readonly productArn = productArn;
      public readonly assetBuckets = [];
    }(scope, id);
  }
}

/**
 * A Service Catalog Cloudformation Product.
 */
export class CloudFormationProduct extends Product {
  public readonly productArn: string;
  public readonly productId: string;
  /**
   * The asset bucket of a product created via product stack.
   * @default - Empty - no assets are used in this product
   */
  public readonly assetBuckets = new Array<IBucket>();

  constructor(scope: Construct, id: string, props: CloudFormationProductProps) {
    super(scope, id);

    this.validateProductProps(props);

    const product = new CfnCloudFormationProduct(this, 'Resource', {
      acceptLanguage: props.messageLanguage,
      description: props.description,
      distributor: props.distributor,
      name: props.productName,
      owner: props.owner,
      provisioningArtifactParameters: this.renderProvisioningArtifacts(props),
      replaceProvisioningArtifacts: props.replaceProductVersionIds,
      supportDescription: props.supportDescription,
      supportEmail: props.supportEmail,
      supportUrl: props.supportUrl,
    });

    this.productId = product.ref;
    this.productArn = Stack.of(this).formatArn({
      service: 'catalog',
      resource: 'product',
      resourceName: product.ref,
    });

    if (props.tagOptions !== undefined) {
      this.associateTagOptions(props.tagOptions);
    }
  }

  private renderProvisioningArtifacts(
    props: CloudFormationProductProps): CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty[] {
    return props.productVersions.map(productVersion => {
      const template = productVersion.cloudFormationTemplate.bind(this);
      if (template.assetBucket) {
        this.assetBuckets.push(template.assetBucket);
      }
      InputValidator.validateUrl(this.node.path, 'provisioning template url', template.httpUrl);
      return {
        name: productVersion.productVersionName,
        description: productVersion.description,
        disableTemplateValidation: productVersion.validateTemplate === false ? true : false,
        info: {
          LoadTemplateFromURL: template.httpUrl,
        },
      };
    });
  };

  private validateProductProps(props: CloudFormationProductProps) {
    InputValidator.validateLength(this.node.path, 'product product name', 1, 100, props.productName);
    InputValidator.validateLength(this.node.path, 'product owner', 1, 8191, props.owner);
    InputValidator.validateLength(this.node.path, 'product description', 0, 8191, props.description);
    InputValidator.validateLength(this.node.path, 'product distributor', 0, 8191, props.distributor);
    InputValidator.validateEmail(this.node.path, 'support email', props.supportEmail);
    InputValidator.validateUrl(this.node.path, 'support url', props.supportUrl);
    InputValidator.validateLength(this.node.path, 'support description', 0, 8191, props.supportDescription);
    if (props.productVersions.length == 0) {
      throw new Error(`Invalid product versions for resource ${this.node.path}, must contain at least 1 product version`);
    }
    props.productVersions.forEach(productVersion => {
      InputValidator.validateLength(this.node.path, 'provisioning artifact name', 0, 100, productVersion.productVersionName);
      InputValidator.validateLength(this.node.path, 'provisioning artifact description', 0, 8191, productVersion.description);
    });
  }
}

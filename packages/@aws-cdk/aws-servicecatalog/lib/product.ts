import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceptLanguage } from './common';
import { InputValidator } from './private/validation';
import { CfnCloudFormationProduct } from './servicecatalog.generated';
import { CloudFormationTemplate } from './template';

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
}

abstract class ProductBase extends Resource implements IProduct {
  public abstract readonly productArn: string;
  public abstract readonly productId: string;
}

/**
 * Properties of product version (also known as a provisioning artifact).
 */
export interface ProductVersion {
  /**
   * The description of the product version
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * Whether the specified product template will be validated by CloudFormation. If turned off, an invalid template configuration can be stored.
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
  readonly name?: string;
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
  readonly productVersions: ProductVersion[];

  /**
   * The language code.
   * @default - No accept language provided
   */
  readonly acceptLanguage?: AcceptLanguage;

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
  readonly replaceProvisioningArtifacts?: boolean;

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
    const arn = Stack.of(scope).parseArn(productArn);
    const productId = arn.resourceName;

    if (!productId) {
      throw new Error('Missing required Portfolio ID from Portfolio ARN: ' + productArn);
    }

    class Import extends ProductBase {
      public readonly productId = productId!;
      public readonly productArn = productArn;
    }
    return new Import(scope, id);
  }
}

/**
 * A Service Catalog Cloudformation Product.
 */
export class CloudFormationProduct extends Product {
  public readonly productArn: string;
  public readonly productId: string;

  constructor(scope: Construct, id: string, props: CloudFormationProductProps) {
    super(scope, id);

    this.validateProductProps(props);

    const product = new CfnCloudFormationProduct(this, 'Resource', {
      acceptLanguage: props.acceptLanguage,
      description: props.description,
      distributor: props.distributor,
      name: props.productName,
      owner: props.owner,
      provisioningArtifactParameters: this.renderProvisioningArtifacts(props),
      replaceProvisioningArtifacts: props.replaceProvisioningArtifacts,
      supportDescription: props.supportDescription,
      supportEmail: props.supportEmail,
      supportUrl: props.supportUrl,
    });

    this.productArn = Stack.of(this).formatArn({
      service: 'catalog',
      resource: 'product',
      resourceName: product.ref,
    });

    this.productId = product.ref;
  }

  private renderProvisioningArtifacts(
    props: CloudFormationProductProps): CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty[] {
    return props.productVersions.map(productVersion => {
      const template = productVersion.cloudFormationTemplate.bind(this);
      InputValidator.validateUrl(this.node.path, 'provisioning template url', template.httpUrl);
      return {
        name: productVersion.name,
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
      throw new Error(`Invalid product versions for resource ${this.node.path}, must contain at least 1 product version, got ${props.productVersions.length}`);
    }
    props.productVersions.map(productVersion => {
      InputValidator.validateLength(this.node.path, 'provisioning artifact name', 0, 100, productVersion.name);
      InputValidator.validateLength(this.node.path, 'provisioning artifact description', 0, 8191, productVersion.description);
    });
  }
}

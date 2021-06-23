import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceptLanguage } from './common';
import { InputValidator } from './private/validation';
import { CfnCloudFormationProduct } from './servicecatalog.generated';
import { Template } from './template';

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

/**
 * A reference to a Service Catalog product.
 */
export interface ProductAttributes {
  /**
   * The ARN of the product.
   */
  readonly productArn: string;

  /**
   * The name of the product.
   */
  readonly productName: string;
}

abstract class ProductBase extends Resource implements IProduct {
  public abstract readonly productArn: string;
  public abstract readonly productId: string;
}

/**
 * Properties of provisioning artifacts
 */
export interface ProvisioningArtifactProperties {
  /**
   * The description of the provisioning artifact
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * Disable template validation.
   * @default True
   */
  readonly disableTemplateValidation?: boolean;

  /**
   * The S3 template that points to the provisioning artifacts template
   */
  readonly template: Template;

  /**
   * The name of the provisioning artifact.
   * @default - No provisioning artifact name provided
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
   * The configuration of the provisioning artifact (also known as a version).
   */
  readonly provisioningArtifacts: ProvisioningArtifactProperties[];

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
  readonly replaceProvisioningParameters?: boolean;

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
   * @param attrs Product import properties
   */
  public static fromProductArn(scope: Construct, id: string, attrs: ProductAttributes): IProduct {
    const parts = Stack.of(scope).parseArn(attrs.productArn);
    if (!parts.resourceName) {
      throw new Error(`Product arn ${attrs.productArn} missing Product ID during import from attributes`);
    }
    class Import extends ProductBase {
      public readonly productId = parts.resourceName!;
      public readonly productArn = attrs.productArn;
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
      provisioningArtifactParameters: this.generateProvisioningArtifactParameters(props),
      replaceProvisioningArtifacts: props.replaceProvisioningParameters,
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

  private generateProvisioningArtifactParameters(
    props: CloudFormationProductProps): CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty[] {
    return props.provisioningArtifacts.map(pa => {
      const template = pa.template.bind(this);
      InputValidator.validateUrl(this.node.path, 'provisioning template url', template.httpUrl);
      return {
        name: pa.name,
        description: pa.description,
        disableTemplateValidation: pa.disableTemplateValidation,
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
    InputValidator.validateLength(this.node.path, 'product distributer', 0, 8191, props.distributor);
    InputValidator.validateEmail(this.node.path, 'support email', props.supportEmail);
    InputValidator.validateUrl(this.node.path, 'support url', props.supportUrl);
    InputValidator.validateLength(this.node.path, 'support description', 0, 8191, props.supportDescription);
    props.provisioningArtifacts.map(pa => {
      InputValidator.validateLength(this.node.path, 'provisioning artifact name', 0, 100, pa.name);
      InputValidator.validateLength(this.node.path, 'provisioning artifact description', 0, 8191, pa.description);
    });
  }
}

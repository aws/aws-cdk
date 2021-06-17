import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceptLanguage } from './common';
import { InputValidator } from './private/validation';
import { CfnCloudFormationProduct } from './servicecatalog.generated';

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
   * The name of the product
   */
  readonly productName: string;
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
  public abstract readonly productName: string;
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
   * The S3 url that points to the provisioning artifacts template
   */
  readonly templateUrl: string;

  /**
   * The name of the provisioning artifact.
   * @default - No provisioning artifact name provided
   */
  readonly name?: string;
}

/**
 * Properties for a Cloudformation Product
 */
export interface ProductProps {
  /**
   * The name of the product.
   */
  readonly productName: string;

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
   * The owner of the product.
   */
  readonly owner: string;

  /**
   * The configuration of the provisioning artifact (also known as a version).
   */
  readonly provisioningArtifacts: ProvisioningArtifactProperties[];

  /**
   * ReplaceProvisioningArtifacts
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
 * A Service Catalog Cloudformation Product.
 * @resource AWS::ServiceCatalog::CloudFormationProduct
 */
export class Product extends ProductBase {
  /**
   * Creates a Product construct that represents an external product.
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs Product import properties
   */
  public static fromProductAttributes(scope: Construct, id: string, attrs: ProductAttributes): IProduct {
    const parts = Stack.of(scope).parseArn(attrs.productArn);
    function throwError(errorMessage: string): never {
      throw new Error(errorMessage);
    }
    class Import extends ProductBase {
      public readonly productId = parts.resourceName ?? throwError('Product arn missing Product ID during import from attributes');
      public readonly productArn = attrs.productArn;
      public readonly productName = attrs.productName;
    }
    return new Import(scope, id);
  }

  public readonly productArn: string;
  public readonly productName: string;
  public readonly productId: string;
  private readonly product: CfnCloudFormationProduct;

  constructor(scope: Construct, id: string, props: ProductProps) {
    super(scope, id, {});

    this.validateProductProps(props);

    this.product = new CfnCloudFormationProduct(this, 'Resource', {
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

    this.productArn = this.getResourceArnAttribute(this.product.ref, {
      service: 'catalog',
      resource: 'product',
      resourceName: this.product.ref,
    });

    this.productName = this.getResourceNameAttribute(props.productName);
    this.productId = this.getResourceNameAttribute(this.product.ref);
  }

  private generateProvisioningArtifactParameters(props: ProductProps): any[] {
    return props.provisioningArtifacts.map(pa => {
      return {
        name: pa.name,
        description: pa.description,
        disableTemplateValidation: pa.disableTemplateValidation,
        info: {
          LoadTemplateFromURL: pa.templateUrl,
        },
      };
    });
  };

  private validateProductProps(props: ProductProps) {
    InputValidator.validateLength(this.node.path, 'portfolio product name', 1, 100, props.productName);
    InputValidator.validateLength(this.node.path, 'portfolio owner', 1, 8191, props.owner);
    InputValidator.validateLength(this.node.path, 'portfolio description', 0, 8191, props.description);
    InputValidator.validateLength(this.node.path, 'portfolio distributer', 0, 8191, props.distributor);
    InputValidator.validateEmail(this.node.path, 'support email', props.supportEmail);
    InputValidator.validateUrl(this.node.path, 'support url', props.supportUrl);
    InputValidator.validateLength(this.node.path, 'support description', 0, 8191, props.supportDescription);
    props.provisioningArtifacts.map(pa => {
      InputValidator.validateLength(this.node.path, 'provisioning artifact name', 0, 100, pa.name);
      InputValidator.validateLength(this.node.path, 'provisioning artifact description', 0, 8191, pa.description);
      InputValidator.validateUrl(this.node.path, 'provisioning template url', pa.templateUrl);
    });
  }
}

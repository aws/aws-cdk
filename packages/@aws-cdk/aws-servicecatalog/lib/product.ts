import { IResource, Resource, Tag, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceptLanguage } from './common';
import { IPortfolio } from './portfolio';
import { AssociationManager } from './private/association-manager';
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
   * @attribute
   */
  readonly productName: string;

  /**
   * Add product to a portfolio
   */
  addToPortfolio(portfolio: IPortfolio): void;
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

/**
 * Represents a Service Catalog CloudFormation Product.
 */
abstract class ProductBase extends Resource implements IProduct {

  /**
   * The arn of the product
   */
  public abstract readonly productArn: string;

  /**
   * The logical id of the product
   */
  public abstract readonly productId: string;

  /**
   * The name of the product
   */
  public abstract readonly productName: string;

  /**
   * Add product to a portfolio
   */
  addToPortfolio(portfolio: IPortfolio) {
    AssociationManager.associateProductWithPortfolio(this, portfolio, this);
  }
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

  /**
   * One or more tags.
   * @default - No tags provided
   */
  readonly tags?: Tag[];
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
    super(scope, id, {
      physicalName: props.productName,
    },
    );

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
      tags: props.tags,
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
}

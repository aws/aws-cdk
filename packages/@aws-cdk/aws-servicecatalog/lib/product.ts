import * as assets from '@aws-cdk/aws-s3-assets';
import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Language } from './language';
import { IPortfolio } from './portfolio';
import { CfnCloudFormationProduct, CfnPortfolioProductAssociation } from './servicecatalog.generated';

/**
 * The interface that represents the product resource.
*/
export interface IProduct extends core.IResource {
  /**
   * The product arn.
   *
   * @attribute
   */
  readonly productArn: string;

  /**
   * The product identifier.
   *
   * @attribute
   */
  readonly productId: string;

  /**
   * Name of the provisioning artifact.
   *
   * @attribute ProvisioningArtifactNames
   */
  readonly provisioningArtifactName: string;

  /**
   * Id of the provisioning artifact.
   *
   * @attribute ProvisioningArtifactIds
   */
  readonly provisioningArtifactId: string;

  /**
   * The product name.
   *
   * @attribute
   */
  readonly productName: string;

  /**
   * Associates a product to a portfolio.
   *
   * @param portfolio Portfolio to associate the product with.
   * @returns boolean
   */
  associateToPortfolio(portfolio: IPortfolio): boolean
}

/**
 * Attributes that represent a Service Catalog Product.
 */
export interface ProductAttributes {
  /**
   * The arn of the product.
   *
   * Format: arn:<partition>:servicecatalog:<region>:<account-id>:product:<product-id>
   */
  readonly prouductArn: string;

  /**
   * The name of the product.
   */
  readonly productName: string;

  /**
   * The IDs of the provisioning artifacts.
   */
  readonly provisioningArtifactIds: string;

  /**
   * The names of the of the provisioning artifacts.
   */
  readonly provisioningArtifactNames: string;


}

/**
 * Properties for the Product
 */
export interface ProductProps {
  /**
   * Name of the product.
   */
  readonly productName: string

  /**
   * The description of the product.
   *
   * @default none
   */
  readonly description?: string;

  /**
   * The description of the product.
   *
   * @default false
   */
  readonly disableTemplateValidation?: boolean;

  /**
   * File path pointing to the template to use as the artifact.
   */
  readonly templatePath: string;

  /**
   * The owner of the product.
   */
  readonly owner: string;

  /**
   * The name of the provisioning artifact (for example, v1 v2beta). No spaces are allowed.
   *
   * @default none
   */
  readonly artifactName?: string;

  /**
   * The contact URL for product support.
   *
   * @default none
   */
  readonly supportUrl?: string;

  /**
   * The contact email for product support.
   *
   * @default none
   */
  readonly supportEmail?: string;

  /**
   * The support information about the product.
   *
   * @default none
   */
  readonly supportDescription?: string;

  /**
   * The distributor of the product.
   *
   * @default none
   */
  readonly distributor?: string;

  /**
   * The language code.
   *
   * @default en
   */
  readonly acceptLanguage?: Language;
}


abstract class ProductBase extends core.Resource implements IProduct {
  public abstract readonly productArn: string;
  public abstract readonly productId: string;
  public abstract readonly productName: string;
  public abstract readonly provisioningArtifactId: string;
  public abstract readonly provisioningArtifactName: string;

  public associateToPortfolio(portfolio: IPortfolio): boolean {
    new CfnPortfolioProductAssociation(this, 'associatePortfolio', { portfolioId: portfolio.portfolioId, productId: this.productId });
    return true;
  }
}

/**
 * Creates an AWS Service Catalog Product from a file path to a CloudFormation template.
 *
 * @resource AWS::ServiceCatalog::CloudFormationProduct
 */
export class Product extends ProductBase {
  /**
   * Reference an existing product, defined outside of the CDK code, by attributes.
   *
   * @param scope The parent construct
   * @param id The name of the product construct
   * @param attrs attrs of the product to import
   */
  public static fromProductAttributes(
    scope: constructs.Construct, id: string, attrs: ProductAttributes,
  ): IProduct {

    class Import extends ProductBase {
      public readonly productArn = attrs.prouductArn;
      public readonly productId = core.Stack.of(scope).parseArn(this.productArn).resourceName!;

      public readonly productName = attrs.productName;
      public readonly provisioningArtifactName = attrs.provisioningArtifactNames;
      public readonly provisioningArtifactId = attrs.provisioningArtifactIds;
    }
    return new Import(scope, id);
  }

  public readonly productArn: string;
  public readonly provisioningArtifactId: string;
  public readonly provisioningArtifactName: string;
  public readonly productId: string;
  public readonly productName: string;

  constructor(scope: constructs.Construct, id: string, props: ProductProps) {
    super(scope, id, { physicalName: props.productName });
    const asset = new assets.Asset(this, 'Asset', { path: props.templatePath });
    const provisioningArtifact = {
      description: props.description,
      disableTemplateValidation: props.disableTemplateValidation,
      name: props.artifactName,
      info: { LoadTemplateFromURL: asset.httpUrl },
    };
    const product = new CfnCloudFormationProduct(this, 'Resource', {
      name: props.productName,
      owner: props.owner,
      provisioningArtifactParameters: [provisioningArtifact],
      acceptLanguage: props.acceptLanguage,
      description: props.description,
      distributor: props.distributor,
      supportDescription: props.supportDescription,
      supportUrl: props.supportUrl,
      supportEmail: props.supportEmail,
    });

    this.provisioningArtifactId = product.attrProvisioningArtifactIds;
    this.provisioningArtifactName = product.attrProvisioningArtifactNames;
    this.productName = product.attrProductName;
    this.productArn = core.Stack.of(this).formatArn({ resource: 'product', service: 'catalog', resourceName: product.ref });
    this.productId = product.ref;
  }
}
import * as core from '@aws-cdk/core';
import { IProduct, Language, Product } from './product';

/**
 * Properties for CDKProduct.
 */
export interface CDKProductProps {
  /**
   * Name of the product.
   */
  readonly productName: string;

  /**
   * Name of the stack containing the Service Catalog stack.
   */
  readonly stackName: string;

  /**
   * The owner of the product.
   */
  readonly owner: string;

  /**
   * The description of the product.
   *
   * @default none
   */
  readonly description?: string;

  /**
   * The name of the provisioning artifact (for example, v1 v2beta). No spaces are allowed.
   *
   * @default none
   */
  readonly artifactName?: string;

  /**
   * The CDK app that this template is part of.
   */
  readonly app: core.App;

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

/**
 * Creates an AWS Service Catalog Product from a CDK Stack
 *
 * @resource AWS::ServiceCatalog::CloudFormationProduct
 */
export class CDKProduct extends Product implements IProduct {
  public readonly productName: string;
  constructor(scope: core.Construct, id: string, props: CDKProductProps) {
    const stackArtifact = props.app.synth().getStackByName(props.stackName);
    if (stackArtifact.assets.length !== 0) {
      throw new Error('CDKProduct - Stack cannot have assets');
    }

    super(scope, id, {
      productName: props.productName,
      templatePath: stackArtifact.templateFullPath,
      owner: props.owner,
      description: props.description,
      artifactName: props.artifactName,
      supportUrl: props.supportUrl,
      acceptLanguage: props.acceptLanguage,
      supportEmail: props.supportEmail,
      supportDescription: props.supportDescription,
    });
    this.productName = props.productName;
  }
}
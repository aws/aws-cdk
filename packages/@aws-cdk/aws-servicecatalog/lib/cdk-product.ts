import * as core from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as constructs from 'constructs';
import { Language } from './language';
import { IProduct, Product } from './product';

/**
 * Properties for CDKProduct.
 */
export interface CDKProductProps {
  /**
   * Name of the product.
   */
  readonly productName: string;

  /**
   * Stack containing the Service Catalog stack.
   */
  readonly stack: core.Stack;

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
  constructor(scope: constructs.Construct, id: string, props: CDKProductProps) {
    const builder = new cxapi.CloudAssemblyBuilder();
    props.stack.synthesizer.synthesize({ outdir: builder.outdir, assembly: builder });
    const asm = builder.buildAssembly();
    // Assets are not currently supported.
    // TODO: Add asset support. This can probably be done via the StackArtifact
    if (asm.getStackArtifact(props.stack.artifactId).assets.length !== 0) {
      throw new Error('CDKProduct - Stack cannot have assets');
    }

    super(scope, id, {
      productName: props.productName,
      templatePath: builder.outdir + '/' + props.stack.templateFile,
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
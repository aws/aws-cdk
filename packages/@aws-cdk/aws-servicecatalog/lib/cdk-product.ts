import * as core from '@aws-cdk/core';
import { Product } from './product';

/**
 * Properties for CDKProduct.
 */
export interface CDKProductProps {
  readonly productName: string;
  readonly stackName: string;
  readonly owner: string;
  readonly description?: string;
  readonly artifaceName?: string;
  readonly app: core.App;
}

export class CDKProduct extends Product {
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
      artifactName: props.artifaceName,
    });
    this.productName = props.productName;
  }
}
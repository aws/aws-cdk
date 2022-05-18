import { Construct } from 'constructs';
import { CloudFormationTemplate } from './cloudformation-template';
import { CloudFormationProductVersion } from './product';
import { ProductStack } from './product-stack';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for a ProductStackHistory.
 */
export interface ProductStackHistoryProps {
  /**
   * The base Product Stack.
   */
  readonly productStack: ProductStack;
  /**
   * The current version name of the ProductStack.
   */
  readonly currentVersionName: string;
  /**
   * If this is set to true, the ProductStack will not be overwritten if a snapshot is found for the currentVersionName.
   */
  readonly locked: boolean
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
   * The directory where template snapshots will be stored
   * @default - product-stack-snapshots
   */
  readonly directory?: string
}

/**
 * A Construct that contains a Service Catalog product stack with its previous deployments maintained.
 */
export class ProductStackHistory extends CoreConstruct {
  private readonly props: ProductStackHistoryProps
  constructor(scope: Construct, id: string, props: ProductStackHistoryProps) {
    super(scope, id);
    this.props = props;
  }

  /**
   * Retains product stack template as a snapshot when deployed and
   * retrieves a CloudFormationProductVersion for the current product version.
   */
  public currentVersion() : CloudFormationProductVersion {
    return {
      cloudFormationTemplate: CloudFormationTemplate.fromProductStackHistory(
        this.props.productStack, this.props.locked, this.props.directory),
      productVersionName: this.props.currentVersionName,
      description: this.props.description,
    };
  }

  /**
   * Retrieves a CloudFormationProductVersion from a previously deployed productVersionName.
   */
  public versionFromSnapshot(versionName: string) : CloudFormationProductVersion {
    return {
      cloudFormationTemplate: CloudFormationTemplate.fromProductStackSnapshot(
        this.props.productStack, this.props.directory),
      productVersionName: versionName,
      description: this.props.description,
    };
  }
}
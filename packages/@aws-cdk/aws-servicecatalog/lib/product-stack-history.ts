import * as fs from 'fs';
import * as path from 'path';
import { Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CloudFormationTemplate } from './cloudformation-template';
import { DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY } from './common';
import { CloudFormationProductVersion } from './product';
import { ProductStack } from './product-stack';

/**
 * Properties for a ProductStackHistory.
 */
export interface ProductStackHistoryProps {
  /**
   * The ProductStack whose history will be retained as a snapshot
   */
  readonly productStack: ProductStack;

  /**
   * The current version name of the ProductStack.
   */
  readonly currentVersionName: string;

  /**
   * If this is set to true, the ProductStack will not be overwritten if a snapshot is found for the currentVersionName.
   */
  readonly currentVersionLocked: boolean

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
   * @default 'product-stack-snapshots'
   */
  readonly directory?: string
}

/**
 * A Construct that contains a Service Catalog product stack with its previous deployments maintained.
 */
export class ProductStackHistory extends Construct {
  private readonly props: ProductStackHistoryProps
  constructor(scope: Construct, id: string, props: ProductStackHistoryProps) {
    super(scope, id);
    props.productStack._setParentProductStackHistory(this);
    this.props = props;
  }

  /**
   * Retains product stack template as a snapshot when deployed and
   * retrieves a CloudFormationProductVersion for the current product version.
   */
  public currentVersion() : CloudFormationProductVersion {
    return {
      cloudFormationTemplate: CloudFormationTemplate.fromProductStack(this.props.productStack),
      productVersionName: this.props.currentVersionName,
      description: this.props.description,
    };
  }

  /**
   * Retrieves a CloudFormationProductVersion from a previously deployed productVersionName.
   */
  public versionFromSnapshot(productVersionName: string) : CloudFormationProductVersion {
    const productStackSnapshotDirectory = this.props.directory || DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY;
    const templateFileKey = `${Names.uniqueId(this)}.${this.props.productStack.artifactId}.${productVersionName}.product.template.json`;
    const templateFilePath = path.join(productStackSnapshotDirectory, templateFileKey);
    if (!fs.existsSync(templateFilePath)) {
      throw new Error(`Template ${templateFileKey} cannot be found in ${productStackSnapshotDirectory}`);
    }
    return {
      cloudFormationTemplate: CloudFormationTemplate.fromAsset(templateFilePath),
      productVersionName: productVersionName,
      description: this.props.description,
    };
  }

  /**
   * Writes current template generated from Product Stack to a snapshot directory.
   *
   * @internal
   */
  public _writeTemplateToSnapshot(cfn: string) {
    const productStackSnapshotDirectory = this.props.directory || DEFAULT_PRODUCT_STACK_SNAPSHOT_DIRECTORY;
    if (!fs.existsSync(productStackSnapshotDirectory)) {
      fs.mkdirSync(productStackSnapshotDirectory);
    }
    const templateFileKey = `${Names.uniqueId(this)}.${this.props.productStack.artifactId}.${this.props.currentVersionName}.product.template.json`;
    const templateFilePath = path.join(productStackSnapshotDirectory, templateFileKey);
    if (fs.existsSync(templateFilePath)) {
      const previousCfn = fs.readFileSync(templateFilePath).toString();
      if (previousCfn !== cfn && this.props.currentVersionLocked) {
        throw new Error(`Template has changed for ProductStack Version ${this.props.currentVersionName}.
        ${this.props.currentVersionName} already exist in ${productStackSnapshotDirectory}.
        Since locked has been set to ${this.props.currentVersionLocked},
        Either update the currentVersionName to deploy a new version or deploy the existing ProductStack snapshot.
        If ${this.props.currentVersionName} was unintentionally synthesized and not deployed, 
        delete the corresponding version from ${productStackSnapshotDirectory} and redeploy.`);
      }
    }
    fs.writeFileSync(templateFilePath, cfn);
  }
}

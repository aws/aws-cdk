import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import { Action } from '../action';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Construction properties of the {@link ServiceCatalogDeployAction ServiceCatalog deploy CodePipeline Action}.
 *
 * **Note**: this API is still experimental, and may have breaking changes in the future!
 *
 * @experimental
 */
export interface ServiceCatalogDeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The path to the cloudformation artifact.
   */
  readonly templatePath: codepipeline.ArtifactPath;

  /**
   * The name of the version of the Service Catalog product to be deployed.
   */
  readonly productVersionName: string;

  /**
   * The optional description of this version of the Service Catalog product.
   * @default ''
   */
  readonly productVersionDescription?: string;

  /**
   * The identifier of the product in the Service Catalog. This product must already exist.
   */
  readonly productId: string;
}

/**
 * CodePipeline action to connect to an existing ServiceCatalog product.
 *
 * **Note**: this class is still experimental, and may have breaking changes in the future!
 *
 * @experimental
 */
export class ServiceCatalogDeployAction extends Action {
  private readonly templatePath: string;
  private readonly productVersionName: string;
  private readonly productVersionDescription?: string;
  private readonly productId: string;
  private readonly productType: string;

  constructor(props: ServiceCatalogDeployActionProps) {
    super({
      ...props,
      provider: 'ServiceCatalog',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [props.templatePath.artifact],
    });
    this.templatePath = props.templatePath.fileName;
    this.productVersionName = props.productVersionName;
    this.productVersionDescription = props.productVersionDescription;
    this.productId = props.productId;
    this.productType = 'CLOUD_FORMATION_TEMPLATE';
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {

    options.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSServiceCatalogAdminFullAccess'));

    // Attempt at least privilege; using this alone fails with "invalid template".
    // Should construct ARN: 'arn:aws:catalog:<region>:<accountID>:product/' + this.scProductId
    // options.role.addToPolicy(new PolicyStatement({
    //   resources: ['*'],
    //   actions: ['servicecatalog:UpdateProduct', 'servicecatalog:ListProvisioningArtifacts', 'servicecatalog:CreateProvisioningArtifact'],
    // }));

    // the Action's Role needs to read from the Bucket to get artifacts
    options.bucket.grantRead(options.role);

    return {
      configuration: {
        TemplateFilePath: this.templatePath,
        ProductVersionName: this.productVersionName,
        ProductVersionDescription: this.productVersionDescription,
        ProductType: this.productType,
        ProductId: this.productId,
      },
    };
  }
}

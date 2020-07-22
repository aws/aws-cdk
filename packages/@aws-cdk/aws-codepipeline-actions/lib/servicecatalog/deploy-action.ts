import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
import { Action } from '../action';

/** TODO:
 *  1.) Support cross account deployments
 *  2.) Fix least privilege
 *  3.) Handle CREATION of a new product
 *  4.) Handle MAINTENANCE of a provisioned product
 *  5.) Test/support product types beyond CLOUD_FORMATION_TEMPLATE
 *  6.) Valid test cases!
 */

/**
 * Construction properties of the {@link ServiceCatalogDeployAction ServiceCatalog server deploy CodePipeline Action}.
 */
export interface ServiceCatalogDeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The name of the template file found in the artifact to install as a new version of the Service Catalog Product
   */
  readonly templateFile: string;
  
  /**
   * The name of the VERSION of the Service Catalog product
   */
  readonly scProductVersionName: string;
  /**
   * The name of the PRODUCT TYPE of the Service Catalog product (this should probably be an ENUM, or implicit)
   * Valid types CLOUD_FORMATION_TEMPLATE
   * Possibly we can support MARKETPLACE in a future release.
   */
  readonly scProductType: string;
  /**
   * The DESCRIPTION of the VERSION of the Service Catalog product
   */
  readonly scProductVersionDescription: string;
  /**
   * The PRODUCT ID  of the Service Catalog product. This product must already exist.
   */
  readonly scProductId: string;
  /**
   * The ARTIFACT that contains the cloudformation template used to update the service catalog product.
   */
  readonly input: codepipeline.Artifact;
}

export class ServiceCatalogDeployAction extends Action {
  private readonly template: string;
  private readonly scProductVersionName: string;
  private readonly scProductVersionDescription: string;
  private readonly scProductId: string;
  private readonly scProductType: string;

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
      inputs: [props.input],
    });
    this.template = props.templateFile;
    this.scProductVersionName = props.scProductVersionName;
    this.scProductVersionDescription = props.scProductVersionDescription;
    this.scProductId = props.scProductId;
    this.scProductType = props.scProductType;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {

    options.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSServiceCatalogAdminFullAccess'));

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
        TemplateFilePath: this.template,
        ProductVersionName: this.scProductVersionName,
        ProductVersionDescription: this.scProductVersionDescription,
        ProductType: this.scProductType,
        ProductId: this.scProductId,
      },
    };
  }
}

import { Construct } from 'constructs';
import { InspectorScanActionBase, InspectorScanActionBaseProps } from './scan-action-base';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import * as iam from '../../../aws-iam';

/**
 * Construction properties of the `InspectorEcrImageScanAction`.
 */
export interface InspectorEcrImageScanActionProps extends InspectorScanActionBaseProps {
  /**
   * The Amazon ECR repository where the image is pushed.
   */
  readonly repository: ecr.IRepository;

  /**
   * The tag used for the image.
   *
   * @default 'latest'
   */
  readonly imageTag?: string;
}

/**
 * CodePipeline invoke action that uses AWS InspectorScan for ECR images.
 */
export class InspectorEcrImageScanAction extends InspectorScanActionBase {
  private readonly ecrProps: InspectorEcrImageScanActionProps;

  constructor(props: InspectorEcrImageScanActionProps) {
    super(props);
    this.ecrProps = props;
  }

  protected renderActionConfiguration(): Record<string, any> {
    return {
      InspectorRunMode: 'ECRImageScan',
      ECRRepositoryName: this.ecrProps.repository.repositoryName,
      ImageTag: this.ecrProps.imageTag,
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const config = super.bound(scope, stage, options);

    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-InspectorScan.html#edit-role-InspectorScan
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.ecrProps.repository.repositoryArn],
      actions: [
        'ecr:GetDownloadUrlForLayer',
        'ecr:BatchGetImage',
        'ecr:BatchCheckLayerAvailability',
      ],
    }));

    // This permission was not listed in the above reference, but without it,
    // an error would occur since `ecr get-login-password` is executed in the action.
    ecr.AuthorizationToken.grantRead(options.role);

    return config;
  }
}

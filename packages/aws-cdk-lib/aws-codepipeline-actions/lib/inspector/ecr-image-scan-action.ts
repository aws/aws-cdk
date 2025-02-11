import { Construct } from 'constructs';
import { BaseInspectorScanAction, BaseInspectorScanActionProps } from './base-scan-action';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import * as iam from '../../../aws-iam';

export interface EcrImageScanActionProps extends BaseInspectorScanActionProps {
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

export class EcrImageScanAction extends BaseInspectorScanAction {
  private readonly ecrProps: EcrImageScanActionProps;

  constructor(props: EcrImageScanActionProps) {
    super(props);
    this.ecrProps = props;
  }

  protected getActionConfiguration(): Record<string, any> {
    return {
      InspectorRunMode: 'ECRImageScan',
      ECRRepositoryName: this.ecrProps.repository.repositoryName,
      ImageTag: this.ecrProps.imageTag,
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const config = super.bound(scope, stage, options);

    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.ecrProps.repository.repositoryArn],
      actions: [
        'ecr:GetDownloadUrlForLayer',
        'ecr:BatchGetImage',
        'ecr:BatchCheckLayerAvailability',
      ],
    }));

    return config;
  }
}

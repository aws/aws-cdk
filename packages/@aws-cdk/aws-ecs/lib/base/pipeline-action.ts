import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import { Repository } from '@aws-cdk/aws-ecr';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import cdk = require('@aws-cdk/cdk');
import { BaseService } from './base-service';

/**
 * Common properties for the {@link PipelineSourceAction CodePipeline deploy Action},
 * whether creating it directly,
 * or through the {@link IRepository#toCodePipelineSourceAction} method.
 */
export interface PipelineDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * the input artifact contains the image definitions file which describes the ECR docker image(s) to deploy
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create.html#pipelines-create-image-definitions
   */
  inputArtifact: codepipeline.Artifact;

  /**
   * the filename of the image definitions file in the input artifact
   */
  fileName: string

  /**
   * the service to deploy inside the ECS cluster
   */
  service: BaseService

  /**
   * the repository where the docker image(s) are stored
   */
  repository: Repository
}

/**
 * CodePipelie Deploy Action to deploy the Service to ECS Cluster
 */
export class EcsDeployAction extends codepipeline.DeployAction {
  private readonly repository: Repository;

  constructor(props: PipelineDeployActionProps) {
    super({
      ...props,
      provider: 'ECS',
      artifactBounds: {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0,
      },
      configuration: {
        ClusterName: props.service.clusterName,
        ServiceName: props.service.serviceName,
        FileName: props.fileName
      },
    });

    this.repository = props.repository;
  }

  protected bind(stage: codepipeline.IStage, _scope: cdk.Construct): void {
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html
    this.repository.grantPull(stage.pipeline.role);

    stage.pipeline.role
      .addToPolicy(
        new PolicyStatement()
          .addAction(
            "ecs:*"
          )
          .addAllResources()
      );

  }
}
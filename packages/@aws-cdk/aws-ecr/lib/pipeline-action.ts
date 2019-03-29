import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import { IRepository } from './repository-ref';

/**
 * Common properties for the {@link PipelineSourceAction CodePipeline source Action},
 * whether creating it directly,
 * or through the {@link IRepository#toCodePipelineSourceAction} method.
 */
export interface CommonPipelineSourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The image tag that will be checked for changes.
   *
   * @default 'latest'
   */
  readonly imageTag?: string;

  /**
   * The name of the source's output artifact.
   * CfnOutput artifacts are used by CodePipeline as inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  readonly outputArtifactName?: string;
}

/**
 * Construction properties of {@link PipelineSourceAction}.
 */
export interface PipelineSourceActionProps extends CommonPipelineSourceActionProps {
  /**
   * The repository that will be watched for changes.
   */
  readonly repository: IRepository;
}

/**
 * The ECR Repository source CodePipeline Action.
 */
export class PipelineSourceAction extends codepipeline.SourceAction {
  private readonly props: PipelineSourceActionProps;

  constructor(props: PipelineSourceActionProps) {
    super({
      ...props,
      provider: 'ECR',
      configuration: {
        RepositoryName: props.repository.repositoryName,
        ImageTag: props.imageTag,
      },
      outputArtifactName: props.outputArtifactName || `Artifact_${props.actionName}_${props.repository.node.uniqueId}`,
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    info.role.addToPolicy(new iam.PolicyStatement()
      .addActions(
        'ecr:DescribeImages',
      )
      .addResource(this.props.repository.repositoryArn));

    this.props.repository.onImagePushed(info.pipeline.node.uniqueId + 'SourceEventRule',
        info.pipeline, this.props.imageTag);
  }
}

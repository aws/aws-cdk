import codepipeline = require('@aws-cdk/aws-codepipeline');
import ecr = require('@aws-cdk/aws-ecr');
import iam = require('@aws-cdk/aws-iam');

/**
 * Construction properties of {@link EcrSourceAction}.
 */
export interface EcrSourceActionProps extends codepipeline.CommonActionProps {
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

  /**
   * The repository that will be watched for changes.
   */
  readonly repository: ecr.IRepository;
}

/**
 * The ECR Repository source CodePipeline Action.
 */
export class EcrSourceAction extends codepipeline.SourceAction {
  private readonly props: EcrSourceActionProps;

  constructor(props: EcrSourceActionProps) {
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

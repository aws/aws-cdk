import codepipeline = require('@aws-cdk/aws-codepipeline');
import ecr = require('@aws-cdk/aws-ecr');
import iam = require('@aws-cdk/aws-iam');
import { sourceArtifactBounds } from '../common';

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
   *
   */
  readonly output: codepipeline.Artifact;

  /**
   * The repository that will be watched for changes.
   */
  readonly repository: ecr.IRepository;
}

/**
 * The ECR Repository source CodePipeline Action.
 */
export class EcrSourceAction extends codepipeline.Action {
  private readonly props: EcrSourceActionProps;

  constructor(props: EcrSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Source,
      provider: 'ECR',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
      configuration: {
        RepositoryName: props.repository.repositoryName,
        ImageTag: props.imageTag,
      },
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

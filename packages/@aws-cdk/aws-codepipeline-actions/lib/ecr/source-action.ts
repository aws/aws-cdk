import codepipeline = require('@aws-cdk/aws-codepipeline');
import ecr = require('@aws-cdk/aws-ecr');
import targets = require('@aws-cdk/aws-events-targets');
import iam = require('@aws-cdk/aws-iam');
import { Construct } from '@aws-cdk/core';
import { Action } from '../action';
import { sourceArtifactBounds } from '../common';

/**
 * Construction properties of {@link EcrSourceAction}.
 */
export interface EcrSourceActionProps extends codepipeline.CommonAwsActionProps {
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
 *
 * Will trigger the pipeline as soon as the target tag in the repository
 * changes, but only if there is a CloudTrail Trail in the account that
 * captures the ECR event.
 */
export class EcrSourceAction extends Action {
  private readonly props: EcrSourceActionProps;

  constructor(props: EcrSourceActionProps) {
    super({
      ...props,
      resource: props.repository,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'ECR',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
    });

    this.props = props;
  }

  protected bound(_scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['ecr:DescribeImages'],
      resources: [this.props.repository.repositoryArn]
    }));

    this.props.repository.onCloudTrailImagePushed(stage.pipeline.node.uniqueId + 'SourceEventRule', {
      target: new targets.CodePipeline(stage.pipeline),
      imageTag: this.props.imageTag
    });

    // the Action Role also needs to write to the Pipeline's bucket
    options.bucket.grantWrite(options.role);

    return {
      configuration: {
        RepositoryName: this.props.repository.repositoryName,
        ImageTag: this.props.imageTag,
      },
    };
  }
}

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import { Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
import { sourceArtifactBounds } from '../common';

/**
 * The CodePipeline variables emitted by the ECR source Action.
 */
export interface EcrSourceVariables {
  /** The identifier of the registry. In ECR, this is usually the ID of the AWS account owning it. */
  readonly registryId: string;

  /** The physical name of the repository that this action tracks. */
  readonly repositoryName: string;

  /** The digest of the current image, in the form '<digest type>:<digest value>'. */
  readonly imageDigest: string;

  /** The Docker tag of the current image. */
  readonly imageTag: string;

  /** The full ECR Docker URI of the current image. */
  readonly imageUri: string;
}

/**
 * Construction properties of {@link EcrSourceAction}.
 */
export interface EcrSourceActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The image tag that will be checked for changes.
   *
   * It is not possible to trigger on changes to more than one tag.
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

  /** The variables emitted by this action. */
  public get variables(): EcrSourceVariables {
    return {
      registryId: this.variableExpression('RegistryId'),
      repositoryName: this.variableExpression('RepositoryName'),
      imageDigest: this.variableExpression('ImageDigest'),
      imageTag: this.variableExpression('ImageTag'),
      imageUri: this.variableExpression('ImageURI'),
    };
  }

  protected bound(_scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['ecr:DescribeImages'],
      resources: [this.props.repository.repositoryArn],
    }));

    this.props.repository.onCloudTrailImagePushed(Names.nodeUniqueId(stage.pipeline.node) + 'SourceEventRule', {
      target: new targets.CodePipeline(stage.pipeline),
      imageTag: this.props.imageTag === '' ? undefined : (this.props.imageTag ?? 'latest'),
    });

    // the Action Role also needs to write to the Pipeline's bucket
    options.bucket.grantWrite(options.role);

    return {
      configuration: {
        RepositoryName: this.props.repository.repositoryName,
        ImageTag: this.props.imageTag ? this.props.imageTag : undefined, // `''` is falsy in JS/TS
      },
    };
  }
}

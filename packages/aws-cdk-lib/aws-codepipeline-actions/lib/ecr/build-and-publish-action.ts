import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { Action } from '../action';

/**
 * The CodePipeline variables emitted by the ECR build and publish Action.
 */
export interface EcrBuildAndPublishVariables {
  /**
   * The sha256 digest of the image manifest.
   */
  readonly ecrImageDigestId: string;

  /**
   * The name of the Amazon ECR repository where the image was pushed.
   */
  readonly ecrRepositoryName: string;
}

/**
 * The type of registry to use for the EcrBuildAndPublish action.
 */
export enum RegistryType {
  /**
   * Private registry
   */
  PRIVATE = 'private',
  /**
   * Public registry
   */
  PUBLIC = 'public',
}

/**
 * Construction properties of the `EcrBuildAndPublishAction`.
 */
export interface EcrBuildAndPublishActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The name of the ECR repository where the image is pushed.
   */
  readonly repositoryName: string;

  /**
   * The directory path of Dockerfile used to build the image.
   *
   * Optionally, you can provide an alternate directory path if Dockerfile is not at the root level.
   *
   * @default - the source repository root level
   */
  readonly dockerfileDirectoryPath?: string;

  /**
   * The tags used for the image.
   *
   * @default - latest
   */
  readonly imageTags?: string[];

  /**
   * Specifies whether the repository is public or private.
   *
   * @default - RegistryType.PRIVATE
   */
  readonly registryType?: RegistryType;

  /**
   * The artifact produced by the source action that contains the Dockerfile needed to build the image.
   */
  readonly input: codepipeline.Artifact;
}

/**
 * CodePipeline build action that uses AWS EcrBuildAndPublish.
 */
export class EcrBuildAndPublishAction extends Action {
  private readonly props: EcrBuildAndPublishActionProps;

  constructor(props: EcrBuildAndPublishActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'ECRBuildAndPublish',
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      inputs: [props.input],
    });

    this.props = props;
  }

  /** The variables emitted by this action. */
  public get variables(): EcrBuildAndPublishVariables {
    return {
      ecrImageDigestId: this.variableExpression('ECRImageDigestId'),
      ecrRepositoryName: this.variableExpression('ECRRepositoryName'),
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#edit-role-ECRBuildAndPublish
    if (this.props.registryType === RegistryType.PUBLIC) {
      // Public registry
      const repositoryArn = cdk.Stack.of(scope).formatArn({
        service: 'ecr-public',
        resource: 'repository',
        resourceName: this.props.repositoryName,
        region: '',
      });

      options.role.addToPrincipalPolicy(new iam.PolicyStatement({
        resources: [repositoryArn],
        actions: [
          'ecr-public:DescribeRepositories',
          'ecr-public:InitiateLayerUpload',
          'ecr-public:UploadLayerPart',
          'ecr-public:CompleteLayerUpload',
          'ecr-public:PutImage',
          'ecr-public:BatchCheckLayerAvailability',
        ],
      }));

      ecr.PublicGalleryAuthorizationToken.grantRead(options.role);
    } else {
      // Private registry
      const repositoryArn = cdk.Stack.of(scope).formatArn({
        service: 'ecr',
        resource: 'repository',
        resourceName: this.props.repositoryName,
        region: cdk.Stack.of(scope).region,
      });

      options.role.addToPrincipalPolicy(new iam.PolicyStatement({
        resources: [repositoryArn],
        actions: [
          'ecr:DescribeRepositories',
          'ecr:InitiateLayerUpload',
          'ecr:UploadLayerPart',
          'ecr:CompleteLayerUpload',
          'ecr:PutImage',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchCheckLayerAvailability',
        ],
      }));

      ecr.AuthorizationToken.grantRead(options.role);
    }

    const logGroupArn = cdk.Stack.of(scope).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `/aws/codepipeline/${stage.pipeline.pipelineName}`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
    const logGroupArnWithWildcard = `${logGroupArn}:*`;

    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArn, logGroupArnWithWildcard],
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    }));

    // allow the Role access to the Bucket, if there are any inputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }

    return {
      configuration: {
        ECRRepositoryName: this.props.repositoryName,
        DockerFilePath: this.props.dockerfileDirectoryPath,
        ImageTags: this.props.imageTags !== undefined ? this.props.imageTags.join(',') : undefined,
        RegistryType: this.props.registryType,
      },
    };
  }
}

import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { Action } from '../action';

/**
 * The CodePipeline variables emitted by the ECR build and publish Action.
 */
export interface ECRBuildAndPublishVariables {
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
 * The type of registry to use for the ECRBuildAndPublish action.
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
 * Construction properties of the `ECRBuildAndPublishAction`.
 */
export interface ECRBuildAndPublishActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The Amazon ECR repository where the image is pushed.
   */
  readonly repository: ecr.IRepository;

  /**
   * The location of the Docker file used to build the image.
   *
   * Optionally, you can provide an alternate docker file location if not at the root level.
   *
   * @default - the source repository root level
   */
  readonly dockerfilePath?: string;

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
 * CodePipeline build action that uses AWS ECRBuildAndPublish.
 */
export class ECRBuildAndPublishAction extends Action {
  private readonly props: ECRBuildAndPublishActionProps;

  constructor(props: ECRBuildAndPublishActionProps) {
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
  public get variables(): ECRBuildAndPublishVariables {
    return {
      ecrImageDigestId: this.variableExpression('ECRImageDigestId'),
      ecrRepositoryName: this.variableExpression('ECRRepositoryName'),
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html#how-to-custom-role
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'ecr:DescribeRepositories',
        'ecr:GetAuthorizationToken',
        'ecr-public:DescribeRepositories',
        'ecr-public:GetAuthorizationToken',
      ],
    }));

    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.props.repository.repositoryArn],
      actions: [
        'ecr:GetAuthorizationToken',
        'ecr:InitiateLayerUpload',
        'ecr:UploadLayerPart',
        'ecr:CompleteLayerUpload',
        'ecr:PutImage',
        'ecr:GetDownloadUrlForLayer',
        'ecr:BatchCheckLayerAvailability',
      ],
    }));

    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.props.repository.repositoryArn],
      actions: [
        'ecr-public:GetAuthorizationToken',
        'ecr-public:DescribeRepositories',
        'ecr-public:InitiateLayerUpload',
        'ecr-public:UploadLayerPart',
        'ecr-public:CompleteLayerUpload',
        'ecr-public:PutImage',
        'ecr-public:BatchCheckLayerAvailability',
        'sts:GetServiceBearerToken',
      ],
    }));

    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'sts:GetServiceBearerToken',
      ],
    }));

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

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }

    return {
      configuration: {
        ECRRepositoryName: this.props.repository.repositoryName,
        DockerFilePath: this.props.dockerfilePath,
        ImageTags: this.props.imageTags,
        RegistryType: this.props.registryType,
      },
    };
  }
}

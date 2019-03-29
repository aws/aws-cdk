import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { IBucket } from './bucket';

/**
 * Common properties for creating {@link PipelineSourceAction} -
 * either directly, through its constructor,
 * or through {@link IBucket#toCodePipelineSourceAction}.
 */
export interface CommonPipelineSourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the source's output artifact. CfnOutput artifacts are used by CodePipeline as
   * inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  readonly outputArtifactName?: string;

  /**
   * The key within the S3 bucket that stores the source code.
   *
   * @example 'path/to/file.zip'
   */
  readonly bucketKey: string;

  /**
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use CloudWatch Events to detect source changes instead.
   * Note that if this is `false`, you need to make sure to include the source Bucket in a CloudTrail Trail,
   * as otherwise the CloudWatch Events will not be emitted.
   *
   * @default true
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/log-s3-data-events.html
   */
  readonly pollForSourceChanges?: boolean;
}

/**
 * Construction properties of the {@link PipelineSourceAction S3 source Action}.
 */
export interface PipelineSourceActionProps extends CommonPipelineSourceActionProps {
  /**
   * The Amazon S3 bucket that stores the source code
   */
  readonly bucket: IBucket;
}

/**
 * Source that is provided by a specific Amazon S3 object.
 */
export class PipelineSourceAction extends codepipeline.SourceAction {
  private readonly props: PipelineSourceActionProps;

  constructor(props: PipelineSourceActionProps) {
    super({
      ...props,
      provider: 'S3',
      outputArtifactName: props.outputArtifactName || `Artifact_${props.actionName}_${props.bucket.node.uniqueId}`,
      configuration: {
        S3Bucket: props.bucket.bucketName,
        S3ObjectKey: props.bucketKey,
        PollForSourceChanges: props.pollForSourceChanges,
      },
    });

    this.props = props;
  }

  protected bind(stage: codepipeline.IStage, _scope: cdk.Construct): void {
    if (this.props.pollForSourceChanges === false) {
      this.props.bucket.onPutObject(stage.pipeline.node.uniqueId + 'SourceEventRule',
          stage.pipeline, this.props.bucketKey);
    }

    // pipeline needs permissions to read from the S3 bucket
    this.props.bucket.grantRead(stage.pipeline.role);
  }
}

/**
 * Common properties for creating {@link PipelineDeployAction} -
 * either directly, through its constructor,
 * or through {@link IBucket#toCodePipelineDeployAction}.
 */
export interface CommonPipelineDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * Should the deploy action extract the artifact before deploying to Amazon S3.
   *
   * @default true
   */
  readonly extract?: boolean;

  /**
   * The key of the target object. This is required if extract is false.
   */
  readonly objectKey?: string;

  /**
   * The inputArtifact to deploy to Amazon S3.
   */
  readonly inputArtifact: codepipeline.Artifact;
}

/**
 * Construction properties of the {@link PipelineDeployAction S3 deploy Action}.
 */
export interface PipelineDeployActionProps extends CommonPipelineDeployActionProps {
  /**
   * The Amazon S3 bucket that is the deploy target.
   */
  readonly bucket: IBucket;
}

/**
 * Deploys the sourceArtifact to Amazon S3.
 */
export class PipelineDeployAction extends codepipeline.DeployAction {
  private readonly bucket: IBucket;

  constructor(props: PipelineDeployActionProps) {
    super({
      ...props,
      provider: 'S3',
      artifactBounds: {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0,
      },
      configuration: {
        BucketName: props.bucket.bucketName,
        Extract: (props.extract === false) ? 'false' : 'true',
        ObjectKey: props.objectKey,
      },
    });

    this.bucket = props.bucket;
  }

  protected bind(stage: codepipeline.IStage, _scope: cdk.Construct): void {
    // pipeline needs permissions to write to the S3 bucket
    this.bucket.grantWrite(stage.pipeline.role);
  }
}

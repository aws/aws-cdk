import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');

/**
 * Construction properties of the {@link S3SourceAction S3 source Action}.
 */
export interface S3SourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the source's output artifact. Output artifacts are used by CodePipeline as
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

  /**
   * The Amazon S3 bucket that stores the source code
   */
  readonly bucket: s3.IBucket;
}

/**
 * Source that is provided by a specific Amazon S3 object.
 */
export class S3SourceAction extends codepipeline.SourceAction {
  private readonly props: S3SourceActionProps;

  constructor(props: S3SourceActionProps) {
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

  protected bind(info: codepipeline.ActionBind): void {
    if (this.props.pollForSourceChanges === false) {
      this.props.bucket.onPutObject(info.pipeline.node.uniqueId + 'SourceEventRule',
          info.pipeline, this.props.bucketKey);
    }

    // pipeline needs permissions to read from the S3 bucket
    this.props.bucket.grantRead(info.role);
  }
}

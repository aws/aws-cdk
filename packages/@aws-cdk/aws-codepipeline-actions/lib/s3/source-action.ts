import codepipeline = require('@aws-cdk/aws-codepipeline');
import targets = require('@aws-cdk/aws-events-targets');
import s3 = require('@aws-cdk/aws-s3');
import { sourceArtifactBounds } from '../common';

/**
 * Construction properties of the {@link S3SourceAction S3 source Action}.
 */
export interface S3SourceActionProps extends codepipeline.CommonActionProps {
  /**
   *
   */
  readonly output: codepipeline.Artifact;

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
export class S3SourceAction extends codepipeline.Action {
  private readonly props: S3SourceActionProps;

  constructor(props: S3SourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Source,
      provider: 'S3',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
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
          new targets.CodePipeline(info.pipeline), this.props.bucketKey);
    }

    // pipeline needs permissions to read from the S3 bucket
    this.props.bucket.grantRead(info.role);
  }
}

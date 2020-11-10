import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import { ISource } from './source';

/**
 * Construction properties of the {@link S3Source S3 source}.
 */
export interface S3SourceProps {

  /**
   * The key within the S3 bucket that stores the source code.
   *
   * @example 'path/to/file.zip'
   */
  readonly bucketKey: string;

  /**
   * How should CodePipeline detect source changes for this Action.
   * Note that if this is S3Trigger.EVENTS, you need to make sure to include the source Bucket in a CloudTrail Trail,
   * as otherwise the CloudWatch Events will not be emitted.
   *
   * @default S3Trigger.POLL
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/log-s3-data-events.html
   */
  readonly trigger?: codepipelineActions.S3Trigger;

  /**
   * The Amazon S3 bucket that stores the source code
   */
  readonly bucket: s3.IBucket;
}

/**
 * A CDK Pipeline source provider for S3.
 *
 * @experimental
 */
export class S3Source implements ISource {

  constructor(private readonly props: S3SourceProps) {
    //
  }

  public provideSourceAction(sourceArtifact: codepipeline.Artifact): codepipeline.IAction {
    return new codepipelineActions.S3SourceAction({
      actionName: `s3-${this.props.bucket.bucketName}`,
      output: sourceArtifact,
      bucket: this.props.bucket,
      bucketKey: this.props.bucketKey,
      trigger: this.props.trigger,
    });
  }
}

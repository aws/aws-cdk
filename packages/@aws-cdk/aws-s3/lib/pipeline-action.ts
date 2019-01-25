import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { IBucket } from './bucket';

/**
 * Common properties for creating {@link PipelineSourceAction} -
 * either directly, through its constructor,
 * or through {@link IBucket#addToPipeline}.
 */
export interface CommonPipelineSourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the source's output artifact. Output artifacts are used by CodePipeline as
   * inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  outputArtifactName?: string;

  /**
   * The key within the S3 bucket that stores the source code.
   *
   * @example 'path/to/file.zip'
   */
  bucketKey: string;

  /**
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use CloudWatch Events to detect source changes instead.
   * Note that if this is `false`, you need to make sure to include the source Bucket in a CloudTrail Trail,
   * as otherwise the CloudWatch Events will not be emitted.
   *
   * @default true
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/log-s3-data-events.html
   */
  pollForSourceChanges?: boolean;
}

/**
 * Construction properties of the {@link PipelineSourceAction S3 source Action}.
 */
export interface PipelineSourceActionProps extends CommonPipelineSourceActionProps,
    codepipeline.CommonActionConstructProps {
  /**
   * The Amazon S3 bucket that stores the source code
   */
  bucket: IBucket;
}

/**
 * Source that is provided by a specific Amazon S3 object.
 */
export class PipelineSourceAction extends codepipeline.SourceAction {
  constructor(scope: cdk.Construct, id: string, props: PipelineSourceActionProps) {
    super(scope, id, {
      provider: 'S3',
      configuration: {
        S3Bucket: props.bucket.bucketName,
        S3ObjectKey: props.bucketKey,
        PollForSourceChanges: props.pollForSourceChanges,
      },
      ...props,
    });

    if (props.pollForSourceChanges === false) {
      props.bucket.onPutObject(props.stage.pipeline.node.uniqueId + 'SourceEventRule',
          props.stage.pipeline, props.bucketKey);
    }

    // pipeline needs permissions to read from the S3 bucket
    props.bucket.grantRead(props.stage.pipeline.role);
  }
}

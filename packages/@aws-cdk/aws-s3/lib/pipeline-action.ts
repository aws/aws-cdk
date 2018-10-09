import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { BucketRef } from './bucket';

/**
 * Common properties for creating {@link PipelineSourceAction} -
 * either directly, through its constructor,
 * or through {@link BucketRef#addToPipeline}.
 */
export interface CommonPipelineSourceActionProps {
  /**
   * The name of the source's output artifact. Output artifacts are used by CodePipeline as
   * inputs into other actions.
   */
  artifactName: string;

  /**
   * The key within the S3 bucket that stores the source code.
   *
   * @example 'path/to/file.zip'
   */
  bucketKey: string;

  // TODO: use CloudWatch events instead
  /**
   * Whether or not AWS CodePipeline should poll for source changes
   *
   * @default true
   */
  pollForSourceChanges?: boolean;
}

/**
 * Construction properties of the {@link PipelineSourceAction S3 source Action}.
 */
export interface PipelineSourceActionProps extends CommonPipelineSourceActionProps, actions.CommonActionProps {
  /**
   * The Amazon S3 bucket that stores the source code
   */
  bucket: BucketRef;
}

/**
 * Source that is provided by a specific Amazon S3 object.
 */
export class PipelineSourceAction extends actions.SourceAction {
  constructor(parent: cdk.Construct, name: string, props: PipelineSourceActionProps) {
    super(parent, name, {
      stage: props.stage,
      provider: 'S3',
      configuration: {
        S3Bucket: props.bucket.bucketName,
        S3ObjectKey: props.bucketKey,
        PollForSourceChanges: props.pollForSourceChanges || true
      },
      artifactName: props.artifactName
    });

    // pipeline needs permissions to read from the S3 bucket
    props.bucket.grantRead(props.stage.pipelineRole);
  }
}

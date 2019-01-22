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

/**
 * Construction properties of the {@link PipelineDeployAction S3 deploy Action}.
 */
export interface PipelineDeployActionProps extends codepipeline.CommonActionProps,
  codepipeline.CommonActionConstructProps {
  /**
   * The Amazon S3 bucket that is the deploy target
   */
  bucket: IBucket;
  /**
   * Should the deploy action extract the artifact before deploying to Amazon S3. Defaults to true
   */
  extract?: boolean;
  /**
   * The key of the target object. This is required if extract is false.
   */
  objectKey?: string;
  /**
   * The inputArtifact to deploy to Amazon S3
   */
  inputArtifact: codepipeline.Artifact;
}

/**
 * Deploys the sourceArtifact to Amazon S3.
 */
export class PipelineDeployAction extends codepipeline.DeployAction {
  constructor(scope: cdk.Construct, id: string, props: PipelineDeployActionProps) {
    super(scope, id, {
      stage: props.stage,
      runOrder: props.runOrder,
      owner: 'AWS',
      provider: 'S3',
      inputArtifact: props.inputArtifact,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0,
      },
      configuration: {
        BucketName: props.bucket.bucketName,
        Extract: props.extract || 'true',
        ObjectKey: props.objectKey,
      },
    });
    // pipeline needs permissions to write to the S3 bucket
    props.bucket.grantWrite(props.stage.pipeline.role);
  }
}

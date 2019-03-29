import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');

/**
 * Construction properties of the {@link S3DeployAction S3 deploy Action}.
 */
export interface S3DeployActionProps extends codepipeline.CommonActionProps {
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

  /**
   * The Amazon S3 bucket that is the deploy target.
   */
  readonly bucket: s3.IBucket;
}

/**
 * Deploys the sourceArtifact to Amazon S3.
 */
export class S3DeployAction extends codepipeline.DeployAction {
  private readonly bucket: s3.IBucket;

  constructor(props: S3DeployActionProps) {
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

  protected bind(info: codepipeline.ActionBind): void {
    // pipeline needs permissions to write to the S3 bucket
    this.bucket.grantWrite(info.role);
  }
}

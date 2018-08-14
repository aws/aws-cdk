import actions = require('@aws-cdk/aws-codepipeline-api');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties of the {@link AmazonS3Source S3 source action}.
 */
export interface AmazonS3SourceProps extends actions.CommonActionProps {
    /**
     * The name of the source's output artifact. Output artifacts are used by CodePipeline as
     * inputs into other actions.
     */
    artifactName: string;

    /**
     * The Amazon S3 bucket that stores the source code
     */
    bucket: s3.BucketRef;

    /**
     * The key within the S3 bucket that stores the source code
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
 * Source that is provided by a specific Amazon S3 object.
 */
export class AmazonS3Source extends actions.SourceAction {
    constructor(parent: cdk.Construct, name: string, props: AmazonS3SourceProps) {
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

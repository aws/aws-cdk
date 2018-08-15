import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { BucketRef } from './bucket';

/**
 * Construction properties of the {@link PipelineSource S3 source Action}.
 */
export interface PipelineSourceProps extends actions.CommonActionProps {
    /**
     * The name of the source's output artifact. Output artifacts are used by CodePipeline as
     * inputs into other actions.
     */
    artifactName: string;

    /**
     * The Amazon S3 bucket that stores the source code
     */
    bucket: BucketRef;

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
export class PipelineSource extends actions.SourceAction {
    constructor(parent: cdk.Construct, name: string, props: PipelineSourceProps) {
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

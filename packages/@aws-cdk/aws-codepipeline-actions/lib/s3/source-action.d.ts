import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * How should the S3 Action detect changes.
 * This is the type of the `S3SourceAction.trigger` property.
 */
export declare enum S3Trigger {
    /**
     * The Action will never detect changes -
     * the Pipeline it's part of will only begin a run when explicitly started.
     */
    NONE = "None",
    /**
     * CodePipeline will poll S3 to detect changes.
     * This is the default method of detecting changes.
     */
    POLL = "Poll",
    /**
     * CodePipeline will use CloudWatch Events to be notified of changes.
     * Note that the Bucket that the Action uses needs to be part of a CloudTrail Trail
     * for the events to be delivered.
     */
    EVENTS = "Events"
}
/**
 * The CodePipeline variables emitted by the S3 source Action.
 */
export interface S3SourceVariables {
    /** The identifier of the S3 version of the object that triggered the build. */
    readonly versionId: string;
    /** The e-tag of the S3 version of the object that triggered the build. */
    readonly eTag: string;
}
/**
 * Construction properties of the `S3SourceAction S3 source Action`.
 */
export interface S3SourceActionProps extends codepipeline.CommonAwsActionProps {
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
     * How should CodePipeline detect source changes for this Action.
     * Note that if this is S3Trigger.EVENTS, you need to make sure to include the source Bucket in a CloudTrail Trail,
     * as otherwise the CloudWatch Events will not be emitted.
     *
     * @default S3Trigger.POLL
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/log-s3-data-events.html
     */
    readonly trigger?: S3Trigger;
    /**
     * The Amazon S3 bucket that stores the source code.
     *
     * If you import an encrypted bucket in your stack, please specify
     * the encryption key at import time by using `Bucket.fromBucketAttributes()` method.
     */
    readonly bucket: s3.IBucket;
}
/**
 * Source that is provided by a specific Amazon S3 object.
 *
 * Will trigger the pipeline as soon as the S3 object changes, but only if there is
 * a CloudTrail Trail in the account that captures the S3 event.
 */
export declare class S3SourceAction extends Action {
    private readonly props;
    constructor(props: S3SourceActionProps);
    /** The variables emitted by this action. */
    get variables(): S3SourceVariables;
    protected bound(_scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
    private generateEventId;
}

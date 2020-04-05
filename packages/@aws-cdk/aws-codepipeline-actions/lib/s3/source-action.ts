import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as targets from '@aws-cdk/aws-events-targets';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
import { Action } from '../action';
import { sourceArtifactBounds } from '../common';

/**
 * How should the S3 Action detect changes.
 * This is the type of the {@link S3SourceAction.trigger} property.
 */
export enum S3Trigger {
  /**
   * The Action will never detect changes -
   * the Pipeline it's part of will only begin a run when explicitly started.
   */
  NONE = 'None',

  /**
   * CodePipeline will poll S3 to detect changes.
   * This is the default method of detecting changes.
   */
  POLL = 'Poll',

  /**
   * CodePipeline will use CloudWatch Events to be notified of changes.
   * Note that the Bucket that the Action uses needs to be part of a CloudTrail Trail
   * for the events to be delivered.
   */
  EVENTS = 'Events',
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
 * Construction properties of the {@link S3SourceAction S3 source Action}.
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
   * The Amazon S3 bucket that stores the source code
   */
  readonly bucket: s3.IBucket;
}

/**
 * Source that is provided by a specific Amazon S3 object.
 *
 * Will trigger the pipeline as soon as the S3 object changes, but only if there is
 * a CloudTrail Trail in the account that captures the S3 event.
 */
export class S3SourceAction extends Action {
  private readonly props: S3SourceActionProps;

  constructor(props: S3SourceActionProps) {
    super({
      ...props,
      resource: props.bucket,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'S3',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
    });

    if (props.bucketKey.length === 0) {
      throw new Error('Property bucketKey cannot be an empty string');
    }

    this.props = props;
  }

  /** The variables emitted by this action. */
  public get variables(): S3SourceVariables {
    return  {
      versionId: this.variableExpression('VersionId'),
      eTag: this.variableExpression('ETag'),
    };
  }

  protected bound(_scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    if (this.props.trigger === S3Trigger.EVENTS) {
      const id = stage.pipeline.node.uniqueId + 'SourceEventRule' + this.props.bucketKey;
      if (this.props.bucket.node.tryFindChild(id)) {
        // this means a duplicate path for the same bucket - error out
        throw new Error(`S3 source action with path '${this.props.bucketKey}' is already present in the pipeline for this source bucket`);
      }
      this.props.bucket.onCloudTrailWriteObject(id, {
        target: new targets.CodePipeline(stage.pipeline),
        paths: [this.props.bucketKey]
      });
    }

    // we need to read from the source bucket...
    this.props.bucket.grantRead(options.role);

    // ...and write to the Pipeline bucket
    options.bucket.grantWrite(options.role);

    return {
      configuration: {
        S3Bucket: this.props.bucket.bucketName,
        S3ObjectKey: this.props.bucketKey,
        PollForSourceChanges: this.props.trigger && this.props.trigger === S3Trigger.POLL,
      },
    };
  }
}

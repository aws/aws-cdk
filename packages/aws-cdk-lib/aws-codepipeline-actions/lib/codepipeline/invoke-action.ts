import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import { Stack } from '../../../core';
import { Action } from '../action';

/**
 * Construction properties of the `PipelineInvokeAction`.
 */
export interface PipelineInvokeActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The pipeline that will, upon running, start the current target pipeline.
   * You must have already created the invoking pipeline.
   */
  readonly targetPipeline: codepipeline.IPipeline;

  /**
   * The source revisions that you want the target pipeline to use when it is started by the invoking pipeline.
   * @default - no specific revisions
   */
  readonly sourceRevisions?: SourceRevision[];

  /**
   * The names and values of variables that you want the action to support.
   * @default - no specific variable
   */
  readonly variables?: Variable[];
}

/**
 * A list that allows you to specify, or override, the source revision for a pipeline execution that's being started.
 */
export interface SourceRevision {
  /**
   * The name of the action where the override will be applied.
   */
  readonly actionName: string;

  /**
   * The type of source revision, based on the source provider.
   */
  readonly revisionType: RevisionType;

  /**
   * The source revision, or version of your source artifact,
   * with the changes that you want to run in the pipeline execution.
   */
  readonly revisionValue: string;
}

/**
 * A pipeline-level variable used for a pipeline execution.
 */
export interface Variable {
  /**
   * The name of a pipeline-level variable.
   */
  readonly name: string;

  /**
   * The value of a pipeline-level variable.
   */
  readonly value: string;
}

/**
 * The types of revision for a pipeline execution.
 */
export enum RevisionType {
  /**
   * The revision type is a commit id.
   */
  COMMIT_ID = 'COMMIT_ID',
  /**
   * The revision type is an image digest.
   */
  IMAGE_DIGEST = 'IMAGE_DIGEST',
  /**
   * The revision type is an s3 object version id.
   */
  S3_OBJECT_VERSION_ID = 'S3_OBJECT_VERSION_ID',
  /**
   * The revision type is an s3 object version key.
   */
  S3_OBJECT_KEY = 'S3_OBJECT_KEY',
}

/**
 * CodePipeline action to invoke a pipeline.
 */
export class PipelineInvokeAction extends Action {
  private readonly props: PipelineInvokeActionProps;

  constructor(props: PipelineInvokeActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.INVOKE,
      provider: 'CodePipeline',
      artifactBounds: {
        minInputs: 0,
        maxInputs: 0,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [],
      outputs: [],
    });

    this.props = props;
  }

  protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['codepipeline:StartPipelineExecution'],
      resources: [this.props.targetPipeline.pipelineArn],
    }));

    return {
      configuration: {
        PipelineName: this.props.targetPipeline.pipelineName,
        SourceRevisions: Stack.of(scope).toJsonString(this.props.sourceRevisions),
        Variables: Stack.of(scope).toJsonString(this.props.variables),
      },
    };
  }
}

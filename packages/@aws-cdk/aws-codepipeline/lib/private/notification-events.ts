/**
 * The list of event types for AWS Codepipeline
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline
 */
export enum PipelineEvent {
  /**
   * Trigger notification when pipeline action execution succeeded
   */
  ACTION_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-action-execution-succeeded',

  /**
   * Trigger notification when pipeline action execution failed
   */
  ACTION_EXECUTION_FAILED = 'codepipeline-pipeline-action-execution-failed',

  /**
   * Trigger notification when pipeline action execution canceled
   */
  ACTION_EXECUTION_CANCELED = 'codepipeline-pipeline-action-execution-canceled',

  /**
   * Trigger notification when pipeline action execution started
   */
  ACTION_EXECUTION_STARTED = 'codepipeline-pipeline-action-execution-started',

  /**
   * Trigger notification when pipeline stage execution started
   */
  STAGE_EXECUTION_STARTED = 'codepipeline-pipeline-stage-execution-started',

  /**
   * Trigger notification when pipeline stage execution succeeded
   */
  STAGE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-stage-execution-succeeded',

  /**
   * Trigger notification when pipeline stage execution resumed
   */
  STAGE_EXECUTION_RESUMED = 'codepipeline-pipeline-stage-execution-resumed',

  /**
   * Trigger notification when pipeline stage execution canceled
   */
  STAGE_EXECUTION_CANCELED = 'codepipeline-pipeline-stage-execution-canceled',

  /**
   * Trigger notification when pipeline stage execution failed
   */
  STAGE_EXECUTION_FAILED = 'codepipeline-pipeline-stage-execution-failed',

  /**
   * Trigger notification when pipeline execution failed
   */
  PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed',

  /**
   * Trigger notification when pipeline execution canceled
   */
  PIPELINE_EXECUTION_CANCELED = 'codepipeline-pipeline-pipeline-execution-canceled',

  /**
   * Trigger notification when pipeline execution started
   */
  PIPELINE_EXECUTION_STARTED = 'codepipeline-pipeline-pipeline-execution-started',

  /**
   * Trigger notification when pipeline execution resumed
   */
  PIPELINE_EXECUTION_RESUMED = 'codepipeline-pipeline-pipeline-execution-resumed',

  /**
   * Trigger notification when pipeline execution succeeded
   */
  PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded',

  /**
   * Trigger notification when pipeline execution superseded
   */
  PIPELINE_EXECUTION_SUPERSEDED = 'codepipeline-pipeline-pipeline-execution-superseded',

  /**
   * Trigger notification when pipeline manual approval failed
   */
  MANUAL_APPROVAL_FAILED = 'codepipeline-pipeline-manual-approval-failed',

  /**
   * Trigger notification when pipeline manual approval needed
   */
  MANUAL_APPROVAL_NEEDED = 'codepipeline-pipeline-manual-approval-needed',

  /**
   * Trigger notification when pipeline manual approval succeeded
   */
  MANUAL_APPROVAL_SUCCEEDED = 'codepipeline-pipeline-manual-approval-succeeded',
}
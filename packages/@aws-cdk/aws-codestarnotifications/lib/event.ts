/**
 * The list of event types for AWS Codebuild and AWS CodePipeline
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline
 */
export enum Event {

  /**
   * Trigger notification when project build state failed
   */
  PROJECT_BUILD_STATE_FAILED = 'codebuild-project-build-state-failed',

  /**
   * Trigger notification when project build state succeeded
   */
  PROJECT_BUILD_STATE_SUCCEEDED = 'codebuild-project-build-state-succeeded',

  /**
   * Trigger notification when project build state in progress
   */
  PROJECT_BUILD_STATE_IN_PROGRESS = 'codebuild-project-build-state-in-progress',

  /**
   * Trigger notification when project build state stopped
   */
  PROJECT_BUILD_STATE_STOPPED = 'codebuild-project-build-state-stopped',

  /**
   * Trigger notification when project build phase failure
   */
  PROJECT_BUILD_PHASE_FAILRE = 'codebuild-project-build-phase-failure',

  /**
   * Trigger notification when project build phase success
   */
  PROJECT_BUILD_PHASE_SUCCESS = 'codebuild-project-build-phase-success',

  /**
   * Trigger notification when pipeline action execution succeeded
   */
  PIPELINE_ACTION_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-action-execution-succeeded',

  /**
   * Trigger notification when pipeline action execution failed
   */
  PIPELINE_ACTION_EXECUTION_FAILED = 'codepipeline-pipeline-action-execution-failed',

  /**
   * Trigger notification when pipeline action execution canceled
   */
  PIPELINE_ACTION_EXECUTION_CANCELED = 'codepipeline-pipeline-action-execution-canceled',

  /**
   * Trigger notification when pipeline action execution started
   */
  PIPELINE_ACTION_EXECUTION_STARTED = 'codepipeline-pipeline-action-execution-started',

  /**
   * Trigger notification when pipeline stage execution started
   */
  PIPELINE_STAGE_EXECUTION_STARTED = 'codepipeline-pipeline-stage-execution-started',

  /**
   * Trigger notification when pipeline stage execution succeeded
   */
  PIPELINE_STAGE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-stage-execution-succeeded',

  /**
   * Trigger notification when pipeline stage execution resumed
   */
  PIPELINE_STAGE_EXECUTION_RESUMED = 'codepipeline-pipeline-stage-execution-resumed',

  /**
   * Trigger notification when pipeline stage execution canceled
   */
  PIPELINE_STAGE_EXECUTION_CANCELED = 'codepipeline-pipeline-stage-execution-canceled',

  /**
   * Trigger notification when pipeline stage execution failed
   */
  PIPELINE_STAGE_EXECUTION_FAILED = 'codepipeline-pipeline-stage-execution-failed',

  /**
   * Trigger notification when pipeline execution failed
   */
  PIPELINE_PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed',

  /**
   * Trigger notification when pipeline execution canceled
   */
  PIPELINE_PIPELINE_EXECUTION_CANCELED = 'codepipeline-pipeline-pipeline-execution-canceled',

  /**
   * Trigger notification when pipeline execution started
   */
  PIPELINE_PIPELINE_EXECUTION_STARTED = 'codepipeline-pipeline-pipeline-execution-started',

  /**
   * Trigger notification when pipeline execution resumed
   */
  PIPELINE_PIPELINE_EXECUTION_RESUMED = 'codepipeline-pipeline-pipeline-execution-resumed',

  /**
   * Trigger notification when pipeline execution succeeded
   */
  PIPELINE_PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded',

  /**
   * Trigger notification when pipeline execution superseded
   */
  PIPELINE_PIPELINE_EXECUTION_SUPERSEDED = 'codepipeline-pipeline-pipeline-execution-superseded',

  /**
   * Trigger notification when pipeline manual approval failed
   */
  PIPELINE_MANUAL_APPROVAL_FAILED = 'codepipeline-pipeline-manual-approval-failed',

  /**
   * Trigger notification when pipeline manual approval needed
   */
  PIPELINE_MANUAL_APPROVAL_NEEDED = 'codepipeline-pipeline-manual-approval-needed',

  /**
   * Trigger notification when pipeline manual approval succeeded
   */
  PIPELINE_MANUAL_APPROVAL_SUCCEEDED = 'codepipeline-pipeline-manual-approval-succeeded',
}
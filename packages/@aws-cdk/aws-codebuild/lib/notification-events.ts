/**
 * The list of event types for AWS Codebuild
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
 */
export enum ProjectEvent {
  /**
   * Trigger notification when project build state failed
   */
  BUILD_STATE_FAILED = 'codebuild-project-build-state-failed',

  /**
   * Trigger notification when project build state succeeded
   */
  BUILD_STATE_SUCCEEDED = 'codebuild-project-build-state-succeeded',

  /**
   * Trigger notification when project build state in progress
   */
  BUILD_STATE_IN_PROGRESS = 'codebuild-project-build-state-in-progress',

  /**
   * Trigger notification when project build state stopped
   */
  BUILD_STATE_STOPPED = 'codebuild-project-build-state-stopped',

  /**
   * Trigger notification when project build phase failure
   */
  BUILD_PHASE_FAILRE = 'codebuild-project-build-phase-failure',

  /**
   * Trigger notification when project build phase success
   */
  BUILD_PHASE_SUCCESS = 'codebuild-project-build-phase-success',
}
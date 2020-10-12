
/**
 * The list of event types for AWS Codecommit
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-repositories
 */
export enum RepositoryEvent {

  /**
   * Trigger notification when repository comments on commits
   */
  COMMENTS_ON_COMMITS = 'codecommit-repository-comments-on-commits',

  /**
   * Trigger notification when repository comments on pull requests
   */
  COMMENTS_ON_PULL_REQUEST = 'codecommit-repository-comments-on-pull-requests',

  /**
   * Trigger notification when repository approvals status changed
   */
  APPROVAL_STATUS_CHANGED = 'codecommit-repository-approvals-status-changed',

  /**
   * Trigger notification when repository approvals rule override
   */
  APPROVAL_RULE_OVERRIDE = 'codecommit-repository-approvals-rule-override',

  /**
   * Trigger notification when repository pull request created
   */
  PULL_REQUEST_CREATED = 'codecommit-repository-pull-request-created',

  /**
   * Trigger notification when repository pull request source updated
   */
  PULL_REQUEST_SOURCE_UPDATED = 'codecommit-repository-pull-request-source-updated',

  /**
   * Trigger notification when repository pull request status changed
   */
  PULL_REQUEST_STATUS_CHANGED = 'codecommit-repository-pull-request-status-changed',

  /**
   * Trigger notification when repository pull request merged
   */
  PULL_REQUEST_MERGED = 'codecommit-repository-pull-request-merged',

  /**
   * Trigger notification when repository branches and tags created
   */
  BRANCHES_AND_TAGS_CREATED = 'codecommit-repository-branches-and-tags-created',

  /**
   * Trigger notification when repository branches and tags deleted
   */
  BRANCHES_AND_TAGS_DELETED = 'codecommit-repository-branches-and-tags-deleted',

  /**
   * Trigger notification when repository branches and tags updated
   */
  BRANCHES_AND_TAGS_UPDATED = 'codecommit-repository-branches-and-tags-updated',
}

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

/**
 * The list of event types for AWS Codedeploy
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-deployapplication
 */
export enum ApplicationEvent {

  /**
   * Trigger notification when application deployment failed
   */
  DEPLOYMENT_FAILED = 'codedeploy-application-deployment-failed',

  /**
   * Trigger notification when application deployment succeeded
   */
  DEPLOYMENT_SUCCEEDED = 'codedeploy-application-deployment-succeeded',

  /**
   * Trigger notification when application deployment started
   */
  DEPLOYMENT_STARTED = 'codedeploy-application-deployment-started',
}

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

// export type Events = RepositoryEvent | ProjectEvent | PipelineEvent | ApplicationEvent;
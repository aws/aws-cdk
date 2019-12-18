import * as events from '@aws-cdk/aws-events';

/**
 * Event fields for the CodeBuild "state change" event
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref
 */
export class StateChangeEvent {
  /**
   * The triggering build's status
   */
  public static get buildStatus() {
    return events.EventField.fromPath('$.detail.build-status');
  }

  /**
   * The triggering build's project name
   */
  public static get projectName() {
    return events.EventField.fromPath('$.detail.project-name');
  }

  /**
   * Return the build id
   */
  public static get buildId() {
    return events.EventField.fromPath('$.detail.build-id');
  }

  public static get currentPhase() {
    return events.EventField.fromPath('$.detail.current-phase');
  }

  private constructor() {
  }
}

/**
 * Event fields for the CodeBuild "phase change" event
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref
 */
export class PhaseChangeEvent {
  /**
   * The triggering build's project name
   */
  public static get projectName() {
    return events.EventField.fromPath('$.detail.project-name');
  }

  /**
   * The triggering build's id
   */
  public static get buildId() {
    return events.EventField.fromPath('$.detail.build-id');
  }

  /**
   * The phase that was just completed
   */
  public static get completedPhase() {
    return events.EventField.fromPath('$.detail.completed-phase');
  }

  /**
   * The status of the completed phase
   */
  public static get completedPhaseStatus() {
    return events.EventField.fromPath('$.detail.completed-phase-status');
  }

  /**
   * The duration of the completed phase
   */
  public static get completedPhaseDurationSeconds() {
    return events.EventField.fromPath('$.detail.completed-phase-duration-seconds');
  }

  /**
   * Whether the build is complete
   */
  public static get buildComplete() {
    return events.EventField.fromPath('$.detail.build-complete');
  }

  private constructor() {
  }
}

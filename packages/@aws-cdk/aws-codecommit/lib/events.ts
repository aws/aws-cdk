import * as events from '@aws-cdk/aws-events';

/**
 * Fields of CloudWatch Events that change references
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#codebuild_event_type
 */
export class ReferenceEvent {
  /**
   * The type of reference event
   *
   * 'referenceCreated', 'referenceUpdated' or 'referenceDeleted'
   */
  public static get eventType() {
    return events.EventField.fromPath('$.detail.event');
  }

  /**
   * Name of the CodeCommit repository
   */
  public static get repositoryName() {
    return events.EventField.fromPath('$.detail.repositoryName');
  }

  /**
   * Id of the CodeCommit repository
   */
  public static get repositoryId() {
    return events.EventField.fromPath('$.detail.repositoryId');
  }

  /**
   * Type of reference changed
   *
   * 'branch' or 'tag'
   */
  public static get referenceType() {
    return events.EventField.fromPath('$.detail.referenceType');
  }

  /**
   * Name of reference changed (branch or tag name)
   */
  public static get referenceName() {
    return events.EventField.fromPath('$.detail.referenceName');
  }

  /**
   * Full reference name
   *
   * For example, 'refs/tags/myTag'
   */
  public static get referenceFullName() {
    return events.EventField.fromPath('$.detail.referenceFullName');
  }

  /**
   * Commit id this reference now points to
   */
  public static get commitId() {
    return events.EventField.fromPath('$.detail.commitId');
  }

  private constructor() {
  }
}

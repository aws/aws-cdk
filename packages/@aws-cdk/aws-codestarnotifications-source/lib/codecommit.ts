import * as codecommit from '@aws-cdk/aws-codecommit';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * Allows using codecommit repository as notification rule source.
 */
export class CodeCommitRepository implements notifications.INotificationSource {

  constructor(private readonly repository: codecommit.IRepository) {}

  /**
   * Returns a notification source configuration to get codecommit repository ARN
   */
  bind(_notificationRule: notifications.INotificationRule): notifications.NotificationSourceConfig {
    return {
      sourceType: notifications.SourceType.CODE_COMMIT,
      sourceAddress: this.repository.repositoryArn,
    };
  }
}
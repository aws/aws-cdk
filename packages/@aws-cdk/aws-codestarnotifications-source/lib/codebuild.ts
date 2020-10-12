import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * Allows using codebuild project as notification rule source.
 */
export class CodeBuildProject implements notifications.INotificationSource {

  constructor(private readonly project: codebuild.IProject) {}

  /**
   * Returns a notification source configuration to get codebuild project ARN
   */
  bind(_notificationRule: notifications.INotificationRule): notifications.NotificationSourceConfig {
    return {
      sourceType: notifications.SourceType.CODE_BUILD,
      sourceAddress: this.project.projectArn,
    };
  }
}
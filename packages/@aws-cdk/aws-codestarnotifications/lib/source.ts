import { INotificationRule } from './notification-rule';

/**
 * Information about the Codebuild or CodePipeline associated with a notification source.
 */
export interface NotificationSourceConfig {

  /**
   * The Amazon Resource Name (ARN) of the notification source.
   */
  readonly arn: string;
}

/**
 * Represents a notification source
 */
export interface INotificationSource {

  /**
   * Binds source to notification rule
   * @param _notificationRule The notification rule
   */
  bind(_notificationRule: INotificationRule): NotificationSourceConfig;
}
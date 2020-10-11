import { INotificationRule } from './notification-rule';

/**
 * The source type of the notification rule.
 */
export enum SourceType {
  /**
   * AWS CodeCommit is specified as CodeCommit.
   */
  CODE_COMMIT = 'CodeCommit',

  /**
   * AWS CodeBuild is specified as CodeBuild.
   */
  CODE_BUILD = 'CodeBuild',

  /**
   * AWS CodePipeline is specified as CodePipeline.
   */
  CODE_PIPELINE = 'CodePipeline',

  /**
   * AWS CodeDeploy is specified as CodeDeploy.
   */
  CODE_DEPLOY = 'CodeDeploy',
}

/**
 * Information about the Codebuild or CodePipeline associated with a notification source.
 */
export interface NotificationSourceConfig {

  /**
   * The source type. Can be an AWS CodeCommit, CodeBuild, CodePipeline or CodeDeploy.
   */
  readonly sourceType: SourceType;

  /**
   * The Amazon Resource Name (ARN) of the notification source.
   */
  readonly sourceAddress: string;
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
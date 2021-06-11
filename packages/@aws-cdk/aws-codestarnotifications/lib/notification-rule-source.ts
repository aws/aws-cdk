
import { INotificationRule } from './notification-rule';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Information about the Codebuild or CodePipeline associated with a notification source.
 */
export interface NotificationRuleSourceConfig {
  /**
   * The source type. Can be an AWS CodeCommit, CodeBuild, CodePipeline or CodeDeploy.
   */
  readonly sourceType: string;

  /**
   * The Amazon Resource Name (ARN) of the notification source.
   */
  readonly sourceArn: string;
}

/**
 * Represents a notification source
 * The source that allows CodeBuild and CodePipeline to associate with this rule.
 */
export interface INotificationRuleSource {
  /**
   * Returns a source configuration for notification rule.
   */
  bindAsNotificationRuleSource(scope: Construct, rule: INotificationRule): NotificationRuleSourceConfig;
}
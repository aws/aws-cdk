import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * Allows using codepipeline project as notification rule source.
 */
export class CodePipelineProject implements notifications.INotificationSource {

  constructor(private readonly pipeline: codepipeline.IPipeline) {}

  /**
   * Returns a notification source configuration to get codepipeline project ARN
   */
  bind(_notificationRule: notifications.INotificationRule): notifications.NotificationSourceConfig {
    return {
      sourceType: notifications.SourceType.CODE_PIPELINE,
      sourceAddress: this.pipeline.pipelineArn,
    };
  }
}
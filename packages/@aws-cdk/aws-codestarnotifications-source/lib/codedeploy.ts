import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

/**
 * Allows using codedeploy application as notification rule source.
 */
export class CodeDeployApplication implements notifications.INotificationSource {

  constructor(private readonly application: codedeploy.IServerApplication | codedeploy.IEcsApplication | codedeploy.ILambdaApplication) {}

  /**
   * Returns a notification source configuration to get codedeploy application ARN
   */
  bind(_notificationRule: notifications.INotificationRule): notifications.NotificationSourceConfig {
    return {
      sourceType: notifications.SourceType.CODE_DEPLOY,
      sourceAddress: this.application.applicationArn,
    };
  }
}
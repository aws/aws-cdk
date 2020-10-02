import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

export class CodeBuildProject implements notifications.INotificationSource {

  constructor(private readonly project: codebuild.IProject) {}

  bind(_notificationRule: notifications.NotificationRule) {
    return {
      arn: this.project.projectArn,
    };
  }
}
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as notifications from '@aws-cdk/aws-codestarnotifications';

export class CodePipelineProject implements notifications.INotificationSource {

  constructor(private readonly pipeline: codepipeline.IPipeline) {}

  bind(_notificationRule: notifications.NotificationRule) {
    return {
      arn: this.pipeline.pipelineArn,
    };
  }
}
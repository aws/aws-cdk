import * as notifications from '@aws-cdk/aws-codestarnotifications';

export class FakeCodeBuildSource implements notifications.INotificationSource {
  bind(): notifications.NotificationSourceConfig {
    return {
      sourceType: notifications.SourceType.CODE_BUILD,
      sourceAddress: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    };
  }
}
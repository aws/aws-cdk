import * as notifications from '../lib';

export class FakeCodebuildSource implements notifications.INotificationSource {
  bind() {
    return {
      sourceType: notifications.SourceType.CODE_BUILD,
      sourceAddress: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    };
  }
}

export class FakeSnsTopicTarget implements notifications.INotificationTarget {
  bind() {
    return {
      targetType: notifications.TargetType.SNS,
      targetAddress: 'arn:aws:sns::1234567890:MyTopic',
    };
  }
}

export class FakeSlackTarget implements notifications.INotificationTarget {
  bind() {
    return {
      targetType: notifications.TargetType.AWS_CHATBOT_SLACK,
      targetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
    };
  }
}
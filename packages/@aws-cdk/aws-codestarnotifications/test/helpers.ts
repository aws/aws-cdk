import * as notifications from '../lib';

export class FakeCodeBuildSource implements notifications.INotificationSource {
  bind() {
    return {
      sourceType: notifications.SourceType.CODE_BUILD,
      sourceAddress: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
    };
  }
}

export class FakeCodePipelineSource implements notifications.INotificationSource {
  bind() {
    return {
      sourceType: notifications.SourceType.CODE_PIPELINE,
      sourceAddress: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
    };
  }
}

export class FakeCodeCommitSource implements notifications.INotificationSource {
  bind() {
    return {
      sourceType: notifications.SourceType.CODE_COMMIT,
      sourceAddress: 'arn:aws:codecommit::1234567890:MyCodecommitRepository',
    };
  }
}

export class FakeCodeDeploySource implements notifications.INotificationSource {
  bind() {
    return {
      sourceType: notifications.SourceType.CODE_DEPLOY,
      sourceAddress: 'arn:aws:codedeploy::1234567890:application:MyApplication',
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
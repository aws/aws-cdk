import * as notifications from '../lib';

export class FakeCodeBuild {
  readonly projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
}

export class FakeCodePipeline {
  readonly pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
}

export class FakeIncorrectSource {
  readonly incorrectArn = 'arn:aws:incorrect';
}

export class FakeSnsTopicTarget implements notifications.IRuleTarget {
  bind(): notifications.TargetConfig {
    return {
      targetType: notifications.TargetType.SNS,
      targetAddress: 'arn:aws:sns::1234567890:MyTopic',
    };
  }
}

export class FakeSlackTarget implements notifications.IRuleTarget {
  bind(): notifications.TargetConfig {
    return {
      targetType: notifications.TargetType.AWS_CHATBOT_SLACK,
      targetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
    };
  }
}
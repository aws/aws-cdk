import * as notifications from '../lib';
export class FakeCodeBuild {
  readonly projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
  readonly projectName = 'test-project';
}

export class FakeCodePipeline {
  readonly pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
  readonly pipelineName = 'test-pipeline';
}

export class FakeSnsTopicTarget implements notifications.IRuleTarget {
  bind(): notifications.RuleTargetConfig {
    return {
      targetType: notifications.TargetType.SNS,
      targetAddress: 'arn:aws:sns::1234567890:MyTopic',
    };
  }
}

export class FakeSlackTarget implements notifications.IRuleTarget {
  bind(): notifications.RuleTargetConfig {
    return {
      targetType: notifications.TargetType.AWS_CHATBOT_SLACK,
      targetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
    };
  }
}

export class FakeIncorrectResource {
  readonly incorrectArn = 'arn:aws:incorrect';
  readonly a = 'a';
  readonly b = 'b';
  readonly o = {};
}
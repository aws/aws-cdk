export class FakeCodeBuild {
  readonly projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
}

export class FakeCodePipeline {
  readonly pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
}

export class FakeIncorrectResource {
  readonly incorrectArn = 'arn:aws:incorrect';
}

export class FakeSnsTopicTarget {
  readonly topicArn = 'arn:aws:sns::1234567890:MyTopic';
}

export class FakeSlackTarget {
  readonly slackChannelConfigurationArn = 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel';
}
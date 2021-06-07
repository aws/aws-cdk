import * as notifications from '../lib';
export class FakeCodeBuild implements notifications.IRuleSource {
  readonly projectArn = 'arn:aws:codebuild::1234567890:project/MyCodebuildProject';
  readonly projectName = 'test-project';

  bind(_rule: notifications.IRule): notifications.RuleSourceConfig {
    return {
      sourceType: 'CodeBuild',
      sourceArn: this.projectArn,
    };
  }
}

export class FakeCodePipeline implements notifications.IRuleSource {
  readonly pipelineArn = 'arn:aws:codepipeline::1234567890:MyCodepipelineProject';
  readonly pipelineName = 'test-pipeline';

  bind(_rule: notifications.IRule): notifications.RuleSourceConfig {
    return {
      sourceType: 'CodePipeline',
      sourceArn: this.pipelineArn,
    };
  }
}

export class FakeSnsTopicTarget implements notifications.IRuleTarget {
  bind(): notifications.RuleTargetConfig {
    return {
      targetType: 'SNS',
      targetAddress: 'arn:aws:sns::1234567890:MyTopic',
    };
  }
}

export class FakeSlackTarget implements notifications.IRuleTarget {
  bind(): notifications.RuleTargetConfig {
    return {
      targetType: 'AWSChatbotSlack',
      targetAddress: 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/MySlackChannel',
    };
  }
}
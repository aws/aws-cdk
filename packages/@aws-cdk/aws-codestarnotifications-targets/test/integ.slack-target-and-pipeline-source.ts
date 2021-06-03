import * as chatbot from '@aws-cdk/aws-chatbot';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as targets from '../lib';

interface MockActionProps extends codepipeline.ActionProperties {
  configuration?: any;
}

class MockAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  private readonly configuration: any;

  constructor(props: MockActionProps) {
    this.actionProperties = props;
    this.configuration = props.configuration;
  }

  public bind(_scope: constructs.Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {
      configuration: this.configuration,
    };
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on MockAction');
  }
}

class SlackAndPipelineInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo = new codecommit.Repository(this, 'Repo', {
      repositoryName: 'TestRepository',
    });

    const pipeline = new codepipeline.Pipeline(this, 'pipelinePipeline22F2A91D');

    const srcArtifact = new codepipeline.Artifact('Src');

    pipeline.addStage({
      stageName: 'Source',
      actions: [new MockAction({
        actionName: 'CodeCommit',
        category: codepipeline.ActionCategory.SOURCE,
        provider: 'CodeCommit',
        artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 1 },
        configuration: {
          RepositoryName: repo.repositoryName,
          BranchName: 'master',
        },
        outputs: [srcArtifact],
      })],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [new MockAction({
        actionName: 'Hello',
        category: codepipeline.ActionCategory.APPROVAL,
        provider: 'Manual',
        artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 },
      })],
    });

    const slack = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-channel',
      slackWorkspaceId: 'T49239U4W', // modify to your slack workspace id
      slackChannelId: 'C0187JABUE9', // modify to your slack channel id
      loggingLevel: chatbot.LoggingLevel.NONE,
    });

    const rule = new notifications.Rule(this, 'MyNotificationRule', {
      source: pipeline,
    });

    rule.addEvents(['codepipeline-pipeline-action-execution-succeeded']);
    rule.addTarget(new targets.SlackChannelConfiguration(slack));
  }
}

const app = new cdk.App();

new SlackAndPipelineInteg(app, 'SlackAndPipelineInteg');

app.synth();

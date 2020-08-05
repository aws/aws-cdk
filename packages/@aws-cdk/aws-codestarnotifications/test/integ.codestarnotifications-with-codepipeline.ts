import * as chatbot from '@aws-cdk/aws-chatbot';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { NotificationRule, SlackNotificationTarget, SNSTopicNotificationTarget, Status, DetailType, PipelineEvent } from '../lib';

class CodestarnotificationsWithCodepipelineInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new codecommit.Repository(this, 'MyRepo', {
      repositoryName: 'my-repo',
    });

    const sourceOutput = new codepipeline.Artifact();

    const artifactBucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
      artifactBucket: artifactBucket,
      stages: [
        {
          stageName: 'SourceStage',
          actions: [
            new codepipelineActions.CodeCommitSourceAction({
              actionName: 'FetchSourceChanged',
              repository: repository,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'TestStage',
          actions: [
            new codepipelineActions.CodeBuildAction({
              actionName: 'Execute',
              input: sourceOutput,
              project: new codebuild.PipelineProject(this, 'MyTestCodebuildProject', {
                buildSpec: codebuild.BuildSpec.fromObject({
                  version: '0.2',
                  phases: {
                    install: {
                      'runtime-versions': {
                        docker: 18,
                      },
                    },
                    build: {
                      commands: [
                        'echo "Nothing to do!"',
                      ],
                    },
                  },
                }),
              }),
            }),
          ],
        },
      ],
    });

    const slackChannel = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
      slackChannelConfigurationName: 'test-slack-with-codebuild',
      slackWorkspaceId: 'T49239U4W',
      slackChannelId: 'C0187JABUE9',
    });

    const topic1 = new sns.Topic(this, 'MyTopic1', {});
    const topic2 = new sns.Topic(this, 'MyTopic2', {});

    const notificationRule = new NotificationRule(this, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      status: Status.ENABLED,
      detailType: DetailType.FULL,
      eventTypeIds: [
        PipelineEvent.PIPELINE_EXECUTION_SUCCEEDED,
        PipelineEvent.PIPELINE_EXECUTION_FAILED,
      ],
      targets: [
        new SlackNotificationTarget(slackChannel),
        new SNSTopicNotificationTarget(topic1),
      ],
      resourceArn: pipeline.pipelineArn,
    });

    notificationRule.addTarget(new SNSTopicNotificationTarget(topic2));
  }
}

const app = new cdk.App();

new CodestarnotificationsWithCodepipelineInteg(app, 'CodestarnotificationsWithCodepipelineInteg');

app.synth();
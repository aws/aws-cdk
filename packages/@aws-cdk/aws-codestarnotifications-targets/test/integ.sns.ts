import * as codebuild from '@aws-cdk/aws-codebuild';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as targets from '../lib';
import { FakeCodeBuildSource } from './helpers';

class SnsInteg extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic');

    const project = new codebuild.Project(this, 'MyCodebuildProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Hello, CodeBuild!"',
            ],
          },
        },
      }),
    });

    new notifications.NotificationRule(this, 'MyNotificationRule', {
      notificationRuleName: 'MyNotificationRule',
      events: [
        notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
      ],
      source: new FakeCodeBuildSource(project),
      targets: [
        new targets.SnsTopicNotificationTarget(topic),
      ],
      detailType: notifications.DetailType.FULL,
      status: notifications.Status.ENABLED,
    });
  }
}

const app = new cdk.App();

new SnsInteg(app, 'SnsInteg');

app.synth();


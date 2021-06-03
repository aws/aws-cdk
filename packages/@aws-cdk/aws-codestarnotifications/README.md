# AWS CodeStarNotifications Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Rule

The `Rule` construct defines an AWS CodeStarNotifications rule.
The rule specifies the events you want notifications about and the targets (such as Amazon SNS topics or AWS Chatbot clients configured for Slack) where you want to receive them. notification targets are objects that implement the `IRuleTarget` interface and notification source is object that implement the `IRuleSource` interface.

# Notification Targets

This module includes classes that implement the `IRuleTarget` interface for SNS and slack in AWS Chatbot.

The following targets are supported:

* `SNS`: specify event and notify to SNS topic.
* `AWS Chatbot`: specify event and notify to slack channel and only support `SlackChannelConfiguration`.

# Examples:

```ts
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as targets from '@aws-cdk/aws-codestarnotifications-targets';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sns from '@aws-cdk/aws-sns';
import * as chatbot from '@aws-cdk/aws-chatbot';

const project = new codebuild.Project(stack, 'MyProject', {});

const topic = new sns.Topic(stack, 'MyTopic1', {});

const slack = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
    slackChannelConfigurationName: 'YOUR_CHANNEL_NAME',
    slackWorkspaceId: 'YOUR_SLACK_WORKSPACE_ID',
    slackChannelId: 'YOUR_SLACK_CHANNEL_ID',
});

const rule = new notifications.Rule(stack, 'NotificationRule', {
  source: project,
});

rule.addEvents(['codebuild-project-build-state-succeeded']);

rule.addTarget(new targets.SlackChannelConfiguration(slack));
rule.addTarget(new targets.SnsTopic(slack));
```

## Notification Source

This module includes classes that implement the `IRuleSource` interface for AWS CodeBuild, AWS CodePipeline and will support AWS CodeCommit, AWS CodeDeploy in future.

The following sources are supported:

* `AWS CodeBuild`: support codebuild project to trigger notification when event specified.
* `AWS CodePipeline`: support codepipeline to trigger notification when event specified.

```ts
// You can also pass the `projectArn` or `pipelineArn`
const rule = new notifications.Rule(stack, 'NotificationRule', {
  ruleName: 'MyNotificationRule',
  events: [
    notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
    notifications.ProjectEvent.BUILD_STATE_FAILED,
  ],
  source: {
    projectArn: 'arn:aws:codebuild::1234567890:project/MyCodebuildProject',
  },
  targets: [
    new notifications.SnsTopicNotificationTarget(topic),
  ],
});

const rule = new notifications.Rule(stack, 'NotificationRule', {
  ruleName: 'MyNotificationRule',
  events: [
    notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
    notifications.ProjectEvent.BUILD_STATE_FAILED,
  ],
  source: {
    pipelineArn: 'arn:aws:codepipeline::1234567890:MyCodepipelineProject',
  },
  targets: [
    new notifications.SnsTopicNotificationTarget(topic),
  ],
});
```

## Events

The list of event types for AWS Codebuild and AWS CodePipeline, for more information, see the

[Events for notification rules on build projects](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject).

[Events for notification rules on pipelines](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline).

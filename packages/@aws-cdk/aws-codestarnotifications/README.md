# AWS CodeStarNotifications Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## NotificationRule

The `NotificationRule` construct defines an AWS CodeStarNotifications rule.
The rule specifies the events you want notifications about and the targets
(such as Amazon SNS topics or AWS Chatbot clients configured for Slack)
where you want to receive them.
Notification targets are objects that implement the `INotificationRuleTarget`
interface and notification source is object that implement the `INotificationRuleSource` interface.

## Notification Targets

This module includes classes that implement the `INotificationRuleTarget` interface for SNS and slack in AWS Chatbot.

The following targets are supported:

* `SNS`: specify event and notify to SNS topic.
* `AWS Chatbot`: specify event and notify to slack channel and only support `SlackChannelConfiguration`.

## Examples

```ts
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sns from '@aws-cdk/aws-sns';
import * as chatbot from '@aws-cdk/aws-chatbot';

const project = new codebuild.PipelineProject(this, 'MyProject');

const topic = new sns.Topic(this, 'MyTopic1');

const slack = new chatbot.SlackChannelConfiguration(this, 'MySlackChannel', {
  slackChannelConfigurationName: 'YOUR_CHANNEL_NAME',
  slackWorkspaceId: 'YOUR_SLACK_WORKSPACE_ID',
  slackChannelId: 'YOUR_SLACK_CHANNEL_ID',
});

const rule = new notifications.NotificationRule(this, 'NotificationRule', {
  source: project,
  events: [
    'codebuild-project-build-state-succeeded',
    'codebuild-project-build-state-failed',
  ],
  targets: [topic],
});
rule.addTarget(slack);
```

## Notification Source

This module includes classes that implement the `INotificationRuleSource` interface for AWS CodeBuild,
AWS CodePipeline and will support AWS CodeCommit, AWS CodeDeploy in future.

The following sources are supported:

* `AWS CodeBuild`: support codebuild project to trigger notification when event specified.
* `AWS CodePipeline`: support codepipeline to trigger notification when event specified.

## Events

For the complete list of supported event types for CodeBuild and CodePipeline, see:

* [Events for notification rules on build projects](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject).
* [Events for notification rules on pipelines](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline).

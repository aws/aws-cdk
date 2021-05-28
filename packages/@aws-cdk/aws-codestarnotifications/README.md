# AWS::CodeStarNotifications Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Example

### Codebuild

```ts
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as targets from '@aws-cdk/aws-codestarnotifications-targets';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sns from '@aws-cdk/aws-sns';
import * as chatbot from '@aws-cdk/aws-chatbot';

const project = new codebuild.Project(stack, 'MyProject', {});

const topic = new sns.Topic(stack, 'MyTopic1', {});

const slack = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
    slackChannelConfigurationName: 'MySlackChannel',
    slackWorkspaceId: 'ABC123',
    slackChannelId: 'DEF456',
});

const rule = new notifications.Rule(stack, 'NotificationRule', {
  ruleName: 'MyNotificationRule',
  events: [
    notifications.ProjectEvent.BUILD_STATE_SUCCEEDED,
    notifications.ProjectEvent.BUILD_STATE_FAILED,
  ],
  source: project,
  targets: [
    new targets.SnsTopicNotificationTarget(topic),
    new targets.SlackNotificationTarget(slack),
  ],
});
```

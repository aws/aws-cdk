import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-notification-shared-rule');

const project = new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: ['echo "Nothing to do!"'],
      },
    },
  }),
});

const topic = new sns.Topic(stack, 'MyTopic');

// Both calls use the same id, so they share one notification rule
const rule = project.notifyOnBuildSucceeded('BuildNotifications', topic);
project.notifyOnBuildFailed('BuildNotifications', topic);

const integ = new IntegTest(app, 'ProjectNotificationSharedRule', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CodeStarNotifications', 'describeNotificationRule', {
  Arn: rule.notificationRuleArn,
}).expect(ExpectedResult.objectLike({
  EventTypes: Match.arrayWith([
    Match.objectLike({ EventTypeId: 'codebuild-project-build-state-succeeded' }),
    Match.objectLike({ EventTypeId: 'codebuild-project-build-state-failed' }),
  ]),
  Targets: [
    Match.objectLike({ TargetType: 'SNS' }),
  ],
}));

#!/usr/bin/env node
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import events = require('@aws-cdk/aws-events');
import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
import targets = require('../../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-events');

const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'aws-cdk-codebuild-events',
});
const project = new codebuild.Project(stack, 'MyProject', {
  source: codebuild.Source.codeCommit({ repository: repo }),
});

const queue = new sqs.Queue(stack, 'MyQueue');

const topic = new sns.Topic(stack, 'MyTopic');
topic.addSubscription(new subs.SqsSubscription(queue));

// this will send an email with the JSON event for every state change of this
// build project.
project.onStateChange('StateChange', { target: new targets.SnsTopic(topic) });

// this will send an email with the message "Build phase changed to <phase>".
// The phase will be extracted from the "completed-phase" field of the event
// details.
project.onPhaseChange('PhaseChange', {
  target: new targets.SnsTopic(topic, {
    message: events.RuleTargetInput.fromText(`Build phase changed to ${codebuild.PhaseChangeEvent.completedPhase}`)
  })
});

// trigger a build when a commit is pushed to the repo
const onCommitRule = repo.onCommit('OnCommit', {
  target: new targets.CodeBuildProject(project),
  branches: ['master']
});

onCommitRule.addTarget(new targets.SnsTopic(topic, {
  message: events.RuleTargetInput.fromText(
    `A commit was pushed to the repository ${codecommit.ReferenceEvent.repositoryName} on branch ${codecommit.ReferenceEvent.referenceName}`
  )
}));

app.synth();

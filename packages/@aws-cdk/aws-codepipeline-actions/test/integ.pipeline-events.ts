// Use pipeline as CloudWAtch event target

import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-pipeline-event-target');

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');

const repository = new codecommit.Repository(stack, 'CodeCommitRepo', {
  repositoryName: 'foo',
});
const project = new codebuild.PipelineProject(stack, 'BuildProject', {
  grantReportGroupPermissions: false,
});

const sourceOutput = new codepipeline.Artifact('Source');
const sourceAction = new cpactions.CodeCommitSourceAction({
  actionName: 'CodeCommitSource',
  output: sourceOutput,
  repository,
  trigger: cpactions.CodeCommitTrigger.POLL,
});
const sourceStage = pipeline.addStage({
  stageName: 'Source',
  actions: [sourceAction],
});

pipeline.addStage({
  stageName: 'Build',
  actions: [
    new cpactions.CodeBuildAction({
      actionName: 'CodeBuildAction',
      input: sourceOutput,
      project,
      outputs: [new codepipeline.Artifact()],
    }),
  ],
});

const topic = new sns.Topic(stack, 'MyTopic');

const eventPipeline = events.EventField.fromPath('$.detail.pipeline');
const eventState = events.EventField.fromPath('$.detail.state');
pipeline.onStateChange('OnPipelineStateChange', {
  target: new targets.SnsTopic(topic, {
    message: events.RuleTargetInput.fromText(`Pipeline ${eventPipeline} changed state to ${eventState}`),
  }),
});

sourceStage.onStateChange('OnSourceStateChange', new targets.SnsTopic(topic));

sourceAction.onStateChange('OnActionStateChange', new targets.SnsTopic(topic)).addEventPattern({
  detail: { state: ['STARTED'] },
});

app.synth();

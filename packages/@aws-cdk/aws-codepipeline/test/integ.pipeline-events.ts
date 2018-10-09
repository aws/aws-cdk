// Use pipeline as CloudWAtch event target

import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-pipeline-event-target');

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
const sourceStage = new codepipeline.Stage(stack, 'Source', { pipeline });
const buildStage = new codepipeline.Stage(stack, 'Build', { pipeline });

const repository = new codecommit.Repository(stack, 'CodeCommitRepo', {
  repositoryName: 'foo'
});
const project = new codebuild.PipelineProject(stack, 'BuildProject');

const sourceAction = new codecommit.PipelineSourceAction(pipeline, 'CodeCommitSource', {
  stage: sourceStage,
  artifactName: 'Source',
  repository,
});
new codebuild.PipelineBuildAction(stack, 'CodeBuildAction', {
  stage: buildStage,
  inputArtifact: sourceAction.artifact,
  project
});

const topic = new sns.Topic(stack, 'MyTopic');

pipeline.onStateChange('OnPipelineStateChange').addTarget(topic, {
  textTemplate: 'Pipeline <pipeline> changed state to <state>',
  pathsMap: {
    pipeline: '$.detail.pipeline',
    state: '$.detail.state'
  }
});

sourceStage.onStateChange('OnSourceStateChange', topic);

sourceAction.onStateChange('OnActionStateChange', topic).addEventPattern({
  detail: { state: [ 'STARTED' ] }
});

process.stdout.write(app.run());

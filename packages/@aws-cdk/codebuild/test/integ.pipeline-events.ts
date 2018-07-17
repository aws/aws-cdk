// Use pipeline as CloudWAtch event target

import * as codecommit from '@aws-cdk/codecommit';
import * as codepipeline from '@aws-cdk/codepipeline';
import { App, Stack } from '@aws-cdk/core';
import * as sns from '@aws-cdk/sns';
import * as codebuild from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-pipeline-event-target');

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
const sourceStage = new codepipeline.Stage(pipeline, 'Source');
const buildStage = new codepipeline.Stage(pipeline, 'Build');

const repository = new codecommit.Repository(stack, 'CodeCommitRepo', { repositoryName: 'foo' });
const project = new codebuild.BuildProject(stack, 'BuildProject', { source: new codebuild.CodePipelineSource() });

const sourceAction = new codecommit.PipelineSource(sourceStage, 'CodeCommitSource', { artifactName: 'Source', repository });
new codebuild.PipelineBuildAction(buildStage, 'CodeBuildAction', { inputArtifact: sourceAction.artifact, project });

const topic = new sns.Topic(stack, 'MyTopic');
topic.subscribeEmail('benisrae', 'benisrae@amazon.com');

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

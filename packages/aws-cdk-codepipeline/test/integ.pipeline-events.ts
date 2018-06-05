// Use pipeline as CloudWAtch event target

import { App, Stack } from 'aws-cdk';
import { BuildProject, CodePipelineSource } from 'aws-cdk-codebuild';
import { Repository } from 'aws-cdk-codecommit';
import { Topic } from 'aws-cdk-sns';
import { CodeBuildAction, CodeCommitSource, Pipeline, Stage } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-pipeline-event-target');

const pipeline = new Pipeline(stack, 'MyPipeline');
const sourceStage = new Stage(pipeline, 'Source');
const buildStage = new Stage(pipeline, 'Build');

const repository = new Repository(stack, 'CodeCommitRepo', { repositoryName: 'foo' });
const project = new BuildProject(stack, 'BuildProject', { source: new CodePipelineSource() });

const sourceAction = new CodeCommitSource(sourceStage, 'CodeCommitSource', { artifactName: 'Source', repository });
new CodeBuildAction(buildStage, 'CodeBuildAction', { inputArtifact: sourceAction.artifact, project });

const topic = new Topic(stack, 'MyTopic');
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
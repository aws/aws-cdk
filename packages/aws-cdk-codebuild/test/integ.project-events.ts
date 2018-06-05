#!/usr/bin/env node
import { App, Stack } from 'aws-cdk';
import { Repository } from 'aws-cdk-codecommit';
import { Topic } from 'aws-cdk-sns';
import { BuildProject, CodeCommitSource } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-codebuild-events');

const repo = new Repository(stack, 'MyRepo', { repositoryName: 'aws-cdk-codebuild-events' });
const project = new BuildProject(stack, 'MyProject', { source: new CodeCommitSource(repo) });

const topic = new Topic(stack, 'MyTopic');
topic.subscribeEmail('Personal', 'benisrae@amazon.com');

// this will send an email with the JSON event for every state change of this
// build project.
project.onStateChange('StateChange', topic);

// this will send an email with the message "Build phase changed to <phase>".
// The phase will be extracted from the "completed-phase" field of the event
// details.
project.onPhaseChange('PhaseChange').addTarget(topic, {
    textTemplate: `Build phase changed to <phase>`,
    pathsMap: {
        phase: '$.detail.completed-phase'
    }
});

// trigger a build when a commit is pushed to the repo
const onCommitRule = repo.onCommit('OnCommit', project, 'master');
onCommitRule.addTarget(topic, {
    textTemplate: 'A commit was pushed to the repository <repo> on branch <branch>',
    pathsMap: {
        branch: '$.detail.referenceName',
        repo: '$.detail.repositoryName'
    }
});

process.stdout.write(app.run());

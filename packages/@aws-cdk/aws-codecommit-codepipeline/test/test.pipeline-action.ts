import codecommit = require("@aws-cdk/aws-codecommit");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codecommitCodepipeline = require('../lib');

export = {
    'polling for changes': {

        'does not poll for changes'(test: Test) {
            const stack = new cdk.Stack();

            const result = new codecommitCodepipeline.PipelineSource(stageForTesting(stack), 'stage', {
                artifactName: 'SomeArtifact',
                repository: repositoryForTesting(stack),
                pollForSourceChanges: false
            });
            test.equal(result.configuration.PollForSourceChanges, false);
            test.done();
        },

        'polls for changes'(test: Test) {
            const stack = new cdk.Stack();

            const result = new codecommitCodepipeline.PipelineSource(stageForTesting(stack), 'stage', {
                artifactName: 'SomeArtifact',
                repository: repositoryForTesting(stack),
                pollForSourceChanges: true
            });
            test.equal(result.configuration.PollForSourceChanges, true);
            test.done();
        }
    }
};

function stageForTesting(stack: cdk.Stack): codepipeline.Stage {
    const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
    return new codepipeline.Stage(pipeline, 'stage');
}

function repositoryForTesting(stack: cdk.Stack): codecommit.Repository {
    return new codecommit.Repository(stack, 'Repository', {
        repositoryName: 'Repository'
    });
}

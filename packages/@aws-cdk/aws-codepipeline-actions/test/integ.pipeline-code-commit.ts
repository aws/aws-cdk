import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/core');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit');

const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      stageName: 'source',
      actions: [
        new cpactions.CodeCommitSourceAction({
          actionName: 'source',
          repository: repo,
          output: new codepipeline.Artifact('SourceArtifact'),
        }),
      ],
    },
    {
      stageName: 'build',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'manual' }),
      ],
    },
  ],
});

app.synth();

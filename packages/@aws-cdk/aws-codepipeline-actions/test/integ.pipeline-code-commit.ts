import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import cpactions = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit');

const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      name: 'source',
      actions: [
        new cpactions.CodeCommitSourceAction({
          actionName: 'source',
          repository: repo,
          output: new codepipeline.Artifact('SourceArtifact'),
        }),
      ],
    },
    {
      name: 'build',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'manual' }),
      ],
    },
  ],
});

app.run();

import codecommit = require('@aws-cdk/aws-codecommit');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit');

const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      name: 'source',
      actions: [
        repo.toCodePipelineSourceAction({
          actionName: 'source',
          outputArtifactName: 'SourceArtifact',
        }),
      ],
    },
    {
      name: 'build',
      actions: [
        new codepipeline.ManualApprovalAction({ actionName: 'manual' }),
      ],
    },
  ],
});

app.run();

import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'a cross-account CodeBuild action with outputs': {
    'causes an error'(test: Test) {
      const app = new App();

      const projectStack = new Stack(app, 'ProjectStack', {
        env: {
          region: 'us-west-2',
          account: '012345678901',
        },
      });
      const project = new codebuild.PipelineProject(projectStack, 'Project');

      const pipelineStack = new Stack(app, 'PipelineStack', {
        env: {
          region: 'us-west-2',
          account: '123456789012',
        },
      });
      const sourceOutput = new codepipeline.Artifact();
      const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'CodeCommit',
              repository: codecommit.Repository.fromRepositoryName(pipelineStack, 'Repo', 'repo-name'),
              output: sourceOutput,
            })],
          },
        ],
      });
      const buildStage = pipeline.addStage({
        stageName: 'Build',
      });

      // this works fine - no outputs!
      buildStage.addAction(new cpactions.CodeBuildAction({
        actionName: 'Build1',
        input: sourceOutput,
        project,
      }));

      const buildAction2 = new cpactions.CodeBuildAction({
        actionName: 'Build2',
        input: sourceOutput,
        project,
        outputs: [new codepipeline.Artifact()],
      });

      test.throws(() => {
        buildStage.addAction(buildAction2);
      }, /https:\/\/github\.com\/aws\/aws-cdk\/issues\/4169/);

      test.done();
    },
  },
};

import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

nodeunitShim({
  'ECR source Action': {
    'exposes variables for other actions to consume'(test: Test) {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const ecrSourceAction = new cpactions.EcrSourceAction({
        actionName: 'Source',
        output: sourceOutput,
        repository: ecr.Repository.fromRepositoryName(stack, 'Repo', 'repo'),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [ecrSourceAction],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  ImageDigest: { value: ecrSourceAction.variables.imageDigest },
                },
              }),
            ],
          },
        ],
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Build',
                'Configuration': {
                  'EnvironmentVariables': '[{"name":"ImageDigest","type":"PLAINTEXT","value":"#{Source_Source_NS.ImageDigest}"}]',
                },
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },
});

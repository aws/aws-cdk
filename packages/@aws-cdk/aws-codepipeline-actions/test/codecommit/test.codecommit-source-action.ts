import { countResources, expect, haveResourceLike, not } from '@aws-cdk/assert';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

export = {
  'CodeCommit Source Action': {
    'by default does not poll for source changes and uses Events'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, undefined);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                  'PollForSourceChanges': false,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(countResources('AWS::Events::Rule', 1));

      test.done();
    },

    'does not poll for source changes and uses Events for CodeCommitTrigger.EVENTS'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, cpactions.CodeCommitTrigger.EVENTS);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                  'PollForSourceChanges': false,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(countResources('AWS::Events::Rule', 1));

      test.done();
    },

    'polls for source changes and does not use Events for CodeCommitTrigger.POLL'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, cpactions.CodeCommitTrigger.POLL);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                  'PollForSourceChanges': true,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(not(haveResourceLike('AWS::Events::Rule')));

      test.done();
    },

    'does not poll for source changes and does not use Events for CodeCommitTrigger.NONE'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, cpactions.CodeCommitTrigger.NONE);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Actions': [
              {
                'Configuration': {
                  'PollForSourceChanges': false,
                },
              },
            ],
          },
          {},
        ],
      }));

      expect(stack).to(not(haveResourceLike('AWS::Events::Rule')));

      test.done();
    },

    'cannot be created with an empty branch'(test: Test) {
      const stack = new Stack();
      const repo = new codecommit.Repository(stack, 'MyRepo', {
        repositoryName: 'my-repo',
      });

      test.throws(() => {
        new cpactions.CodeCommitSourceAction({
          actionName: 'Source2',
          repository: repo,
          output: new codepipeline.Artifact(),
          branch: '',
        });
      }, /'branch' parameter cannot be an empty string/);

      test.done();
    },

    'allows using the same repository multiple times with different branches when trigger=EVENTS'(test: Test) {
      const stack = new Stack();

      const repo = new codecommit.Repository(stack, 'MyRepo', {
        repositoryName: 'my-repo',
      });
      const sourceOutput1 = new codepipeline.Artifact();
      const sourceOutput2 = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'MyPipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.CodeCommitSourceAction({
                actionName: 'Source1',
                repository: repo,
                output: sourceOutput1,
              }),
              new cpactions.CodeCommitSourceAction({
                actionName: 'Source2',
                repository: repo,
                output: sourceOutput2,
                branch: 'develop',
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput1,
              }),
            ],
          },
        ],
      });

      test.done();
    },

    'exposes variables for other actions to consume'(test: Test) {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const codeCommitSourceAction = new cpactions.CodeCommitSourceAction({
        actionName: 'Source',
        repository: new codecommit.Repository(stack, 'MyRepo', {
          repositoryName: 'my-repo',
        }),
        output: sourceOutput,
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [codeCommitSourceAction],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  AuthorDate: { value: codeCommitSourceAction.variables.authorDate },
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
                  'EnvironmentVariables': '[{"name":"AuthorDate","type":"PLAINTEXT","value":"#{Source_Source_NS.AuthorDate}"}]',
                },
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },
};

function minimalPipeline(stack: Stack, trigger: cpactions.CodeCommitTrigger | undefined): codepipeline.Pipeline {
  const sourceOutput = new codepipeline.Artifact();
  return new codepipeline.Pipeline(stack, 'MyPipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.CodeCommitSourceAction({
            actionName: 'Source',
            repository: new codecommit.Repository(stack, 'MyRepo', {
              repositoryName: 'my-repo',
            }),
            output: sourceOutput,
            trigger,
          }),
        ],
      },
      {
        stageName: 'Build',
        actions: [
          new cpactions.CodeBuildAction({
            actionName: 'Build',
            project: new codebuild.PipelineProject(stack, 'MyProject'),
            input: sourceOutput,
          }),
        ],
      },
    ],
  });
}

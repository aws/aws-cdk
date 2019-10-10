import { countResources, expect, haveResourceLike, not } from "@aws-cdk/assert";
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import { Stack } from "@aws-cdk/core";
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'CodeCommit Source Action': {
    'by default does not poll for source changes and uses Events'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack, undefined);

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": false,
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
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": false,
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
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": true,
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
        "Stages": [
          {
            "Actions": [
              {
                "Configuration": {
                  "PollForSourceChanges": false,
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

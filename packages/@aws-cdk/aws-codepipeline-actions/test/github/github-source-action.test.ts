import { expect, haveResourceLike, SynthUtils } from '@aws-cdk/assert';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { SecretValue, Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

nodeunitShim({
  'GitHub source Action': {
    'exposes variables for other actions to consume'(test: Test) {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const gitHubSourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source',
        owner: 'aws',
        repo: 'aws-cdk',
        output: sourceOutput,
        oauthToken: SecretValue.plainText('secret'),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [gitHubSourceAction],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  CommitUrl: { value: gitHubSourceAction.variables.commitUrl },
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
                  'EnvironmentVariables': '[{"name":"CommitUrl","type":"PLAINTEXT","value":"#{Source_Source_NS.CommitUrl}"}]',
                },
              },
            ],
          },
        ],
      }));

      test.done();
    },

    'always renders the customer-supplied namespace, even if none of the variables are used'(test: Test) {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.GitHubSourceAction({
                actionName: 'Source',
                owner: 'aws',
                repo: 'aws-cdk',
                output: sourceOutput,
                oauthToken: SecretValue.plainText('secret'),
                variablesNamespace: 'MyNamespace',
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

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'Source',
                'Namespace': 'MyNamespace',
              },
            ],
          },
          {
          },
        ],
      }));

      test.done();
    },

    'fails if a variable from an action without a namespace set that is not part of a pipeline is referenced'(test: Test) {
      const stack = new Stack();

      const unusedSourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source2',
        owner: 'aws',
        repo: 'aws-cdk',
        output: new codepipeline.Artifact(),
        oauthToken: SecretValue.plainText('secret'),
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.GitHubSourceAction({
              actionName: 'Source1',
              owner: 'aws',
              repo: 'aws-cdk',
              output: sourceOutput,
              oauthToken: SecretValue.plainText('secret'),
            })],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  'VAR1': { value: unusedSourceAction.variables.authorDate },
                },
              }),
            ],
          },
        ],
      });

      test.throws(() => {
        SynthUtils.synthesize(stack);
      }, /Cannot reference variables of action 'Source2', as that action was never added to a pipeline/);

      test.done();
    },

    'fails if a variable from an action with a namespace set that is not part of a pipeline is referenced'(test: Test) {
      const stack = new Stack();

      const unusedSourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source2',
        owner: 'aws',
        repo: 'aws-cdk',
        output: new codepipeline.Artifact(),
        oauthToken: SecretValue.plainText('secret'),
        variablesNamespace: 'MyNamespace',
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.GitHubSourceAction({
              actionName: 'Source1',
              owner: 'aws',
              repo: 'aws-cdk',
              output: sourceOutput,
              oauthToken: SecretValue.plainText('secret'),
            })],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  'VAR1': { value: unusedSourceAction.variables.authorDate },
                },
              }),
            ],
          },
        ],
      });

      test.throws(() => {
        SynthUtils.synthesize(stack);
      }, /Cannot reference variables of action 'Source2', as that action was never added to a pipeline/);

      test.done();
    },
  },
});

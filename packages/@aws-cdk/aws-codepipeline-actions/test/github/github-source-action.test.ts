import { Template } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { App, SecretValue, Stack } from '@aws-cdk/core';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describe('Github source action', () => {
  describe('GitHub source Action', () => {
    test('exposes variables for other actions to consume', () => {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const gitHubSourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source',
        owner: 'aws',
        repo: 'aws-cdk',
        output: sourceOutput,
        oauthToken: SecretValue.unsafePlainText('secret'),
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

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
      });


    });

    test('always renders the customer-supplied namespace, even if none of the variables are used', () => {
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
                oauthToken: SecretValue.unsafePlainText('secret'),
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

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
      });


    });

    test('fails if a variable from an action without a namespace set that is not part of a pipeline is referenced', () => {
      const app = new App();
      const stack = new Stack(app);

      const unusedSourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source2',
        owner: 'aws',
        repo: 'aws-cdk',
        output: new codepipeline.Artifact(),
        oauthToken: SecretValue.unsafePlainText('secret'),
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
              oauthToken: SecretValue.unsafePlainText('secret'),
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

      expect(() => {
        App.of(stack)!.synth();
      }).toThrow(/Cannot reference variables of action 'Source2', as that action was never added to a pipeline/);


    });

    test('fails if a variable from an action with a namespace set that is not part of a pipeline is referenced', () => {
      const app = new App();
      const stack = new Stack(app);

      const unusedSourceAction = new cpactions.GitHubSourceAction({
        actionName: 'Source2',
        owner: 'aws',
        repo: 'aws-cdk',
        output: new codepipeline.Artifact(),
        oauthToken: SecretValue.unsafePlainText('secret'),
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
              oauthToken: SecretValue.unsafePlainText('secret'),
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

      expect(() => {
        App.of(stack)!.synth();
      }).toThrow(/Cannot reference variables of action 'Source2', as that action was never added to a pipeline/);


    });
  });
});

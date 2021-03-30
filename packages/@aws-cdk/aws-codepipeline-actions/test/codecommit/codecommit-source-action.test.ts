import { arrayWith, countResources, expect, haveResourceLike, not, objectLike } from '@aws-cdk/assert-internal';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import { Stack, Lazy } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

nodeunitShim({
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

    'allows using a Token for the branch name'(test: Test) {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'P', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.CodeCommitSourceAction({
                actionName: 'CodeCommit',
                repository: new codecommit.Repository(stack, 'R', {
                  repositoryName: 'repository',
                }),
                branch: Lazy.string({ produce: () => 'my-branch' }),
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                input: sourceOutput,
              }),
            ],
          },
        ],
      });

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        EventPattern: {
          detail: {
            referenceName: ['my-branch'],
          },
        },
      }));

      test.done();
    },

    'allows to enable full clone'(test: Test) {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'P', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.CodeCommitSourceAction({
                actionName: 'CodeCommit',
                repository: new codecommit.Repository(stack, 'R', {
                  repositoryName: 'repository',
                }),
                branch: Lazy.string({ produce: () => 'my-branch' }),
                output: sourceOutput,
                codeBuildCloneOutput: true,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
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
            'Actions': [{
              'Configuration': {
                'OutputArtifactFormat': 'CODEBUILD_CLONE_REF',
              },
            }],
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Build',
              },
            ],
          },
        ],
      }));

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': arrayWith(
            objectLike({
              'Action': [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
            }),
            objectLike({
              'Action': 'codecommit:GitPull',
              'Effect': 'Allow',
              'Resource': {
                'Fn::GetAtt': [
                  'RC21A1702',
                  'Arn',
                ],
              },
            }),
          ),
        },
      }));

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': arrayWith(
            objectLike({
              'Action': [
                'codecommit:GetBranch',
                'codecommit:GetCommit',
                'codecommit:UploadArchive',
                'codecommit:GetUploadArchiveStatus',
                'codecommit:CancelUploadArchive',
                'codecommit:GetRepository',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::GetAtt': [
                  'RC21A1702',
                  'Arn',
                ],
              },
            }),
          ),
        },
      }));

      test.done();
    },

    'uses the role when passed'(test: Test) {
      const stack = new Stack();

      const pipeline = new codepipeline.Pipeline(stack, 'P', {
        pipelineName: 'MyPipeline',
      });

      const triggerEventTestRole = new iam.Role(stack, 'Trigger-test-role', {
        assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
      });
      triggerEventTestRole.addToPolicy(new iam.PolicyStatement({
        actions: ['codepipeline:StartPipelineExecution'],
        resources: [pipeline.pipelineArn],
      }));

      const sourceOutput = new codepipeline.Artifact();

      const sourceAction = new cpactions.CodeCommitSourceAction({
        actionName: 'CodeCommit',
        repository: new codecommit.Repository(stack, 'R', {
          repositoryName: 'repository',
        }),
        branch: Lazy.string({ produce: () => 'my-branch' }),
        output: sourceOutput,
        eventRole: triggerEventTestRole,
      });

      pipeline.addStage({
        stageName: 'Source',
        actions: [sourceAction],
      });

      const buildAction = new cpactions.CodeBuildAction({
        actionName: 'Build',
        project: new codebuild.PipelineProject(stack, 'CodeBuild'),
        input: sourceOutput,
      });

      pipeline.addStage({
        stageName: 'build',
        actions: [buildAction],
      });

      expect(stack).to(haveResourceLike('AWS::Events::Rule', {
        Targets: [
          {
            Arn: stack.resolve(pipeline.pipelineArn),
            Id: 'Target0',
            RoleArn: stack.resolve(triggerEventTestRole.roleArn),
          },
        ],
      }));

      test.done();
    },
  },
});

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

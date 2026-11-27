import { Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codecommit from '../../../aws-codecommit';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as s3 from '../../../aws-s3';
import * as sns from '../../../aws-sns';
import type { CfnElement } from '../../../core';
import { App, SecretValue, Stack } from '../../../core';
import * as cpactions from '../../lib';

/* eslint-disable @stylistic/quote-props */

describe('CodeBuild Action', () => {
  describe('CodeBuild action', () => {
    test('pipeline depends on the policy for a shared action role', () => {
      const stack = new Stack(new App(), 'Stack');
      const sourceActionRole = new iam.Role(stack, 'SourceActionRole', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      });
      const buildActionRole = new iam.Role(stack, 'BuildActionRole', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      });
      const repository = new codecommit.Repository(stack, 'Repository', { repositoryName: 'repository' });
      const sourceOutput = new codepipeline.Artifact();

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'Source',
              repository,
              output: sourceOutput,
              role: sourceActionRole,
              trigger: cpactions.CodeCommitTrigger.POLL,
            })],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'BuildOne',
                input: sourceOutput,
                project: new codebuild.PipelineProject(stack, 'BuildProjectOne'),
                role: buildActionRole,
              }),
              new cpactions.CodeBuildAction({
                actionName: 'BuildTwo',
                input: sourceOutput,
                project: new codebuild.PipelineProject(stack, 'BuildProjectTwo'),
                role: buildActionRole,
              }),
            ],
          },
        ],
      });

      const sourceRolePolicy = sourceActionRole.node.tryFindChild('DefaultPolicy');
      const buildRolePolicy = buildActionRole.node.tryFindChild('DefaultPolicy');
      if (!sourceRolePolicy?.node.defaultChild || !buildRolePolicy?.node.defaultChild) {
        throw new Error('expected both action roles to have a default policy');
      }
      const sourceRolePolicyId = stack.getLogicalId(sourceRolePolicy.node.defaultChild as CfnElement);
      const buildRolePolicyId = stack.getLogicalId(buildRolePolicy.node.defaultChild as CfnElement);

      const template = Template.fromStack(stack);
      template.hasResource('AWS::CodePipeline::Pipeline', {
        DependsOn: Match.arrayWith([sourceRolePolicyId]),
      });
      template.hasResource('AWS::CodePipeline::Pipeline', {
        DependsOn: Match.arrayWith([buildRolePolicyId]),
      });
    });

    test('pipeline depends on the policy for a generated CodeBuild action role', () => {
      const stack = new Stack(new App(), 'Stack');
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'Source',
              repository: new codecommit.Repository(stack, 'Repository', { repositoryName: 'repository' }),
              output: sourceOutput,
              trigger: cpactions.CodeCommitTrigger.POLL,
            })],
          },
          {
            stageName: 'Build',
            actions: [new cpactions.CodeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              project: new codebuild.PipelineProject(stack, 'BuildProject'),
            })],
          },
        ],
      });

      const buildRolePolicyId = getPolicyLogicalId(stack, 'Pipeline/Build/Build/CodePipelineActionRole/DefaultPolicy');
      Template.fromStack(stack).hasResource('AWS::CodePipeline::Pipeline', {
        DependsOn: Match.arrayWith([buildRolePolicyId]),
      });
    });

    test('pipeline depends on policy updates to a mutable imported action role', () => {
      const stack = new Stack(new App(), 'Stack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });
      const actionRole = iam.Role.fromRoleArn(stack, 'ImportedActionRole', 'arn:aws:iam::123456789012:role/ImportedActionRole');
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'Source',
              repository: new codecommit.Repository(stack, 'Repository', { repositoryName: 'repository' }),
              output: sourceOutput,
              trigger: cpactions.CodeCommitTrigger.POLL,
            })],
          },
          {
            stageName: 'Build',
            actions: [new cpactions.CodeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              project: new codebuild.PipelineProject(stack, 'BuildProject'),
              role: actionRole,
            })],
          },
        ],
      });

      const importedRolePolicyId = getPolicyLogicalId(stack, 'ImportedActionRole/Policy');
      Template.fromStack(stack).hasResource('AWS::CodePipeline::Pipeline', {
        DependsOn: Match.arrayWith([importedRolePolicyId]),
      });
    });

    test('does not create a policy for an immutable imported action role', () => {
      const stack = new Stack(new App(), 'Stack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });
      const actionRole = iam.Role.fromRoleArn(stack, 'ImportedActionRole', 'arn:aws:iam::123456789012:role/ImportedActionRole', {
        mutable: false,
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'Source',
              repository: new codecommit.Repository(stack, 'Repository', { repositoryName: 'repository' }),
              output: sourceOutput,
              trigger: cpactions.CodeCommitTrigger.POLL,
            })],
          },
          {
            stageName: 'Build',
            actions: [new cpactions.CodeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              project: new codebuild.PipelineProject(stack, 'BuildProject'),
              role: actionRole,
            })],
          },
        ],
      });

      expect(stack.node.findAll().some(construct => construct.node.path.endsWith('ImportedActionRole/Policy'))).toBe(false);
      expect(() => Template.fromStack(stack)).not.toThrow();
    });

    test('can synthesize a cross-account CodeBuild action', () => {
      const app = new App();
      const pipelineStack = new Stack(app, 'PipelineStack', {
        env: { account: '111111111111', region: 'us-east-1' },
      });
      const actionStack = new Stack(app, 'ActionStack', {
        env: { account: '222222222222', region: 'us-east-1' },
      });
      const sourceOutput = new codepipeline.Artifact();

      new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
        crossAccountKeys: true,
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'Source',
              repository: new codecommit.Repository(pipelineStack, 'Repository', { repositoryName: 'repository' }),
              output: sourceOutput,
              trigger: cpactions.CodeCommitTrigger.POLL,
            })],
          },
          {
            stageName: 'Build',
            actions: [new cpactions.CodeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              project: new codebuild.PipelineProject(actionStack, 'BuildProject', { projectName: 'ActionBuildProject' }),
            })],
          },
        ],
      });

      expect(() => app.synth()).not.toThrow();
    });

    describe('that is cross-account and has outputs', () => {
      test('causes an error', () => {
        const app = new App();

        const projectStack = new Stack(app, 'ProjectStack', {
          env: {
            region: 'us-west-2',
            account: '012345678912',
          },
        });
        const project = new codebuild.PipelineProject(projectStack, 'Project');

        const pipelineStack = new Stack(app, 'PipelineStack', {
          env: {
            region: 'us-west-2',
            account: '012345678913',
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

        expect(() => {
          buildStage.addAction(buildAction2);
        }).toThrow(/https:\/\/github\.com\/aws\/aws-cdk\/issues\/4169/);
      });
    });

    test('can be backed by an imported project', () => {
      const stack = new Stack();

      const codeBuildProject = codebuild.PipelineProject.fromProjectName(stack, 'CodeBuild',
        'codeBuildProjectNameInAnotherAccount');

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: new s3.Bucket(stack, 'Bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project: codeBuildProject,
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
                'Name': 'CodeBuild',
                'Configuration': {
                  'ProjectName': 'codeBuildProjectNameInAnotherAccount',
                },
              },
            ],
          },
        ],
      });
    });

    test('exposes variables for other actions to consume', () => {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const codeBuildAction = new cpactions.CodeBuildAction({
        actionName: 'CodeBuild',
        input: sourceOutput,
        project: new codebuild.PipelineProject(stack, 'CodeBuild', {
          buildSpec: codebuild.BuildSpec.fromObject({
            version: '0.2',
            env: {
              'exported-variables': [
                'SomeVar',
              ],
            },
            phases: {
              build: {
                commands: [
                  'export SomeVar="Some Value"',
                ],
              },
            },
          }),
        }),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: s3.Bucket.fromBucketName(stack, 'Bucket', 'bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              codeBuildAction,
              new cpactions.ManualApprovalAction({
                actionName: 'Approve',
                additionalInformation: codeBuildAction.variable('SomeVar'),
                notificationTopic: sns.Topic.fromTopicArn(stack, 'Topic', 'arn:aws:sns:us-east-1:123456789012:mytopic'),
                runOrder: 2,
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
                'Name': 'CodeBuild',
                'Namespace': 'Build_CodeBuild_NS',
              },
              {
                'Name': 'Approve',
                'Configuration': {
                  'CustomData': '#{Build_CodeBuild_NS.SomeVar}',
                },
              },
            ],
          },
        ],
      });
    });

    test('sets the BatchEnabled configuration', () => {
      const stack = new Stack();

      const codeBuildProject = new codebuild.PipelineProject(stack, 'CodeBuild');

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: new s3.Bucket(stack, 'Bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project: codeBuildProject,
                executeBatchBuild: true,
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
                'Name': 'CodeBuild',
                'Configuration': {
                  'BatchEnabled': 'true',
                },
              },
            ],
          },
        ],
      });
    });

    test('sets the CombineArtifacts configuration', () => {
      const stack = new Stack();

      const codeBuildProject = new codebuild.PipelineProject(stack, 'CodeBuild');

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: new s3.Bucket(stack, 'Bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project: codeBuildProject,
                executeBatchBuild: true,
                combineBatchBuildArtifacts: true,
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
                'Name': 'CodeBuild',
                'Configuration': {
                  'BatchEnabled': 'true',
                  'CombineArtifacts': 'true',
                },
              },
            ],
          },
        ],
      });
    });

    describe('environment variables', () => {
      test('should fail by default when added to a Pipeline while using a secret value in a plaintext variable', () => {
        const stack = new Stack();

        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeCommitSourceAction({
                actionName: 'source',
                repository: new codecommit.Repository(stack, 'CodeCommitRepo', {
                  repositoryName: 'my-repo',
                }),
                output: sourceOutput,
              })],
            },
          ],
        });

        const buildStage = pipeline.addStage({
          stageName: 'Build',
        });
        const codeBuildProject = new codebuild.PipelineProject(stack, 'CodeBuild');
        const buildAction = new cpactions.CodeBuildAction({
          actionName: 'Build',
          project: codeBuildProject,
          input: sourceOutput,
          environmentVariables: {
            'X': {
              value: SecretValue.secretsManager('my-secret'),
            },
          },
        });

        expect(() => {
          buildStage.addAction(buildAction);
        }).toThrow(/Plaintext environment variable 'X' contains a secret value!/);
      });

      test("should allow opting out of the 'secret value in a plaintext variable' validation", () => {
        const stack = new Stack();

        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeCommitSourceAction({
                actionName: 'source',
                repository: new codecommit.Repository(stack, 'CodeCommitRepo', {
                  repositoryName: 'my-repo',
                }),
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new cpactions.CodeBuildAction({
                actionName: 'build',
                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                input: sourceOutput,
                environmentVariables: {
                  'X': {
                    value: SecretValue.secretsManager('my-secret'),
                  },
                },
                checkSecretsInPlainTextEnvVariables: false,
              })],
            },
          ],
        });
      });
    });
  });
});

function getPolicyLogicalId(stack: Stack, policyPathSuffix: string): string {
  const policy = stack.node.findAll().find(construct => construct.node.path.endsWith(policyPathSuffix));
  if (!policy?.node.defaultChild) {
    throw new Error(`expected a policy at the end of construct path '${policyPathSuffix}'`);
  }
  return stack.getLogicalId(policy.node.defaultChild as CfnElement);
}

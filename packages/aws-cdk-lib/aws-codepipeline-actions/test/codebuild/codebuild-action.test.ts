import { Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codecommit from '../../../aws-codecommit';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as s3 from '../../../aws-s3';
import * as sns from '../../../aws-sns';
import { App, SecretValue, Stack } from '../../../core';
import * as cpactions from '../../lib';

/* eslint-disable @stylistic/quote-props */

describe('CodeBuild Action', () => {
  describe('CodeBuild action', () => {
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

    describe('serviceRoleOverride', () => {
      const ROLE_ARN = 'arn:aws:iam::123456789012:role/MyCodeBuildRole';
      const PASS_ROLE_CONDITION = { 'StringEquals': { 'iam:PassedToService': 'codebuild.amazonaws.com' } };

      // Builds a single-stack pipeline whose Build stage holds one CodeBuild action.
      function setup(roleFactory?: (stack: Stack) => iam.IRoleRef) {
        const stack = new Stack();
        const serviceRoleOverride = roleFactory?.(stack);
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
                  project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                  serviceRoleOverride,
                }),
              ],
            },
          ],
        });
        return { stack, serviceRoleOverride, template: Template.fromStack(stack) };
      }

      function expectBuildConfiguration(template: Template, configuration: any) {
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [Match.objectLike({ 'Name': 'CodeBuild', 'Configuration': configuration })],
            }),
          ]),
        });
      }

      test('when provided: renders ServiceRoleArnOverride and grants iam:PassRole limited to CodeBuild', () => {
        const { template } = setup(stack => iam.Role.fromRoleArn(stack, 'OverrideRole', ROLE_ARN));

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': ROLE_ARN }));
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({ 'Action': 'iam:PassRole', 'Resource': ROLE_ARN, 'Condition': PASS_ROLE_CONDITION }),
            ]),
          },
        });
      });

      test('when provided as a role in the same stack: references the role ARN and adds nothing to the role', () => {
        const { stack, serviceRoleOverride, template } = setup(s => new iam.Role(s, 'OverrideRole', {
          assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        }));
        const roleArn = { 'Fn::GetAtt': [stack.getLogicalId((serviceRoleOverride as iam.Role).node.defaultChild as any), 'Arn'] };

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': roleArn }));
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({ 'Action': 'iam:PassRole', 'Resource': roleArn, 'Condition': PASS_ROLE_CONDITION }),
            ]),
          },
        });
        // CDK grants nothing to the override role itself
        template.resourcePropertiesCountIs('AWS::IAM::Policy', {
          'Roles': Match.arrayWith([{ 'Ref': stack.getLogicalId((serviceRoleOverride as iam.Role).node.defaultChild as any) }]),
        }, 0);
      });

      test('when not provided: no ServiceRoleArnOverride and no CodeBuild PassRole', () => {
        const { template } = setup();

        expectBuildConfiguration(template, Match.not(Match.objectLike({ 'ServiceRoleArnOverride': Match.anyValue() })));
        const policies = template.findResources('AWS::IAM::Policy');
        for (const policy of Object.values(policies)) {
          for (const statement of policy.Properties.PolicyDocument.Statement) {
            expect(statement.Condition?.StringEquals?.['iam:PassedToService']).not.toBe('codebuild.amazonaws.com');
          }
        }
      });

      test('cross-account: grants iam:PassRole to the action role in the project account', () => {
        const app = new App();
        const projectStack = new Stack(app, 'ProjectStack', { env: { region: 'us-west-2', account: '123456789012' } });
        const project = new codebuild.PipelineProject(projectStack, 'Project', { projectName: 'MyProject' });
        const pipelineStack = new Stack(app, 'PipelineStack', { env: { region: 'us-west-2', account: '234567890123' } });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          crossAccountKeys: true,
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeCommitSourceAction({
                actionName: 'CodeCommit',
                repository: codecommit.Repository.fromRepositoryName(pipelineStack, 'Repo', 'repo-name'),
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project,
                serviceRoleOverride: iam.Role.fromRoleArn(projectStack, 'OverrideRole', ROLE_ARN),
              })],
            },
          ],
        });

        expectBuildConfiguration(Template.fromStack(pipelineStack), Match.objectLike({ 'ServiceRoleArnOverride': ROLE_ARN }));
        const passRole = Match.objectLike({ 'Action': 'iam:PassRole', 'Resource': ROLE_ARN, 'Condition': PASS_ROLE_CONDITION });
        Template.fromStack(projectStack).hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': { 'Statement': Match.arrayWith([passRole]) },
        });
        for (const policy of Object.values(Template.fromStack(pipelineStack).findResources('AWS::IAM::Policy'))) {
          for (const statement of policy.Properties.PolicyDocument.Statement) {
            expect(statement.Action).not.toEqual('iam:PassRole');
          }
        }
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

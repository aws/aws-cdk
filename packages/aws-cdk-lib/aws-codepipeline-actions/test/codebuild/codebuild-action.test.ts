import { Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codecommit from '../../../aws-codecommit';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as s3 from '../../../aws-s3';
import * as sns from '../../../aws-sns';
import { App, CfnParameter, PhysicalName, SecretValue, Stack } from '../../../core';
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
      function setup(roleFactory?: (stack: Stack) => iam.IRoleRef & iam.IGrantable, pipelineProps: Partial<codepipeline.PipelineProps> = {}) {
        const stack = new Stack();
        const serviceRoleOverride = roleFactory?.(stack);
        const project = new codebuild.PipelineProject(stack, 'CodeBuild');
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(stack, 'Pipeline', {
          ...pipelineProps,
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
                  project,
                  serviceRoleOverride,
                }),
              ],
            },
          ],
        });
        return { stack, project, serviceRoleOverride, template: Template.fromStack(stack) };
      }

      // Asserts that exactly one policy in the template grants the conditioned iam:PassRole on
      // `roleArn`, and that it is attached only to a role whose logical ID matches `rolePattern`.
      function expectPassRoleOnlyOn(template: Template, roleArn: any, rolePattern: RegExp) {
        const passRole = Match.objectLike({ 'Action': 'iam:PassRole', 'Resource': roleArn, 'Condition': PASS_ROLE_CONDITION });
        const policies = Object.values(template.findResources('AWS::IAM::Policy', {
          Properties: { PolicyDocument: { Statement: Match.arrayWith([passRole]) } },
        }));
        expect(policies).toHaveLength(1);
        expect(policies[0].Properties.Roles).toEqual([{ 'Ref': expect.stringMatching(rolePattern) }]);
      }

      // All actions in all policy statements of the template, with array Actions flattened.
      function policyActions(template: Template): string[] {
        return Object.values(template.findResources('AWS::IAM::Policy'))
          .flatMap(policy => policy.Properties.PolicyDocument.Statement)
          .flatMap((statement: any) => [statement.Action].flat());
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
        // CodePipeline assumes the action role to start the build, so that role must be allowed to pass the override
        expectPassRoleOnlyOn(template, ROLE_ARN, /^PipelineBuildCodeBuildCodePipelineActionRole/);
      });

      test('with usePipelineRoleForActions: grants iam:PassRole to the pipeline role', () => {
        const { template } = setup(stack => iam.Role.fromRoleArn(stack, 'OverrideRole', ROLE_ARN), {
          usePipelineRoleForActions: true,
        });

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': ROLE_ARN }));
        expectPassRoleOnlyOn(template, ROLE_ARN, /^PipelineRole/);
      });

      // All actions in the policies attached to `role`, with array Actions flattened.
      // With `s3Resources`, returns instead the resources of the statements that grant s3 actions.
      function roleActions(template: Template, stack: Stack, role: iam.Role, s3Resources = false): any[] {
        const roleRef = { 'Ref': stack.getLogicalId(role.node.defaultChild as any) };
        const statements = Object.values(template.findResources('AWS::IAM::Policy', { Properties: { Roles: Match.arrayWith([roleRef]) } }))
          .flatMap(policy => policy.Properties.PolicyDocument.Statement);
        if (s3Resources) {
          return statements
            .filter((statement: any) => [statement.Action].flat().some((action: string) => action.startsWith('s3:')))
            .flatMap((statement: any) => [statement.Resource].flat());
        }
        return statements.flatMap((statement: any) => [statement.Action].flat());
      }

      test('when provided as a role in the same stack: references the role ARN and grants it only the artifact bucket', () => {
        const { stack, serviceRoleOverride, template } = setup(s => new iam.Role(s, 'OverrideRole', {
          assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        }));
        const roleArn = { 'Fn::GetAtt': [stack.getLogicalId((serviceRoleOverride as iam.Role).node.defaultChild as any), 'Arn'] };

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': roleArn }));
        expectPassRoleOnlyOn(template, roleArn, /^PipelineBuildCodeBuildCodePipelineActionRole/);
        // the action has no outputs, so the override role can read the artifact bucket and its key, and nothing else
        expect(new Set(roleActions(template, stack, serviceRoleOverride as iam.Role))).toEqual(new Set([
          's3:GetObject*', 's3:GetBucket*', 's3:List*', 'kms:Decrypt', 'kms:DescribeKey',
        ]));
      });

      test('when provided on an action with outputs: grants the override role read/write on the artifact bucket and its key', () => {
        const stack = new Stack();
        const overrideRole = new iam.Role(stack, 'OverrideRole', { assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com') });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(stack, 'Pipeline', {
          crossAccountKeys: true,
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: new s3.Bucket(stack, 'Bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                outputs: [new codepipeline.Artifact()],
                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                serviceRoleOverride: overrideRole,
              })],
            },
          ],
        });

        const actions = roleActions(Template.fromStack(stack), stack, overrideRole);
        expect(actions).toEqual(expect.arrayContaining(['s3:GetObject*', 's3:PutObject', 'kms:Decrypt', 'kms:Encrypt']));
      });

      test('cross-region: grants the override role the replication bucket in the action\'s region', () => {
        const app = new App();
        const pipelineStack = new Stack(app, 'PipelineStack', { env: { account: '123456789012', region: 'us-east-1' } });
        const projectStack = new Stack(app, 'ProjectStack', { env: { account: '123456789012', region: 'eu-west-1' } });
        const project = new codebuild.PipelineProject(projectStack, 'Project', { projectName: 'MyProject' });
        const overrideRole = new iam.Role(projectStack, 'OverrideRole', {
          assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
          roleName: PhysicalName.GENERATE_IF_NEEDED,
        });
        const replicationBucket = new s3.Bucket(projectStack, 'ReplicationBucket', { bucketName: 'my-replication-bucket' });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          crossRegionReplicationBuckets: { 'eu-west-1': replicationBucket },
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.S3SourceAction({
                actionName: 'S3_Source',
                bucket: new s3.Bucket(pipelineStack, 'Bucket'),
                bucketKey: 'key',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project,
                serviceRoleOverride: overrideRole,
              })],
            },
          ],
        });

        Template.fromStack(projectStack).hasResourceProperties('AWS::IAM::Policy', {
          'Roles': [{ 'Ref': projectStack.getLogicalId(overrideRole.node.defaultChild as any) }],
          'PolicyDocument': {
            'Statement': Match.arrayWith([Match.objectLike({
              'Action': Match.arrayWith(['s3:GetObject*']),
              'Resource': Match.arrayWith([{ 'Fn::GetAtt': [projectStack.getLogicalId(replicationBucket.node.defaultChild as any), 'Arn'] }]),
            })]),
          },
        });
        // and not the pipeline's bucket in us-east-1, which the build never reads
        const s3Resources = roleActions(Template.fromStack(projectStack), projectStack, overrideRole, true);
        expect(s3Resources.length).toBeGreaterThan(0);
        for (const resource of s3Resources) {
          expect(JSON.stringify(resource)).toContain(projectStack.getLogicalId(replicationBucket.node.defaultChild as any));
        }
      });

      test('when not provided: no ServiceRoleArnOverride and no CodeBuild PassRole', () => {
        const { template } = setup();

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': Match.absent() }));
        expect(policyActions(template)).not.toContain('iam:PassRole');
      });

      test('when provided on an action without outputs: does not grant the project role read access to the artifact bucket', () => {
        const { stack, project, template } = setup(s => iam.Role.fromRoleArn(s, 'OverrideRole', ROLE_ARN));
        const roleRef = { 'Ref': stack.getLogicalId(project.role!.node.defaultChild as any) };
        const actions = Object.values(template.findResources('AWS::IAM::Policy', { Properties: { Roles: Match.arrayWith([roleRef]) } }))
          .flatMap(policy => policy.Properties.PolicyDocument.Statement)
          .flatMap((statement: any) => [statement.Action].flat());

        expect(actions).not.toContain('s3:GetObject*');
        expect(actions).toContain('logs:PutLogEvents');
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
        // The grant lands on the action role CDK generates in the project's account, which CodePipeline
        // assumes to start the build.
        expectPassRoleOnlyOn(Template.fromStack(projectStack), ROLE_ARN, /^PipelineStackPipeline[0-9A-F]+BuildCodeBuildActionRole/);
        // the override role is in the project's account, so the artifact bucket and its key in the
        // pipeline's account grant it through their resource policies
        const overridePrincipal = Match.objectLike({ 'Principal': { 'AWS': ROLE_ARN }, 'Action': Match.arrayWith(['s3:GetObject*']) });
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::S3::BucketPolicy', {
          'PolicyDocument': { 'Statement': Match.arrayWith([overridePrincipal]) },
        });
        Template.fromStack(pipelineStack).hasResourceProperties('AWS::KMS::Key', {
          'KeyPolicy': { 'Statement': Match.arrayWith([Match.objectLike({ 'Principal': { 'AWS': ROLE_ARN }, 'Action': Match.arrayWith(['kms:Decrypt']) })]) },
        });
        // IAM only allows passing a role to a service in the same account as the role, so a PassRole
        // grant on the pipeline role in the pipeline's account could never be used here.
        // https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html
        expect(policyActions(Template.fromStack(pipelineStack))).not.toContain('iam:PassRole');
      });

      // Builds a pipeline whose CodeBuild actions all use `project`, with a Full Clone CodeConnections
      // source, a Full Clone CodeCommit source, an output and secret environment variables.
      // Returns the actions of the project's role's policies.
      function projectRoleActions(withOverride: boolean[]): string[] {
        const stack = new Stack();
        const project = new codebuild.PipelineProject(stack, 'Project');
        const connectionOutput = new codepipeline.Artifact('ConnectionOutput');
        const codeCommitOutput = new codepipeline.Artifact('CodeCommitOutput');
        new codepipeline.Pipeline(stack, 'Pipeline', {
          crossAccountKeys: true,
          stages: [
            {
              stageName: 'Source',
              actions: [
                new cpactions.CodeStarConnectionsSourceAction({
                  actionName: 'Connection',
                  connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                  owner: 'my-org',
                  repo: 'my-repo',
                  output: connectionOutput,
                  codeBuildCloneOutput: true,
                }),
                new cpactions.CodeCommitSourceAction({
                  actionName: 'CodeCommit',
                  repository: codecommit.Repository.fromRepositoryName(stack, 'Repo', 'repo-name'),
                  output: codeCommitOutput,
                  codeBuildCloneOutput: true,
                }),
              ],
            },
            {
              stageName: 'Build',
              actions: withOverride.map((override, i) => new cpactions.CodeBuildAction({
                actionName: `CodeBuild${i}`,
                project,
                input: connectionOutput,
                extraInputs: [codeCommitOutput],
                outputs: [new codepipeline.Artifact(`BuildOutput${i}`)],
                environmentVariables: {
                  PARAM: { type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE, value: '/my/param' },
                  SECRET: { type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER, value: 'my-secret' },
                },
                serviceRoleOverride: override ? iam.Role.fromRoleArn(stack, `OverrideRole${i}`, ROLE_ARN) : undefined,
              })),
            },
          ],
        });

        const template = Template.fromStack(stack);
        const roleRef = { 'Ref': stack.getLogicalId(project.role!.node.defaultChild as any) };
        return Object.values(template.findResources('AWS::IAM::Policy', { Properties: { Roles: Match.arrayWith([roleRef]) } }))
          .flatMap(policy => policy.Properties.PolicyDocument.Statement)
          .flatMap((statement: any) => [statement.Action].flat());
      }

      const ACTION_GRANTS = [
        's3:PutObject',
        'codestar-connections:UseConnection',
        'codecommit:GitPull',
        'ssm:GetParameters',
        'secretsmanager:GetSecretValue',
      ];

      test('when provided: does not grant the project role the action\'s bucket, source and secret permissions', () => {
        const actions = projectRoleActions([true]);

        for (const action of ACTION_GRANTS) {
          expect(actions).not.toContain(action);
        }
        // grants the Project construct itself makes are unaffected
        expect(actions).toContain('logs:PutLogEvents');
        // the artifact key is still set as the project's encryption key, and granted with it
        expect(actions).toContain('kms:Decrypt');
      });

      test('when not provided: grants the project role the action\'s bucket, source and secret permissions', () => {
        const actions = projectRoleActions([false]);

        for (const action of ACTION_GRANTS) {
          expect(actions).toContain(action);
        }
        expect(actions).toContain('kms:Decrypt');
      });

      test('shared project: an action without an override still grants the project role its permissions', () => {
        const actions = projectRoleActions([true, false]);

        for (const action of ACTION_GRANTS) {
          expect(actions).toContain(action);
        }
      });

      test('fails when the role is in a different account than the project', () => {
        const stack = new Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [{
            stageName: 'Source',
            actions: [new cpactions.S3SourceAction({
              actionName: 'S3_Source',
              bucket: new s3.Bucket(stack, 'Bucket'),
              bucketKey: 'key',
              output: sourceOutput,
            })],
          }],
        });

        expect(() => pipeline.addStage({
          stageName: 'Build',
          actions: [new cpactions.CodeBuildAction({
            actionName: 'CodeBuild',
            input: sourceOutput,
            project: new codebuild.PipelineProject(stack, 'CodeBuild'),
            serviceRoleOverride: iam.Role.fromRoleArn(stack, 'OverrideRole', 'arn:aws:iam::234567890123:role/MyCodeBuildRole'),
          })],
        })).toThrow(/serviceRoleOverride must be in the same account as the CodeBuild project \("123456789012"\), got a role in account "234567890123"/);
      });

      // Builds a pipeline in account 123456789012 whose CodeBuild action uses a project imported
      // from account 234567890123, with an override role from `roleAccount`.
      function addImportedProjectAction(roleAccount: string) {
        const app = new App();
        const stack = new Stack(app, 'PipelineStack', { env: { account: '123456789012', region: 'us-east-1' } });
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          crossAccountKeys: true,
          stages: [{
            stageName: 'Source',
            actions: [new cpactions.S3SourceAction({
              actionName: 'S3_Source',
              bucket: new s3.Bucket(stack, 'Bucket'),
              bucketKey: 'key',
              output: sourceOutput,
            })],
          }],
        });
        pipeline.addStage({
          stageName: 'Build',
          actions: [new cpactions.CodeBuildAction({
            actionName: 'CodeBuild',
            input: sourceOutput,
            project: codebuild.Project.fromProjectArn(stack, 'Imported', 'arn:aws:codebuild:us-east-1:234567890123:project/Imported'),
            serviceRoleOverride: iam.Role.fromRoleArn(stack, 'OverrideRole', `arn:aws:iam::${roleAccount}:role/MyCodeBuildRole`),
          })],
        });
        return stack;
      }

      test('imported project: accepts a role from the project\'s account and grants it the artifact bucket', () => {
        const stack = addImportedProjectAction('234567890123');
        const template = Template.fromStack(stack);
        const roleArn = 'arn:aws:iam::234567890123:role/MyCodeBuildRole';

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': roleArn }));
        // the role is in the project's account, so the bucket and key in the pipeline's account grant it
        template.hasResourceProperties('AWS::S3::BucketPolicy', {
          'PolicyDocument': { 'Statement': Match.arrayWith([Match.objectLike({ 'Principal': { 'AWS': roleArn } })]) },
        });
        template.hasResourceProperties('AWS::KMS::Key', {
          'KeyPolicy': { 'Statement': Match.arrayWith([Match.objectLike({ 'Principal': { 'AWS': roleArn } })]) },
        });
      });

      test('imported project: fails for a role from the pipeline\'s account', () => {
        expect(() => addImportedProjectAction('123456789012'))
          .toThrow(/serviceRoleOverride must be in the same account as the CodeBuild project \("234567890123"\), got a role in account "123456789012"/);
      });

      test('does not check the account when the project\'s account is not known at synth time', () => {
        const { template } = setup(stack => iam.Role.fromRoleArn(stack, 'OverrideRole', 'arn:aws:iam::234567890123:role/MyCodeBuildRole'));

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': 'arn:aws:iam::234567890123:role/MyCodeBuildRole' }));
      });

      test('does not check the account when the role ARN is a token', () => {
        const { template } = setup(stack => iam.Role.fromRoleArn(stack, 'OverrideRole',
          new CfnParameter(stack, 'RoleArn').valueAsString));

        expectBuildConfiguration(template, Match.objectLike({ 'ServiceRoleArnOverride': { 'Ref': 'RoleArn' } }));
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

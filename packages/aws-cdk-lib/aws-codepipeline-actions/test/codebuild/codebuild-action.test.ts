import { Annotations, Match, Template } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codecommit from '../../../aws-codecommit';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as s3 from '../../../aws-s3';
import * as sns from '../../../aws-sns';
import { App, Fn, SecretValue, Stack } from '../../../core';
import * as cxapi from '../../../cx-api';
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
      // Builds a pipeline with a single CodeBuild action and an optional explicit
      // serviceRoleOverride. Returns the action + rendered template.
      function setup(serviceRoleOverride?: iam.IRole) {
        const stack = new Stack();
        const sourceOutput = new codepipeline.Artifact();
        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: sourceOutput,
          project: new codebuild.PipelineProject(stack, 'CodeBuild'),
          serviceRoleOverride,
        });
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
            { stageName: 'Build', actions: [action] },
          ],
        });
        return { stack, action, template: Template.fromStack(stack) };
      }

      test('when provided: emits ServiceRoleArnOverride and grants the pipeline role iam:PassRole scoped to CodeBuild', () => {
        const stack = new Stack();
        const overrideRole = iam.Role.fromRoleArn(stack, 'OverrideRole',
          'arn:aws:iam::123456789012:role/MyCodeBuildRole');
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
                  serviceRoleOverride: overrideRole,
                }),
              ],
            },
          ],
        });

        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Name': 'CodeBuild',
                  'Configuration': Match.objectLike({
                    'ServiceRoleArnOverride': 'arn:aws:iam::123456789012:role/MyCodeBuildRole',
                  }),
                }),
              ],
            }),
          ]),
        });

        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': 'iam:PassRole',
                'Resource': 'arn:aws:iam::123456789012:role/MyCodeBuildRole',
                'Condition': {
                  'StringEquals': { 'iam:PassedToService': 'codebuild.amazonaws.com' },
                },
              }),
            ]),
          },
        });
      });

      test('when not provided: no ServiceRoleArnOverride and no codebuild PassRole', () => {
        const { template } = setup();

        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Name': 'CodeBuild',
                  'Configuration': Match.not(Match.objectLike({
                    'ServiceRoleArnOverride': Match.anyValue(),
                  })),
                }),
              ],
            }),
          ]),
        });

        const policies = template.findResources('AWS::IAM::Policy');
        for (const policy of Object.values(policies)) {
          for (const statement of policy.Properties.PolicyDocument.Statement) {
            expect(statement.Condition?.StringEquals?.['iam:PassedToService']).not.toBe('codebuild.amazonaws.com');
          }
        }
      });

      test('serviceRole getter returns undefined before bind and the explicit role after the action is added to a pipeline', () => {
        const stack = new Stack();
        const overrideRole = new iam.Role(stack, 'OverrideRole', {
          assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        });
        const sourceOutput = new codepipeline.Artifact();
        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: sourceOutput,
          project: new codebuild.PipelineProject(stack, 'CodeBuild'),
          serviceRoleOverride: overrideRole,
        });

        expect(action.serviceRole).toBeUndefined();

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
            { stageName: 'Build', actions: [action] },
          ],
        });

        expect(action.serviceRole).toBe(overrideRole);
      });
    });

    describe('auto-create CodeBuild service role for Full Clone sources (feature flag)', () => {
      const CODECONNECTIONS_ARN = 'arn:aws:codeconnections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh';
      const LEGACY_ARN = 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh';

      interface SetupOptions {
        connectionArn?: string;
        flagEnabled?: boolean;
        serviceRoleOverride?: iam.IRole;
        crossAccountKeys?: boolean;
        withOutputs?: boolean;
        importedProject?: boolean;
      }

      function setup(opts: SetupOptions = {}) {
        const connectionArn = opts.connectionArn ?? CODECONNECTIONS_ARN;
        const app = new App({
          context: opts.flagEnabled === false
            ? {}
            : { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true },
        });
        const stack = new Stack(app, 'Stack');

        const project = opts.importedProject
          ? codebuild.PipelineProject.fromProjectName(stack, 'ImportedProject', 'imported-project')
          : new codebuild.PipelineProject(stack, 'CodeBuild');

        const sourceOutput = new codepipeline.Artifact();
        const buildOutputs = opts.withOutputs ? [new codepipeline.Artifact()] : undefined;
        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: sourceOutput,
          project,
          outputs: buildOutputs,
          serviceRoleOverride: opts.serviceRoleOverride,
        });

        new codepipeline.Pipeline(stack, 'Pipeline', {
          crossAccountKeys: opts.crossAccountKeys,
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeStarConnectionsSourceAction({
                actionName: 'BitBucket',
                owner: 'aws',
                repo: 'aws-cdk',
                output: sourceOutput,
                connectionArn,
                codeBuildCloneOutput: true,
              })],
            },
            {
              stageName: 'Build',
              actions: [action],
            },
          ],
        });

        return { stack, action, template: Template.fromStack(stack) };
      }

      // Builds a pipeline whose single CodeBuildAction consumes N Full Clone inputs,
      // each from its own CodeStarConnectionsSourceAction.
      function setupMultiInput(sources: Array<{ connectionArn: string; owner: string; repo: string }>) {
        const app = new App({ context: { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true } });
        const stack = new Stack(app, 'Stack');
        const project = new codebuild.PipelineProject(stack, 'CodeBuild');

        const outputs = sources.map(() => new codepipeline.Artifact());
        const sourceActions = sources.map((s, i) => new cpactions.CodeStarConnectionsSourceAction({
          actionName: `Source${i}`,
          owner: s.owner,
          repo: s.repo,
          output: outputs[i],
          connectionArn: s.connectionArn,
          codeBuildCloneOutput: true,
        }));

        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: outputs[0],
          extraInputs: outputs.slice(1),
          project,
        });

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            { stageName: 'Source', actions: sourceActions },
            { stageName: 'Build', actions: [action] },
          ],
        });

        return { template: Template.fromStack(stack), action };
      }

      // Counts UseConnection statements across IAM policies, split by whether they
      // carry a Condition (scoped, the auto-created role) or not (broad).
      function countUseConnectionStatements(template: Template) {
        const policies = template.findResources('AWS::IAM::Policy');
        let broad = 0;
        let scoped = 0;
        for (const [logicalId, policy] of Object.entries<any>(policies)) {
          if (logicalId.includes('CodePipelineActionRole')) {
            continue; // the source action's own pipeline-role grant (pre-existing, unrelated)
          }
          for (const statement of policy.Properties.PolicyDocument.Statement) {
            const actions = Array.isArray(statement.Action) ? statement.Action : [statement.Action];
            const isUseConnection = actions.some((a: any) => typeof a === 'string' && a.endsWith(':UseConnection'));
            if (!isUseConnection) {
              continue;
            }
            if (statement.Condition) {
              scoped += 1;
            } else {
              broad += 1;
            }
          }
        }
        return { broad, scoped };
      }

      test('does not auto-create a role when the flag is off; project role keeps its broad UseConnection', () => {
        const { template } = setup({ flagEnabled: false });

        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Configuration': Match.not(Match.objectLike({ 'ServiceRoleArnOverride': Match.anyValue() })),
                }),
              ],
            }),
          ]),
        });

        const { broad, scoped } = countUseConnectionStatements(template);
        expect(broad).toBe(1);
        expect(scoped).toBe(0);
      });

      test('does not auto-create a role when an explicit serviceRoleOverride is provided; project role keeps its broad UseConnection', () => {
        const app = new App({ context: { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true } });
        const stack = new Stack(app, 'Stack');
        const role = iam.Role.fromRoleArn(stack, 'OverrideRole', 'arn:aws:iam::123456789012:role/MyCodeBuildRole');
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeStarConnectionsSourceAction({
                actionName: 'BitBucket',
                owner: 'aws',
                repo: 'aws-cdk',
                output: sourceOutput,
                connectionArn: CODECONNECTIONS_ARN,
                codeBuildCloneOutput: true,
              })],
            },
            {
              stageName: 'Build',
              actions: [new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                serviceRoleOverride: role,
              })],
            },
          ],
        });

        const template = Template.fromStack(stack);

        // uses the explicit role's ARN, not an auto-created role
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Configuration': Match.objectLike({
                    'ServiceRoleArnOverride': 'arn:aws:iam::123456789012:role/MyCodeBuildRole',
                  }),
                }),
              ],
            }),
          ]),
        });

        // explicit override is the customer's own role; we do NOT auto-create a scoped role,
        // so the project role keeps its broad grant exactly as before.
        const { broad, scoped } = countUseConnectionStatements(template);
        expect(broad).toBe(1);
        expect(scoped).toBe(0);
      });

      test('auto-created role: contains all necessary permissions', () => {
        const { action, template } = setup();

        expect(action.serviceRole).toBeDefined();

        template.hasResourceProperties('AWS::IAM::Role', {
          'AssumeRolePolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': 'sts:AssumeRole',
                'Principal': { 'Service': 'codebuild.amazonaws.com' },
              }),
            ]),
          },
        });

        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Configuration': Match.objectLike({ 'ServiceRoleArnOverride': Match.anyValue() }),
                }),
              ],
            }),
          ]),
        });
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': 'iam:PassRole',
                'Condition': { 'StringEquals': { 'iam:PassedToService': 'codebuild.amazonaws.com' } },
              }),
            ]),
          },
        });

        // baseline: logs on /aws/codebuild/<project>, report groups on <project>-*, S3 read on the artifact bucket
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                'Resource': Match.arrayWith([
                  Match.objectLike({ 'Fn::Join': ['', Match.arrayWith([':log-group:/aws/codebuild/'])] }),
                ]),
              }),
              Match.objectLike({
                'Action': [
                  'codebuild:CreateReportGroup',
                  'codebuild:CreateReport',
                  'codebuild:UpdateReport',
                  'codebuild:BatchPutTestCases',
                  'codebuild:BatchPutCodeCoverages',
                ],
                'Resource': Match.objectLike({ 'Fn::Join': ['', Match.arrayWith([':report-group/'])] }),
              }),
              Match.objectLike({
                'Action': Match.arrayWith(['s3:GetObject*', 's3:GetBucket*', 's3:List*']),
              }),
            ]),
          },
        });

        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Action': 'codeconnections:UseConnection',
                'Effect': 'Allow',
                'Resource': CODECONNECTIONS_ARN,
                'Condition': { 'StringEquals': { 'codeconnections:FullRepositoryId': 'aws/aws-cdk' } },
              },
            ]),
          },
        });

        // the broad, unconditioned project-role grant is skipped; only the scoped grant exists
        const { broad, scoped } = countUseConnectionStatements(template);
        expect(broad).toBe(0);
        expect(scoped).toBe(1);
      });

      test('auto-created role: grants S3 read/write when the action has outputs', () => {
        const { template } = setup({ withOutputs: true });

        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': Match.arrayWith(['s3:DeleteObject*', 's3:PutObject']),
              }),
            ]),
          },
        });
      });

      test('auto-created role: grants KMS encrypt/decrypt when the artifact bucket has a customer key', () => {
        const { template } = setup({ crossAccountKeys: true });

        // the KMS statement lives on the SAME policy document that carries the scoped UseConnection
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': Match.arrayWith(['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*']),
              }),
              Match.objectLike({
                'Action': 'codeconnections:UseConnection',
                'Condition': { 'StringEquals': { 'codeconnections:FullRepositoryId': 'aws/aws-cdk' } },
              }),
            ]),
          },
        });
      });

      test('derives the legacy codestar-connections prefix from the connection ARN', () => {
        const { template } = setup({ connectionArn: LEGACY_ARN });

        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Action': 'codestar-connections:UseConnection',
                'Effect': 'Allow',
                'Resource': LEGACY_ARN,
                'Condition': { 'StringEquals': { 'codestar-connections:FullRepositoryId': 'aws/aws-cdk' } },
              },
            ]),
          },
        });
      });

      test('cross-account action: auto-creates the scoped role in the project (B) account, with the PassRole grant in B', () => {
        const app = new App({ context: { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true } });
        const projectStack = new Stack(app, 'ProjectStack', {
          env: { region: 'us-west-2', account: '222222222222' },
        });

        const project = new codebuild.PipelineProject(projectStack, 'CodeBuild', {
          projectName: 'my-cross-account-project',
        });

        const pipelineStack = new Stack(app, 'PipelineStack', {
          env: { region: 'us-west-2', account: '111111111111' },
        });
        const sourceOutput = new codepipeline.Artifact();
        // no outputs → does NOT hit the pre-existing cross-account-with-outputs throw
        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: sourceOutput,
          project,
        });
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeStarConnectionsSourceAction({
                actionName: 'BitBucket',
                owner: 'aws',
                repo: 'aws-cdk',
                output: sourceOutput,
                connectionArn: CODECONNECTIONS_ARN,
                codeBuildCloneOutput: true,
              })],
            },
            { stageName: 'Build', actions: [action] },
          ],
        });

        const pipelineTemplate = Template.fromStack(pipelineStack);
        const projectTemplate = Template.fromStack(projectStack);

        expect(action.serviceRole).toBeDefined();
        expect(Stack.of(action.serviceRole!)).toBe(projectStack);
        expect(Stack.of(action.serviceRole!).account).toBe('222222222222');

        pipelineTemplate.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Configuration': Match.objectLike({ 'ServiceRoleArnOverride': Match.anyValue() }),
                }),
              ],
            }),
          ]),
        });

        // the scoped UseConnection statement lives in the project (B) stack
        projectTemplate.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Action': 'codeconnections:UseConnection',
                'Effect': 'Allow',
                'Resource': CODECONNECTIONS_ARN,
                'Condition': { 'StringEquals': { 'codeconnections:FullRepositoryId': 'aws/aws-cdk' } },
              },
            ]),
          },
        });

        // the PassRole grant lands in the project (B) stack — same-account grant
        projectTemplate.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': 'iam:PassRole',
                'Condition': { 'StringEquals': { 'iam:PassedToService': 'codebuild.amazonaws.com' } },
              }),
            ]),
          },
        });
      });

      test('imported project: skips auto-create and emits an info message pointing at serviceRoleOverride', () => {
        const { stack, action, template } = setup({ importedProject: true });

        // no auto-created role, no override in the config
        expect(action.serviceRole).toBeUndefined();
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Configuration': Match.not(Match.objectLike({ 'ServiceRoleArnOverride': Match.anyValue() })),
                }),
              ],
            }),
          ]),
        });

        Annotations.fromStack(stack).hasInfo('*', Match.stringLikeRegexp('.*serviceRoleOverride.*'));
        Annotations.fromStack(stack).hasInfo('*', Match.stringLikeRegexp('codeBuildServiceRoleNotAutoScoped'));
      });

      test('unresolved token connection ARN: skips auto-create, emits info, project role keeps its broad grant', () => {
        const app = new App({ context: { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true } });
        const stack = new Stack(app, 'Stack');
        const tokenConnectionArn = Fn.importValue('SomeExport');
        const sourceOutput = new codepipeline.Artifact();
        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: sourceOutput,
          project: new codebuild.PipelineProject(stack, 'CodeBuild'),
        });

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new cpactions.CodeStarConnectionsSourceAction({
                actionName: 'BitBucket',
                owner: 'aws',
                repo: 'aws-cdk',
                output: sourceOutput,
                connectionArn: tokenConnectionArn,
                codeBuildCloneOutput: true,
              })],
            },
            { stageName: 'Build', actions: [action] },
          ],
        });

        const template = Template.fromStack(stack);

        expect(action.serviceRole).toBeUndefined();
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'Stages': Match.arrayWith([
            Match.objectLike({
              'Name': 'Build',
              'Actions': [
                Match.objectLike({
                  'Configuration': Match.not(Match.objectLike({ 'ServiceRoleArnOverride': Match.anyValue() })),
                }),
              ],
            }),
          ]),
        });

        // info message emitted
        Annotations.fromStack(stack).hasInfo('*', Match.stringLikeRegexp('codeBuildServiceRoleNotAutoScoped'));
      });

      test('multiple Full Clone inputs: one scoped statement per connection (repos OR-ed within a connection)', () => {
        // two repos on the SAME connection (→ one statement, OR-ed repos array) and a third repo
        // on a DIFFERENT connection (→ its own dedicated statement).
        const { template } = setupMultiInput([
          { connectionArn: CODECONNECTIONS_ARN, owner: 'aws', repo: 'repo-a' },
          { connectionArn: CODECONNECTIONS_ARN, owner: 'aws', repo: 'repo-b' },
          { connectionArn: LEGACY_ARN, owner: 'aws', repo: 'repo-c' },
        ]);

        // same-connection repos collapse into ONE statement with a sorted OR-ed array
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Action': 'codeconnections:UseConnection',
                'Effect': 'Allow',
                'Resource': CODECONNECTIONS_ARN,
                'Condition': { 'StringEquals': { 'codeconnections:FullRepositoryId': ['aws/repo-a', 'aws/repo-b'] } },
              },
            ]),
          },
        });

        // the different connection gets its own dedicated statement with its own prefix
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Action': 'codestar-connections:UseConnection',
                'Effect': 'Allow',
                'Resource': LEGACY_ARN,
                'Condition': { 'StringEquals': { 'codestar-connections:FullRepositoryId': 'aws/repo-c' } },
              },
            ]),
          },
        });

        // exactly two scoped statements
        const { broad, scoped } = countUseConnectionStatements(template);
        expect(scoped).toBe(2);
        expect(broad).toBe(0);
      });

      test('CodeConnections + CodeCommit Full Clone on one action: the auto-created role also gets scoped codecommit:GitPull', () => {
        // A single action can Full Clone a CodeConnections repo (primary input) AND a CodeCommit repo
        // (extra input). The build runs as the auto-created role, so that role must carry BOTH clone
        // grants — otherwise the CodeCommit clone fails at build time with AccessDenied on GitPull.
        const app = new App({ context: { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true } });
        const stack = new Stack(app, 'Stack');
        const project = new codebuild.PipelineProject(stack, 'CodeBuild');

        const connectionOutput = new codepipeline.Artifact();
        const codeCommitOutput = new codepipeline.Artifact();
        const repo = new codecommit.Repository(stack, 'Repo', { repositoryName: 'my-repo' });

        const action = new cpactions.CodeBuildAction({
          actionName: 'CodeBuild',
          input: connectionOutput,
          extraInputs: [codeCommitOutput],
          project,
        });

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [
                new cpactions.CodeStarConnectionsSourceAction({
                  actionName: 'BitBucket',
                  owner: 'aws',
                  repo: 'aws-cdk',
                  output: connectionOutput,
                  connectionArn: CODECONNECTIONS_ARN,
                  codeBuildCloneOutput: true,
                }),
                new cpactions.CodeCommitSourceAction({
                  actionName: 'CodeCommit',
                  repository: repo,
                  output: codeCommitOutput,
                  codeBuildCloneOutput: true,
                }),
              ],
            },
            { stageName: 'Build', actions: [action] },
          ],
        });

        const template = Template.fromStack(stack);

        // both scoped clone grants live on the SAME policy document (the auto-created role's default
        // policy): the scoped UseConnection is only ever emitted onto the SRO, so co-locating GitPull
        // with it proves GitPull landed on the SRO rather than being left behind on the project role.
        template.hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              Match.objectLike({
                'Action': 'codeconnections:UseConnection',
                'Condition': { 'StringEquals': { 'codeconnections:FullRepositoryId': 'aws/aws-cdk' } },
              }),
              Match.objectLike({
                'Action': 'codecommit:GitPull',
                'Resource': { 'Fn::GetAtt': [Match.stringLikeRegexp('Repo'), 'Arn'] },
              }),
            ]),
          },
        });
      });

      test('creates distinct roles for two Full Clone actions sharing an action name in one stack', () => {
        // The scoped role lives in the (shared) project stack, and action names are only
        // unique within a stage. Two same-named Full Clone actions must therefore produce
        // distinct role logical ids, or synth would crash on a duplicate construct id.
        const app = new App({ context: { [cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE]: true } });
        const stack = new Stack(app, 'Stack');

        function addPipeline(id: string) {
          const sourceOutput = new codepipeline.Artifact();
          const action = new cpactions.CodeBuildAction({
            actionName: 'CodeBuild', // same action name on purpose
            input: sourceOutput,
            project: new codebuild.PipelineProject(stack, `${id}Project`),
          });
          new codepipeline.Pipeline(stack, id, {
            stages: [
              {
                stageName: 'Source',
                actions: [new cpactions.CodeStarConnectionsSourceAction({
                  actionName: 'BitBucket',
                  owner: 'aws',
                  repo: 'aws-cdk',
                  output: sourceOutput,
                  connectionArn: CODECONNECTIONS_ARN,
                  codeBuildCloneOutput: true,
                })],
              },
              { stageName: 'Build', actions: [action] },
            ],
          });
          return action;
        }

        const action1 = addPipeline('PipelineA');
        const action2 = addPipeline('PipelineB');

        // synth succeeds (no logical-id collision) and produces two distinct roles
        Template.fromStack(stack);
        expect(action1.serviceRole).toBeDefined();
        expect(action2.serviceRole).toBeDefined();
        expect(action1.serviceRole).not.toBe(action2.serviceRole);
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

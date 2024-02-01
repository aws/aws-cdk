import { Construct, IConstruct } from 'constructs';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Match, Template } from '../../assertions';
import { CodeStarConnectionsSourceAction } from '../../aws-codepipeline-actions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as codepipeline from '../lib';

/* eslint-disable quote-props */

describe('', () => {
  describe('Pipeline', () => {
    test('can be passed an IAM role during pipeline creation', () => {
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      });
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        role,
      });

      const sourceArtifact = new codepipeline.Artifact();
      testPipelineSetup(
        pipeline,
        [new FakeSourceAction({
          actionName: 'FakeSource',
          output: sourceArtifact,
        })],
        [new FakeBuildAction({
          actionName: 'FakeBuild',
          input: sourceArtifact,
        })],
      );

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'RoleArn': {
          'Fn::GetAtt': [
            'Role1ABCC5F0',
            'Arn',
          ],
        },
      });
    });

    test('can be imported by ARN', () => {
      const stack = new cdk.Stack();

      const pipeline = codepipeline.Pipeline.fromPipelineArn(stack, 'Pipeline',
        'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');

      expect(pipeline.pipelineArn).toEqual('arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');
      expect(pipeline.pipelineName).toEqual('MyPipeline');
    });

    test('imported pipeline has correct region and account', () => {
      const stack = new cdk.Stack(new cdk.App(), 'Stack', {
        env: {
          region: 'eu-west-1',
          account: '234567890123',
        },
      });

      const pipeline = codepipeline.Pipeline.fromPipelineArn(stack, 'Pipeline',
        'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');

      expect(pipeline.env.region).toEqual('us-east-1');
      expect(pipeline.env.account).toEqual('123456789012');
    });

    describe('that is cross-region', () => {
      test('validates that source actions are in the same region as the pipeline', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack', { env: { region: 'us-west-1', account: '123456789012' } });
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
        const sourceStage = pipeline.addStage({
          stageName: 'Source',
        });
        const sourceAction = new FakeSourceAction({
          actionName: 'FakeSource',
          output: new codepipeline.Artifact(),
          region: 'ap-southeast-1',
        });

        expect(() => {
          sourceStage.addAction(sourceAction);
        }).toThrow(/Source action 'FakeSource' must be in the same region as the pipeline/);
      });

      test('allows passing an Alias in place of the KMS Key in the replication Bucket', () => {
        const app = new cdk.App();

        const replicationRegion = 'us-west-1';
        const replicationStack = new cdk.Stack(app, 'ReplicationStack', {
          env: { region: replicationRegion, account: '123456789012' },
        });
        const replicationKey = new kms.Key(replicationStack, 'ReplicationKey');
        const replicationAlias = replicationKey.addAlias('alias/my-replication-alias');
        const replicationBucket = new s3.Bucket(replicationStack, 'ReplicationBucket', {
          encryptionKey: replicationAlias,
          bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });

        const pipelineRegion = 'us-west-2';
        const pipelineStack = new cdk.Stack(app, 'PipelineStack', {
          env: { region: pipelineRegion, account: '123456789012' },
        });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          crossRegionReplicationBuckets: {
            [replicationRegion]: replicationBucket,
          },
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                region: replicationRegion,
              })],
            },
          ],
        });

        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'ArtifactStores': [
            {
              'Region': replicationRegion,
              'ArtifactStore': {
                'Type': 'S3',
                'EncryptionKey': {
                  'Type': 'KMS',
                  'Id': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          'Ref': 'AWS::Partition',
                        },
                        ':kms:us-west-1:123456789012:alias/my-replication-alias',
                      ],
                    ],
                  },
                },
              },
            },
            {
              'Region': pipelineRegion,
            },
          ],
        });

        Template.fromStack(replicationStack).hasResourceProperties('AWS::KMS::Key', {
          'KeyPolicy': {
            'Statement': [
              {
                // owning account management permissions - we don't care about them in this test
              },
              {
                // KMS verifies whether the principal given in its key policy exists when creating that key.
                // Since the replication bucket must be deployed before the pipeline,
                // we cannot put the pipeline role as the principal here -
                // hence, we put the account itself
                'Action': [
                  'kms:Decrypt',
                  'kms:DescribeKey',
                  'kms:Encrypt',
                  'kms:ReEncrypt*',
                  'kms:GenerateDataKey*',
                ],
                'Effect': 'Allow',
                'Principal': {
                  'AWS': {
                    'Fn::Join': ['', [
                      'arn:',
                      { 'Ref': 'AWS::Partition' },
                      ':iam::123456789012:root',
                    ]],
                  },
                },
                'Resource': '*',
              },
            ],
          },
        });
      });

      test('generates ArtifactStores with the alias ARN as the KeyID', () => {
        const app = new cdk.App();
        const replicationRegion = 'us-west-1';

        const pipelineRegion = 'us-west-2';
        const pipelineStack = new cdk.Stack(app, 'MyStack', {
          env: { region: pipelineRegion, account: '123456789012' },
        });
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                region: replicationRegion,
              })],
            },
          ],
        });

        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'ArtifactStores': [
            {
              'Region': replicationRegion,
              'ArtifactStore': {
                'Type': 'S3',
                'EncryptionKey': {
                  'Type': 'KMS',
                  'Id': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          'Ref': 'AWS::Partition',
                        },
                        ':kms:us-west-1:123456789012:alias/s-west-1tencryptionalias9b344b2b8e6825cb1f7d',
                      ],
                    ],
                  },
                },
              },
            },
            {
              'Region': pipelineRegion,
            },
          ],
        });

        Template.fromStack(pipeline.crossRegionSupport[replicationRegion].stack).hasResource('AWS::KMS::Alias', {
          'DeletionPolicy': 'Delete',
          'UpdateReplacePolicy': 'Delete',
        });
      });

      test('allows passing an imported Bucket and Key for the replication Bucket', () => {
        const replicationRegion = 'us-west-1';

        const pipelineRegion = 'us-west-2';
        const pipelineStack = new cdk.Stack(undefined, undefined, {
          env: { region: pipelineRegion },
        });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          crossRegionReplicationBuckets: {
            [replicationRegion]: s3.Bucket.fromBucketAttributes(pipelineStack, 'ReplicationBucket', {
              bucketArn: 'arn:aws:s3:::my-us-west-1-replication-bucket',
              encryptionKey: kms.Key.fromKeyArn(pipelineStack, 'ReplicationKey',
                `arn:aws:kms:${replicationRegion}:123456789012:key/1234-5678-9012`,
              ),
            }),
          },
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
              })],
            },
          ],
        });

        Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          'ArtifactStores': [
            {
              'Region': replicationRegion,
              'ArtifactStore': {
                'Type': 'S3',
                'Location': 'my-us-west-1-replication-bucket',
                'EncryptionKey': {
                  'Type': 'KMS',
                  'Id': 'arn:aws:kms:us-west-1:123456789012:key/1234-5678-9012',
                },
              },
            },
            {
              'Region': pipelineRegion,
            },
          ],
        });
      });

      test('generates the support stack containing the replication Bucket without the need to bootstrap in that environment', () => {
        const app = new cdk.App({
          treeMetadata: false, // we can't set the context otherwise, because App will have a child
        });
        app.node.setContext(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT, true);

        const pipelineStack = new cdk.Stack(app, 'PipelineStack', {
          env: { region: 'us-west-2', account: '123456789012' },
        });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                region: 'eu-south-1',
              })],
            },
          ],
        });

        const assembly = app.synth();
        const supportStackArtifact = assembly.getStackByName('PipelineStack-support-eu-south-1');
        expect(supportStackArtifact.assumeRoleArn).toEqual(
          'arn:${AWS::Partition}:iam::123456789012:role/cdk-hnb659fds-deploy-role-123456789012-us-west-2');
        expect(supportStackArtifact.cloudFormationExecutionRoleArn).toEqual(
          'arn:${AWS::Partition}:iam::123456789012:role/cdk-hnb659fds-cfn-exec-role-123456789012-us-west-2');

      });

      test('generates the same support stack containing the replication Bucket without the need to bootstrap in that environment for multiple pipelines', () => {
        const app = new cdk.App();

        new ReusePipelineStack(app, 'PipelineStackA', {
          env: { region: 'us-west-2', account: '123456789012' },
        });
        new ReusePipelineStack(app, 'PipelineStackB', {
          env: { region: 'us-west-2', account: '123456789012' },
        });

        const assembly = app.synth();
        // 2 Pipeline Stacks and 1 support stack for both pipeline stacks.
        expect(assembly.stacks.length).toEqual(3);
        assembly.getStackByName('PipelineStackA-support-eu-south-1');
        expect(() => {
          assembly.getStackByName('PipelineStackB-support-eu-south-1');
        }).toThrowError(/Unable to find stack with stack name/);

      });

      test('generates the unique support stack containing the replication Bucket without the need to bootstrap in that environment for multiple pipelines', () => {
        const app = new cdk.App();

        new ReusePipelineStack(app, 'PipelineStackA', {
          env: { region: 'us-west-2', account: '123456789012' },
          reuseCrossRegionSupportStacks: false,
        });
        new ReusePipelineStack(app, 'PipelineStackB', {
          env: { region: 'us-west-2', account: '123456789012' },
          reuseCrossRegionSupportStacks: false,
        });

        const assembly = app.synth();
        // 2 Pipeline Stacks and 1 support stack for each pipeline stack.
        expect(assembly.stacks.length).toEqual(4);
        const supportStackAArtifact = assembly.getStackByName('PipelineStackA-support-eu-south-1');
        const supportStackBArtifact = assembly.getStackByName('PipelineStackB-support-eu-south-1');

        const supportStackATemplate = supportStackAArtifact.template;
        Template.fromJSON(supportStackATemplate).hasResourceProperties('AWS::S3::Bucket', {
          BucketName: 'pipelinestacka-support-eueplicationbucket8934e91f26961aa6cbfa',
        });
        Template.fromJSON(supportStackATemplate).hasResourceProperties('AWS::KMS::Alias', {
          AliasName: 'alias/pport-eutencryptionalias02f1cda3732942f6c529',
        });

        const supportStackBTemplate = supportStackBArtifact.template;
        Template.fromJSON(supportStackBTemplate).hasResourceProperties('AWS::S3::Bucket', {
          BucketName: 'pipelinestackb-support-eueplicationbucketdf7c0e10245faa377228',
        });
        Template.fromJSON(supportStackBTemplate).hasResourceProperties('AWS::KMS::Alias', {
          AliasName: 'alias/pport-eutencryptionaliasdef3fd3fec63bc54980e',
        });
      });
    });

    describe('that is cross-account', () => {
      test('does not allow passing a dynamic value in the Action account property', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack', { env: { account: '123456789012' } });
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
          ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });

        expect(() => {
          buildStage.addAction(new FakeBuildAction({
            actionName: 'FakeBuild',
            input: sourceOutput,
            account: cdk.Aws.ACCOUNT_ID,
          }));
        }).toThrow(/The 'account' property must be a concrete value \(action: 'FakeBuild'\)/);
      });

      test('does not allow an env-agnostic Pipeline Stack if an Action account has been provided', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack');
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
          ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });

        expect(() => {
          buildStage.addAction(new FakeBuildAction({
            actionName: 'FakeBuild',
            input: sourceOutput,
            account: '123456789012',
          }));
        }).toThrow(/Pipeline stack which uses cross-environment actions must have an explicitly set account/);
      });

      test('does not allow enabling key rotation if cross account keys have been disabled', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack');

        expect(() => {
          new codepipeline.Pipeline(stack, 'Pipeline', {
            crossAccountKeys: false,
            enableKeyRotation: true,
          });
        }).toThrow("Setting 'enableKeyRotation' to true also requires 'crossAccountKeys' to be enabled");
      });

      test("enabling key rotation sets 'EnableKeyRotation' to 'true' in the main generated KMS key", () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack');
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(stack, 'Pipeline', {
          enableKeyRotation: true,
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({ actionName: 'Build', input: sourceOutput })],
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
          'EnableKeyRotation': true,
        });
      });
    });

    test.each([
      [codepipeline.PipelineType.V1, 'V1'],
      [codepipeline.PipelineType.V2, 'V2'],
    ])('can specify pipeline type %s', (type, expected) => {
      const stack = new cdk.Stack();
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        pipelineType: type,
      });

      const sourceArtifact = new codepipeline.Artifact();
      const sourceActions = [new FakeSourceAction({
        actionName: 'FakeSource',
        output: sourceArtifact,
      })];
      const buildActions = [new FakeBuildAction({
        actionName: 'FakeBuild',
        input: sourceArtifact,
      })];
      testPipelineSetup(pipeline, sourceActions, buildActions);

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        PipelineType: expected,
      });
    });

    describe('pipeline-level variables', () => {
      let stack: cdk.Stack;
      let sourceArtifact: codepipeline.Artifact;
      let sourceActions: codepipeline.Action[];
      let buildActions: codepipeline.Action[];
      let variable1: codepipeline.Variable;
      let variable2: codepipeline.Variable;

      beforeEach(() => {
        stack = new cdk.Stack();
        sourceArtifact = new codepipeline.Artifact();
        sourceActions = [new FakeSourceAction({
          actionName: 'FakeSource',
          output: sourceArtifact,
        })];
        buildActions = [new FakeBuildAction({
          actionName: 'FakeBuild',
          input: sourceArtifact,
        })];
        variable1 = new codepipeline.Variable({
          variableName: 'var-name-1',
          description: 'description',
          defaultValue: 'default-value',
        });
        variable2 = new codepipeline.Variable({
          variableName: 'var-name-2',
          description: 'description',
          defaultValue: 'default-value',
        });
      });

      test('can specify pipeline-level variables', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          pipelineType: codepipeline.PipelineType.V2,
          variables: [variable1],
        });

        testPipelineSetup(pipeline, sourceActions, buildActions);

        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          PipelineType: 'V2',
          Variables: [{
            Name: 'var-name-1',
            Description: 'description',
            DefaultValue: 'default-value',
          }],
        });
      });

      test('can specify pipeline-level multiple variables', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          pipelineType: codepipeline.PipelineType.V2,
          variables: [variable1, variable2],
        });

        testPipelineSetup(pipeline, sourceActions, buildActions);

        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          PipelineType: 'V2',
          Variables: [
            {
              Name: 'var-name-1',
              Description: 'description',
              DefaultValue: 'default-value',
            },
            {
              Name: 'var-name-2',
              Description: 'description',
              DefaultValue: 'default-value',
            },
          ],
        });
      });

      test('can specify pipeline-level variables by addVariable method', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          pipelineType: codepipeline.PipelineType.V2,
        });
        pipeline.addVariable(variable1);

        testPipelineSetup(pipeline, sourceActions, buildActions);

        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          PipelineType: 'V2',
          Variables: [{
            Name: 'var-name-1',
            Description: 'description',
            DefaultValue: 'default-value',
          }],
        });
      });

      test('can reference in a format `#{variables.${this.variableName}}`', () => {
        expect(variable1.reference()).toEqual('#{variables.var-name-1}');
      });

      test('validate if pipeline-level variables are specified when pipelineType is not set to V2', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          variables: [variable1],
        });

        testPipelineSetup(pipeline, sourceActions, buildActions);

        const errors = validate(stack);

        expect(errors.length).toEqual(1);
        const error = errors[0];
        expect(error).toMatch(/Pipeline variables can only be used with V2 pipelines/);
      });

      test('validate if pipeline-level variables are specified when pipelineType is not set to V2 and addVariable method is used', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {});
        pipeline.addVariable(variable1);

        testPipelineSetup(pipeline, sourceActions, buildActions);

        const errors = validate(stack);

        expect(errors.length).toEqual(1);
        const error = errors[0];
        expect(error).toMatch(/Pipeline variables can only be used with V2 pipelines/);
      });

      test('throw if name for pipeline-level variable uses invalid character', () => {
        expect(() => {
          new codepipeline.Variable({
            variableName: 'var name',
            description: 'description',
            defaultValue: 'default-value',
          });
        }).toThrow('Variable name must match regular expression: /^[A-Za-z0-9@\\-_]{1,128}$/, got \'var name\'');
      });

      test('throw if length of name for pipeline-level variable is less than 1', () => {
        expect(() => {
          new codepipeline.Variable({
            variableName: '',
            description: 'description',
            defaultValue: 'default-value',
          });
        }).toThrow('Variable name must match regular expression: /^[A-Za-z0-9@\\-_]{1,128}$/, got \'\'');
      });

      test('throw if length of name for pipeline-level variable is greater than 128', () => {
        expect(() => {
          new codepipeline.Variable({
            variableName: 'a'.repeat(129),
            description: 'description',
            defaultValue: 'default-value',
          });
        }).toThrow(`Variable name must match regular expression: /^[A-Za-z0-9@\\-_]{1,128}$/, got '${'a'.repeat(129)}'`);
      });

      test('throw if length of default value for pipeline-level variable is less than 1', () => {
        expect(() => {
          new codepipeline.Variable({
            variableName: 'var-name-1',
            description: 'description',
            defaultValue: '',
          });
        }).toThrow(/Default value for variable 'var-name-1' must be between 1 and 1000 characters long, got 0/);
      });

      test('throw if length of default value for pipeline-level variable is greater than 1000', () => {
        expect(() => {
          new codepipeline.Variable({
            variableName: 'var-name-1',
            description: 'description',
            defaultValue: 'a'.repeat(1001),
          });
        }).toThrow(/Default value for variable 'var-name-1' must be between 1 and 1000 characters long, got 1001/);
      });

      test('throw if length of description for pipeline-level variable is greater than 200', () => {
        expect(() => {
          new codepipeline.Variable({
            variableName: 'var-name-1',
            description: 'a'.repeat(201),
            defaultValue: 'default',
          });
        }).toThrow(/Description for variable 'var-name-1' must not be greater than 200 characters long, got 201/);
      });
    });

    describe('triggers', () => {
      let stack: cdk.Stack;
      let sourceArtifact: codepipeline.Artifact;
      let sourceAction: codepipeline.Action;
      let buildAction: codepipeline.Action;

      beforeEach(() => {
        stack = new cdk.Stack();
        sourceArtifact = new codepipeline.Artifact();
        sourceAction = new CodeStarConnectionsSourceAction({
          actionName: 'CodeStarConnectionsSourceAction',
          output: sourceArtifact,
          connectionArn: 'connection',
          owner: 'owner',
          repo: 'repo',
        });
        buildAction = new FakeBuildAction({
          actionName: 'FakeBuild',
          input: sourceArtifact,
        });
      });

      test('can specify triggers', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          pipelineType: codepipeline.PipelineType.V2,
          triggers: [{
            providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
            gitConfiguration: {
              sourceAction,
              pushFilter: [{
                excludedTags: ['exclude1', 'exclude2'],
                includedTags: ['include1', 'include2'],
              }],
            },
          }],
        });

        testPipelineSetup(pipeline, [sourceAction], [buildAction]);

        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          PipelineType: 'V2',
          Triggers: [{
            GitConfiguration: {
              SourceActionName: 'CodeStarConnectionsSourceAction',
              Push: [{
                Tags: {
                  Excludes: ['exclude1', 'exclude2'],
                  Includes: ['include1', 'include2'],
                },
              }],
            },
            ProviderType: 'CodeStarSourceConnection',
          }],
        });
      });

      test('empty excludedTags for trigger is set to undefined', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          pipelineType: codepipeline.PipelineType.V2,
          triggers: [{
            providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
            gitConfiguration: {
              sourceAction,
              pushFilter: [{
                excludedTags: [],
                includedTags: ['include1', 'include2'],
              }],
            },
          }],
        });

        testPipelineSetup(pipeline, [sourceAction], [buildAction]);

        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          PipelineType: 'V2',
          Triggers: [{
            GitConfiguration: {
              SourceActionName: 'CodeStarConnectionsSourceAction',
              Push: [{
                Tags: {
                  Excludes: Match.absent(),
                  Includes: ['include1', 'include2'],
                },
              }],
            },
            ProviderType: 'CodeStarSourceConnection',
          }],
        });
      });

      test('empty includedTags for trigger is set to undefined', () => {
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          pipelineType: codepipeline.PipelineType.V2,
          triggers: [{
            providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
            gitConfiguration: {
              sourceAction,
              pushFilter: [{
                excludedTags: ['excluded1', 'excluded2'],
                includedTags: [],
              }],
            },
          }],
        });

        testPipelineSetup(pipeline, [sourceAction], [buildAction]);

        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
          PipelineType: 'V2',
          Triggers: [{
            GitConfiguration: {
              SourceActionName: 'CodeStarConnectionsSourceAction',
              Push: [{
                Tags: {
                  Excludes: ['excluded1', 'excluded2'],
                  Includes: Match.absent(),
                },
              }],
            },
            ProviderType: 'CodeStarSourceConnection',
          }],
        });
      });

      test('throw if length of excludes is greater than 8', () => {
        expect(() => {
          new codepipeline.Pipeline(stack, 'Pipeline', {
            pipelineType: codepipeline.PipelineType.V2,
            triggers: [{
              providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
              gitConfiguration: {
                sourceAction,
                pushFilter: [{
                  excludedTags: ['exclude1', 'exclude2', 'exclude3', 'exclude4', 'exclude5', 'exclude6', 'exclude7', 'exclude8', 'exclude9'],
                  includedTags: ['include1', 'include2'],
                }],
              },
            }],
          });
        }).toThrow(/maximum length of excludedTags is 8, got 9 at triggers\[0\].gitConfiguration.pushFilter\[0\]/);
      });

      test('throw if length of excludes is greater than 8', () => {
        expect(() => {
          new codepipeline.Pipeline(stack, 'Pipeline', {
            pipelineType: codepipeline.PipelineType.V2,
            triggers: [{
              providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
              gitConfiguration: {
                sourceAction,
                pushFilter: [{
                  excludedTags: ['exclude1', 'exclude2'],
                  includedTags: ['include1', 'include2', 'include3', 'include4', 'include5', 'include6', 'include7', 'include8', 'include9'],
                }],
              },
            }],
          });
        }).toThrow(/maximum length of includedTags is 8, got 9 at triggers\[0\].gitConfiguration.pushFilter\[0\]/);
      });

      test('throw if provider of sourceAction is not \'CodeStarSourceConnection\'', () => {
        const fakeAction = new FakeSourceAction({
          actionName: 'FakeSource',
          output: sourceArtifact,
        });

        expect(() => {
          new codepipeline.Pipeline(stack, 'Pipeline', {
            pipelineType: codepipeline.PipelineType.V2,
            triggers: [{
              providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
              gitConfiguration: {
                sourceAction: fakeAction,
                pushFilter: [{
                  excludedTags: ['exclude1', 'exclude2'],
                  includedTags: ['include1', 'include2'],
                }],
              },
            }],
          });
        }).toThrow(/provider for actionProperties in sourceAction must be 'CodeStarSourceConnection', got 'Fake' at triggers\[0\]/);
      });

      test('throw if triggers are specified when pipelineType is not set to V2', () => {
        expect(() => {
          new codepipeline.Pipeline(stack, 'Pipeline', {
            pipelineType: codepipeline.PipelineType.V1,
            triggers: [{
              providerType: codepipeline.ProviderType.CODE_STAR_SOURCE_CONNECTION,
              gitConfiguration: {
                sourceAction,
                pushFilter: [{
                  excludedTags: ['exclude1', 'exclude2'],
                  includedTags: ['include1', 'include2'],
                }],
              },
            }],
          });
        }).toThrow(/triggers can only be used with V2 pipelines/);
      });
    });
  });

  describe('cross account key alias name tests', () => {
    const kmsAliasResource = 'AWS::KMS::Alias';

    test('cross account key alias is named with stack name instead of ID when feature flag is enabled', () => {
      const stack = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name',
        stackId: 'PipelineStack',
      });

      Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-name-pipeline-0a412eb5',
      });
    });

    test('cross account key alias is named with stack ID when feature flag is not enabled', () => {
      const stack = createPipelineStack({
        suffix: 'Name',
        stackId: 'PipelineStack',
      });

      Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-pipelinestackpipeline9db740af',
      });
    });

    test('cross account key alias is named with generated stack name when stack name is undefined and feature flag is enabled', () => {
      const stack = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name',
        stackId: 'PipelineStack',
        undefinedStackName: true,
      });

      Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-pipelinestack-pipeline-9db740af',
      });
    });

    test('cross account key alias is named with stack ID when stack name is not present and feature flag is not enabled', () => {
      const stack = createPipelineStack({
        suffix: 'Name',
        stackId: 'PipelineStack',
        undefinedStackName: true,
      });

      Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-pipelinestackpipeline9db740af',
      });
    });

    test('cross account key alias is named with stack name and nested stack ID when feature flag is enabled', () => {
      const stack = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name',
        stackId: 'TopLevelStack',
        nestedStackId: 'NestedPipelineStack',
        pipelineId: 'ActualPipeline',
      });

      Template.fromStack(stack.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-name-nestedpipelinestack-actualpipeline-23a98110',
      });
    });

    test('cross account key alias is named with stack ID and nested stack ID when stack name is present and feature flag is not enabled', () => {
      const stack = createPipelineStack({
        suffix: 'Name',
        stackId: 'TopLevelStack',
        nestedStackId: 'NestedPipelineStack',
        pipelineId: 'ActualPipeline',
      });

      Template.fromStack(stack.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-toplevelstacknestedpipelinestackactualpipeline3161a537',
      });
    });

    test('cross account key alias is named with generated stack name and nested stack ID when stack name is undefined and feature flag is enabled', () => {
      const stack = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name',
        stackId: 'TopLevelStack',
        nestedStackId: 'NestedPipelineStack',
        pipelineId: 'ActualPipeline',
        undefinedStackName: true,
      });

      Template.fromStack(stack.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-toplevelstack-nestedpipelinestack-actualpipeline-3161a537',
      });
    });

    test('cross account key alias is named with stack ID and nested stack ID when stack name is not present and feature flag is not enabled', () => {
      const stack = createPipelineStack({
        suffix: 'Name',
        stackId: 'TopLevelStack',
        nestedStackId: 'NestedPipelineStack',
        pipelineId: 'ActualPipeline',
        undefinedStackName: true,
      });

      Template.fromStack(stack.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-toplevelstacknestedpipelinestackactualpipeline3161a537',
      });
    });

    test('cross account key alias is properly shortened to 256 characters when stack name is too long and feature flag is enabled', () => {
      const stack = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'NeedsToBeShortenedDueToTheLengthOfThisAbsurdNameThatNoOneShouldUseButItStillMightHappenSoWeMustTestForTheTestCase',
        stackId: 'too-long',
        pipelineId: 'ActualPipelineWithExtraSuperLongNameThatWillNeedToBeShortenedDueToTheAlsoVerySuperExtraLongNameOfTheStack-AlsoWithSomeDifferentCharactersAddedToTheEnd',
      });

      Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-needstobeshortenedduetothelengthofthisabsurdnamethatnooneshouldusebutitstillmighthappensowemusttestfohatwillneedtobeshortenedduetothealsoverysuperextralongnameofthestack-alsowithsomedifferentcharactersaddedtotheend-384b9343',
      });
    });

    test('cross account key alias is properly shortened to 256 characters when stack name is too long and feature flag is not enabled', () => {
      const stack = createPipelineStack({
        suffix: 'too-long',
        stackId: 'NeedsToBeShortenedDueToTheLengthOfThisAbsurdNameThatNoOneShouldUseButItStillMightHappenSoWeMustTestForTheTestCase',
        pipelineId: 'ActualPipelineWithExtraSuperLongNameThatWillNeedToBeShortenedDueToTheAlsoVerySuperExtraLongNameOfTheStack-AlsoWithSomeDifferentCharactersAddedToTheEnd',
      });

      Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-ortenedduetothelengthofthisabsurdnamethatnooneshouldusebutitstillmighthappensowemusttestforthetestcaseactualpipelinewithextrasuperlongnamethatwillneedtobeshortenedduetothealsoverysuperextralongnameofthestackalsowithsomedifferentc498e0672',
      });
    });

    test('cross account key alias names do not conflict when the stack ID is the same and pipeline ID is the same and feature flag is enabled', () => {
      const stack1 = createPipelineStack({
        withFeatureFlag: true,
        suffix: '1',
        stackId: 'STACK-ID',
      });

      const stack2 = createPipelineStack({
        withFeatureFlag: true,
        suffix: '2',
        stackId: 'STACK-ID',
      });

      expect(Template.fromStack(stack1).findResources(kmsAliasResource)).not.toEqual(Template.fromStack(stack2).findResources(kmsAliasResource));

      Template.fromStack(stack1).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-1-pipeline-b09fefee',
      });

      Template.fromStack(stack2).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-2-pipeline-f46258fe',
      });
    });

    test('cross account key alias names do conflict when the stack ID is the same and pipeline ID is the same when feature flag is not enabled', () => {
      const stack1 = createPipelineStack({
        suffix: '1',
        stackId: 'STACK-ID',
      });

      const stack2 = createPipelineStack({
        suffix: '2',
        stackId: 'STACK-ID',
      });

      expect(Template.fromStack(stack1).findResources(kmsAliasResource)).toEqual(Template.fromStack(stack2).findResources(kmsAliasResource));

      Template.fromStack(stack1).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-stackidpipeline32fb88b3',
      });

      Template.fromStack(stack2).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-stackidpipeline32fb88b3',
      });
    });

    test('cross account key alias names do not conflict for nested stacks when pipeline ID is the same and nested stacks have the same ID when feature flag is enabled', () => {
      const stack1 = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name-1',
        stackId: 'STACK-ID',
        nestedStackId: 'Nested',
        pipelineId: 'PIPELINE-ID',
      });
      const stack2 = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name-2',
        stackId: 'STACK-ID',
        nestedStackId: 'Nested',
        pipelineId: 'PIPELINE-ID',
      });

      expect(Template.fromStack(stack1.nestedStack!).findResources(kmsAliasResource))
        .not.toEqual(Template.fromStack(stack2.nestedStack!).findResources(kmsAliasResource));

      Template.fromStack(stack1.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-name-1-nested-pipeline-id-c8c9f252',
      });

      Template.fromStack(stack2.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-name-2-nested-pipeline-id-aff6dd63',
      });
    });

    test('cross account key alias names do conflict for nested stacks when pipeline ID is the same and nested stacks have the same ID when feature flag is not enabled', () => {
      const stack1 = createPipelineStack({
        suffix: '1',
        stackId: 'STACK-ID',
        nestedStackId: 'Nested',
        pipelineId: 'PIPELINE-ID',
      });
      const stack2 = createPipelineStack({
        suffix: '2',
        stackId: 'STACK-ID',
        nestedStackId: 'Nested',
        pipelineId: 'PIPELINE-ID',
      });

      expect(Template.fromStack(stack1.nestedStack!).findResources(kmsAliasResource))
        .toEqual(Template.fromStack(stack2.nestedStack!).findResources(kmsAliasResource));

      Template.fromStack(stack1.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-stackidnestedpipelineid3e91360a',
      });

      Template.fromStack(stack2.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-stackidnestedpipelineid3e91360a',
      });
    });

    test('cross account key alias names do not conflict for nested stacks when in the same stack but nested stacks have different IDs when feature flag is enabled', () => {
      const stack = createPipelineStack({
        withFeatureFlag: true,
        suffix: 'Name-1',
        stackId: 'STACK-ID',
        nestedStackId: 'First',
        pipelineId: 'PIPELINE-ID',
      });
      const nestedStack2 = new cdk.NestedStack(stack, 'Second');
      createPipelineWithSourceAndBuildStages(nestedStack2, 'Actual-Pipeline-Name-2', 'PIPELINE-ID');

      expect(Template.fromStack(stack.nestedStack!).findResources(kmsAliasResource))
        .not.toEqual(Template.fromStack(nestedStack2).findResources(kmsAliasResource));

      Template.fromStack(stack.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-name-1-first-pipeline-id-3c59cb88',
      });

      Template.fromStack(nestedStack2).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-actual-stack-name-1-second-pipeline-id-16143d12',
      });
    });

    test('cross account key alias names do not conflict for nested stacks when in the same stack but nested stacks have different IDs when feature flag is not enabled', () => {
      const stack = createPipelineStack({
        suffix: 'Name-1',
        stackId: 'STACK-ID',
        nestedStackId: 'First',
        pipelineId: 'PIPELINE-ID',
      });
      const nestedStack2 = new cdk.NestedStack(stack, 'Second');
      createPipelineWithSourceAndBuildStages(nestedStack2, 'Actual-Pipeline-Name-2', 'PIPELINE-ID');

      expect(Template.fromStack(stack.nestedStack!).findResources(kmsAliasResource))
        .not.toEqual(Template.fromStack(nestedStack2).findResources(kmsAliasResource));

      Template.fromStack(stack.nestedStack!).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-stackidfirstpipelineid5abca693',
      });

      Template.fromStack(nestedStack2).hasResourceProperties(kmsAliasResource, {
        AliasName: 'alias/codepipeline-stackidsecondpipelineid288ce778',
      });
    });
  });
});

describe('test with shared setup', () => {
  let stack: cdk.Stack;
  let sourceArtifact: codepipeline.Artifact;
  beforeEach(() => {
    stack = new cdk.Stack();
    sourceArtifact = new codepipeline.Artifact();
  });

  test('can add actions to stages after creation', () => {
    // GIVEN
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [new FakeSourceAction({ actionName: 'Fetch', output: sourceArtifact })],
        },
        {
          stageName: 'Build',
          actions: [new FakeBuildAction({ actionName: 'Gcc', input: sourceArtifact })],
        },
      ],
    });

    // WHEN
    pipeline.stage('Build').addAction(new FakeBuildAction({ actionName: 'debug.com', input: sourceArtifact }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Name: 'Build',
        Actions: [
          Match.objectLike({ Name: 'Gcc' }),
          Match.objectLike({ Name: 'debug.com' }),
        ],
      }]),
    });
  });
});

interface ReusePipelineStackProps extends cdk.StackProps {
  reuseCrossRegionSupportStacks?: boolean;
}

class ReusePipelineStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: ReusePipelineStackProps ) {
    super(scope, id, props);
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    new codepipeline.Pipeline(this, 'Pipeline', {
      reuseCrossRegionSupportStacks: props.reuseCrossRegionSupportStacks,
      stages: [
        {
          stageName: 'Source',
          actions: [new FakeSourceAction({
            actionName: 'Source',
            output: sourceOutput,
          })],
        },
        {
          stageName: 'Build',
          actions: [new FakeBuildAction({
            actionName: 'Build',
            input: sourceOutput,
            region: 'eu-south-1',
            output: buildOutput,
          })],
        },
        {
          stageName: 'Deploy',
          actions: [new FakeBuildAction({
            actionName: 'Deploy',
            input: buildOutput,
            region: 'eu-south-1',
          })],
        },
      ],
    });
  }
}

interface PipelineStackProps extends cdk.StackProps {
  readonly nestedStackId?: string;
  readonly pipelineName: string;
  readonly pipelineId?: string;
}

class PipelineStack extends cdk.Stack {
  nestedStack?: cdk.NestedStack;
  pipeline: codepipeline.Pipeline;

  constructor(scope?: Construct, id?: string, props?: PipelineStackProps) {
    super (scope, id, props);

    props?.nestedStackId ? this.nestedStack = new cdk.NestedStack(this, props!.nestedStackId!) : undefined;
    this.pipeline = createPipelineWithSourceAndBuildStages(this.nestedStack || this, props?.pipelineName, props?.pipelineId);
  }
}

function createPipelineWithSourceAndBuildStages(scope: Construct, pipelineName?: string, pipelineId: string = 'Pipeline') {
  const artifact = new codepipeline.Artifact();
  return new codepipeline.Pipeline(scope, pipelineId, {
    pipelineName,
    crossAccountKeys: true,
    reuseCrossRegionSupportStacks: false,
    stages: [
      {
        stageName: 'Source',
        actions: [new FakeSourceAction({ actionName: 'Source', output: artifact })],
      },
      {
        stageName: 'Build',
        actions: [new FakeBuildAction({ actionName: 'Build', input: artifact })],
      },
    ],
  });
};

interface CreatePipelineStackOptions {
  readonly withFeatureFlag?: boolean,
  readonly suffix: string,
  readonly stackId?: string,
  readonly pipelineId?: string,
  readonly undefinedStackName?: boolean,
  readonly nestedStackId?: string,
}

function createPipelineStack(options: CreatePipelineStackOptions): PipelineStack {
  const context = options.withFeatureFlag ? { context: { [cxapi.CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME]: true } } : undefined;
  return new PipelineStack(new cdk.App(context), options.stackId, {
    stackName: options.undefinedStackName ? undefined : `Actual-Stack-${options.suffix}`,
    nestedStackId: options.nestedStackId,
    pipelineName: `Actual-Pipeline-${options.suffix}`.substring(0, 100),
    pipelineId: options.pipelineId,
  });
};

function validate(construct: IConstruct): string[] {
  try {
    (construct.node.root as cdk.App).synth();
    return [];
  } catch (err: any) {
    if (!('message' in err) || !err.message.startsWith('Validation failed')) {
      throw err;
    }
    return err.message.split('\n').slice(1);
  }
}

// Adding 2 stages with actions so pipeline validation will pass
function testPipelineSetup(pipeline: codepipeline.Pipeline, sourceActions?: codepipeline.IAction[], buildActions?: codepipeline.IAction[]) {
  pipeline.addStage({
    stageName: 'Source',
    actions: sourceActions,
  });

  pipeline.addStage({
    stageName: 'Build',
    actions: buildActions,
  });
}
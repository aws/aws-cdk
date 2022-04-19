import { Template } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import { App, Aws, CfnParameter, ConstructNode, SecretValue, Stack } from '@aws-cdk/core';
import * as cpactions from '../lib';

/* eslint-disable quote-props */

describe('pipeline', () => {
  test('basic pipeline', () => {
    const stack = new Stack();

    const repository = new codecommit.Repository(stack, 'MyRepo', {
      repositoryName: 'my-repo',
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    const sourceOutput = new codepipeline.Artifact('SourceArtifact');
    const source = new cpactions.CodeCommitSourceAction({
      actionName: 'source',
      output: sourceOutput,
      repository,
    });
    pipeline.addStage({
      stageName: 'source',
      actions: [source],
    });

    const project = new codebuild.PipelineProject(stack, 'MyBuildProject');
    pipeline.addStage({
      stageName: 'build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'build',
          input: sourceOutput,
          project,
        }),
      ],
    });

    expect(Template.fromStack(stack).toJSON()).not.toEqual({});
    expect([]).toEqual(ConstructNode.validate(pipeline.node));

  });

  test('Tokens can be used as physical names of the Pipeline', () => {
    const stack = new Stack(undefined, 'StackName');

    const p = new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineName: Aws.STACK_NAME,
    });
    p.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.unsafePlainText('secret'),
          owner: 'foo',
          repo: 'bar',
          trigger: cpactions.GitHubTrigger.POLL,
        }),
      ],
    });

    p.addStage({
      stageName: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Name': {
        'Ref': 'AWS::StackName',
      },
    });


  });

  test('pipeline with GitHub source with poll trigger', () => {
    const stack = new Stack();

    const secret = new CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    p.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.unsafePlainText(secret.valueAsString),
          owner: 'foo',
          repo: 'bar',
          trigger: cpactions.GitHubTrigger.POLL,
        }),
      ],
    });

    p.addStage({
      stageName: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Webhook', 0);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Actions': [
            {
              'Configuration': {
                'PollForSourceChanges': true,
              },
              'Name': 'GH',
            },
          ],
          'Name': 'Source',
        },
        {
          'Actions': [
            {
              'Name': 'Boo',
            },
          ],
          'Name': 'Two',
        },
      ],
    });


  });

  test('pipeline with GitHub source without triggers', () => {
    const stack = new Stack();

    const secret = new CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    p.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.unsafePlainText(secret.valueAsString),
          owner: 'foo',
          repo: 'bar',
          trigger: cpactions.GitHubTrigger.NONE,
        }),
      ],
    });

    p.addStage({
      stageName: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Webhook', 0);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Actions': [
            {
              'Configuration': {
                'PollForSourceChanges': false,
              },
              'Name': 'GH',
            },
          ],
          'Name': 'Source',
        },
        {
          'Actions': [
            {
              'Name': 'Boo',
            },
          ],
          'Name': 'Two',
        },
      ],
    });


  });

  test('github action uses ThirdParty owner', () => {
    const stack = new Stack();

    const secret = new CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    p.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.unsafePlainText(secret.valueAsString),
          owner: 'foo',
          repo: 'bar',
        }),
      ],
    });

    p.addStage({
      stageName: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Webhook', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'ArtifactStore': {
        'Location': {
          'Ref': 'PArtifactsBucket5E711C12',
        },
        'Type': 'S3',
      },
      'RoleArn': {
        'Fn::GetAtt': [
          'PRole07BDC907',
          'Arn',
        ],
      },
      'Stages': [
        {
          'Actions': [
            {
              'ActionTypeId': {
                'Category': 'Source',
                'Owner': 'ThirdParty',
                'Provider': 'GitHub',
                'Version': '1',
              },
              'Configuration': {
                'Owner': 'foo',
                'Repo': 'bar',
                'Branch': 'branch',
                'OAuthToken': {
                  'Ref': 'GitHubToken',
                },
                'PollForSourceChanges': false,
              },
              'Name': 'GH',
              'OutputArtifacts': [
                {
                  'Name': 'A',
                },
              ],
              'RunOrder': 8,
            },
          ],
          'Name': 'Source',
        },
        {
          'Actions': [
            {
              'ActionTypeId': {
                'Category': 'Approval',
                'Owner': 'AWS',
                'Provider': 'Manual',
                'Version': '1',
              },
              'Name': 'Boo',
              'RunOrder': 1,
            },
          ],
          'Name': 'Two',
        },
      ],
    });

    expect([]).toEqual(ConstructNode.validate(p.node));

  });

  test('onStateChange', () => {
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    const pipeline = new codepipeline.Pipeline(stack, 'PL');

    pipeline.addStage({
      stageName: 'S1',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'A1',
          output: new codepipeline.Artifact('Artifact'),
          bucket: new s3.Bucket(stack, 'Bucket'),
          bucketKey: 'Key',
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'S2',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'A2' }),
      ],
    });

    pipeline.onStateChange('OnStateChange', {
      target: new targets.SnsTopic(topic),
      description: 'desc',
      eventPattern: {
        detail: {
          state: ['FAILED'],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      'Description': 'desc',
      'EventPattern': {
        'detail': {
          'state': [
            'FAILED',
          ],
        },
        'detail-type': [
          'CodePipeline Pipeline Execution State Change',
        ],
        'source': [
          'aws.codepipeline',
        ],
        'resources': [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  'Ref': 'AWS::Partition',
                },
                ':codepipeline:',
                {
                  'Ref': 'AWS::Region',
                },
                ':',
                {
                  'Ref': 'AWS::AccountId',
                },
                ':',
                {
                  'Ref': 'PLD5425AEA',
                },
              ],
            ],
          },
        ],
      },
      'State': 'ENABLED',
      'Targets': [
        {
          'Arn': {
            'Ref': 'TopicBFC7AF6E',
          },
          'Id': 'Target0',
        },
      ],
    });

    expect([]).toEqual(ConstructNode.validate(pipeline.node));

  });

  describe('PipelineProject', () => {
    describe('with a custom Project Name', () => {
      test('sets the source and artifacts to CodePipeline', () => {
        const stack = new Stack();

        new codebuild.PipelineProject(stack, 'MyProject', {
          projectName: 'MyProject',
        });

        Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
          'Name': 'MyProject',
          'Source': {
            'Type': 'CODEPIPELINE',
          },
          'Artifacts': {
            'Type': 'CODEPIPELINE',
          },
          'ServiceRole': {
            'Fn::GetAtt': [
              'MyProjectRole9BBE5233',
              'Arn',
            ],
          },
          'Environment': {
            'Type': 'LINUX_CONTAINER',
            'PrivilegedMode': false,
            'Image': 'aws/codebuild/standard:1.0',
            'ComputeType': 'BUILD_GENERAL1_SMALL',
          },
        });


      });
    });
  });

  test('Lambda PipelineInvokeAction can be used to invoke Lambda functions from a CodePipeline', () => {
    const stack = new Stack();

    const lambdaFun = new lambda.Function(stack, 'Function', {
      code: new lambda.InlineCode('bla'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

    const bucket = new s3.Bucket(stack, 'Bucket');
    const source1Output = new codepipeline.Artifact('sourceArtifact1');
    const source1 = new cpactions.S3SourceAction({
      actionName: 'SourceAction1',
      bucketKey: 'some/key',
      output: source1Output,
      bucket,
    });
    const source2Output = new codepipeline.Artifact('sourceArtifact2');
    const source2 = new cpactions.S3SourceAction({
      actionName: 'SourceAction2',
      bucketKey: 'another/key',
      output: source2Output,
      bucket,
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        source1,
        source2,
      ],
    });

    const lambdaAction = new cpactions.LambdaInvokeAction({
      actionName: 'InvokeAction',
      lambda: lambdaFun,
      inputs: [
        source2Output,
        source1Output,
      ],
      outputs: [
        new codepipeline.Artifact('lambdaOutput1'),
        new codepipeline.Artifact('lambdaOutput2'),
        new codepipeline.Artifact('lambdaOutput3'),
      ],
    });
    pipeline.addStage({
      stageName: 'Stage',
      actions: [lambdaAction],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'ArtifactStore': {
        'Location': {
          'Ref': 'PipelineArtifactsBucket22248F97',
        },
        'Type': 'S3',
      },
      'RoleArn': {
        'Fn::GetAtt': [
          'PipelineRoleD68726F7',
          'Arn',
        ],
      },
      'Stages': [
        {
          'Name': 'Source',
        },
        {
          'Actions': [
            {
              'ActionTypeId': {
                'Category': 'Invoke',
                'Owner': 'AWS',
                'Provider': 'Lambda',
                'Version': '1',
              },
              'Configuration': {
                'FunctionName': {
                  'Ref': 'Function76856677',
                },
              },
              'InputArtifacts': [
                { 'Name': 'sourceArtifact2' },
                { 'Name': 'sourceArtifact1' },
              ],
              'Name': 'InvokeAction',
              'OutputArtifacts': [
                { 'Name': 'lambdaOutput1' },
                { 'Name': 'lambdaOutput2' },
                { 'Name': 'lambdaOutput3' },
              ],
              'RunOrder': 1,
            },
          ],
          'Name': 'Stage',
        },
      ],
    });

    expect((lambdaAction.actionProperties.outputs || []).length).toEqual(3);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'codepipeline:PutJobSuccessResult',
              'codepipeline:PutJobFailureResult',
            ],
            'Effect': 'Allow',
            'Resource': '*',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'FunctionServiceRoleDefaultPolicy2F49994A',
      'Roles': [
        {
          'Ref': 'FunctionServiceRole675BB04A',
        },
      ],
    });


  });

  describe('cross-region Pipeline', () => {
    test('generates the required Action & ArtifactStores properties in the template', () => {
      const pipelineRegion = 'us-west-2';
      const pipelineAccount = '123';

      const app = new App();

      const stack = new Stack(app, 'TestStack', {
        env: {
          region: pipelineRegion,
          account: pipelineAccount,
        },
      });
      const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
        crossRegionReplicationBuckets: {
          'us-west-1': s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'sfo-replication-bucket'),
        },
      });

      const sourceBucket = new s3.Bucket(stack, 'MyBucket');
      const sourceOutput = new codepipeline.Artifact('SourceOutput');
      const sourceAction = new cpactions.S3SourceAction({
        actionName: 'BucketSource',
        bucketKey: '/some/key',
        output: sourceOutput,
        bucket: sourceBucket,
      });
      pipeline.addStage({
        stageName: 'Stage1',
        actions: [sourceAction],
      });

      pipeline.addStage({
        stageName: 'Stage2',
        actions: [
          new cpactions.CloudFormationCreateReplaceChangeSetAction({
            actionName: 'Action1',
            changeSetName: 'ChangeSet',
            templatePath: sourceOutput.atPath('template.yaml'),
            stackName: 'SomeStack',
            region: pipelineRegion,
            adminPermissions: false,
          }),
          new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'Action2',
            templatePath: sourceOutput.atPath('template.yaml'),
            stackName: 'OtherStack',
            region: 'us-east-1',
            adminPermissions: false,
          }),
          new cpactions.CloudFormationExecuteChangeSetAction({
            actionName: 'Action3',
            changeSetName: 'ChangeSet',
            stackName: 'SomeStack',
            region: 'us-west-1',
          }),
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'ArtifactStores': [
          {
            'Region': 'us-west-1',
            'ArtifactStore': {
              'Type': 'S3',
              'Location': 'sfo-replication-bucket',
            },
          },
          {
            'Region': 'us-east-1',
            'ArtifactStore': {
              'Type': 'S3',
              'Location': 'teststack-support-us-easteplicationbucket1a8063b3cdac6e7e0e73',
            },
          },
          {
            'Region': 'us-west-2',
            'ArtifactStore': {
              'Type': 'S3',
              'EncryptionKey': {
                'Type': 'KMS',
                'Id': {
                },
              },
            },
          },
        ],
        'Stages': [
          {
            'Name': 'Stage1',
          },
          {
            'Name': 'Stage2',
            'Actions': [
              {
                'Name': 'Action1',
                'Region': 'us-west-2',
              },
              {
                'Name': 'Action2',
                'Region': 'us-east-1',
              },
              {
                'Name': 'Action3',
                'Region': 'us-west-1',
              },
            ],
          },
        ],
      });

      expect(pipeline.crossRegionSupport[pipelineRegion]).toBeDefined();
      expect(pipeline.crossRegionSupport['us-west-1']).toBeDefined();

      const usEast1Support = pipeline.crossRegionSupport['us-east-1'];
      expect(usEast1Support).toBeDefined();
      expect(usEast1Support.stack.region).toEqual('us-east-1');
      expect(usEast1Support.stack.account).toEqual(pipelineAccount);
      expect(usEast1Support.stack.node.id.indexOf('us-east-1')).not.toEqual(-1);


    });

    test('allows specifying only one of artifactBucket and crossRegionReplicationBuckets', () => {
      const stack = new Stack();

      expect(() => {
        new codepipeline.Pipeline(stack, 'Pipeline', {
          artifactBucket: new s3.Bucket(stack, 'Bucket'),
          crossRegionReplicationBuckets: {
            // even an empty map should trigger this validation...
          },
        });
      }).toThrow(/Only one of artifactBucket and crossRegionReplicationBuckets can be specified!/);

    });

    test('does not create a new artifact Bucket if one was provided in the cross-region Buckets for the Pipeline region', () => {
      const pipelineRegion = 'us-west-2';

      const stack = new Stack(undefined, undefined, {
        env: {
          region: pipelineRegion,
        },
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(stack, 'Pipeline', {
        crossRegionReplicationBuckets: {
          [pipelineRegion]: new s3.Bucket(stack, 'Bucket', {
            bucketName: 'my-pipeline-bucket',
          }),
        },
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.CodeCommitSourceAction({
                actionName: 'Source',
                output: sourceOutput,
                repository: new codecommit.Repository(stack, 'Repo', { repositoryName: 'Repo' }),
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                project: new codebuild.PipelineProject(stack, 'Project'),
              }),
            ],
          },
        ],
      });

      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'ArtifactStores': [
          {
            'Region': pipelineRegion,
            'ArtifactStore': {
              'Type': 'S3',
              'Location': {
                'Ref': 'Bucket83908E77',
              },
            },
          },
        ],
      });


    });

    test('allows providing a resource-backed action from a different region directly', () => {
      const account = '123456789012';
      const app = new App();

      const replicationRegion = 'us-west-1';
      const replicationStack = new Stack(app, 'ReplicationStack', { env: { region: replicationRegion, account } });
      const project = new codebuild.PipelineProject(replicationStack, 'CodeBuildProject', {
        projectName: 'MyCodeBuildProject',
      });

      const pipelineRegion = 'us-west-2';
      const pipelineStack = new Stack(app, 'TestStack', { env: { region: pipelineRegion, account } });
      const sourceOutput = new codepipeline.Artifact('SourceOutput');
      new codepipeline.Pipeline(pipelineStack, 'MyPipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.CodeCommitSourceAction({
              actionName: 'CodeCommitAction',
              output: sourceOutput,
              repository: codecommit.Repository.fromRepositoryName(pipelineStack, 'Repo', 'my-codecommit-repo'),
            })],
          },
          {
            stageName: 'Build',
            actions: [new cpactions.CodeBuildAction({
              actionName: 'CodeBuildAction',
              input: sourceOutput,
              project,
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
              'Location': 'replicationstackeplicationbucket2464cd5c33b386483b66',
              'EncryptionKey': {
                'Id': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':kms:us-west-1:123456789012:alias/ionstacktencryptionalias043cb2f8ceac9da9c07c',
                    ],
                  ],
                },
                'Type': 'KMS',
              },
            },
          },
          {
            'Region': pipelineRegion,
          },
        ],
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'CodeBuildAction',
                'Region': replicationRegion,
                'Configuration': {
                  'ProjectName': 'MyCodeBuildProject',
                },
              },
            ],
          },
        ],
      });

      Template.fromStack(replicationStack).hasResourceProperties('AWS::S3::Bucket', {
        'BucketName': 'replicationstackeplicationbucket2464cd5c33b386483b66',
      });


    });
  });

  describe('cross-account Pipeline', () => {
    test('with a CodeBuild Project in a different account works correctly', () => {
      const app = new App();

      const buildAccount = '901234567890';
      const buildRegion = 'bermuda-triangle-1';
      const buildStack = new Stack(app, 'BuildStack', {
        env: { account: buildAccount, region: buildRegion },
      });
      const rolePhysicalName = 'ProjectRolePhysicalName';
      const projectRole = new iam.Role(buildStack, 'ProjectRole', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        roleName: rolePhysicalName,
      });
      const projectPhysicalName = 'ProjectPhysicalName';
      const project = new codebuild.PipelineProject(buildStack, 'Project', {
        projectName: projectPhysicalName,
        role: projectRole,
      });

      const pipelineStack = new Stack(app, 'PipelineStack', {
        env: { account: '123456789012', region: buildRegion },
      });
      const sourceBucket = new s3.Bucket(pipelineStack, 'ArtifactBucket', {
        bucketName: 'source-bucket',
        encryption: s3.BucketEncryption.KMS,
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3',
                bucket: sourceBucket,
                bucketKey: 'path/to/file.zip',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                project,
                input: sourceOutput,
              }),
            ],
          },
        ],
      });

      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
                  'ProjectName': projectPhysicalName,
                },
                'RoleArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      `:iam::${buildAccount}:role/buildstackebuildactionrole166c75d1d8be701b1ad8`,
                    ],
                  ],
                },
              },
            ],
          },
        ],
      });

      Template.fromStack(buildStack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              // log permissions from the CodeBuild Project Construct...
            },
            {
              // report group permissions from the CodeBuild Project construct...
            },
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
              'Resource': [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':s3:::pipelinestackeartifactsbucket5409dc84bb108027cb58',
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':s3:::pipelinestackeartifactsbucket5409dc84bb108027cb58/*',
                    ],
                  ],
                },
              ],
            },
            {
              'Action': [
                'kms:Decrypt',
                'kms:DescribeKey',
              ],
              'Effect': 'Allow',
              'Resource': '*',
            },
          ],
        },
      });


    });

    test('adds a dependency on the Stack containing a new action Role', () => {
      const region = 'us-west-2';
      const pipelineAccount = '123456789012';
      const buildAccount = '901234567890';
      const app = new App();

      const buildStack = new Stack(app, 'BuildStack', {
        env: { account: buildAccount, region },
      });
      const actionRolePhysicalName = 'ProjectRolePhysicalName';
      const actionRoleInOtherAccount = new iam.Role(buildStack, 'ProjectRole', {
        assumedBy: new iam.AccountPrincipal(pipelineAccount),
        roleName: actionRolePhysicalName,
      });
      const projectPhysicalName = 'ProjectPhysicalName';
      const project = codebuild.Project.fromProjectName(buildStack, 'Project',
        projectPhysicalName);

      const pipelineStack = new Stack(app, 'PipelineStack', {
        env: { account: pipelineAccount, region },
      });
      const bucket = new s3.Bucket(pipelineStack, 'ArtifactBucket', {
        bucketName: 'source-bucket',
        encryption: s3.BucketEncryption.KMS,
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
        artifactBucket: bucket,
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3',
                bucket,
                bucketKey: 'path/to/file.zip',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                project,
                input: sourceOutput,
                role: actionRoleInOtherAccount,
              }),
            ],
          },
        ],
      });

      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
                  'ProjectName': projectPhysicalName,
                },
                'RoleArn': {
                  'Fn::Join': ['', [
                    'arn:',
                    { 'Ref': 'AWS::Partition' },
                    `:iam::${buildAccount}:role/${actionRolePhysicalName}`,
                  ]],
                },
              },
            ],
          },
        ],
      });

      expect(pipelineStack.dependencies.length).toEqual(1);


    });

    test('does not add a dependency on the Stack containing an imported action Role', () => {
      const region = 'us-west-2';
      const pipelineAccount = '123456789012';
      const buildAccount = '901234567890';
      const app = new App();

      const buildStack = new Stack(app, 'BuildStack', {
        env: { account: buildAccount, region },
      });
      const actionRolePhysicalName = 'ProjectRolePhysicalName';
      const actionRoleInOtherAccount = iam.Role.fromRoleArn(buildStack, 'ProjectRole',
        `arn:aws:iam::${buildAccount}:role/${actionRolePhysicalName}`);
      const projectPhysicalName = 'ProjectPhysicalName';
      const project = new codebuild.PipelineProject(buildStack, 'Project', {
        projectName: projectPhysicalName,
      });

      const pipelineStack = new Stack(app, 'PipelineStack', {
        env: { account: pipelineAccount, region },
      });
      const bucket = new s3.Bucket(pipelineStack, 'ArtifactBucket', {
        bucketName: 'source-bucket',
        encryption: s3.BucketEncryption.KMS,
      });
      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
        artifactBucket: bucket,
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.S3SourceAction({
                actionName: 'S3',
                bucket,
                bucketKey: 'path/to/file.zip',
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                project,
                input: sourceOutput,
                role: actionRoleInOtherAccount,
              }),
            ],
          },
        ],
      });

      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
                  'ProjectName': projectPhysicalName,
                },
                'RoleArn': `arn:aws:iam::${buildAccount}:role/${actionRolePhysicalName}`,
              },
            ],
          },
        ],
      });

      expect(pipelineStack.dependencies.length).toEqual(0);


    });
  });
});

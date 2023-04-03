"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const targets = require("@aws-cdk/aws-events-targets");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../lib");
/* eslint-disable quote-props */
describe('pipeline', () => {
    test('basic pipeline', () => {
        const stack = new core_1.Stack();
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
        expect(assertions_1.Template.fromStack(stack).toJSON()).not.toEqual({});
        expect([]).toEqual(pipeline.node.validate());
    });
    test('Tokens can be used as physical names of the Pipeline', () => {
        const stack = new core_1.Stack(undefined, 'StackName');
        const p = new codepipeline.Pipeline(stack, 'Pipeline', {
            pipelineName: core_1.Aws.STACK_NAME,
        });
        p.addStage({
            stageName: 'Source',
            actions: [
                new cpactions.GitHubSourceAction({
                    actionName: 'GH',
                    runOrder: 8,
                    output: new codepipeline.Artifact('A'),
                    branch: 'branch',
                    oauthToken: core_1.SecretValue.unsafePlainText('secret'),
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Name': {
                'Ref': 'AWS::StackName',
            },
        });
    });
    test('pipeline with GitHub source with poll trigger', () => {
        const stack = new core_1.Stack();
        const secret = new core_1.CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });
        const p = new codepipeline.Pipeline(stack, 'P');
        p.addStage({
            stageName: 'Source',
            actions: [
                new cpactions.GitHubSourceAction({
                    actionName: 'GH',
                    runOrder: 8,
                    output: new codepipeline.Artifact('A'),
                    branch: 'branch',
                    oauthToken: core_1.SecretValue.unsafePlainText(secret.valueAsString),
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Webhook', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
        const stack = new core_1.Stack();
        const secret = new core_1.CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });
        const p = new codepipeline.Pipeline(stack, 'P');
        p.addStage({
            stageName: 'Source',
            actions: [
                new cpactions.GitHubSourceAction({
                    actionName: 'GH',
                    runOrder: 8,
                    output: new codepipeline.Artifact('A'),
                    branch: 'branch',
                    oauthToken: core_1.SecretValue.unsafePlainText(secret.valueAsString),
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Webhook', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
        const stack = new core_1.Stack();
        const secret = new core_1.CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });
        const p = new codepipeline.Pipeline(stack, 'P');
        p.addStage({
            stageName: 'Source',
            actions: [
                new cpactions.GitHubSourceAction({
                    actionName: 'GH',
                    runOrder: 8,
                    output: new codepipeline.Artifact('A'),
                    branch: 'branch',
                    oauthToken: core_1.SecretValue.unsafePlainText(secret.valueAsString),
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Webhook', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
        expect([]).toEqual(p.node.validate());
    });
    test('onStateChange', () => {
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
        expect([]).toEqual(pipeline.node.validate());
    });
    describe('PipelineProject', () => {
        describe('with a custom Project Name', () => {
            test('sets the source and artifacts to CodePipeline', () => {
                const stack = new core_1.Stack();
                new codebuild.PipelineProject(stack, 'MyProject', {
                    projectName: 'MyProject',
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
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
        const stack = new core_1.Stack();
        const lambdaFun = new lambda.Function(stack, 'Function', {
            code: new lambda.InlineCode('bla'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'TestStack', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
                                'Id': {},
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
            const stack = new core_1.Stack();
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
            const stack = new core_1.Stack(undefined, undefined, {
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
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
            const app = new core_1.App();
            const replicationRegion = 'us-west-1';
            const replicationStack = new core_1.Stack(app, 'ReplicationStack', { env: { region: replicationRegion, account } });
            const project = new codebuild.PipelineProject(replicationStack, 'CodeBuildProject', {
                projectName: 'MyCodeBuildProject',
            });
            const pipelineRegion = 'us-west-2';
            const pipelineStack = new core_1.Stack(app, 'TestStack', { env: { region: pipelineRegion, account } });
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
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
            assertions_1.Template.fromStack(replicationStack).hasResourceProperties('AWS::S3::Bucket', {
                'BucketName': 'replicationstackeplicationbucket2464cd5c33b386483b66',
            });
        });
    });
    describe('cross-account Pipeline', () => {
        test('with a CodeBuild Project in a different account works correctly', () => {
            const app = new core_1.App();
            const buildAccount = '901234567890';
            const buildRegion = 'bermuda-triangle-1';
            const buildStack = new core_1.Stack(app, 'BuildStack', {
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
            const pipelineStack = new core_1.Stack(app, 'PipelineStack', {
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
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
            assertions_1.Template.fromStack(buildStack).hasResourceProperties('AWS::IAM::Policy', {
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
            const app = new core_1.App();
            const buildStack = new core_1.Stack(app, 'BuildStack', {
                env: { account: buildAccount, region },
            });
            const actionRolePhysicalName = 'ProjectRolePhysicalName';
            const actionRoleInOtherAccount = new iam.Role(buildStack, 'ProjectRole', {
                assumedBy: new iam.AccountPrincipal(pipelineAccount),
                roleName: actionRolePhysicalName,
            });
            const projectPhysicalName = 'ProjectPhysicalName';
            const project = codebuild.Project.fromProjectName(buildStack, 'Project', projectPhysicalName);
            const pipelineStack = new core_1.Stack(app, 'PipelineStack', {
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
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
            const app = new core_1.App();
            const buildStack = new core_1.Stack(app, 'BuildStack', {
                env: { account: buildAccount, region },
            });
            const actionRolePhysicalName = 'ProjectRolePhysicalName';
            const actionRoleInOtherAccount = iam.Role.fromRoleArn(buildStack, 'ProjectRole', `arn:aws:iam::${buildAccount}:role/${actionRolePhysicalName}`);
            const projectPhysicalName = 'ProjectPhysicalName';
            const project = new codebuild.PipelineProject(buildStack, 'Project', {
                projectName: projectPhysicalName,
            });
            const pipelineStack = new core_1.Stack(app, 'PipelineStack', {
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
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msb0RBQW9EO0FBQ3BELHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQsdURBQXVEO0FBQ3ZELHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsc0NBQXNDO0FBQ3RDLHdDQUF3QztBQUN4Qyx3Q0FBMkU7QUFDM0Usb0NBQW9DO0FBRXBDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDNUQsY0FBYyxFQUFFLFNBQVM7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztZQUNsRCxVQUFVLEVBQUUsUUFBUTtZQUNwQixNQUFNLEVBQUUsWUFBWTtZQUNwQixVQUFVO1NBQ1gsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNoQixTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FB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QUUsbUJBQW1CO2lDQUNuQztnQ0FDRCxTQUFTLEVBQUUsZ0JBQWdCLFlBQVksU0FBUyxzQkFBc0IsRUFBRTs2QkFDekU7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHdkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzLXRhcmdldHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IEFwcCwgQXdzLCBDZm5QYXJhbWV0ZXIsIFNlY3JldFZhbHVlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdwaXBlbGluZScsICgpID0+IHtcbiAgdGVzdCgnYmFzaWMgcGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHN0YWNrLCAnTXlSZXBvJywge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteS1yZXBvJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG4gICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbiAgICBjb25zdCBzb3VyY2UgPSBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZScsXG4gICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgIHJlcG9zaXRvcnksXG4gICAgfSk7XG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnc291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtzb3VyY2VdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlCdWlsZFByb2plY3QnKTtcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdidWlsZCcsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnYnVpbGQnLFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgcHJvamVjdCxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCkpLm5vdC50b0VxdWFsKHt9KTtcbiAgICBleHBlY3QoW10pLnRvRXF1YWwocGlwZWxpbmUubm9kZS52YWxpZGF0ZSgpKTtcbiAgfSk7XG5cbiAgdGVzdCgnVG9rZW5zIGNhbiBiZSB1c2VkIGFzIHBoeXNpY2FsIG5hbWVzIG9mIHRoZSBQaXBlbGluZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdTdGFja05hbWUnKTtcblxuICAgIGNvbnN0IHAgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICBwaXBlbGluZU5hbWU6IEF3cy5TVEFDS19OQU1FLFxuICAgIH0pO1xuICAgIHAuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdHSCcsXG4gICAgICAgICAgcnVuT3JkZXI6IDgsXG4gICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBJyksXG4gICAgICAgICAgYnJhbmNoOiAnYnJhbmNoJyxcbiAgICAgICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldCcpLFxuICAgICAgICAgIG93bmVyOiAnZm9vJyxcbiAgICAgICAgICByZXBvOiAnYmFyJyxcbiAgICAgICAgICB0cmlnZ2VyOiBjcGFjdGlvbnMuR2l0SHViVHJpZ2dlci5QT0xMLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBwLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ1R3bycsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuTWFudWFsQXBwcm92YWxBY3Rpb24oeyBhY3Rpb25OYW1lOiAnQm9vJyB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ05hbWUnOiB7XG4gICAgICAgICdSZWYnOiAnQVdTOjpTdGFja05hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3BpcGVsaW5lIHdpdGggR2l0SHViIHNvdXJjZSB3aXRoIHBvbGwgdHJpZ2dlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ0dpdEh1YlRva2VuJywgeyB0eXBlOiAnU3RyaW5nJywgZGVmYXVsdDogJ215LXRva2VuJyB9KTtcblxuICAgIGNvbnN0IHAgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUCcpO1xuXG4gICAgcC5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0dIJyxcbiAgICAgICAgICBydW5PcmRlcjogOCxcbiAgICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0EnKSxcbiAgICAgICAgICBicmFuY2g6ICdicmFuY2gnLFxuICAgICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dChzZWNyZXQudmFsdWVBc1N0cmluZyksXG4gICAgICAgICAgb3duZXI6ICdmb28nLFxuICAgICAgICAgIHJlcG86ICdiYXInLFxuICAgICAgICAgIHRyaWdnZXI6IGNwYWN0aW9ucy5HaXRIdWJUcmlnZ2VyLlBPTEwsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHAuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnVHdvJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7IGFjdGlvbk5hbWU6ICdCb28nIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNvZGVQaXBlbGluZTo6V2ViaG9vaycsIDApO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ1BvbGxGb3JTb3VyY2VDaGFuZ2VzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ05hbWUnOiAnR0gnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnQm9vJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnTmFtZSc6ICdUd28nLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3BpcGVsaW5lIHdpdGggR2l0SHViIHNvdXJjZSB3aXRob3V0IHRyaWdnZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnR2l0SHViVG9rZW4nLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiAnbXktdG9rZW4nIH0pO1xuXG4gICAgY29uc3QgcCA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQJyk7XG5cbiAgICBwLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnR0gnLFxuICAgICAgICAgIHJ1bk9yZGVyOiA4LFxuICAgICAgICAgIG91dHB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQScpLFxuICAgICAgICAgIGJyYW5jaDogJ2JyYW5jaCcsXG4gICAgICAgICAgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KHNlY3JldC52YWx1ZUFzU3RyaW5nKSxcbiAgICAgICAgICBvd25lcjogJ2ZvbycsXG4gICAgICAgICAgcmVwbzogJ2JhcicsXG4gICAgICAgICAgdHJpZ2dlcjogY3BhY3Rpb25zLkdpdEh1YlRyaWdnZXIuTk9ORSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcC5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdUd28nLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLk1hbnVhbEFwcHJvdmFsQWN0aW9uKHsgYWN0aW9uTmFtZTogJ0JvbycgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpXZWJob29rJywgMCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnUG9sbEZvclNvdXJjZUNoYW5nZXMnOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ05hbWUnOiAnR0gnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnQm9vJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnTmFtZSc6ICdUd28nLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2dpdGh1YiBhY3Rpb24gdXNlcyBUaGlyZFBhcnR5IG93bmVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnR2l0SHViVG9rZW4nLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiAnbXktdG9rZW4nIH0pO1xuXG4gICAgY29uc3QgcCA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQJyk7XG5cbiAgICBwLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnR0gnLFxuICAgICAgICAgIHJ1bk9yZGVyOiA4LFxuICAgICAgICAgIG91dHB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQScpLFxuICAgICAgICAgIGJyYW5jaDogJ2JyYW5jaCcsXG4gICAgICAgICAgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KHNlY3JldC52YWx1ZUFzU3RyaW5nKSxcbiAgICAgICAgICBvd25lcjogJ2ZvbycsXG4gICAgICAgICAgcmVwbzogJ2JhcicsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHAuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnVHdvJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7IGFjdGlvbk5hbWU6ICdCb28nIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNvZGVQaXBlbGluZTo6V2ViaG9vaycsIDEpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdBcnRpZmFjdFN0b3JlJzoge1xuICAgICAgICAnTG9jYXRpb24nOiB7XG4gICAgICAgICAgJ1JlZic6ICdQQXJ0aWZhY3RzQnVja2V0NUU3MTFDMTInLFxuICAgICAgICB9LFxuICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICB9LFxuICAgICAgJ1JvbGVBcm4nOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdQUm9sZTA3QkRDOTA3JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb25UeXBlSWQnOiB7XG4gICAgICAgICAgICAgICAgJ0NhdGVnb3J5JzogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICAgJ093bmVyJzogJ1RoaXJkUGFydHknLFxuICAgICAgICAgICAgICAgICdQcm92aWRlcic6ICdHaXRIdWInLFxuICAgICAgICAgICAgICAgICdWZXJzaW9uJzogJzEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnT3duZXInOiAnZm9vJyxcbiAgICAgICAgICAgICAgICAnUmVwbyc6ICdiYXInLFxuICAgICAgICAgICAgICAgICdCcmFuY2gnOiAnYnJhbmNoJyxcbiAgICAgICAgICAgICAgICAnT0F1dGhUb2tlbic6IHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnR2l0SHViVG9rZW4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1BvbGxGb3JTb3VyY2VDaGFuZ2VzJzogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ0dIJyxcbiAgICAgICAgICAgICAgJ091dHB1dEFydGlmYWN0cyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnTmFtZSc6ICdBJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnUnVuT3JkZXInOiA4LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgICAnQ2F0ZWdvcnknOiAnQXBwcm92YWwnLFxuICAgICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAgICdQcm92aWRlcic6ICdNYW51YWwnLFxuICAgICAgICAgICAgICAgICdWZXJzaW9uJzogJzEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnTmFtZSc6ICdCb28nLFxuICAgICAgICAgICAgICAnUnVuT3JkZXInOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdOYW1lJzogJ1R3bycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KFtdKS50b0VxdWFsKHAubm9kZS52YWxpZGF0ZSgpKTtcbiAgfSk7XG5cbiAgdGVzdCgnb25TdGF0ZUNoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMnKTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BMJyk7XG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdTMScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdBMScsXG4gICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcnRpZmFjdCcpLFxuICAgICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICAgIGJ1Y2tldEtleTogJ0tleScsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ1MyJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7IGFjdGlvbk5hbWU6ICdBMicgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcGlwZWxpbmUub25TdGF0ZUNoYW5nZSgnT25TdGF0ZUNoYW5nZScsIHtcbiAgICAgIHRhcmdldDogbmV3IHRhcmdldHMuU25zVG9waWModG9waWMpLFxuICAgICAgZGVzY3JpcHRpb246ICdkZXNjJyxcbiAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBzdGF0ZTogWydGQUlMRUQnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAnRGVzY3JpcHRpb24nOiAnZGVzYycsXG4gICAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgICAnZGV0YWlsJzoge1xuICAgICAgICAgICdzdGF0ZSc6IFtcbiAgICAgICAgICAgICdGQUlMRUQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFtcbiAgICAgICAgICAnQ29kZVBpcGVsaW5lIFBpcGVsaW5lIEV4ZWN1dGlvbiBTdGF0ZSBDaGFuZ2UnLFxuICAgICAgICBdLFxuICAgICAgICAnc291cmNlJzogW1xuICAgICAgICAgICdhd3MuY29kZXBpcGVsaW5lJyxcbiAgICAgICAgXSxcbiAgICAgICAgJ3Jlc291cmNlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpjb2RlcGlwZWxpbmU6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ1BMRDU0MjVBRUEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdUb3BpY0JGQzdBRjZFJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdJZCc6ICdUYXJnZXQwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoW10pLnRvRXF1YWwocGlwZWxpbmUubm9kZS52YWxpZGF0ZSgpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1BpcGVsaW5lUHJvamVjdCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnd2l0aCBhIGN1c3RvbSBQcm9qZWN0IE5hbWUnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdzZXRzIHRoZSBzb3VyY2UgYW5kIGFydGlmYWN0cyB0byBDb2RlUGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gICAgICAgICAgcHJvamVjdE5hbWU6ICdNeVByb2plY3QnLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgICAgJ05hbWUnOiAnTXlQcm9qZWN0JyxcbiAgICAgICAgICAnU291cmNlJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQ09ERVBJUEVMSU5FJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdBcnRpZmFjdHMnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdDT0RFUElQRUxJTkUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1NlcnZpY2VSb2xlJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVByb2plY3RSb2xlOUJCRTUyMzMnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdMSU5VWF9DT05UQUlORVInLFxuICAgICAgICAgICAgJ1ByaXZpbGVnZWRNb2RlJzogZmFsc2UsXG4gICAgICAgICAgICAnSW1hZ2UnOiAnYXdzL2NvZGVidWlsZC9zdGFuZGFyZDoxLjAnLFxuICAgICAgICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTGFtYmRhIFBpcGVsaW5lSW52b2tlQWN0aW9uIGNhbiBiZSB1c2VkIHRvIGludm9rZSBMYW1iZGEgZnVuY3Rpb25zIGZyb20gYSBDb2RlUGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGxhbWJkYUZ1biA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnYmxhJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgY29uc3Qgc291cmNlMU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ3NvdXJjZUFydGlmYWN0MScpO1xuICAgIGNvbnN0IHNvdXJjZTEgPSBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2VBY3Rpb24xJyxcbiAgICAgIGJ1Y2tldEtleTogJ3NvbWUva2V5JyxcbiAgICAgIG91dHB1dDogc291cmNlMU91dHB1dCxcbiAgICAgIGJ1Y2tldCxcbiAgICB9KTtcbiAgICBjb25zdCBzb3VyY2UyT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnc291cmNlQXJ0aWZhY3QyJyk7XG4gICAgY29uc3Qgc291cmNlMiA9IG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZUFjdGlvbjInLFxuICAgICAgYnVja2V0S2V5OiAnYW5vdGhlci9rZXknLFxuICAgICAgb3V0cHV0OiBzb3VyY2UyT3V0cHV0LFxuICAgICAgYnVja2V0LFxuICAgIH0pO1xuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIHNvdXJjZTEsXG4gICAgICAgIHNvdXJjZTIsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbGFtYmRhQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5MYW1iZGFJbnZva2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0ludm9rZUFjdGlvbicsXG4gICAgICBsYW1iZGE6IGxhbWJkYUZ1bixcbiAgICAgIGlucHV0czogW1xuICAgICAgICBzb3VyY2UyT3V0cHV0LFxuICAgICAgICBzb3VyY2UxT3V0cHV0LFxuICAgICAgXSxcbiAgICAgIG91dHB1dHM6IFtcbiAgICAgICAgbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnbGFtYmRhT3V0cHV0MScpLFxuICAgICAgICBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdsYW1iZGFPdXRwdXQyJyksXG4gICAgICAgIG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ2xhbWJkYU91dHB1dDMnKSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnU3RhZ2UnLFxuICAgICAgYWN0aW9uczogW2xhbWJkYUFjdGlvbl0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ0FydGlmYWN0U3RvcmUnOiB7XG4gICAgICAgICdMb2NhdGlvbic6IHtcbiAgICAgICAgICAnUmVmJzogJ1BpcGVsaW5lQXJ0aWZhY3RzQnVja2V0MjIyNDhGOTcnLFxuICAgICAgICB9LFxuICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICB9LFxuICAgICAgJ1JvbGVBcm4nOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdQaXBlbGluZVJvbGVENjg3MjZGNycsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgICAnQ2F0ZWdvcnknOiAnSW52b2tlJyxcbiAgICAgICAgICAgICAgICAnT3duZXInOiAnQVdTJyxcbiAgICAgICAgICAgICAgICAnUHJvdmlkZXInOiAnTGFtYmRhJyxcbiAgICAgICAgICAgICAgICAnVmVyc2lvbic6ICcxJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0Z1bmN0aW9uTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnRnVuY3Rpb243Njg1NjY3NycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0lucHV0QXJ0aWZhY3RzJzogW1xuICAgICAgICAgICAgICAgIHsgJ05hbWUnOiAnc291cmNlQXJ0aWZhY3QyJyB9LFxuICAgICAgICAgICAgICAgIHsgJ05hbWUnOiAnc291cmNlQXJ0aWZhY3QxJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnTmFtZSc6ICdJbnZva2VBY3Rpb24nLFxuICAgICAgICAgICAgICAnT3V0cHV0QXJ0aWZhY3RzJzogW1xuICAgICAgICAgICAgICAgIHsgJ05hbWUnOiAnbGFtYmRhT3V0cHV0MScgfSxcbiAgICAgICAgICAgICAgICB7ICdOYW1lJzogJ2xhbWJkYU91dHB1dDInIH0sXG4gICAgICAgICAgICAgICAgeyAnTmFtZSc6ICdsYW1iZGFPdXRwdXQzJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnUnVuT3JkZXInOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdOYW1lJzogJ1N0YWdlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKGxhbWJkYUFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLm91dHB1dHMgfHwgW10pLmxlbmd0aCkudG9FcXVhbCgzKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICdjb2RlcGlwZWxpbmU6UHV0Sm9iU3VjY2Vzc1Jlc3VsdCcsXG4gICAgICAgICAgICAgICdjb2RlcGlwZWxpbmU6UHV0Sm9iRmFpbHVyZVJlc3VsdCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgJ1BvbGljeU5hbWUnOiAnRnVuY3Rpb25TZXJ2aWNlUm9sZURlZmF1bHRQb2xpY3kyRjQ5OTk0QScsXG4gICAgICAnUm9sZXMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnUmVmJzogJ0Z1bmN0aW9uU2VydmljZVJvbGU2NzVCQjA0QScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Nyb3NzLXJlZ2lvbiBQaXBlbGluZScsICgpID0+IHtcbiAgICB0ZXN0KCdnZW5lcmF0ZXMgdGhlIHJlcXVpcmVkIEFjdGlvbiAmIEFydGlmYWN0U3RvcmVzIHByb3BlcnRpZXMgaW4gdGhlIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGlwZWxpbmVSZWdpb24gPSAndXMtd2VzdC0yJztcbiAgICAgIGNvbnN0IHBpcGVsaW5lQWNjb3VudCA9ICcxMjMnO1xuXG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgcmVnaW9uOiBwaXBlbGluZVJlZ2lvbixcbiAgICAgICAgICBhY2NvdW50OiBwaXBlbGluZUFjY291bnQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ015UGlwZWxpbmUnLCB7XG4gICAgICAgIGNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzOiB7XG4gICAgICAgICAgJ3VzLXdlc3QtMSc6IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ0ltcG9ydGVkQnVja2V0JywgJ3Nmby1yZXBsaWNhdGlvbi1idWNrZXQnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZU91dHB1dCcpO1xuICAgICAgY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdCdWNrZXRTb3VyY2UnLFxuICAgICAgICBidWNrZXRLZXk6ICcvc29tZS9rZXknLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgYnVja2V0OiBzb3VyY2VCdWNrZXQsXG4gICAgICB9KTtcbiAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU3RhZ2UxJyxcbiAgICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG4gICAgICB9KTtcblxuICAgICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgICBzdGFnZU5hbWU6ICdTdGFnZTInLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVJlcGxhY2VDaGFuZ2VTZXRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0FjdGlvbjEnLFxuICAgICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ0NoYW5nZVNldCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVBhdGg6IHNvdXJjZU91dHB1dC5hdFBhdGgoJ3RlbXBsYXRlLnlhbWwnKSxcbiAgICAgICAgICAgIHN0YWNrTmFtZTogJ1NvbWVTdGFjaycsXG4gICAgICAgICAgICByZWdpb246IHBpcGVsaW5lUmVnaW9uLFxuICAgICAgICAgICAgYWRtaW5QZXJtaXNzaW9uczogZmFsc2UsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdBY3Rpb24yJyxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpLFxuICAgICAgICAgICAgc3RhY2tOYW1lOiAnT3RoZXJTdGFjaycsXG4gICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgYWRtaW5QZXJtaXNzaW9uczogZmFsc2UsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0FjdGlvbjMnLFxuICAgICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ0NoYW5nZVNldCcsXG4gICAgICAgICAgICBzdGFja05hbWU6ICdTb21lU3RhY2snLFxuICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0xJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnQXJ0aWZhY3RTdG9yZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZ2lvbic6ICd1cy13ZXN0LTEnLFxuICAgICAgICAgICAgJ0FydGlmYWN0U3RvcmUnOiB7XG4gICAgICAgICAgICAgICdUeXBlJzogJ1MzJyxcbiAgICAgICAgICAgICAgJ0xvY2F0aW9uJzogJ3Nmby1yZXBsaWNhdGlvbi1idWNrZXQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdSZWdpb24nOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgICdBcnRpZmFjdFN0b3JlJzoge1xuICAgICAgICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICAgICAgICAgICdMb2NhdGlvbic6ICd0ZXN0c3RhY2stc3VwcG9ydC11cy1lYXN0ZXBsaWNhdGlvbmJ1Y2tldDFhODA2M2IzY2RhYzZlN2UwZTczJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnUmVnaW9uJzogJ3VzLXdlc3QtMicsXG4gICAgICAgICAgICAnQXJ0aWZhY3RTdG9yZSc6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnUzMnLFxuICAgICAgICAgICAgICAnRW5jcnlwdGlvbktleSc6IHtcbiAgICAgICAgICAgICAgICAnVHlwZSc6ICdLTVMnLFxuICAgICAgICAgICAgICAgICdJZCc6IHtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1N0YWdlMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTdGFnZTInLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdBY3Rpb24xJyxcbiAgICAgICAgICAgICAgICAnUmVnaW9uJzogJ3VzLXdlc3QtMicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdBY3Rpb24yJyxcbiAgICAgICAgICAgICAgICAnUmVnaW9uJzogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdBY3Rpb24zJyxcbiAgICAgICAgICAgICAgICAnUmVnaW9uJzogJ3VzLXdlc3QtMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHBpcGVsaW5lLmNyb3NzUmVnaW9uU3VwcG9ydFtwaXBlbGluZVJlZ2lvbl0pLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QocGlwZWxpbmUuY3Jvc3NSZWdpb25TdXBwb3J0Wyd1cy13ZXN0LTEnXSkudG9CZURlZmluZWQoKTtcblxuICAgICAgY29uc3QgdXNFYXN0MVN1cHBvcnQgPSBwaXBlbGluZS5jcm9zc1JlZ2lvblN1cHBvcnRbJ3VzLWVhc3QtMSddO1xuICAgICAgZXhwZWN0KHVzRWFzdDFTdXBwb3J0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KHVzRWFzdDFTdXBwb3J0LnN0YWNrLnJlZ2lvbikudG9FcXVhbCgndXMtZWFzdC0xJyk7XG4gICAgICBleHBlY3QodXNFYXN0MVN1cHBvcnQuc3RhY2suYWNjb3VudCkudG9FcXVhbChwaXBlbGluZUFjY291bnQpO1xuICAgICAgZXhwZWN0KHVzRWFzdDFTdXBwb3J0LnN0YWNrLm5vZGUuaWQuaW5kZXhPZigndXMtZWFzdC0xJykpLm5vdC50b0VxdWFsKC0xKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3Mgc3BlY2lmeWluZyBvbmx5IG9uZSBvZiBhcnRpZmFjdEJ1Y2tldCBhbmQgY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgICAgYXJ0aWZhY3RCdWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgICBjcm9zc1JlZ2lvblJlcGxpY2F0aW9uQnVja2V0czoge1xuICAgICAgICAgICAgLy8gZXZlbiBhbiBlbXB0eSBtYXAgc2hvdWxkIHRyaWdnZXIgdGhpcyB2YWxpZGF0aW9uLi4uXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Pbmx5IG9uZSBvZiBhcnRpZmFjdEJ1Y2tldCBhbmQgY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHMgY2FuIGJlIHNwZWNpZmllZCEvKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgY3JlYXRlIGEgbmV3IGFydGlmYWN0IEJ1Y2tldCBpZiBvbmUgd2FzIHByb3ZpZGVkIGluIHRoZSBjcm9zcy1yZWdpb24gQnVja2V0cyBmb3IgdGhlIFBpcGVsaW5lIHJlZ2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBpcGVsaW5lUmVnaW9uID0gJ3VzLXdlc3QtMic7XG5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIHJlZ2lvbjogcGlwZWxpbmVSZWdpb24sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHM6IHtcbiAgICAgICAgICBbcGlwZWxpbmVSZWdpb25dOiBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgICAgICAgYnVja2V0TmFtZTogJ215LXBpcGVsaW5lLWJ1Y2tldCcsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7IHJlcG9zaXRvcnlOYW1lOiAnUmVwbycgfSksXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnKSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDEpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnQXJ0aWZhY3RTdG9yZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZ2lvbic6IHBpcGVsaW5lUmVnaW9uLFxuICAgICAgICAgICAgJ0FydGlmYWN0U3RvcmUnOiB7XG4gICAgICAgICAgICAgICdUeXBlJzogJ1MzJyxcbiAgICAgICAgICAgICAgJ0xvY2F0aW9uJzoge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnQnVja2V0ODM5MDhFNzcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHByb3ZpZGluZyBhIHJlc291cmNlLWJhY2tlZCBhY3Rpb24gZnJvbSBhIGRpZmZlcmVudCByZWdpb24gZGlyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAgIGNvbnN0IHJlcGxpY2F0aW9uUmVnaW9uID0gJ3VzLXdlc3QtMSc7XG4gICAgICBjb25zdCByZXBsaWNhdGlvblN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1JlcGxpY2F0aW9uU3RhY2snLCB7IGVudjogeyByZWdpb246IHJlcGxpY2F0aW9uUmVnaW9uLCBhY2NvdW50IH0gfSk7XG4gICAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QocmVwbGljYXRpb25TdGFjaywgJ0NvZGVCdWlsZFByb2plY3QnLCB7XG4gICAgICAgIHByb2plY3ROYW1lOiAnTXlDb2RlQnVpbGRQcm9qZWN0JyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBwaXBlbGluZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdUZXN0U3RhY2snLCB7IGVudjogeyByZWdpb246IHBpcGVsaW5lUmVnaW9uLCBhY2NvdW50IH0gfSk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VPdXRwdXQnKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUocGlwZWxpbmVTdGFjaywgJ015UGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbbmV3IGNwYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0NvZGVDb21taXRBY3Rpb24nLFxuICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeTogY29kZWNvbW1pdC5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5TmFtZShwaXBlbGluZVN0YWNrLCAnUmVwbycsICdteS1jb2RlY29tbWl0LXJlcG8nKSxcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGRBY3Rpb24nLFxuICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICBwcm9qZWN0LFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnQXJ0aWZhY3RTdG9yZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZ2lvbic6IHJlcGxpY2F0aW9uUmVnaW9uLFxuICAgICAgICAgICAgJ0FydGlmYWN0U3RvcmUnOiB7XG4gICAgICAgICAgICAgICdUeXBlJzogJ1MzJyxcbiAgICAgICAgICAgICAgJ0xvY2F0aW9uJzogJ3JlcGxpY2F0aW9uc3RhY2tlcGxpY2F0aW9uYnVja2V0MjQ2NGNkNWMzM2IzODY0ODNiNjYnLFxuICAgICAgICAgICAgICAnRW5jcnlwdGlvbktleSc6IHtcbiAgICAgICAgICAgICAgICAnSWQnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzprbXM6dXMtd2VzdC0xOjEyMzQ1Njc4OTAxMjphbGlhcy9pb25zdGFja3RlbmNyeXB0aW9uYWxpYXMwNDNjYjJmOGNlYWM5ZGE5YzA3YycsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1R5cGUnOiAnS01TJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnUmVnaW9uJzogcGlwZWxpbmVSZWdpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGRBY3Rpb24nLFxuICAgICAgICAgICAgICAgICdSZWdpb24nOiByZXBsaWNhdGlvblJlZ2lvbixcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdQcm9qZWN0TmFtZSc6ICdNeUNvZGVCdWlsZFByb2plY3QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHJlcGxpY2F0aW9uU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgICAnQnVja2V0TmFtZSc6ICdyZXBsaWNhdGlvbnN0YWNrZXBsaWNhdGlvbmJ1Y2tldDI0NjRjZDVjMzNiMzg2NDgzYjY2JyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Nyb3NzLWFjY291bnQgUGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBhIENvZGVCdWlsZCBQcm9qZWN0IGluIGEgZGlmZmVyZW50IGFjY291bnQgd29ya3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgICBjb25zdCBidWlsZEFjY291bnQgPSAnOTAxMjM0NTY3ODkwJztcbiAgICAgIGNvbnN0IGJ1aWxkUmVnaW9uID0gJ2Jlcm11ZGEtdHJpYW5nbGUtMSc7XG4gICAgICBjb25zdCBidWlsZFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0J1aWxkU3RhY2snLCB7XG4gICAgICAgIGVudjogeyBhY2NvdW50OiBidWlsZEFjY291bnQsIHJlZ2lvbjogYnVpbGRSZWdpb24gfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgcm9sZVBoeXNpY2FsTmFtZSA9ICdQcm9qZWN0Um9sZVBoeXNpY2FsTmFtZSc7XG4gICAgICBjb25zdCBwcm9qZWN0Um9sZSA9IG5ldyBpYW0uUm9sZShidWlsZFN0YWNrLCAnUHJvamVjdFJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2RlYnVpbGQuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICByb2xlTmFtZTogcm9sZVBoeXNpY2FsTmFtZSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvamVjdFBoeXNpY2FsTmFtZSA9ICdQcm9qZWN0UGh5c2ljYWxOYW1lJztcbiAgICAgIGNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChidWlsZFN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgcHJvamVjdE5hbWU6IHByb2plY3RQaHlzaWNhbE5hbWUsXG4gICAgICAgIHJvbGU6IHByb2plY3RSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246IGJ1aWxkUmVnaW9uIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQocGlwZWxpbmVTdGFjaywgJ0FydGlmYWN0QnVja2V0Jywge1xuICAgICAgICBidWNrZXROYW1lOiAnc291cmNlLWJ1Y2tldCcsXG4gICAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgICAgICAgICAgICAgICBidWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgICAgICAgICBidWNrZXRLZXk6ICdwYXRoL3RvL2ZpbGUuemlwJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0NvZGVCdWlsZCcsXG4gICAgICAgICAgICAgICAgcHJvamVjdCxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socGlwZWxpbmVTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdQcm9qZWN0TmFtZSc6IHByb2plY3RQaHlzaWNhbE5hbWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUm9sZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBgOmlhbTo6JHtidWlsZEFjY291bnR9OnJvbGUvYnVpbGRzdGFja2VidWlsZGFjdGlvbnJvbGUxNjZjNzVkMWQ4YmU3MDFiMWFkOGAsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKGJ1aWxkU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIGxvZyBwZXJtaXNzaW9ucyBmcm9tIHRoZSBDb2RlQnVpbGQgUHJvamVjdCBDb25zdHJ1Y3QuLi5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIHJlcG9ydCBncm91cCBwZXJtaXNzaW9ucyBmcm9tIHRoZSBDb2RlQnVpbGQgUHJvamVjdCBjb25zdHJ1Y3QuLi5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnMzOjo6cGlwZWxpbmVzdGFja2VhcnRpZmFjdHNidWNrZXQ1NDA5ZGM4NGJiMTA4MDI3Y2I1OCcsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6czM6OjpwaXBlbGluZXN0YWNrZWFydGlmYWN0c2J1Y2tldDU0MDlkYzg0YmIxMDgwMjdjYjU4LyonLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAgICdrbXM6RGVzY3JpYmVLZXknLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkcyBhIGRlcGVuZGVuY3kgb24gdGhlIFN0YWNrIGNvbnRhaW5pbmcgYSBuZXcgYWN0aW9uIFJvbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZWdpb24gPSAndXMtd2VzdC0yJztcbiAgICAgIGNvbnN0IHBpcGVsaW5lQWNjb3VudCA9ICcxMjM0NTY3ODkwMTInO1xuICAgICAgY29uc3QgYnVpbGRBY2NvdW50ID0gJzkwMTIzNDU2Nzg5MCc7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAgIGNvbnN0IGJ1aWxkU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnQnVpbGRTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6IGJ1aWxkQWNjb3VudCwgcmVnaW9uIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGFjdGlvblJvbGVQaHlzaWNhbE5hbWUgPSAnUHJvamVjdFJvbGVQaHlzaWNhbE5hbWUnO1xuICAgICAgY29uc3QgYWN0aW9uUm9sZUluT3RoZXJBY2NvdW50ID0gbmV3IGlhbS5Sb2xlKGJ1aWxkU3RhY2ssICdQcm9qZWN0Um9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwocGlwZWxpbmVBY2NvdW50KSxcbiAgICAgICAgcm9sZU5hbWU6IGFjdGlvblJvbGVQaHlzaWNhbE5hbWUsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb2plY3RQaHlzaWNhbE5hbWUgPSAnUHJvamVjdFBoeXNpY2FsTmFtZSc7XG4gICAgICBjb25zdCBwcm9qZWN0ID0gY29kZWJ1aWxkLlByb2plY3QuZnJvbVByb2plY3ROYW1lKGJ1aWxkU3RhY2ssICdQcm9qZWN0JyxcbiAgICAgICAgcHJvamVjdFBoeXNpY2FsTmFtZSk7XG5cbiAgICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6IHBpcGVsaW5lQWNjb3VudCwgcmVnaW9uIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQocGlwZWxpbmVTdGFjaywgJ0FydGlmYWN0QnVja2V0Jywge1xuICAgICAgICBidWNrZXROYW1lOiAnc291cmNlLWJ1Y2tldCcsXG4gICAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgICAgICAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgICAgICAgYnVja2V0S2V5OiAncGF0aC90by9maWxlLnppcCcsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3QsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICByb2xlOiBhY3Rpb25Sb2xlSW5PdGhlckFjY291bnQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1Byb2plY3ROYW1lJzogcHJvamVjdFBoeXNpY2FsTmFtZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdSb2xlQXJuJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICBgOmlhbTo6JHtidWlsZEFjY291bnR9OnJvbGUvJHthY3Rpb25Sb2xlUGh5c2ljYWxOYW1lfWAsXG4gICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChwaXBlbGluZVN0YWNrLmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgYWRkIGEgZGVwZW5kZW5jeSBvbiB0aGUgU3RhY2sgY29udGFpbmluZyBhbiBpbXBvcnRlZCBhY3Rpb24gUm9sZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgY29uc3QgcGlwZWxpbmVBY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG4gICAgICBjb25zdCBidWlsZEFjY291bnQgPSAnOTAxMjM0NTY3ODkwJztcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgICAgY29uc3QgYnVpbGRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdCdWlsZFN0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogYnVpbGRBY2NvdW50LCByZWdpb24gfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYWN0aW9uUm9sZVBoeXNpY2FsTmFtZSA9ICdQcm9qZWN0Um9sZVBoeXNpY2FsTmFtZSc7XG4gICAgICBjb25zdCBhY3Rpb25Sb2xlSW5PdGhlckFjY291bnQgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihidWlsZFN0YWNrLCAnUHJvamVjdFJvbGUnLFxuICAgICAgICBgYXJuOmF3czppYW06OiR7YnVpbGRBY2NvdW50fTpyb2xlLyR7YWN0aW9uUm9sZVBoeXNpY2FsTmFtZX1gKTtcbiAgICAgIGNvbnN0IHByb2plY3RQaHlzaWNhbE5hbWUgPSAnUHJvamVjdFBoeXNpY2FsTmFtZSc7XG4gICAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QoYnVpbGRTdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIHByb2plY3ROYW1lOiBwcm9qZWN0UGh5c2ljYWxOYW1lLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6IHBpcGVsaW5lQWNjb3VudCwgcmVnaW9uIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQocGlwZWxpbmVTdGFjaywgJ0FydGlmYWN0QnVja2V0Jywge1xuICAgICAgICBidWNrZXROYW1lOiAnc291cmNlLWJ1Y2tldCcsXG4gICAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgICAgICAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgICAgICAgYnVja2V0S2V5OiAncGF0aC90by9maWxlLnppcCcsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3QsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICByb2xlOiBhY3Rpb25Sb2xlSW5PdGhlckFjY291bnQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1Byb2plY3ROYW1lJzogcHJvamVjdFBoeXNpY2FsTmFtZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdSb2xlQXJuJzogYGFybjphd3M6aWFtOjoke2J1aWxkQWNjb3VudH06cm9sZS8ke2FjdGlvblJvbGVQaHlzaWNhbE5hbWV9YCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGlwZWxpbmVTdGFjay5kZXBlbmRlbmNpZXMubGVuZ3RoKS50b0VxdWFsKDApO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
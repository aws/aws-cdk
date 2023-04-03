"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
const codepipeline = require("../lib");
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
            // Adding 2 stages with actions so pipeline validation will pass
            const sourceArtifact = new codepipeline.Artifact();
            pipeline.addStage({
                stageName: 'Source',
                actions: [new fake_source_action_1.FakeSourceAction({
                        actionName: 'FakeSource',
                        output: sourceArtifact,
                    })],
            });
            pipeline.addStage({
                stageName: 'Build',
                actions: [new fake_build_action_1.FakeBuildAction({
                        actionName: 'FakeBuild',
                        input: sourceArtifact,
                    })],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
            const pipeline = codepipeline.Pipeline.fromPipelineArn(stack, 'Pipeline', 'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');
            expect(pipeline.pipelineArn).toEqual('arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');
            expect(pipeline.pipelineName).toEqual('MyPipeline');
        });
        describe('that is cross-region', () => {
            test('validates that source actions are in the same region as the pipeline', () => {
                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'PipelineStack', { env: { region: 'us-west-1', account: '123456789012' } });
                const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
                const sourceStage = pipeline.addStage({
                    stageName: 'Source',
                });
                const sourceAction = new fake_source_action_1.FakeSourceAction({
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
                            actions: [new fake_source_action_1.FakeSourceAction({
                                    actionName: 'Source',
                                    output: sourceOutput,
                                })],
                        },
                        {
                            stageName: 'Build',
                            actions: [new fake_build_action_1.FakeBuildAction({
                                    actionName: 'Build',
                                    input: sourceOutput,
                                    region: replicationRegion,
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
                assertions_1.Template.fromStack(replicationStack).hasResourceProperties('AWS::KMS::Key', {
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
                            actions: [new fake_source_action_1.FakeSourceAction({
                                    actionName: 'Source',
                                    output: sourceOutput,
                                })],
                        },
                        {
                            stageName: 'Build',
                            actions: [new fake_build_action_1.FakeBuildAction({
                                    actionName: 'Build',
                                    input: sourceOutput,
                                    region: replicationRegion,
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
                assertions_1.Template.fromStack(pipeline.crossRegionSupport[replicationRegion].stack).hasResource('AWS::KMS::Alias', {
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
                            encryptionKey: kms.Key.fromKeyArn(pipelineStack, 'ReplicationKey', `arn:aws:kms:${replicationRegion}:123456789012:key/1234-5678-9012`),
                        }),
                    },
                    stages: [
                        {
                            stageName: 'Source',
                            actions: [new fake_source_action_1.FakeSourceAction({
                                    actionName: 'Source',
                                    output: sourceOutput,
                                })],
                        },
                        {
                            stageName: 'Build',
                            actions: [new fake_build_action_1.FakeBuildAction({
                                    actionName: 'Build',
                                    input: sourceOutput,
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
                    treeMetadata: false,
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
                            actions: [new fake_source_action_1.FakeSourceAction({
                                    actionName: 'Source',
                                    output: sourceOutput,
                                })],
                        },
                        {
                            stageName: 'Build',
                            actions: [new fake_build_action_1.FakeBuildAction({
                                    actionName: 'Build',
                                    input: sourceOutput,
                                    region: 'eu-south-1',
                                })],
                        },
                    ],
                });
                const assembly = app.synth();
                const supportStackArtifact = assembly.getStackByName('PipelineStack-support-eu-south-1');
                expect(supportStackArtifact.assumeRoleArn).toEqual('arn:${AWS::Partition}:iam::123456789012:role/cdk-hnb659fds-deploy-role-123456789012-us-west-2');
                expect(supportStackArtifact.cloudFormationExecutionRoleArn).toEqual('arn:${AWS::Partition}:iam::123456789012:role/cdk-hnb659fds-cfn-exec-role-123456789012-us-west-2');
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
                assertions_1.Template.fromJSON(supportStackATemplate).hasResourceProperties('AWS::S3::Bucket', {
                    BucketName: 'pipelinestacka-support-eueplicationbucket8934e91f26961aa6cbfa',
                });
                assertions_1.Template.fromJSON(supportStackATemplate).hasResourceProperties('AWS::KMS::Alias', {
                    AliasName: 'alias/pport-eutencryptionalias02f1cda3732942f6c529',
                });
                const supportStackBTemplate = supportStackBArtifact.template;
                assertions_1.Template.fromJSON(supportStackBTemplate).hasResourceProperties('AWS::S3::Bucket', {
                    BucketName: 'pipelinestackb-support-eueplicationbucketdf7c0e10245faa377228',
                });
                assertions_1.Template.fromJSON(supportStackBTemplate).hasResourceProperties('AWS::KMS::Alias', {
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
                            actions: [new fake_source_action_1.FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
                        },
                    ],
                });
                const buildStage = pipeline.addStage({ stageName: 'Build' });
                expect(() => {
                    buildStage.addAction(new fake_build_action_1.FakeBuildAction({
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
                            actions: [new fake_source_action_1.FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
                        },
                    ],
                });
                const buildStage = pipeline.addStage({ stageName: 'Build' });
                expect(() => {
                    buildStage.addAction(new fake_build_action_1.FakeBuildAction({
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
                            actions: [new fake_source_action_1.FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
                        },
                        {
                            stageName: 'Build',
                            actions: [new fake_build_action_1.FakeBuildAction({ actionName: 'Build', input: sourceOutput })],
                        },
                    ],
                });
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                    'EnableKeyRotation': true,
                });
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
            assertions_1.Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-actual-stack-name-pipeline-0a412eb5',
            });
        });
        test('cross account key alias is named with stack ID when feature flag is not enabled', () => {
            const stack = createPipelineStack({
                suffix: 'Name',
                stackId: 'PipelineStack',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-pipelinestack-pipeline-9db740af',
            });
        });
        test('cross account key alias is named with stack ID when stack name is not present and feature flag is not enabled', () => {
            const stack = createPipelineStack({
                suffix: 'Name',
                stackId: 'PipelineStack',
                undefinedStackName: true,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
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
            assertions_1.Template.fromStack(stack.nestedStack).hasResourceProperties(kmsAliasResource, {
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
            assertions_1.Template.fromStack(stack.nestedStack).hasResourceProperties(kmsAliasResource, {
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
            assertions_1.Template.fromStack(stack.nestedStack).hasResourceProperties(kmsAliasResource, {
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
            assertions_1.Template.fromStack(stack.nestedStack).hasResourceProperties(kmsAliasResource, {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-actual-stack-needstobeshortenedduetothelengthofthisabsurdnamethatnooneshouldusebutitstillmighthappensowemusttestfohatwillneedtobeshortenedduetothealsoverysuperextralongnameofthestack-alsowithsomedifferentcharactersaddedtotheend-384b9343',
            });
        });
        test('cross account key alias is properly shortened to 256 characters when stack name is too long and feature flag is not enabled', () => {
            const stack = createPipelineStack({
                suffix: 'too-long',
                stackId: 'NeedsToBeShortenedDueToTheLengthOfThisAbsurdNameThatNoOneShouldUseButItStillMightHappenSoWeMustTestForTheTestCase',
                pipelineId: 'ActualPipelineWithExtraSuperLongNameThatWillNeedToBeShortenedDueToTheAlsoVerySuperExtraLongNameOfTheStack-AlsoWithSomeDifferentCharactersAddedToTheEnd',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(kmsAliasResource, {
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
            expect(assertions_1.Template.fromStack(stack1).findResources(kmsAliasResource)).not.toEqual(assertions_1.Template.fromStack(stack2).findResources(kmsAliasResource));
            assertions_1.Template.fromStack(stack1).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-actual-stack-1-pipeline-b09fefee',
            });
            assertions_1.Template.fromStack(stack2).hasResourceProperties(kmsAliasResource, {
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
            expect(assertions_1.Template.fromStack(stack1).findResources(kmsAliasResource)).toEqual(assertions_1.Template.fromStack(stack2).findResources(kmsAliasResource));
            assertions_1.Template.fromStack(stack1).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-stackidpipeline32fb88b3',
            });
            assertions_1.Template.fromStack(stack2).hasResourceProperties(kmsAliasResource, {
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
            expect(assertions_1.Template.fromStack(stack1.nestedStack).findResources(kmsAliasResource))
                .not.toEqual(assertions_1.Template.fromStack(stack2.nestedStack).findResources(kmsAliasResource));
            assertions_1.Template.fromStack(stack1.nestedStack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-actual-stack-name-1-nested-pipeline-id-c8c9f252',
            });
            assertions_1.Template.fromStack(stack2.nestedStack).hasResourceProperties(kmsAliasResource, {
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
            expect(assertions_1.Template.fromStack(stack1.nestedStack).findResources(kmsAliasResource))
                .toEqual(assertions_1.Template.fromStack(stack2.nestedStack).findResources(kmsAliasResource));
            assertions_1.Template.fromStack(stack1.nestedStack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-stackidnestedpipelineid3e91360a',
            });
            assertions_1.Template.fromStack(stack2.nestedStack).hasResourceProperties(kmsAliasResource, {
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
            expect(assertions_1.Template.fromStack(stack.nestedStack).findResources(kmsAliasResource))
                .not.toEqual(assertions_1.Template.fromStack(nestedStack2).findResources(kmsAliasResource));
            assertions_1.Template.fromStack(stack.nestedStack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-actual-stack-name-1-first-pipeline-id-3c59cb88',
            });
            assertions_1.Template.fromStack(nestedStack2).hasResourceProperties(kmsAliasResource, {
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
            expect(assertions_1.Template.fromStack(stack.nestedStack).findResources(kmsAliasResource))
                .not.toEqual(assertions_1.Template.fromStack(nestedStack2).findResources(kmsAliasResource));
            assertions_1.Template.fromStack(stack.nestedStack).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-stackidfirstpipelineid5abca693',
            });
            assertions_1.Template.fromStack(nestedStack2).hasResourceProperties(kmsAliasResource, {
                AliasName: 'alias/codepipeline-stackidsecondpipelineid288ce778',
            });
        });
    });
});
describe('test with shared setup', () => {
    let stack;
    let sourceArtifact;
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
                    actions: [new fake_source_action_1.FakeSourceAction({ actionName: 'Fetch', output: sourceArtifact })],
                },
                {
                    stageName: 'Build',
                    actions: [new fake_build_action_1.FakeBuildAction({ actionName: 'Gcc', input: sourceArtifact })],
                },
            ],
        });
        // WHEN
        pipeline.stage('Build').addAction(new fake_build_action_1.FakeBuildAction({ actionName: 'debug.com', input: sourceArtifact }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: assertions_1.Match.arrayWith([{
                    Name: 'Build',
                    Actions: [
                        assertions_1.Match.objectLike({ Name: 'Gcc' }),
                        assertions_1.Match.objectLike({ Name: 'debug.com' }),
                    ],
                }]),
        });
    });
});
class ReusePipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceOutput = new codepipeline.Artifact();
        const buildOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(this, 'Pipeline', {
            reuseCrossRegionSupportStacks: props.reuseCrossRegionSupportStacks,
            stages: [
                {
                    stageName: 'Source',
                    actions: [new fake_source_action_1.FakeSourceAction({
                            actionName: 'Source',
                            output: sourceOutput,
                        })],
                },
                {
                    stageName: 'Build',
                    actions: [new fake_build_action_1.FakeBuildAction({
                            actionName: 'Build',
                            input: sourceOutput,
                            region: 'eu-south-1',
                            output: buildOutput,
                        })],
                },
                {
                    stageName: 'Deploy',
                    actions: [new fake_build_action_1.FakeBuildAction({
                            actionName: 'Deploy',
                            input: buildOutput,
                            region: 'eu-south-1',
                        })],
                },
            ],
        });
    }
}
class PipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        props?.nestedStackId ? this.nestedStack = new cdk.NestedStack(this, props.nestedStackId) : undefined;
        this.pipeline = createPipelineWithSourceAndBuildStages(this.nestedStack || this, props?.pipelineName, props?.pipelineId);
    }
}
function createPipelineWithSourceAndBuildStages(scope, pipelineName, pipelineId = 'Pipeline') {
    const artifact = new codepipeline.Artifact();
    return new codepipeline.Pipeline(scope, pipelineId, {
        pipelineName,
        crossAccountKeys: true,
        reuseCrossRegionSupportStacks: false,
        stages: [
            {
                stageName: 'Source',
                actions: [new fake_source_action_1.FakeSourceAction({ actionName: 'Source', output: artifact })],
            },
            {
                stageName: 'Build',
                actions: [new fake_build_action_1.FakeBuildAction({ actionName: 'Build', input: artifact })],
            },
        ],
    });
}
;
function createPipelineStack(options) {
    const context = options.withFeatureFlag ? { context: { [cxapi.CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME]: true } } : undefined;
    return new PipelineStack(new cdk.App(context), options.stackId, {
        stackName: options.undefinedStackName ? undefined : `Actual-Stack-${options.suffix}`,
        nestedStackId: options.nestedStackId,
        pipelineName: `Actual-Pipeline-${options.suffix}`.substring(0, 100),
        pipelineId: options.pipelineId,
    });
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUV6QywyREFBc0Q7QUFDdEQsNkRBQXdEO0FBQ3hELHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUU7SUFDaEIsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7UUFDeEIsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM5RCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDdkMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDO2FBQ2xFLENBQUMsQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO2dCQUM1RCxJQUFJO2FBQ0wsQ0FBQyxDQUFDO1lBRUgsZ0VBQWdFO1lBQ2hFLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25ELFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hCLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixPQUFPLEVBQUUsQ0FBQyxJQUFJLHFDQUFnQixDQUFDO3dCQUM3QixVQUFVLEVBQUUsWUFBWTt3QkFDeEIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hCLFNBQVMsRUFBRSxP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cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRmFrZUJ1aWxkQWN0aW9uIH0gZnJvbSAnLi9mYWtlLWJ1aWxkLWFjdGlvbic7XG5pbXBvcnQgeyBGYWtlU291cmNlQWN0aW9uIH0gZnJvbSAnLi9mYWtlLXNvdXJjZS1hY3Rpb24nO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCcnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdQaXBlbGluZScsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYmUgcGFzc2VkIGFuIElBTSByb2xlIGR1cmluZyBwaXBlbGluZSBjcmVhdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2RlcGlwZWxpbmUuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgcm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBBZGRpbmcgMiBzdGFnZXMgd2l0aCBhY3Rpb25zIHNvIHBpcGVsaW5lIHZhbGlkYXRpb24gd2lsbCBwYXNzXG4gICAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRmFrZVNvdXJjZScsXG4gICAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgfSldLFxuICAgICAgfSk7XG5cbiAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0Zha2VCdWlsZCcsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICB9KV0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1JvbGVBcm4nOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSBpbXBvcnRlZCBieSBBUk4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgcGlwZWxpbmUgPSBjb2RlcGlwZWxpbmUuUGlwZWxpbmUuZnJvbVBpcGVsaW5lQXJuKHN0YWNrLCAnUGlwZWxpbmUnLFxuICAgICAgICAnYXJuOmF3czpjb2RlcGlwZWxpbmU6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpNeVBpcGVsaW5lJyk7XG5cbiAgICAgIGV4cGVjdChwaXBlbGluZS5waXBlbGluZUFybikudG9FcXVhbCgnYXJuOmF3czpjb2RlcGlwZWxpbmU6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpNeVBpcGVsaW5lJyk7XG4gICAgICBleHBlY3QocGlwZWxpbmUucGlwZWxpbmVOYW1lKS50b0VxdWFsKCdNeVBpcGVsaW5lJyk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgndGhhdCBpcyBjcm9zcy1yZWdpb24nLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd2YWxpZGF0ZXMgdGhhdCBzb3VyY2UgYWN0aW9ucyBhcmUgaW4gdGhlIHNhbWUgcmVnaW9uIGFzIHRoZSBwaXBlbGluZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy13ZXN0LTEnLCBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyB9IH0pO1xuICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScpO1xuICAgICAgICBjb25zdCBzb3VyY2VTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdGYWtlU291cmNlJyxcbiAgICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKSxcbiAgICAgICAgICByZWdpb246ICdhcC1zb3V0aGVhc3QtMScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgc291cmNlU3RhZ2UuYWRkQWN0aW9uKHNvdXJjZUFjdGlvbik7XG4gICAgICAgIH0pLnRvVGhyb3coL1NvdXJjZSBhY3Rpb24gJ0Zha2VTb3VyY2UnIG11c3QgYmUgaW4gdGhlIHNhbWUgcmVnaW9uIGFzIHRoZSBwaXBlbGluZS8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2FsbG93cyBwYXNzaW5nIGFuIEFsaWFzIGluIHBsYWNlIG9mIHRoZSBLTVMgS2V5IGluIHRoZSByZXBsaWNhdGlvbiBCdWNrZXQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgICAgY29uc3QgcmVwbGljYXRpb25SZWdpb24gPSAndXMtd2VzdC0xJztcbiAgICAgICAgY29uc3QgcmVwbGljYXRpb25TdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUmVwbGljYXRpb25TdGFjaycsIHtcbiAgICAgICAgICBlbnY6IHsgcmVnaW9uOiByZXBsaWNhdGlvblJlZ2lvbiwgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlcGxpY2F0aW9uS2V5ID0gbmV3IGttcy5LZXkocmVwbGljYXRpb25TdGFjaywgJ1JlcGxpY2F0aW9uS2V5Jyk7XG4gICAgICAgIGNvbnN0IHJlcGxpY2F0aW9uQWxpYXMgPSByZXBsaWNhdGlvbktleS5hZGRBbGlhcygnYWxpYXMvbXktcmVwbGljYXRpb24tYWxpYXMnKTtcbiAgICAgICAgY29uc3QgcmVwbGljYXRpb25CdWNrZXQgPSBuZXcgczMuQnVja2V0KHJlcGxpY2F0aW9uU3RhY2ssICdSZXBsaWNhdGlvbkJ1Y2tldCcsIHtcbiAgICAgICAgICBlbmNyeXB0aW9uS2V5OiByZXBsaWNhdGlvbkFsaWFzLFxuICAgICAgICAgIGJ1Y2tldE5hbWU6IGNkay5QaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVELFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwaXBlbGluZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJywge1xuICAgICAgICAgIGVudjogeyByZWdpb246IHBpcGVsaW5lUmVnaW9uLCBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyB9LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICBjcm9zc1JlZ2lvblJlcGxpY2F0aW9uQnVja2V0czoge1xuICAgICAgICAgICAgW3JlcGxpY2F0aW9uUmVnaW9uXTogcmVwbGljYXRpb25CdWNrZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogcmVwbGljYXRpb25SZWdpb24sXG4gICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAgICdBcnRpZmFjdFN0b3Jlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZ2lvbic6IHJlcGxpY2F0aW9uUmVnaW9uLFxuICAgICAgICAgICAgICAnQXJ0aWZhY3RTdG9yZSc6IHtcbiAgICAgICAgICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICAgICAgICAgICAgJ0VuY3J5cHRpb25LZXknOiB7XG4gICAgICAgICAgICAgICAgICAnVHlwZSc6ICdLTVMnLFxuICAgICAgICAgICAgICAgICAgJ0lkJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOmttczp1cy13ZXN0LTE6MTIzNDU2Nzg5MDEyOmFsaWFzL215LXJlcGxpY2F0aW9uLWFsaWFzJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZ2lvbic6IHBpcGVsaW5lUmVnaW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socmVwbGljYXRpb25TdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgICAgICdLZXlQb2xpY3knOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gb3duaW5nIGFjY291bnQgbWFuYWdlbWVudCBwZXJtaXNzaW9ucyAtIHdlIGRvbid0IGNhcmUgYWJvdXQgdGhlbSBpbiB0aGlzIHRlc3RcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEtNUyB2ZXJpZmllcyB3aGV0aGVyIHRoZSBwcmluY2lwYWwgZ2l2ZW4gaW4gaXRzIGtleSBwb2xpY3kgZXhpc3RzIHdoZW4gY3JlYXRpbmcgdGhhdCBrZXkuXG4gICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIHJlcGxpY2F0aW9uIGJ1Y2tldCBtdXN0IGJlIGRlcGxveWVkIGJlZm9yZSB0aGUgcGlwZWxpbmUsXG4gICAgICAgICAgICAgICAgLy8gd2UgY2Fubm90IHB1dCB0aGUgcGlwZWxpbmUgcm9sZSBhcyB0aGUgcHJpbmNpcGFsIGhlcmUgLVxuICAgICAgICAgICAgICAgIC8vIGhlbmNlLCB3ZSBwdXQgdGhlIGFjY291bnQgaXRzZWxmXG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnQVdTJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjoxMjM0NTY3ODkwMTI6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZ2VuZXJhdGVzIEFydGlmYWN0U3RvcmVzIHdpdGggdGhlIGFsaWFzIEFSTiBhcyB0aGUgS2V5SUQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICAgIGNvbnN0IHJlcGxpY2F0aW9uUmVnaW9uID0gJ3VzLXdlc3QtMSc7XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVSZWdpb24gPSAndXMtd2VzdC0yJztcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnTXlTdGFjaycsIHtcbiAgICAgICAgICBlbnY6IHsgcmVnaW9uOiBwaXBlbGluZVJlZ2lvbiwgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogcmVwbGljYXRpb25SZWdpb24sXG4gICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAgICdBcnRpZmFjdFN0b3Jlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZ2lvbic6IHJlcGxpY2F0aW9uUmVnaW9uLFxuICAgICAgICAgICAgICAnQXJ0aWZhY3RTdG9yZSc6IHtcbiAgICAgICAgICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICAgICAgICAgICAgJ0VuY3J5cHRpb25LZXknOiB7XG4gICAgICAgICAgICAgICAgICAnVHlwZSc6ICdLTVMnLFxuICAgICAgICAgICAgICAgICAgJ0lkJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOmttczp1cy13ZXN0LTE6MTIzNDU2Nzg5MDEyOmFsaWFzL3Mtd2VzdC0xdGVuY3J5cHRpb25hbGlhczliMzQ0YjJiOGU2ODI1Y2IxZjdkJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZ2lvbic6IHBpcGVsaW5lUmVnaW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socGlwZWxpbmUuY3Jvc3NSZWdpb25TdXBwb3J0W3JlcGxpY2F0aW9uUmVnaW9uXS5zdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6S01TOjpBbGlhcycsIHtcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdhbGxvd3MgcGFzc2luZyBhbiBpbXBvcnRlZCBCdWNrZXQgYW5kIEtleSBmb3IgdGhlIHJlcGxpY2F0aW9uIEJ1Y2tldCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVwbGljYXRpb25SZWdpb24gPSAndXMtd2VzdC0xJztcblxuICAgICAgICBjb25zdCBwaXBlbGluZVJlZ2lvbiA9ICd1cy13ZXN0LTInO1xuICAgICAgICBjb25zdCBwaXBlbGluZVN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICAgIGVudjogeyByZWdpb246IHBpcGVsaW5lUmVnaW9uIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUocGlwZWxpbmVTdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICAgIGNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzOiB7XG4gICAgICAgICAgICBbcmVwbGljYXRpb25SZWdpb25dOiBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMocGlwZWxpbmVTdGFjaywgJ1JlcGxpY2F0aW9uQnVja2V0Jywge1xuICAgICAgICAgICAgICBidWNrZXRBcm46ICdhcm46YXdzOnMzOjo6bXktdXMtd2VzdC0xLXJlcGxpY2F0aW9uLWJ1Y2tldCcsXG4gICAgICAgICAgICAgIGVuY3J5cHRpb25LZXk6IGttcy5LZXkuZnJvbUtleUFybihwaXBlbGluZVN0YWNrLCAnUmVwbGljYXRpb25LZXknLFxuICAgICAgICAgICAgICAgIGBhcm46YXdzOmttczoke3JlcGxpY2F0aW9uUmVnaW9ufToxMjM0NTY3ODkwMTI6a2V5LzEyMzQtNTY3OC05MDEyYCxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socGlwZWxpbmVTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICAgJ0FydGlmYWN0U3RvcmVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnUmVnaW9uJzogcmVwbGljYXRpb25SZWdpb24sXG4gICAgICAgICAgICAgICdBcnRpZmFjdFN0b3JlJzoge1xuICAgICAgICAgICAgICAgICdUeXBlJzogJ1MzJyxcbiAgICAgICAgICAgICAgICAnTG9jYXRpb24nOiAnbXktdXMtd2VzdC0xLXJlcGxpY2F0aW9uLWJ1Y2tldCcsXG4gICAgICAgICAgICAgICAgJ0VuY3J5cHRpb25LZXknOiB7XG4gICAgICAgICAgICAgICAgICAnVHlwZSc6ICdLTVMnLFxuICAgICAgICAgICAgICAgICAgJ0lkJzogJ2Fybjphd3M6a21zOnVzLXdlc3QtMToxMjM0NTY3ODkwMTI6a2V5LzEyMzQtNTY3OC05MDEyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZ2lvbic6IHBpcGVsaW5lUmVnaW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdnZW5lcmF0ZXMgdGhlIHN1cHBvcnQgc3RhY2sgY29udGFpbmluZyB0aGUgcmVwbGljYXRpb24gQnVja2V0IHdpdGhvdXQgdGhlIG5lZWQgdG8gYm9vdHN0cmFwIGluIHRoYXQgZW52aXJvbm1lbnQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgICAgICAgICB0cmVlTWV0YWRhdGE6IGZhbHNlLCAvLyB3ZSBjYW4ndCBzZXQgdGhlIGNvbnRleHQgb3RoZXJ3aXNlLCBiZWNhdXNlIEFwcCB3aWxsIGhhdmUgYSBjaGlsZFxuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm5vZGUuc2V0Q29udGV4dChjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFQsIHRydWUpO1xuXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snLCB7XG4gICAgICAgICAgZW52OiB7IHJlZ2lvbjogJ3VzLXdlc3QtMicsIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUocGlwZWxpbmVTdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICAgIHN0YWdlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAnZXUtc291dGgtMScsXG4gICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgICAgY29uc3Qgc3VwcG9ydFN0YWNrQXJ0aWZhY3QgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZSgnUGlwZWxpbmVTdGFjay1zdXBwb3J0LWV1LXNvdXRoLTEnKTtcbiAgICAgICAgZXhwZWN0KHN1cHBvcnRTdGFja0FydGlmYWN0LmFzc3VtZVJvbGVBcm4pLnRvRXF1YWwoXG4gICAgICAgICAgJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2Nkay1obmI2NTlmZHMtZGVwbG95LXJvbGUtMTIzNDU2Nzg5MDEyLXVzLXdlc3QtMicpO1xuICAgICAgICBleHBlY3Qoc3VwcG9ydFN0YWNrQXJ0aWZhY3QuY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuKS50b0VxdWFsKFxuICAgICAgICAgICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9jZGstaG5iNjU5ZmRzLWNmbi1leGVjLXJvbGUtMTIzNDU2Nzg5MDEyLXVzLXdlc3QtMicpO1xuXG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZ2VuZXJhdGVzIHRoZSBzYW1lIHN1cHBvcnQgc3RhY2sgY29udGFpbmluZyB0aGUgcmVwbGljYXRpb24gQnVja2V0IHdpdGhvdXQgdGhlIG5lZWQgdG8gYm9vdHN0cmFwIGluIHRoYXQgZW52aXJvbm1lbnQgZm9yIG11bHRpcGxlIHBpcGVsaW5lcycsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuICAgICAgICBuZXcgUmV1c2VQaXBlbGluZVN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2tBJywge1xuICAgICAgICAgIGVudjogeyByZWdpb246ICd1cy13ZXN0LTInLCBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyB9LFxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IFJldXNlUGlwZWxpbmVTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrQicsIHtcbiAgICAgICAgICBlbnY6IHsgcmVnaW9uOiAndXMtd2VzdC0yJywgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgICAgLy8gMiBQaXBlbGluZSBTdGFja3MgYW5kIDEgc3VwcG9ydCBzdGFjayBmb3IgYm90aCBwaXBlbGluZSBzdGFja3MuXG4gICAgICAgIGV4cGVjdChhc3NlbWJseS5zdGFja3MubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgICAgICBhc3NlbWJseS5nZXRTdGFja0J5TmFtZSgnUGlwZWxpbmVTdGFja0Etc3VwcG9ydC1ldS1zb3V0aC0xJyk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoJ1BpcGVsaW5lU3RhY2tCLXN1cHBvcnQtZXUtc291dGgtMScpO1xuICAgICAgICB9KS50b1Rocm93RXJyb3IoL1VuYWJsZSB0byBmaW5kIHN0YWNrIHdpdGggc3RhY2sgbmFtZS8pO1xuXG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZ2VuZXJhdGVzIHRoZSB1bmlxdWUgc3VwcG9ydCBzdGFjayBjb250YWluaW5nIHRoZSByZXBsaWNhdGlvbiBCdWNrZXQgd2l0aG91dCB0aGUgbmVlZCB0byBib290c3RyYXAgaW4gdGhhdCBlbnZpcm9ubWVudCBmb3IgbXVsdGlwbGUgcGlwZWxpbmVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4gICAgICAgIG5ldyBSZXVzZVBpcGVsaW5lU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFja0EnLCB7XG4gICAgICAgICAgZW52OiB7IHJlZ2lvbjogJ3VzLXdlc3QtMicsIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0sXG4gICAgICAgICAgcmV1c2VDcm9zc1JlZ2lvblN1cHBvcnRTdGFja3M6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IFJldXNlUGlwZWxpbmVTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrQicsIHtcbiAgICAgICAgICBlbnY6IHsgcmVnaW9uOiAndXMtd2VzdC0yJywgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSxcbiAgICAgICAgICByZXVzZUNyb3NzUmVnaW9uU3VwcG9ydFN0YWNrczogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICAgIC8vIDIgUGlwZWxpbmUgU3RhY2tzIGFuZCAxIHN1cHBvcnQgc3RhY2sgZm9yIGVhY2ggcGlwZWxpbmUgc3RhY2suXG4gICAgICAgIGV4cGVjdChhc3NlbWJseS5zdGFja3MubGVuZ3RoKS50b0VxdWFsKDQpO1xuICAgICAgICBjb25zdCBzdXBwb3J0U3RhY2tBQXJ0aWZhY3QgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZSgnUGlwZWxpbmVTdGFja0Etc3VwcG9ydC1ldS1zb3V0aC0xJyk7XG4gICAgICAgIGNvbnN0IHN1cHBvcnRTdGFja0JBcnRpZmFjdCA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKCdQaXBlbGluZVN0YWNrQi1zdXBwb3J0LWV1LXNvdXRoLTEnKTtcblxuICAgICAgICBjb25zdCBzdXBwb3J0U3RhY2tBVGVtcGxhdGUgPSBzdXBwb3J0U3RhY2tBQXJ0aWZhY3QudGVtcGxhdGU7XG4gICAgICAgIFRlbXBsYXRlLmZyb21KU09OKHN1cHBvcnRTdGFja0FUZW1wbGF0ZSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAgICAgQnVja2V0TmFtZTogJ3BpcGVsaW5lc3RhY2thLXN1cHBvcnQtZXVlcGxpY2F0aW9uYnVja2V0ODkzNGU5MWYyNjk2MWFhNmNiZmEnLFxuICAgICAgICB9KTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbUpTT04oc3VwcG9ydFN0YWNrQVRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpBbGlhcycsIHtcbiAgICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9wcG9ydC1ldXRlbmNyeXB0aW9uYWxpYXMwMmYxY2RhMzczMjk0MmY2YzUyOScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN1cHBvcnRTdGFja0JUZW1wbGF0ZSA9IHN1cHBvcnRTdGFja0JBcnRpZmFjdC50ZW1wbGF0ZTtcbiAgICAgICAgVGVtcGxhdGUuZnJvbUpTT04oc3VwcG9ydFN0YWNrQlRlbXBsYXRlKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgICAgICBCdWNrZXROYW1lOiAncGlwZWxpbmVzdGFja2Itc3VwcG9ydC1ldWVwbGljYXRpb25idWNrZXRkZjdjMGUxMDI0NWZhYTM3NzIyOCcsXG4gICAgICAgIH0pO1xuICAgICAgICBUZW1wbGF0ZS5mcm9tSlNPTihzdXBwb3J0U3RhY2tCVGVtcGxhdGUpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OkFsaWFzJywge1xuICAgICAgICAgIEFsaWFzTmFtZTogJ2FsaWFzL3Bwb3J0LWV1dGVuY3J5cHRpb25hbGlhc2RlZjNmZDNmZWM2M2JjNTQ5ODBlJyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd0aGF0IGlzIGNyb3NzLWFjY291bnQnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdkb2VzIG5vdCBhbGxvdyBwYXNzaW5nIGEgZHluYW1pYyB2YWx1ZSBpbiB0aGUgQWN0aW9uIGFjY291bnQgcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSB9KTtcbiAgICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHsgYWN0aW9uTmFtZTogJ1NvdXJjZScsIG91dHB1dDogc291cmNlT3V0cHV0IH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGJ1aWxkU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ0J1aWxkJyB9KTtcblxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIGJ1aWxkU3RhZ2UuYWRkQWN0aW9uKG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0Zha2VCdWlsZCcsXG4gICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgYWNjb3VudDogY2RrLkF3cy5BQ0NPVU5UX0lELFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkudG9UaHJvdygvVGhlICdhY2NvdW50JyBwcm9wZXJ0eSBtdXN0IGJlIGEgY29uY3JldGUgdmFsdWUgXFwoYWN0aW9uOiAnRmFrZUJ1aWxkJ1xcKS8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2RvZXMgbm90IGFsbG93IGFuIGVudi1hZ25vc3RpYyBQaXBlbGluZSBTdGFjayBpZiBhbiBBY3Rpb24gYWNjb3VudCBoYXMgYmVlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snKTtcbiAgICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHsgYWN0aW9uTmFtZTogJ1NvdXJjZScsIG91dHB1dDogc291cmNlT3V0cHV0IH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGJ1aWxkU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ0J1aWxkJyB9KTtcblxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIGJ1aWxkU3RhZ2UuYWRkQWN0aW9uKG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0Zha2VCdWlsZCcsXG4gICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KS50b1Rocm93KC9QaXBlbGluZSBzdGFjayB3aGljaCB1c2VzIGNyb3NzLWVudmlyb25tZW50IGFjdGlvbnMgbXVzdCBoYXZlIGFuIGV4cGxpY2l0bHkgc2V0IGFjY291bnQvKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdkb2VzIG5vdCBhbGxvdyBlbmFibGluZyBrZXkgcm90YXRpb24gaWYgY3Jvc3MgYWNjb3VudCBrZXlzIGhhdmUgYmVlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snKTtcblxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICAgIGNyb3NzQWNjb3VudEtleXM6IGZhbHNlLFxuICAgICAgICAgICAgZW5hYmxlS2V5Um90YXRpb246IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRvVGhyb3coXCJTZXR0aW5nICdlbmFibGVLZXlSb3RhdGlvbicgdG8gdHJ1ZSBhbHNvIHJlcXVpcmVzICdjcm9zc0FjY291bnRLZXlzJyB0byBiZSBlbmFibGVkXCIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJlbmFibGluZyBrZXkgcm90YXRpb24gc2V0cyAnRW5hYmxlS2V5Um90YXRpb24nIHRvICd0cnVlJyBpbiB0aGUgbWFpbiBnZW5lcmF0ZWQgS01TIGtleVwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJyk7XG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICAgIGVuYWJsZUtleVJvdGF0aW9uOiB0cnVlLFxuICAgICAgICAgIHN0YWdlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VTb3VyY2VBY3Rpb24oeyBhY3Rpb25OYW1lOiAnU291cmNlJywgb3V0cHV0OiBzb3VyY2VPdXRwdXQgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7IGFjdGlvbk5hbWU6ICdCdWlsZCcsIGlucHV0OiBzb3VyY2VPdXRwdXQgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgICAgICAnRW5hYmxlS2V5Um90YXRpb24nOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY3Jvc3MgYWNjb3VudCBrZXkgYWxpYXMgbmFtZSB0ZXN0cycsICgpID0+IHtcbiAgICBjb25zdCBrbXNBbGlhc1Jlc291cmNlID0gJ0FXUzo6S01TOjpBbGlhcyc7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBpcyBuYW1lZCB3aXRoIHN0YWNrIG5hbWUgaW5zdGVhZCBvZiBJRCB3aGVuIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOYW1lJyxcbiAgICAgICAgc3RhY2tJZDogJ1BpcGVsaW5lU3RhY2snLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGttc0FsaWFzUmVzb3VyY2UsIHtcbiAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvY29kZXBpcGVsaW5lLWFjdHVhbC1zdGFjay1uYW1lLXBpcGVsaW5lLTBhNDEyZWI1JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3Jvc3MgYWNjb3VudCBrZXkgYWxpYXMgaXMgbmFtZWQgd2l0aCBzdGFjayBJRCB3aGVuIGZlYXR1cmUgZmxhZyBpcyBub3QgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gY3JlYXRlUGlwZWxpbmVTdGFjayh7XG4gICAgICAgIHN1ZmZpeDogJ05hbWUnLFxuICAgICAgICBzdGFja0lkOiAnUGlwZWxpbmVTdGFjaycsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtcGlwZWxpbmVzdGFja3BpcGVsaW5lOWRiNzQwYWYnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBpcyBuYW1lZCB3aXRoIGdlbmVyYXRlZCBzdGFjayBuYW1lIHdoZW4gc3RhY2sgbmFtZSBpcyB1bmRlZmluZWQgYW5kIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOYW1lJyxcbiAgICAgICAgc3RhY2tJZDogJ1BpcGVsaW5lU3RhY2snLFxuICAgICAgICB1bmRlZmluZWRTdGFja05hbWU6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtcGlwZWxpbmVzdGFjay1waXBlbGluZS05ZGI3NDBhZicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nyb3NzIGFjY291bnQga2V5IGFsaWFzIGlzIG5hbWVkIHdpdGggc3RhY2sgSUQgd2hlbiBzdGFjayBuYW1lIGlzIG5vdCBwcmVzZW50IGFuZCBmZWF0dXJlIGZsYWcgaXMgbm90IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGNyZWF0ZVBpcGVsaW5lU3RhY2soe1xuICAgICAgICBzdWZmaXg6ICdOYW1lJyxcbiAgICAgICAgc3RhY2tJZDogJ1BpcGVsaW5lU3RhY2snLFxuICAgICAgICB1bmRlZmluZWRTdGFja05hbWU6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtcGlwZWxpbmVzdGFja3BpcGVsaW5lOWRiNzQwYWYnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBpcyBuYW1lZCB3aXRoIHN0YWNrIG5hbWUgYW5kIG5lc3RlZCBzdGFjayBJRCB3aGVuIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOYW1lJyxcbiAgICAgICAgc3RhY2tJZDogJ1RvcExldmVsU3RhY2snLFxuICAgICAgICBuZXN0ZWRTdGFja0lkOiAnTmVzdGVkUGlwZWxpbmVTdGFjaycsXG4gICAgICAgIHBpcGVsaW5lSWQ6ICdBY3R1YWxQaXBlbGluZScsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrLm5lc3RlZFN0YWNrISkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGttc0FsaWFzUmVzb3VyY2UsIHtcbiAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvY29kZXBpcGVsaW5lLWFjdHVhbC1zdGFjay1uYW1lLW5lc3RlZHBpcGVsaW5lc3RhY2stYWN0dWFscGlwZWxpbmUtMjNhOTgxMTAnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBpcyBuYW1lZCB3aXRoIHN0YWNrIElEIGFuZCBuZXN0ZWQgc3RhY2sgSUQgd2hlbiBzdGFjayBuYW1lIGlzIHByZXNlbnQgYW5kIGZlYXR1cmUgZmxhZyBpcyBub3QgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gY3JlYXRlUGlwZWxpbmVTdGFjayh7XG4gICAgICAgIHN1ZmZpeDogJ05hbWUnLFxuICAgICAgICBzdGFja0lkOiAnVG9wTGV2ZWxTdGFjaycsXG4gICAgICAgIG5lc3RlZFN0YWNrSWQ6ICdOZXN0ZWRQaXBlbGluZVN0YWNrJyxcbiAgICAgICAgcGlwZWxpbmVJZDogJ0FjdHVhbFBpcGVsaW5lJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2submVzdGVkU3RhY2shKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtdG9wbGV2ZWxzdGFja25lc3RlZHBpcGVsaW5lc3RhY2thY3R1YWxwaXBlbGluZTMxNjFhNTM3JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3Jvc3MgYWNjb3VudCBrZXkgYWxpYXMgaXMgbmFtZWQgd2l0aCBnZW5lcmF0ZWQgc3RhY2sgbmFtZSBhbmQgbmVzdGVkIHN0YWNrIElEIHdoZW4gc3RhY2sgbmFtZSBpcyB1bmRlZmluZWQgYW5kIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOYW1lJyxcbiAgICAgICAgc3RhY2tJZDogJ1RvcExldmVsU3RhY2snLFxuICAgICAgICBuZXN0ZWRTdGFja0lkOiAnTmVzdGVkUGlwZWxpbmVTdGFjaycsXG4gICAgICAgIHBpcGVsaW5lSWQ6ICdBY3R1YWxQaXBlbGluZScsXG4gICAgICAgIHVuZGVmaW5lZFN0YWNrTmFtZTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2submVzdGVkU3RhY2shKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtdG9wbGV2ZWxzdGFjay1uZXN0ZWRwaXBlbGluZXN0YWNrLWFjdHVhbHBpcGVsaW5lLTMxNjFhNTM3JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3Jvc3MgYWNjb3VudCBrZXkgYWxpYXMgaXMgbmFtZWQgd2l0aCBzdGFjayBJRCBhbmQgbmVzdGVkIHN0YWNrIElEIHdoZW4gc3RhY2sgbmFtZSBpcyBub3QgcHJlc2VudCBhbmQgZmVhdHVyZSBmbGFnIGlzIG5vdCBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgc3VmZml4OiAnTmFtZScsXG4gICAgICAgIHN0YWNrSWQ6ICdUb3BMZXZlbFN0YWNrJyxcbiAgICAgICAgbmVzdGVkU3RhY2tJZDogJ05lc3RlZFBpcGVsaW5lU3RhY2snLFxuICAgICAgICBwaXBlbGluZUlkOiAnQWN0dWFsUGlwZWxpbmUnLFxuICAgICAgICB1bmRlZmluZWRTdGFja05hbWU6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrLm5lc3RlZFN0YWNrISkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGttc0FsaWFzUmVzb3VyY2UsIHtcbiAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvY29kZXBpcGVsaW5lLXRvcGxldmVsc3RhY2tuZXN0ZWRwaXBlbGluZXN0YWNrYWN0dWFscGlwZWxpbmUzMTYxYTUzNycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nyb3NzIGFjY291bnQga2V5IGFsaWFzIGlzIHByb3Blcmx5IHNob3J0ZW5lZCB0byAyNTYgY2hhcmFjdGVycyB3aGVuIHN0YWNrIG5hbWUgaXMgdG9vIGxvbmcgYW5kIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOZWVkc1RvQmVTaG9ydGVuZWREdWVUb1RoZUxlbmd0aE9mVGhpc0Fic3VyZE5hbWVUaGF0Tm9PbmVTaG91bGRVc2VCdXRJdFN0aWxsTWlnaHRIYXBwZW5Tb1dlTXVzdFRlc3RGb3JUaGVUZXN0Q2FzZScsXG4gICAgICAgIHN0YWNrSWQ6ICd0b28tbG9uZycsXG4gICAgICAgIHBpcGVsaW5lSWQ6ICdBY3R1YWxQaXBlbGluZVdpdGhFeHRyYVN1cGVyTG9uZ05hbWVUaGF0V2lsbE5lZWRUb0JlU2hvcnRlbmVkRHVlVG9UaGVBbHNvVmVyeVN1cGVyRXh0cmFMb25nTmFtZU9mVGhlU3RhY2stQWxzb1dpdGhTb21lRGlmZmVyZW50Q2hhcmFjdGVyc0FkZGVkVG9UaGVFbmQnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGttc0FsaWFzUmVzb3VyY2UsIHtcbiAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvY29kZXBpcGVsaW5lLWFjdHVhbC1zdGFjay1uZWVkc3RvYmVzaG9ydGVuZWRkdWV0b3RoZWxlbmd0aG9mdGhpc2Fic3VyZG5hbWV0aGF0bm9vbmVzaG91bGR1c2VidXRpdHN0aWxsbWlnaHRoYXBwZW5zb3dlbXVzdHRlc3Rmb2hhdHdpbGxuZWVkdG9iZXNob3J0ZW5lZGR1ZXRvdGhlYWxzb3ZlcnlzdXBlcmV4dHJhbG9uZ25hbWVvZnRoZXN0YWNrLWFsc293aXRoc29tZWRpZmZlcmVudGNoYXJhY3RlcnNhZGRlZHRvdGhlZW5kLTM4NGI5MzQzJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3Jvc3MgYWNjb3VudCBrZXkgYWxpYXMgaXMgcHJvcGVybHkgc2hvcnRlbmVkIHRvIDI1NiBjaGFyYWN0ZXJzIHdoZW4gc3RhY2sgbmFtZSBpcyB0b28gbG9uZyBhbmQgZmVhdHVyZSBmbGFnIGlzIG5vdCBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgc3VmZml4OiAndG9vLWxvbmcnLFxuICAgICAgICBzdGFja0lkOiAnTmVlZHNUb0JlU2hvcnRlbmVkRHVlVG9UaGVMZW5ndGhPZlRoaXNBYnN1cmROYW1lVGhhdE5vT25lU2hvdWxkVXNlQnV0SXRTdGlsbE1pZ2h0SGFwcGVuU29XZU11c3RUZXN0Rm9yVGhlVGVzdENhc2UnLFxuICAgICAgICBwaXBlbGluZUlkOiAnQWN0dWFsUGlwZWxpbmVXaXRoRXh0cmFTdXBlckxvbmdOYW1lVGhhdFdpbGxOZWVkVG9CZVNob3J0ZW5lZER1ZVRvVGhlQWxzb1ZlcnlTdXBlckV4dHJhTG9uZ05hbWVPZlRoZVN0YWNrLUFsc29XaXRoU29tZURpZmZlcmVudENoYXJhY3RlcnNBZGRlZFRvVGhlRW5kJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhrbXNBbGlhc1Jlc291cmNlLCB7XG4gICAgICAgIEFsaWFzTmFtZTogJ2FsaWFzL2NvZGVwaXBlbGluZS1vcnRlbmVkZHVldG90aGVsZW5ndGhvZnRoaXNhYnN1cmRuYW1ldGhhdG5vb25lc2hvdWxkdXNlYnV0aXRzdGlsbG1pZ2h0aGFwcGVuc293ZW11c3R0ZXN0Zm9ydGhldGVzdGNhc2VhY3R1YWxwaXBlbGluZXdpdGhleHRyYXN1cGVybG9uZ25hbWV0aGF0d2lsbG5lZWR0b2Jlc2hvcnRlbmVkZHVldG90aGVhbHNvdmVyeXN1cGVyZXh0cmFsb25nbmFtZW9mdGhlc3RhY2thbHNvd2l0aHNvbWVkaWZmZXJlbnRjNDk4ZTA2NzInLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBuYW1lcyBkbyBub3QgY29uZmxpY3Qgd2hlbiB0aGUgc3RhY2sgSUQgaXMgdGhlIHNhbWUgYW5kIHBpcGVsaW5lIElEIGlzIHRoZSBzYW1lIGFuZCBmZWF0dXJlIGZsYWcgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IGNyZWF0ZVBpcGVsaW5lU3RhY2soe1xuICAgICAgICB3aXRoRmVhdHVyZUZsYWc6IHRydWUsXG4gICAgICAgIHN1ZmZpeDogJzEnLFxuICAgICAgICBzdGFja0lkOiAnU1RBQ0stSUQnLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IGNyZWF0ZVBpcGVsaW5lU3RhY2soe1xuICAgICAgICB3aXRoRmVhdHVyZUZsYWc6IHRydWUsXG4gICAgICAgIHN1ZmZpeDogJzInLFxuICAgICAgICBzdGFja0lkOiAnU1RBQ0stSUQnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKS5maW5kUmVzb3VyY2VzKGttc0FsaWFzUmVzb3VyY2UpKS5ub3QudG9FcXVhbChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5maW5kUmVzb3VyY2VzKGttc0FsaWFzUmVzb3VyY2UpKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGttc0FsaWFzUmVzb3VyY2UsIHtcbiAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvY29kZXBpcGVsaW5lLWFjdHVhbC1zdGFjay0xLXBpcGVsaW5lLWIwOWZlZmVlJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtYWN0dWFsLXN0YWNrLTItcGlwZWxpbmUtZjQ2MjU4ZmUnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBuYW1lcyBkbyBjb25mbGljdCB3aGVuIHRoZSBzdGFjayBJRCBpcyB0aGUgc2FtZSBhbmQgcGlwZWxpbmUgSUQgaXMgdGhlIHNhbWUgd2hlbiBmZWF0dXJlIGZsYWcgaXMgbm90IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjazEgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgc3VmZml4OiAnMScsXG4gICAgICAgIHN0YWNrSWQ6ICdTVEFDSy1JRCcsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2syID0gY3JlYXRlUGlwZWxpbmVTdGFjayh7XG4gICAgICAgIHN1ZmZpeDogJzInLFxuICAgICAgICBzdGFja0lkOiAnU1RBQ0stSUQnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKS5maW5kUmVzb3VyY2VzKGttc0FsaWFzUmVzb3VyY2UpKS50b0VxdWFsKFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLmZpbmRSZXNvdXJjZXMoa21zQWxpYXNSZXNvdXJjZSkpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtc3RhY2tpZHBpcGVsaW5lMzJmYjg4YjMnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLmhhc1Jlc291cmNlUHJvcGVydGllcyhrbXNBbGlhc1Jlc291cmNlLCB7XG4gICAgICAgIEFsaWFzTmFtZTogJ2FsaWFzL2NvZGVwaXBlbGluZS1zdGFja2lkcGlwZWxpbmUzMmZiODhiMycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nyb3NzIGFjY291bnQga2V5IGFsaWFzIG5hbWVzIGRvIG5vdCBjb25mbGljdCBmb3IgbmVzdGVkIHN0YWNrcyB3aGVuIHBpcGVsaW5lIElEIGlzIHRoZSBzYW1lIGFuZCBuZXN0ZWQgc3RhY2tzIGhhdmUgdGhlIHNhbWUgSUQgd2hlbiBmZWF0dXJlIGZsYWcgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IGNyZWF0ZVBpcGVsaW5lU3RhY2soe1xuICAgICAgICB3aXRoRmVhdHVyZUZsYWc6IHRydWUsXG4gICAgICAgIHN1ZmZpeDogJ05hbWUtMScsXG4gICAgICAgIHN0YWNrSWQ6ICdTVEFDSy1JRCcsXG4gICAgICAgIG5lc3RlZFN0YWNrSWQ6ICdOZXN0ZWQnLFxuICAgICAgICBwaXBlbGluZUlkOiAnUElQRUxJTkUtSUQnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdGFjazIgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOYW1lLTInLFxuICAgICAgICBzdGFja0lkOiAnU1RBQ0stSUQnLFxuICAgICAgICBuZXN0ZWRTdGFja0lkOiAnTmVzdGVkJyxcbiAgICAgICAgcGlwZWxpbmVJZDogJ1BJUEVMSU5FLUlEJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMS5uZXN0ZWRTdGFjayEpLmZpbmRSZXNvdXJjZXMoa21zQWxpYXNSZXNvdXJjZSkpXG4gICAgICAgIC5ub3QudG9FcXVhbChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syLm5lc3RlZFN0YWNrISkuZmluZFJlc291cmNlcyhrbXNBbGlhc1Jlc291cmNlKSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEubmVzdGVkU3RhY2shKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtYWN0dWFsLXN0YWNrLW5hbWUtMS1uZXN0ZWQtcGlwZWxpbmUtaWQtYzhjOWYyNTInLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIubmVzdGVkU3RhY2shKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtYWN0dWFsLXN0YWNrLW5hbWUtMi1uZXN0ZWQtcGlwZWxpbmUtaWQtYWZmNmRkNjMnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBuYW1lcyBkbyBjb25mbGljdCBmb3IgbmVzdGVkIHN0YWNrcyB3aGVuIHBpcGVsaW5lIElEIGlzIHRoZSBzYW1lIGFuZCBuZXN0ZWQgc3RhY2tzIGhhdmUgdGhlIHNhbWUgSUQgd2hlbiBmZWF0dXJlIGZsYWcgaXMgbm90IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjazEgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgc3VmZml4OiAnMScsXG4gICAgICAgIHN0YWNrSWQ6ICdTVEFDSy1JRCcsXG4gICAgICAgIG5lc3RlZFN0YWNrSWQ6ICdOZXN0ZWQnLFxuICAgICAgICBwaXBlbGluZUlkOiAnUElQRUxJTkUtSUQnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdGFjazIgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgc3VmZml4OiAnMicsXG4gICAgICAgIHN0YWNrSWQ6ICdTVEFDSy1JRCcsXG4gICAgICAgIG5lc3RlZFN0YWNrSWQ6ICdOZXN0ZWQnLFxuICAgICAgICBwaXBlbGluZUlkOiAnUElQRUxJTkUtSUQnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxLm5lc3RlZFN0YWNrISkuZmluZFJlc291cmNlcyhrbXNBbGlhc1Jlc291cmNlKSlcbiAgICAgICAgLnRvRXF1YWwoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMi5uZXN0ZWRTdGFjayEpLmZpbmRSZXNvdXJjZXMoa21zQWxpYXNSZXNvdXJjZSkpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxLm5lc3RlZFN0YWNrISkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGttc0FsaWFzUmVzb3VyY2UsIHtcbiAgICAgICAgQWxpYXNOYW1lOiAnYWxpYXMvY29kZXBpcGVsaW5lLXN0YWNraWRuZXN0ZWRwaXBlbGluZWlkM2U5MTM2MGEnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIubmVzdGVkU3RhY2shKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtc3RhY2tpZG5lc3RlZHBpcGVsaW5laWQzZTkxMzYwYScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nyb3NzIGFjY291bnQga2V5IGFsaWFzIG5hbWVzIGRvIG5vdCBjb25mbGljdCBmb3IgbmVzdGVkIHN0YWNrcyB3aGVuIGluIHRoZSBzYW1lIHN0YWNrIGJ1dCBuZXN0ZWQgc3RhY2tzIGhhdmUgZGlmZmVyZW50IElEcyB3aGVuIGZlYXR1cmUgZmxhZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBjcmVhdGVQaXBlbGluZVN0YWNrKHtcbiAgICAgICAgd2l0aEZlYXR1cmVGbGFnOiB0cnVlLFxuICAgICAgICBzdWZmaXg6ICdOYW1lLTEnLFxuICAgICAgICBzdGFja0lkOiAnU1RBQ0stSUQnLFxuICAgICAgICBuZXN0ZWRTdGFja0lkOiAnRmlyc3QnLFxuICAgICAgICBwaXBlbGluZUlkOiAnUElQRUxJTkUtSUQnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBuZXN0ZWRTdGFjazIgPSBuZXcgY2RrLk5lc3RlZFN0YWNrKHN0YWNrLCAnU2Vjb25kJyk7XG4gICAgICBjcmVhdGVQaXBlbGluZVdpdGhTb3VyY2VBbmRCdWlsZFN0YWdlcyhuZXN0ZWRTdGFjazIsICdBY3R1YWwtUGlwZWxpbmUtTmFtZS0yJywgJ1BJUEVMSU5FLUlEJyk7XG5cbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2submVzdGVkU3RhY2shKS5maW5kUmVzb3VyY2VzKGttc0FsaWFzUmVzb3VyY2UpKVxuICAgICAgICAubm90LnRvRXF1YWwoVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZFN0YWNrMikuZmluZFJlc291cmNlcyhrbXNBbGlhc1Jlc291cmNlKSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjay5uZXN0ZWRTdGFjayEpLmhhc1Jlc291cmNlUHJvcGVydGllcyhrbXNBbGlhc1Jlc291cmNlLCB7XG4gICAgICAgIEFsaWFzTmFtZTogJ2FsaWFzL2NvZGVwaXBlbGluZS1hY3R1YWwtc3RhY2stbmFtZS0xLWZpcnN0LXBpcGVsaW5lLWlkLTNjNTljYjg4JyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobmVzdGVkU3RhY2syKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoa21zQWxpYXNSZXNvdXJjZSwge1xuICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9jb2RlcGlwZWxpbmUtYWN0dWFsLXN0YWNrLW5hbWUtMS1zZWNvbmQtcGlwZWxpbmUtaWQtMTYxNDNkMTInLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBuYW1lcyBkbyBub3QgY29uZmxpY3QgZm9yIG5lc3RlZCBzdGFja3Mgd2hlbiBpbiB0aGUgc2FtZSBzdGFjayBidXQgbmVzdGVkIHN0YWNrcyBoYXZlIGRpZmZlcmVudCBJRHMgd2hlbiBmZWF0dXJlIGZsYWcgaXMgbm90IGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IGNyZWF0ZVBpcGVsaW5lU3RhY2soe1xuICAgICAgICBzdWZmaXg6ICdOYW1lLTEnLFxuICAgICAgICBzdGFja0lkOiAnU1RBQ0stSUQnLFxuICAgICAgICBuZXN0ZWRTdGFja0lkOiAnRmlyc3QnLFxuICAgICAgICBwaXBlbGluZUlkOiAnUElQRUxJTkUtSUQnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBuZXN0ZWRTdGFjazIgPSBuZXcgY2RrLk5lc3RlZFN0YWNrKHN0YWNrLCAnU2Vjb25kJyk7XG4gICAgICBjcmVhdGVQaXBlbGluZVdpdGhTb3VyY2VBbmRCdWlsZFN0YWdlcyhuZXN0ZWRTdGFjazIsICdBY3R1YWwtUGlwZWxpbmUtTmFtZS0yJywgJ1BJUEVMSU5FLUlEJyk7XG5cbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2submVzdGVkU3RhY2shKS5maW5kUmVzb3VyY2VzKGttc0FsaWFzUmVzb3VyY2UpKVxuICAgICAgICAubm90LnRvRXF1YWwoVGVtcGxhdGUuZnJvbVN0YWNrKG5lc3RlZFN0YWNrMikuZmluZFJlc291cmNlcyhrbXNBbGlhc1Jlc291cmNlKSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjay5uZXN0ZWRTdGFjayEpLmhhc1Jlc291cmNlUHJvcGVydGllcyhrbXNBbGlhc1Jlc291cmNlLCB7XG4gICAgICAgIEFsaWFzTmFtZTogJ2FsaWFzL2NvZGVwaXBlbGluZS1zdGFja2lkZmlyc3RwaXBlbGluZWlkNWFiY2E2OTMnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWRTdGFjazIpLmhhc1Jlc291cmNlUHJvcGVydGllcyhrbXNBbGlhc1Jlc291cmNlLCB7XG4gICAgICAgIEFsaWFzTmFtZTogJ2FsaWFzL2NvZGVwaXBlbGluZS1zdGFja2lkc2Vjb25kcGlwZWxpbmVpZDI4OGNlNzc4JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgndGVzdCB3aXRoIHNoYXJlZCBzZXR1cCcsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG4gIGxldCBzb3VyY2VBcnRpZmFjdDogY29kZXBpcGVsaW5lLkFydGlmYWN0O1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBzb3VyY2VBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBhY3Rpb25zIHRvIHN0YWdlcyBhZnRlciBjcmVhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgc3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZVNvdXJjZUFjdGlvbih7IGFjdGlvbk5hbWU6ICdGZXRjaCcsIG91dHB1dDogc291cmNlQXJ0aWZhY3QgfSldLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZUJ1aWxkQWN0aW9uKHsgYWN0aW9uTmFtZTogJ0djYycsIGlucHV0OiBzb3VyY2VBcnRpZmFjdCB9KV0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHBpcGVsaW5lLnN0YWdlKCdCdWlsZCcpLmFkZEFjdGlvbihuZXcgRmFrZUJ1aWxkQWN0aW9uKHsgYWN0aW9uTmFtZTogJ2RlYnVnLmNvbScsIGlucHV0OiBzb3VyY2VBcnRpZmFjdCB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgIFN0YWdlczogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgIE5hbWU6ICdCdWlsZCcsXG4gICAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHsgTmFtZTogJ0djYycgfSksXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7IE5hbWU6ICdkZWJ1Zy5jb20nIH0pLFxuICAgICAgICBdLFxuICAgICAgfV0pLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5pbnRlcmZhY2UgUmV1c2VQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHJldXNlQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2tzPzogYm9vbGVhbjtcbn1cblxuY2xhc3MgUmV1c2VQaXBlbGluZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXVzZVBpcGVsaW5lU3RhY2tQcm9wcyApIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgYnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICByZXVzZUNyb3NzUmVnaW9uU3VwcG9ydFN0YWNrczogcHJvcHMucmV1c2VDcm9zc1JlZ2lvblN1cHBvcnRTdGFja3MsXG4gICAgICBzdGFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgfSldLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgcmVnaW9uOiAnZXUtc291dGgtMScsXG4gICAgICAgICAgICBvdXRwdXQ6IGJ1aWxkT3V0cHV0LFxuICAgICAgICAgIH0pXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgICBpbnB1dDogYnVpbGRPdXRwdXQsXG4gICAgICAgICAgICByZWdpb246ICdldS1zb3V0aC0xJyxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG5cbmludGVyZmFjZSBQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IG5lc3RlZFN0YWNrSWQ/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHBpcGVsaW5lTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBwaXBlbGluZUlkPzogc3RyaW5nO1xufVxuXG5jbGFzcyBQaXBlbGluZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgbmVzdGVkU3RhY2s/OiBjZGsuTmVzdGVkU3RhY2s7XG4gIHBpcGVsaW5lOiBjb2RlcGlwZWxpbmUuUGlwZWxpbmU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU/OiBDb25zdHJ1Y3QsIGlkPzogc3RyaW5nLCBwcm9wcz86IFBpcGVsaW5lU3RhY2tQcm9wcykge1xuICAgIHN1cGVyIChzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHByb3BzPy5uZXN0ZWRTdGFja0lkID8gdGhpcy5uZXN0ZWRTdGFjayA9IG5ldyBjZGsuTmVzdGVkU3RhY2sodGhpcywgcHJvcHMhLm5lc3RlZFN0YWNrSWQhKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLnBpcGVsaW5lID0gY3JlYXRlUGlwZWxpbmVXaXRoU291cmNlQW5kQnVpbGRTdGFnZXModGhpcy5uZXN0ZWRTdGFjayB8fCB0aGlzLCBwcm9wcz8ucGlwZWxpbmVOYW1lLCBwcm9wcz8ucGlwZWxpbmVJZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUGlwZWxpbmVXaXRoU291cmNlQW5kQnVpbGRTdGFnZXMoc2NvcGU6IENvbnN0cnVjdCwgcGlwZWxpbmVOYW1lPzogc3RyaW5nLCBwaXBlbGluZUlkOiBzdHJpbmcgPSAnUGlwZWxpbmUnKSB7XG4gIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICByZXR1cm4gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzY29wZSwgcGlwZWxpbmVJZCwge1xuICAgIHBpcGVsaW5lTmFtZSxcbiAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLFxuICAgIHJldXNlQ3Jvc3NSZWdpb25TdXBwb3J0U3RhY2tzOiBmYWxzZSxcbiAgICBzdGFnZXM6IFtcbiAgICAgIHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHsgYWN0aW9uTmFtZTogJ1NvdXJjZScsIG91dHB1dDogYXJ0aWZhY3QgfSldLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7IGFjdGlvbk5hbWU6ICdCdWlsZCcsIGlucHV0OiBhcnRpZmFjdCB9KV0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufTtcblxuaW50ZXJmYWNlIENyZWF0ZVBpcGVsaW5lU3RhY2tPcHRpb25zIHtcbiAgcmVhZG9ubHkgd2l0aEZlYXR1cmVGbGFnPzogYm9vbGVhbixcbiAgcmVhZG9ubHkgc3VmZml4OiBzdHJpbmcsXG4gIHJlYWRvbmx5IHN0YWNrSWQ/OiBzdHJpbmcsXG4gIHJlYWRvbmx5IHBpcGVsaW5lSWQ/OiBzdHJpbmcsXG4gIHJlYWRvbmx5IHVuZGVmaW5lZFN0YWNrTmFtZT86IGJvb2xlYW4sXG4gIHJlYWRvbmx5IG5lc3RlZFN0YWNrSWQ/OiBzdHJpbmcsXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBpcGVsaW5lU3RhY2sob3B0aW9uczogQ3JlYXRlUGlwZWxpbmVTdGFja09wdGlvbnMpOiBQaXBlbGluZVN0YWNrIHtcbiAgY29uc3QgY29udGV4dCA9IG9wdGlvbnMud2l0aEZlYXR1cmVGbGFnID8geyBjb250ZXh0OiB7IFtjeGFwaS5DT0RFUElQRUxJTkVfQ1JPU1NfQUNDT1VOVF9LRVlfQUxJQVNfU1RBQ0tfU0FGRV9SRVNPVVJDRV9OQU1FXTogdHJ1ZSB9IH0gOiB1bmRlZmluZWQ7XG4gIHJldHVybiBuZXcgUGlwZWxpbmVTdGFjayhuZXcgY2RrLkFwcChjb250ZXh0KSwgb3B0aW9ucy5zdGFja0lkLCB7XG4gICAgc3RhY2tOYW1lOiBvcHRpb25zLnVuZGVmaW5lZFN0YWNrTmFtZSA/IHVuZGVmaW5lZCA6IGBBY3R1YWwtU3RhY2stJHtvcHRpb25zLnN1ZmZpeH1gLFxuICAgIG5lc3RlZFN0YWNrSWQ6IG9wdGlvbnMubmVzdGVkU3RhY2tJZCxcbiAgICBwaXBlbGluZU5hbWU6IGBBY3R1YWwtUGlwZWxpbmUtJHtvcHRpb25zLnN1ZmZpeH1gLnN1YnN0cmluZygwLCAxMDApLFxuICAgIHBpcGVsaW5lSWQ6IG9wdGlvbnMucGlwZWxpbmVJZCxcbiAgfSk7XG59O1xuIl19
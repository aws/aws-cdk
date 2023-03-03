"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cfn = require("@aws-cdk/aws-cloudformation");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const cpactions = require("@aws-cdk/aws-codepipeline-actions");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cdk = require("@aws-cdk/core");
const fc = require("fast-check");
const pipeline_deploy_stack_action_1 = require("../lib/pipeline-deploy-stack-action");
const accountId = fc.array(fc.integer(0, 9), 12, 12).map(arr => arr.join());
cdk_build_tools_1.describeDeprecated('pipeline deploy stack action', () => {
    test('rejects cross-environment deployment', () => {
        fc.assert(fc.property(accountId, accountId, (pipelineAccount, stackAccount) => {
            fc.pre(pipelineAccount !== stackAccount);
            expect(() => {
                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'Test', { env: { account: pipelineAccount } });
                const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
                const fakeAction = new FakeAction('Fake');
                pipeline.addStage({
                    stageName: 'FakeStage',
                    actions: [fakeAction],
                });
                const deployStage = pipeline.addStage({ stageName: 'DeployStage' });
                deployStage.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
                    changeSetName: 'ChangeSet',
                    input: fakeAction.outputArtifact,
                    stack: new cdk.Stack(app, 'DeployedStack', { env: { account: stackAccount } }),
                    adminPermissions: false,
                }));
            }).toThrow('Cross-environment deployment is not supported');
        }));
    });
    test('rejects createRunOrder >= executeRunOrder', () => {
        fc.assert(fc.property(fc.integer(1, 999), fc.integer(1, 999), (createRunOrder, executeRunOrder) => {
            fc.pre(createRunOrder >= executeRunOrder);
            expect(() => {
                const app = new cdk.App();
                const stack = new cdk.Stack(app, 'Test');
                const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
                const fakeAction = new FakeAction('Fake');
                pipeline.addStage({
                    stageName: 'FakeStage',
                    actions: [fakeAction],
                });
                const deployStage = pipeline.addStage({ stageName: 'DeployStage' });
                deployStage.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
                    changeSetName: 'ChangeSet',
                    createChangeSetRunOrder: createRunOrder,
                    executeChangeSetRunOrder: executeRunOrder,
                    input: fakeAction.outputArtifact,
                    stack: new cdk.Stack(app, 'DeployedStack'),
                    adminPermissions: false,
                }));
            }).toThrow(/createChangeSetRunOrder .* must be < executeChangeSetRunOrder/);
        }));
    });
    test('users can supply CloudFormation capabilities', () => {
        const pipelineStack = getTestStack();
        const stackWithNoCapability = new cdk.Stack(undefined, 'NoCapStack', { env: { account: '123456789012', region: 'us-east-1' } });
        const stackWithAnonymousCapability = new cdk.Stack(undefined, 'AnonymousIAM', { env: { account: '123456789012', region: 'us-east-1' } });
        const stackWithAutoExpandCapability = new cdk.Stack(undefined, 'AutoExpand', { env: { account: '123456789012', region: 'us-east-1' } });
        const stackWithAnonymousAndAutoExpandCapability = new cdk.Stack(undefined, 'AnonymousIAMAndAutoExpand', { env: { account: '123456789012', region: 'us-east-1' } });
        const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);
        const pipeline = selfUpdatingStack.pipeline;
        const selfUpdateStage1 = pipeline.addStage({ stageName: 'SelfUpdate1' });
        const selfUpdateStage2 = pipeline.addStage({ stageName: 'SelfUpdate2' });
        const selfUpdateStage3 = pipeline.addStage({ stageName: 'SelfUpdate3' });
        const selfUpdateStage4 = pipeline.addStage({ stageName: 'SelfUpdate4' });
        const selfUpdateStage5 = pipeline.addStage({ stageName: 'SelfUpdate5' });
        selfUpdateStage1.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: pipelineStack,
            input: selfUpdatingStack.synthesizedApp,
            capabilities: [cfn.CloudFormationCapabilities.NAMED_IAM],
            adminPermissions: false,
        }));
        selfUpdateStage2.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: stackWithNoCapability,
            input: selfUpdatingStack.synthesizedApp,
            capabilities: [cfn.CloudFormationCapabilities.NONE],
            adminPermissions: false,
        }));
        selfUpdateStage3.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: stackWithAnonymousCapability,
            input: selfUpdatingStack.synthesizedApp,
            capabilities: [cfn.CloudFormationCapabilities.ANONYMOUS_IAM],
            adminPermissions: false,
        }));
        selfUpdateStage4.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: stackWithAutoExpandCapability,
            input: selfUpdatingStack.synthesizedApp,
            capabilities: [cfn.CloudFormationCapabilities.AUTO_EXPAND],
            adminPermissions: false,
        }));
        selfUpdateStage5.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: stackWithAnonymousAndAutoExpandCapability,
            input: selfUpdatingStack.synthesizedApp,
            capabilities: [cfn.CloudFormationCapabilities.ANONYMOUS_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND],
            adminPermissions: false,
        }));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
            StackName: 'TestStack',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_NAMED_IAM',
        }));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
            StackName: 'AnonymousIAM',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_IAM',
        }));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.not(hasPipelineActionConfiguration({
            StackName: 'NoCapStack',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_NAMED_IAM',
        })));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.not(hasPipelineActionConfiguration({
            StackName: 'NoCapStack',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_IAM',
        })));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
            StackName: 'NoCapStack',
            ActionMode: 'CHANGE_SET_REPLACE',
        }));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
            StackName: 'AutoExpand',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_AUTO_EXPAND',
        }));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
            StackName: 'AnonymousIAMAndAutoExpand',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_IAM,CAPABILITY_AUTO_EXPAND',
        }));
    });
    test('users can use admin permissions', () => {
        const pipelineStack = getTestStack();
        const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);
        const pipeline = selfUpdatingStack.pipeline;
        const selfUpdateStage = pipeline.addStage({ stageName: 'SelfUpdate' });
        selfUpdateStage.addAction(new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: pipelineStack,
            input: selfUpdatingStack.synthesizedApp,
            adminPermissions: true,
        }));
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                        ],
                        Effect: 'Allow',
                        Resource: [
                            {
                                'Fn::GetAtt': [
                                    'CodePipelineArtifactsBucketF1E925CF',
                                    'Arn',
                                ],
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'CodePipelineArtifactsBucketF1E925CF',
                                                'Arn',
                                            ],
                                        },
                                        '/*',
                                    ],
                                ],
                            },
                        ],
                    },
                    {
                        Action: [
                            'kms:Decrypt',
                            'kms:DescribeKey',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'CodePipelineArtifactsBucketEncryptionKey85407CB4',
                                'Arn',
                            ],
                        },
                    },
                    {
                        Action: '*',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
            StackName: 'TestStack',
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
        }));
    });
    test('users can supply a role for deploy action', () => {
        const pipelineStack = getTestStack();
        const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);
        const role = new iam.Role(pipelineStack, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
        });
        const pipeline = selfUpdatingStack.pipeline;
        const selfUpdateStage = pipeline.addStage({ stageName: 'SelfUpdate' });
        const deployAction = new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: pipelineStack,
            input: selfUpdatingStack.synthesizedApp,
            adminPermissions: false,
            role,
        });
        selfUpdateStage.addAction(deployAction);
        expect(deployAction.deploymentRole).toEqual(role);
    });
    test('users can specify IAM permissions for the deploy action', () => {
        // GIVEN //
        const pipelineStack = getTestStack();
        // the fake stack to deploy
        const emptyStack = getTestStack();
        const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);
        const pipeline = selfUpdatingStack.pipeline;
        // WHEN //
        // this our app/service/infra to deploy
        const deployStage = pipeline.addStage({ stageName: 'Deploy' });
        const deployAction = new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
            stack: emptyStack,
            input: selfUpdatingStack.synthesizedApp,
            adminPermissions: false,
        });
        deployStage.addAction(deployAction);
        // we might need to add permissions
        deployAction.addToDeploymentRolePolicy(new iam.PolicyStatement({
            actions: [
                'ec2:AuthorizeSecurityGroupEgress',
                'ec2:AuthorizeSecurityGroupIngress',
                'ec2:DeleteSecurityGroup',
                'ec2:DescribeSecurityGroups',
                'ec2:CreateSecurityGroup',
                'ec2:RevokeSecurityGroupEgress',
                'ec2:RevokeSecurityGroupIngress',
            ],
            resources: ['*'],
        }));
        // THEN //
        assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                        ],
                        Effect: 'Allow',
                        Resource: [
                            {
                                'Fn::GetAtt': [
                                    'CodePipelineArtifactsBucketF1E925CF',
                                    'Arn',
                                ],
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'CodePipelineArtifactsBucketF1E925CF',
                                                'Arn',
                                            ],
                                        },
                                        '/*',
                                    ],
                                ],
                            },
                        ],
                    },
                    {
                        Action: [
                            'kms:Decrypt',
                            'kms:DescribeKey',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'CodePipelineArtifactsBucketEncryptionKey85407CB4',
                                'Arn',
                            ],
                        },
                    },
                    {
                        Action: [
                            'ec2:AuthorizeSecurityGroupEgress',
                            'ec2:AuthorizeSecurityGroupIngress',
                            'ec2:DeleteSecurityGroup',
                            'ec2:DescribeSecurityGroups',
                            'ec2:CreateSecurityGroup',
                            'ec2:RevokeSecurityGroupEgress',
                            'ec2:RevokeSecurityGroupIngress',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
            Roles: [
                {
                    Ref: 'CodePipelineDeployChangeSetRoleF9F2B343',
                },
            ],
        });
    });
    test('rejects stacks with assets', () => {
        fc.assert(fc.property(fc.integer(1, 5), (assetCount) => {
            const app = new cdk.App();
            const deployedStack = new cdk.Stack(app, 'DeployedStack');
            for (let i = 0; i < assetCount; i++) {
                deployedStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, {});
            }
            expect(() => {
                new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
                    changeSetName: 'ChangeSet',
                    input: new codepipeline.Artifact(),
                    stack: deployedStack,
                    adminPermissions: false,
                });
            }).toThrow(/Cannot deploy the stack DeployedStack because it references/);
        }));
    });
    test('allows overriding the ChangeSet and Execute action names', () => {
        const stack = getTestStack();
        const selfUpdatingPipeline = createSelfUpdatingStack(stack);
        selfUpdatingPipeline.pipeline.addStage({
            stageName: 'Deploy',
            actions: [
                new pipeline_deploy_stack_action_1.PipelineDeployStackAction({
                    input: selfUpdatingPipeline.synthesizedApp,
                    adminPermissions: true,
                    stack,
                    createChangeSetActionName: 'Prepare',
                    executeChangeSetActionName: 'Deploy',
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: assertions_1.Match.arrayWith([
                assertions_1.Match.objectLike({
                    Name: 'Deploy',
                    Actions: assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            Name: 'Prepare',
                        }),
                        assertions_1.Match.objectLike({
                            Name: 'Deploy',
                        }),
                    ]),
                }),
            ]),
        });
    });
});
class FakeAction {
    constructor(actionName) {
        this.actionProperties = {
            actionName,
            artifactBounds: { minInputs: 0, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
            category: codepipeline.ActionCategory.TEST,
            provider: 'Test',
        };
        this.outputArtifact = new codepipeline.Artifact('OutputArtifact');
    }
    bind(_scope, _stage, _options) {
        return {};
    }
    onStateChange(_name, _target, _options) {
        throw new Error('onStateChange() is not available on FakeAction');
    }
}
function getTestStack() {
    return new cdk.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
function createSelfUpdatingStack(pipelineStack) {
    const pipeline = new codepipeline.Pipeline(pipelineStack, 'CodePipeline', {
        restartExecutionOnUpdate: true,
    });
    // simple source
    const bucket = s3.Bucket.fromBucketArn(pipeline, 'PatternBucket', 'arn:aws:s3:::totally-fake-bucket');
    const sourceOutput = new codepipeline.Artifact('SourceOutput');
    const sourceAction = new cpactions.S3SourceAction({
        actionName: 'S3Source',
        bucket,
        bucketKey: 'the-great-key',
        output: sourceOutput,
    });
    pipeline.addStage({
        stageName: 'source',
        actions: [sourceAction],
    });
    const project = new codebuild.PipelineProject(pipelineStack, 'CodeBuild');
    const buildOutput = new codepipeline.Artifact('BuildOutput');
    const buildAction = new cpactions.CodeBuildAction({
        actionName: 'CodeBuild',
        project,
        input: sourceOutput,
        outputs: [buildOutput],
    });
    pipeline.addStage({
        stageName: 'build',
        actions: [buildAction],
    });
    return { synthesizedApp: buildOutput, pipeline };
}
function hasPipelineActionConfiguration(expectedActionConfiguration) {
    return assertions_1.Match.objectLike({
        Stages: assertions_1.Match.arrayWith([
            assertions_1.Match.objectLike({
                Actions: assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        Configuration: expectedActionConfiguration,
                    }),
                ]),
            }),
        ]),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtZGVwbG95LXN0YWNrLWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtZGVwbG95LXN0YWNrLWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStEO0FBQy9ELG1EQUFtRDtBQUNuRCxvREFBb0Q7QUFDcEQsMERBQTBEO0FBQzFELCtEQUErRDtBQUUvRCx3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLDhEQUE4RDtBQUM5RCwyREFBMkQ7QUFDM0QscUNBQXFDO0FBRXJDLGlDQUFpQztBQUNqQyxzRkFBZ0Y7QUFNaEYsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFFNUUsb0NBQWtCLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO0lBQ3RELElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDaEQsRUFBRSxDQUFDLE1BQU0sQ0FDUCxFQUFFLENBQUMsUUFBUSxDQUNULFNBQVMsRUFBRSxTQUFTLEVBQ3BCLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxFQUFFO1lBQ2hDLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxLQUFLLFlBQVksQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FB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QUFPLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUM7b0JBQ3ZCLGtCQUFLLENBQUMsVUFBVSxDQUFDO3dCQUNmLGFBQWEsRUFBRSwyQkFBMkI7cUJBQzNDLENBQUM7aUJBQ0gsQ0FBQzthQUNILENBQUM7U0FDSCxDQUFDO0tBQ0gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBNYXRjaGVyLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2ZuIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbic7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBkZXNjcmliZURlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBmYyBmcm9tICdmYXN0LWNoZWNrJztcbmltcG9ydCB7IFBpcGVsaW5lRGVwbG95U3RhY2tBY3Rpb24gfSBmcm9tICcuLi9saWIvcGlwZWxpbmUtZGVwbG95LXN0YWNrLWFjdGlvbic7XG5cbmludGVyZmFjZSBTZWxmVXBkYXRpbmdQaXBlbGluZSB7XG4gIHN5bnRoZXNpemVkQXBwOiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG4gIHBpcGVsaW5lOiBjb2RlcGlwZWxpbmUuUGlwZWxpbmU7XG59XG5jb25zdCBhY2NvdW50SWQgPSBmYy5hcnJheShmYy5pbnRlZ2VyKDAsIDkpLCAxMiwgMTIpLm1hcChhcnIgPT4gYXJyLmpvaW4oKSk7XG5cbmRlc2NyaWJlRGVwcmVjYXRlZCgncGlwZWxpbmUgZGVwbG95IHN0YWNrIGFjdGlvbicsICgpID0+IHtcbiAgdGVzdCgncmVqZWN0cyBjcm9zcy1lbnZpcm9ubWVudCBkZXBsb3ltZW50JywgKCkgPT4ge1xuICAgIGZjLmFzc2VydChcbiAgICAgIGZjLnByb3BlcnR5KFxuICAgICAgICBhY2NvdW50SWQsIGFjY291bnRJZCxcbiAgICAgICAgKHBpcGVsaW5lQWNjb3VudCwgc3RhY2tBY2NvdW50KSA9PiB7XG4gICAgICAgICAgZmMucHJlKHBpcGVsaW5lQWNjb3VudCAhPT0gc3RhY2tBY2NvdW50KTtcbiAgICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0JywgeyBlbnY6IHsgYWNjb3VudDogcGlwZWxpbmVBY2NvdW50IH0gfSk7XG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScpO1xuICAgICAgICAgICAgY29uc3QgZmFrZUFjdGlvbiA9IG5ldyBGYWtlQWN0aW9uKCdGYWtlJyk7XG4gICAgICAgICAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICAgICAgICAgIHN0YWdlTmFtZTogJ0Zha2VTdGFnZScsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtmYWtlQWN0aW9uXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBkZXBsb3lTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnRGVwbG95U3RhZ2UnIH0pO1xuICAgICAgICAgICAgZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBQaXBlbGluZURlcGxveVN0YWNrQWN0aW9uKHtcbiAgICAgICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ0NoYW5nZVNldCcsXG4gICAgICAgICAgICAgIGlucHV0OiBmYWtlQWN0aW9uLm91dHB1dEFydGlmYWN0LFxuICAgICAgICAgICAgICBzdGFjazogbmV3IGNkay5TdGFjayhhcHAsICdEZXBsb3llZFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogc3RhY2tBY2NvdW50IH0gfSksXG4gICAgICAgICAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0pLnRvVGhyb3coJ0Nyb3NzLWVudmlyb25tZW50IGRlcGxveW1lbnQgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICB9LFxuICAgICAgKSxcbiAgICApO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3JlamVjdHMgY3JlYXRlUnVuT3JkZXIgPj0gZXhlY3V0ZVJ1bk9yZGVyJywgKCkgPT4ge1xuICAgIGZjLmFzc2VydChcbiAgICAgIGZjLnByb3BlcnR5KFxuICAgICAgICBmYy5pbnRlZ2VyKDEsIDk5OSksIGZjLmludGVnZXIoMSwgOTk5KSxcbiAgICAgICAgKGNyZWF0ZVJ1bk9yZGVyLCBleGVjdXRlUnVuT3JkZXIpID0+IHtcbiAgICAgICAgICBmYy5wcmUoY3JlYXRlUnVuT3JkZXIgPj0gZXhlY3V0ZVJ1bk9yZGVyKTtcbiAgICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScpO1xuICAgICAgICAgICAgY29uc3QgZmFrZUFjdGlvbiA9IG5ldyBGYWtlQWN0aW9uKCdGYWtlJyk7XG4gICAgICAgICAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICAgICAgICAgIHN0YWdlTmFtZTogJ0Zha2VTdGFnZScsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtmYWtlQWN0aW9uXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgZGVwbG95U3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ0RlcGxveVN0YWdlJyB9KTtcbiAgICAgICAgICAgIGRlcGxveVN0YWdlLmFkZEFjdGlvbihuZXcgUGlwZWxpbmVEZXBsb3lTdGFja0FjdGlvbih7XG4gICAgICAgICAgICAgIGNoYW5nZVNldE5hbWU6ICdDaGFuZ2VTZXQnLFxuICAgICAgICAgICAgICBjcmVhdGVDaGFuZ2VTZXRSdW5PcmRlcjogY3JlYXRlUnVuT3JkZXIsXG4gICAgICAgICAgICAgIGV4ZWN1dGVDaGFuZ2VTZXRSdW5PcmRlcjogZXhlY3V0ZVJ1bk9yZGVyLFxuICAgICAgICAgICAgICBpbnB1dDogZmFrZUFjdGlvbi5vdXRwdXRBcnRpZmFjdCxcbiAgICAgICAgICAgICAgc3RhY2s6IG5ldyBjZGsuU3RhY2soYXBwLCAnRGVwbG95ZWRTdGFjaycpLFxuICAgICAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9KS50b1Rocm93KC9jcmVhdGVDaGFuZ2VTZXRSdW5PcmRlciAuKiBtdXN0IGJlIDwgZXhlY3V0ZUNoYW5nZVNldFJ1bk9yZGVyLyk7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICk7XG5cbiAgfSk7XG4gIHRlc3QoJ3VzZXJzIGNhbiBzdXBwbHkgQ2xvdWRGb3JtYXRpb24gY2FwYWJpbGl0aWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcbiAgICBjb25zdCBzdGFja1dpdGhOb0NhcGFiaWxpdHkgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ05vQ2FwU3RhY2snLFxuICAgICAgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcblxuICAgIGNvbnN0IHN0YWNrV2l0aEFub255bW91c0NhcGFiaWxpdHkgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ0Fub255bW91c0lBTScsXG4gICAgICB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuXG4gICAgY29uc3Qgc3RhY2tXaXRoQXV0b0V4cGFuZENhcGFiaWxpdHkgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ0F1dG9FeHBhbmQnLFxuICAgICAgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcblxuICAgIGNvbnN0IHN0YWNrV2l0aEFub255bW91c0FuZEF1dG9FeHBhbmRDYXBhYmlsaXR5ID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdBbm9ueW1vdXNJQU1BbmRBdXRvRXhwYW5kJyxcbiAgICAgIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG5cbiAgICBjb25zdCBzZWxmVXBkYXRpbmdTdGFjayA9IGNyZWF0ZVNlbGZVcGRhdGluZ1N0YWNrKHBpcGVsaW5lU3RhY2spO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBzZWxmVXBkYXRpbmdTdGFjay5waXBlbGluZTtcblxuICAgIGNvbnN0IHNlbGZVcGRhdGVTdGFnZTEgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ1NlbGZVcGRhdGUxJyB9KTtcbiAgICBjb25zdCBzZWxmVXBkYXRlU3RhZ2UyID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTZWxmVXBkYXRlMicgfSk7XG4gICAgY29uc3Qgc2VsZlVwZGF0ZVN0YWdlMyA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnU2VsZlVwZGF0ZTMnIH0pO1xuICAgIGNvbnN0IHNlbGZVcGRhdGVTdGFnZTQgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ1NlbGZVcGRhdGU0JyB9KTtcbiAgICBjb25zdCBzZWxmVXBkYXRlU3RhZ2U1ID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTZWxmVXBkYXRlNScgfSk7XG5cbiAgICBzZWxmVXBkYXRlU3RhZ2UxLmFkZEFjdGlvbihuZXcgUGlwZWxpbmVEZXBsb3lTdGFja0FjdGlvbih7XG4gICAgICBzdGFjazogcGlwZWxpbmVTdGFjayxcbiAgICAgIGlucHV0OiBzZWxmVXBkYXRpbmdTdGFjay5zeW50aGVzaXplZEFwcCxcbiAgICAgIGNhcGFiaWxpdGllczogW2Nmbi5DbG91ZEZvcm1hdGlvbkNhcGFiaWxpdGllcy5OQU1FRF9JQU1dLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogZmFsc2UsXG4gICAgfSkpO1xuICAgIHNlbGZVcGRhdGVTdGFnZTIuYWRkQWN0aW9uKG5ldyBQaXBlbGluZURlcGxveVN0YWNrQWN0aW9uKHtcbiAgICAgIHN0YWNrOiBzdGFja1dpdGhOb0NhcGFiaWxpdHksXG4gICAgICBpbnB1dDogc2VsZlVwZGF0aW5nU3RhY2suc3ludGhlc2l6ZWRBcHAsXG4gICAgICBjYXBhYmlsaXRpZXM6IFtjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuTk9ORV0sXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICB9KSk7XG4gICAgc2VsZlVwZGF0ZVN0YWdlMy5hZGRBY3Rpb24obmV3IFBpcGVsaW5lRGVwbG95U3RhY2tBY3Rpb24oe1xuICAgICAgc3RhY2s6IHN0YWNrV2l0aEFub255bW91c0NhcGFiaWxpdHksXG4gICAgICBpbnB1dDogc2VsZlVwZGF0aW5nU3RhY2suc3ludGhlc2l6ZWRBcHAsXG4gICAgICBjYXBhYmlsaXRpZXM6IFtjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuQU5PTllNT1VTX0lBTV0sXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICB9KSk7XG4gICAgc2VsZlVwZGF0ZVN0YWdlNC5hZGRBY3Rpb24obmV3IFBpcGVsaW5lRGVwbG95U3RhY2tBY3Rpb24oe1xuICAgICAgc3RhY2s6IHN0YWNrV2l0aEF1dG9FeHBhbmRDYXBhYmlsaXR5LFxuICAgICAgaW5wdXQ6IHNlbGZVcGRhdGluZ1N0YWNrLnN5bnRoZXNpemVkQXBwLFxuICAgICAgY2FwYWJpbGl0aWVzOiBbY2ZuLkNsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzLkFVVE9fRVhQQU5EXSxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgIH0pKTtcbiAgICBzZWxmVXBkYXRlU3RhZ2U1LmFkZEFjdGlvbihuZXcgUGlwZWxpbmVEZXBsb3lTdGFja0FjdGlvbih7XG4gICAgICBzdGFjazogc3RhY2tXaXRoQW5vbnltb3VzQW5kQXV0b0V4cGFuZENhcGFiaWxpdHksXG4gICAgICBpbnB1dDogc2VsZlVwZGF0aW5nU3RhY2suc3ludGhlc2l6ZWRBcHAsXG4gICAgICBjYXBhYmlsaXRpZXM6IFtjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuQU5PTllNT1VTX0lBTSwgY2ZuLkNsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzLkFVVE9fRVhQQU5EXSxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIGhhc1BpcGVsaW5lQWN0aW9uQ29uZmlndXJhdGlvbih7XG4gICAgICBTdGFja05hbWU6ICdUZXN0U3RhY2snLFxuICAgICAgQWN0aW9uTW9kZTogJ0NIQU5HRV9TRVRfUkVQTEFDRScsXG4gICAgICBDYXBhYmlsaXRpZXM6ICdDQVBBQklMSVRZX05BTUVEX0lBTScsXG4gICAgfSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIGhhc1BpcGVsaW5lQWN0aW9uQ29uZmlndXJhdGlvbih7XG4gICAgICBTdGFja05hbWU6ICdBbm9ueW1vdXNJQU0nLFxuICAgICAgQWN0aW9uTW9kZTogJ0NIQU5HRV9TRVRfUkVQTEFDRScsXG4gICAgICBDYXBhYmlsaXRpZXM6ICdDQVBBQklMSVRZX0lBTScsXG4gICAgfSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm5vdChoYXNQaXBlbGluZUFjdGlvbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgU3RhY2tOYW1lOiAnTm9DYXBTdGFjaycsXG4gICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgIENhcGFiaWxpdGllczogJ0NBUEFCSUxJVFlfTkFNRURfSUFNJyxcbiAgICB9KSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm5vdChoYXNQaXBlbGluZUFjdGlvbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgU3RhY2tOYW1lOiAnTm9DYXBTdGFjaycsXG4gICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgIENhcGFiaWxpdGllczogJ0NBUEFCSUxJVFlfSUFNJyxcbiAgICB9KSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIGhhc1BpcGVsaW5lQWN0aW9uQ29uZmlndXJhdGlvbih7XG4gICAgICBTdGFja05hbWU6ICdOb0NhcFN0YWNrJyxcbiAgICAgIEFjdGlvbk1vZGU6ICdDSEFOR0VfU0VUX1JFUExBQ0UnLFxuICAgIH0pKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2socGlwZWxpbmVTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBoYXNQaXBlbGluZUFjdGlvbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgU3RhY2tOYW1lOiAnQXV0b0V4cGFuZCcsXG4gICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgIENhcGFiaWxpdGllczogJ0NBUEFCSUxJVFlfQVVUT19FWFBBTkQnLFxuICAgIH0pKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2socGlwZWxpbmVTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBoYXNQaXBlbGluZUFjdGlvbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgU3RhY2tOYW1lOiAnQW5vbnltb3VzSUFNQW5kQXV0b0V4cGFuZCcsXG4gICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgIENhcGFiaWxpdGllczogJ0NBUEFCSUxJVFlfSUFNLENBUEFCSUxJVFlfQVVUT19FWFBBTkQnLFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcnMgY2FuIHVzZSBhZG1pbiBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICBjb25zdCBwaXBlbGluZVN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgY29uc3Qgc2VsZlVwZGF0aW5nU3RhY2sgPSBjcmVhdGVTZWxmVXBkYXRpbmdTdGFjayhwaXBlbGluZVN0YWNrKTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gc2VsZlVwZGF0aW5nU3RhY2sucGlwZWxpbmU7XG4gICAgY29uc3Qgc2VsZlVwZGF0ZVN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTZWxmVXBkYXRlJyB9KTtcbiAgICBzZWxmVXBkYXRlU3RhZ2UuYWRkQWN0aW9uKG5ldyBQaXBlbGluZURlcGxveVN0YWNrQWN0aW9uKHtcbiAgICAgIHN0YWNrOiBwaXBlbGluZVN0YWNrLFxuICAgICAgaW5wdXQ6IHNlbGZVcGRhdGluZ1N0YWNrLnN5bnRoZXNpemVkQXBwLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcbiAgICB9KSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdDb2RlUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXRGMUU5MjVDRicsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb2RlUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXRGMUU5MjVDRicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ29kZVBpcGVsaW5lQXJ0aWZhY3RzQnVja2V0RW5jcnlwdGlvbktleTg1NDA3Q0I0JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICcqJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgaGFzUGlwZWxpbmVBY3Rpb25Db25maWd1cmF0aW9uKHtcbiAgICAgIFN0YWNrTmFtZTogJ1Rlc3RTdGFjaycsXG4gICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgIENhcGFiaWxpdGllczogJ0NBUEFCSUxJVFlfTkFNRURfSUFNLENBUEFCSUxJVFlfQVVUT19FWFBBTkQnLFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcnMgY2FuIHN1cHBseSBhIHJvbGUgZm9yIGRlcGxveSBhY3Rpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IGdldFRlc3RTdGFjaygpO1xuICAgIGNvbnN0IHNlbGZVcGRhdGluZ1N0YWNrID0gY3JlYXRlU2VsZlVwZGF0aW5nU3RhY2socGlwZWxpbmVTdGFjayk7XG5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHBpcGVsaW5lU3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY2xvdWRmb3JtYXRpb24uYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHBpcGVsaW5lID0gc2VsZlVwZGF0aW5nU3RhY2sucGlwZWxpbmU7XG4gICAgY29uc3Qgc2VsZlVwZGF0ZVN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTZWxmVXBkYXRlJyB9KTtcbiAgICBjb25zdCBkZXBsb3lBY3Rpb24gPSBuZXcgUGlwZWxpbmVEZXBsb3lTdGFja0FjdGlvbih7XG4gICAgICBzdGFjazogcGlwZWxpbmVTdGFjayxcbiAgICAgIGlucHV0OiBzZWxmVXBkYXRpbmdTdGFjay5zeW50aGVzaXplZEFwcCxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgcm9sZSxcbiAgICB9KTtcbiAgICBzZWxmVXBkYXRlU3RhZ2UuYWRkQWN0aW9uKGRlcGxveUFjdGlvbik7XG4gICAgZXhwZWN0KGRlcGxveUFjdGlvbi5kZXBsb3ltZW50Um9sZSkudG9FcXVhbChyb2xlKTtcblxuICB9KTtcbiAgdGVzdCgndXNlcnMgY2FuIHNwZWNpZnkgSUFNIHBlcm1pc3Npb25zIGZvciB0aGUgZGVwbG95IGFjdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTiAvL1xuICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgIC8vIHRoZSBmYWtlIHN0YWNrIHRvIGRlcGxveVxuICAgIGNvbnN0IGVtcHR5U3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgIGNvbnN0IHNlbGZVcGRhdGluZ1N0YWNrID0gY3JlYXRlU2VsZlVwZGF0aW5nU3RhY2socGlwZWxpbmVTdGFjayk7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBzZWxmVXBkYXRpbmdTdGFjay5waXBlbGluZTtcblxuICAgIC8vIFdIRU4gLy9cbiAgICAvLyB0aGlzIG91ciBhcHAvc2VydmljZS9pbmZyYSB0byBkZXBsb3lcbiAgICBjb25zdCBkZXBsb3lTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnRGVwbG95JyB9KTtcbiAgICBjb25zdCBkZXBsb3lBY3Rpb24gPSBuZXcgUGlwZWxpbmVEZXBsb3lTdGFja0FjdGlvbih7XG4gICAgICBzdGFjazogZW1wdHlTdGFjayxcbiAgICAgIGlucHV0OiBzZWxmVXBkYXRpbmdTdGFjay5zeW50aGVzaXplZEFwcCxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgIH0pO1xuICAgIGRlcGxveVN0YWdlLmFkZEFjdGlvbihkZXBsb3lBY3Rpb24pO1xuICAgIC8vIHdlIG1pZ2h0IG5lZWQgdG8gYWRkIHBlcm1pc3Npb25zXG4gICAgZGVwbG95QWN0aW9uLmFkZFRvRGVwbG95bWVudFJvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnZWMyOkF1dGhvcml6ZVNlY3VyaXR5R3JvdXBFZ3Jlc3MnLFxuICAgICAgICAnZWMyOkF1dGhvcml6ZVNlY3VyaXR5R3JvdXBJbmdyZXNzJyxcbiAgICAgICAgJ2VjMjpEZWxldGVTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgJ2VjMjpEZXNjcmliZVNlY3VyaXR5R3JvdXBzJyxcbiAgICAgICAgJ2VjMjpDcmVhdGVTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgJ2VjMjpSZXZva2VTZWN1cml0eUdyb3VwRWdyZXNzJyxcbiAgICAgICAgJ2VjMjpSZXZva2VTZWN1cml0eUdyb3VwSW5ncmVzcycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOIC8vXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBpcGVsaW5lU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdDb2RlUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXRGMUU5MjVDRicsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb2RlUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXRGMUU5MjVDRicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ29kZVBpcGVsaW5lQXJ0aWZhY3RzQnVja2V0RW5jcnlwdGlvbktleTg1NDA3Q0I0JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2VjMjpBdXRob3JpemVTZWN1cml0eUdyb3VwRWdyZXNzJyxcbiAgICAgICAgICAgICAgJ2VjMjpBdXRob3JpemVTZWN1cml0eUdyb3VwSW5ncmVzcycsXG4gICAgICAgICAgICAgICdlYzI6RGVsZXRlU2VjdXJpdHlHcm91cCcsXG4gICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVTZWN1cml0eUdyb3VwcycsXG4gICAgICAgICAgICAgICdlYzI6Q3JlYXRlU2VjdXJpdHlHcm91cCcsXG4gICAgICAgICAgICAgICdlYzI6UmV2b2tlU2VjdXJpdHlHcm91cEVncmVzcycsXG4gICAgICAgICAgICAgICdlYzI6UmV2b2tlU2VjdXJpdHlHcm91cEluZ3Jlc3MnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnQ29kZVBpcGVsaW5lRGVwbG95Q2hhbmdlU2V0Um9sZUY5RjJCMzQzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG4gIHRlc3QoJ3JlamVjdHMgc3RhY2tzIHdpdGggYXNzZXRzJywgKCkgPT4ge1xuICAgIGZjLmFzc2VydChcbiAgICAgIGZjLnByb3BlcnR5KFxuICAgICAgICBmYy5pbnRlZ2VyKDEsIDUpLFxuICAgICAgICAoYXNzZXRDb3VudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbiAgICAgICAgICBjb25zdCBkZXBsb3llZFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdEZXBsb3llZFN0YWNrJyk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3NldENvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGRlcGxveWVkU3RhY2subm9kZS5hZGRNZXRhZGF0YShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkFTU0VULCB7fSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgIG5ldyBQaXBlbGluZURlcGxveVN0YWNrQWN0aW9uKHtcbiAgICAgICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ0NoYW5nZVNldCcsXG4gICAgICAgICAgICAgIGlucHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgICAgICAgIHN0YWNrOiBkZXBsb3llZFN0YWNrLFxuICAgICAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBkZXBsb3kgdGhlIHN0YWNrIERlcGxveWVkU3RhY2sgYmVjYXVzZSBpdCByZWZlcmVuY2VzLyk7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93cyBvdmVycmlkaW5nIHRoZSBDaGFuZ2VTZXQgYW5kIEV4ZWN1dGUgYWN0aW9uIG5hbWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG4gICAgY29uc3Qgc2VsZlVwZGF0aW5nUGlwZWxpbmUgPSBjcmVhdGVTZWxmVXBkYXRpbmdTdGFjayhzdGFjayk7XG4gICAgc2VsZlVwZGF0aW5nUGlwZWxpbmUucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IFBpcGVsaW5lRGVwbG95U3RhY2tBY3Rpb24oe1xuICAgICAgICAgIGlucHV0OiBzZWxmVXBkYXRpbmdQaXBlbGluZS5zeW50aGVzaXplZEFwcCxcbiAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgICAgIHN0YWNrLFxuICAgICAgICAgIGNyZWF0ZUNoYW5nZVNldEFjdGlvbk5hbWU6ICdQcmVwYXJlJyxcbiAgICAgICAgICBleGVjdXRlQ2hhbmdlU2V0QWN0aW9uTmFtZTogJ0RlcGxveScsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICBTdGFnZXM6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIE5hbWU6ICdEZXBsb3knLFxuICAgICAgICAgIEFjdGlvbnM6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgTmFtZTogJ1ByZXBhcmUnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSksXG4gICAgICBdKSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgRmFrZUFjdGlvbiBpbXBsZW1lbnRzIGNvZGVwaXBlbGluZS5JQWN0aW9uIHtcbiAgcHVibGljIHJlYWRvbmx5IGFjdGlvblByb3BlcnRpZXM6IGNvZGVwaXBlbGluZS5BY3Rpb25Qcm9wZXJ0aWVzO1xuICBwdWJsaWMgcmVhZG9ubHkgb3V0cHV0QXJ0aWZhY3Q6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcblxuICBjb25zdHJ1Y3RvcihhY3Rpb25OYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLmFjdGlvblByb3BlcnRpZXMgPSB7XG4gICAgICBhY3Rpb25OYW1lLFxuICAgICAgYXJ0aWZhY3RCb3VuZHM6IHsgbWluSW5wdXRzOiAwLCBtYXhJbnB1dHM6IDUsIG1pbk91dHB1dHM6IDAsIG1heE91dHB1dHM6IDUgfSxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuVEVTVCxcbiAgICAgIHByb3ZpZGVyOiAnVGVzdCcsXG4gICAgfTtcbiAgICB0aGlzLm91dHB1dEFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnT3V0cHV0QXJ0aWZhY3QnKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIF9zdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSwgX29wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBvblN0YXRlQ2hhbmdlKF9uYW1lOiBzdHJpbmcsIF90YXJnZXQ/OiBldmVudHMuSVJ1bGVUYXJnZXQsIF9vcHRpb25zPzogZXZlbnRzLlJ1bGVQcm9wcyk6IGV2ZW50cy5SdWxlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29uU3RhdGVDaGFuZ2UoKSBpcyBub3QgYXZhaWxhYmxlIG9uIEZha2VBY3Rpb24nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXN0U3RhY2soKTogY2RrLlN0YWNrIHtcbiAgcmV0dXJuIG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VsZlVwZGF0aW5nU3RhY2socGlwZWxpbmVTdGFjazogY2RrLlN0YWNrKTogU2VsZlVwZGF0aW5nUGlwZWxpbmUge1xuICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUocGlwZWxpbmVTdGFjaywgJ0NvZGVQaXBlbGluZScsIHtcbiAgICByZXN0YXJ0RXhlY3V0aW9uT25VcGRhdGU6IHRydWUsXG4gIH0pO1xuXG4gIC8vIHNpbXBsZSBzb3VyY2VcbiAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBcm4ocGlwZWxpbmUsICdQYXR0ZXJuQnVja2V0JywgJ2Fybjphd3M6czM6Ojp0b3RhbGx5LWZha2UtYnVja2V0Jyk7XG4gIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZU91dHB1dCcpO1xuICBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICBhY3Rpb25OYW1lOiAnUzNTb3VyY2UnLFxuICAgIGJ1Y2tldCxcbiAgICBidWNrZXRLZXk6ICd0aGUtZ3JlYXQta2V5JyxcbiAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgfSk7XG4gIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICBzdGFnZU5hbWU6ICdzb3VyY2UnLFxuICAgIGFjdGlvbnM6IFtzb3VyY2VBY3Rpb25dLFxuICB9KTtcblxuICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QocGlwZWxpbmVTdGFjaywgJ0NvZGVCdWlsZCcpO1xuICBjb25zdCBidWlsZE91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0J1aWxkT3V0cHV0Jyk7XG4gIGNvbnN0IGJ1aWxkQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgIHByb2plY3QsXG4gICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICBvdXRwdXRzOiBbYnVpbGRPdXRwdXRdLFxuICB9KTtcbiAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgIHN0YWdlTmFtZTogJ2J1aWxkJyxcbiAgICBhY3Rpb25zOiBbYnVpbGRBY3Rpb25dLFxuICB9KTtcbiAgcmV0dXJuIHsgc3ludGhlc2l6ZWRBcHA6IGJ1aWxkT3V0cHV0LCBwaXBlbGluZSB9O1xufVxuXG5mdW5jdGlvbiBoYXNQaXBlbGluZUFjdGlvbkNvbmZpZ3VyYXRpb24oZXhwZWN0ZWRBY3Rpb25Db25maWd1cmF0aW9uOiBhbnkpOiBNYXRjaGVyIHtcbiAgcmV0dXJuIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgIFN0YWdlczogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBBY3Rpb25zOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbjogZXhwZWN0ZWRBY3Rpb25Db25maWd1cmF0aW9uLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKSxcbiAgICAgIH0pLFxuICAgIF0pLFxuICB9KTtcbn0iXX0=
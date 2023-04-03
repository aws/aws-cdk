"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('', () => {
    describe('Lambda invoke Action', () => {
        test('properly serializes the object passed in userParameters', () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                userParams: {
                    key: 1234,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {},
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'UserParameters': '{"key":1234}',
                                },
                            },
                        ],
                    },
                ],
            }));
        });
        test('properly resolves any Tokens passed in userParameters', () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                userParams: {
                    key: core_1.Lazy.string({ produce: () => core_1.Aws.REGION }),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {},
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'UserParameters': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                '{"key":"',
                                                {
                                                    'Ref': 'AWS::Region',
                                                },
                                                '"}',
                                            ],
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                ],
            }));
        });
        test('properly resolves any stringified Tokens passed in userParameters', () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                userParams: {
                    key: core_1.Token.asString(null),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {},
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'UserParameters': '{"key":null}',
                                },
                            },
                        ],
                    },
                ],
            }));
        });
        test('properly assings userParametersString to UserParameters', () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                userParamsString: '**/*.template.json',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {},
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'UserParameters': '**/*.template.json',
                                },
                            },
                        ],
                    },
                ],
            }));
        });
        test('throws if both userParameters and userParametersString are supplied', () => {
            expect(() => stackIncludingLambdaInvokeCodePipeline({
                userParams: {
                    key: core_1.Token.asString(null),
                },
                userParamsString: '**/*.template.json',
            })).toThrow(/Only one of userParameters or userParametersString can be specified/);
        });
        test("assigns the Action's Role with read permissions to the Bucket if it has only inputs", () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                lambdaInput: new codepipeline.Artifact(),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', assertions_1.Match.objectLike({
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Action': 'lambda:ListFunctions',
                            'Resource': '*',
                            'Effect': 'Allow',
                        },
                        {
                            'Action': 'lambda:InvokeFunction',
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                            ],
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                            ],
                            'Effect': 'Allow',
                        },
                    ],
                },
            }));
        });
        test("assigns the Action's Role with write permissions to the Bucket if it has only outputs", () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                lambdaOutput: new codepipeline.Artifact(),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyName: 'PipelineInvokeLambdaCodePipelineActionRoleDefaultPolicy103F34DA',
                'PolicyDocument': assertions_1.Match.objectLike({
                    'Statement': [
                        {
                            'Action': 'lambda:ListFunctions',
                            'Resource': '*',
                            'Effect': 'Allow',
                        },
                        {
                            'Action': 'lambda:InvokeFunction',
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                's3:DeleteObject*',
                                's3:PutObject',
                                's3:PutObjectLegalHold',
                                's3:PutObjectRetention',
                                's3:PutObjectTagging',
                                's3:PutObjectVersionTagging',
                                's3:Abort*',
                            ],
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*',
                                'kms:Decrypt',
                            ],
                            'Effect': 'Allow',
                        },
                    ],
                }),
            });
        });
        test("assigns the Action's Role with read-write permissions to the Bucket if it has both inputs and outputs", () => {
            const stack = stackIncludingLambdaInvokeCodePipeline({
                lambdaInput: new codepipeline.Artifact(),
                lambdaOutput: new codepipeline.Artifact(),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyName: 'PipelineInvokeLambdaCodePipelineActionRoleDefaultPolicy103F34DA',
                'PolicyDocument': assertions_1.Match.objectLike({
                    'Statement': [
                        {
                            'Action': 'lambda:ListFunctions',
                            'Resource': '*',
                            'Effect': 'Allow',
                        },
                        {
                            'Action': 'lambda:InvokeFunction',
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                            ],
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                            ],
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                's3:DeleteObject*',
                                's3:PutObject',
                                's3:PutObjectLegalHold',
                                's3:PutObjectRetention',
                                's3:PutObjectTagging',
                                's3:PutObjectVersionTagging',
                                's3:Abort*',
                            ],
                            'Effect': 'Allow',
                        },
                        {
                            'Action': [
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*',
                                'kms:Decrypt',
                            ],
                            'Effect': 'Allow',
                        },
                    ],
                }),
            });
        });
        test('exposes variables for other actions to consume', () => {
            const stack = new core_1.Stack(undefined, undefined, {
                env: { account: '123456789012', region: 'us-east-1' },
            });
            const sourceOutput = new codepipeline.Artifact();
            const lambdaInvokeAction = new cpactions.LambdaInvokeAction({
                actionName: 'LambdaInvoke',
                lambda: lambda.Function.fromFunctionArn(stack, 'Func', 'arn:aws:lambda:us-east-1:123456789012:function:some-func'),
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
                        stageName: 'Invoke',
                        actions: [
                            lambdaInvokeAction,
                            new cpactions.ManualApprovalAction({
                                actionName: 'Approve',
                                additionalInformation: lambdaInvokeAction.variable('SomeVar'),
                                notificationTopic: sns.Topic.fromTopicArn(stack, 'Topic', 'arn:aws:sns:us-east-1:123456789012:mytopic'),
                                runOrder: 2,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Invoke',
                        'Actions': [
                            {
                                'Name': 'LambdaInvoke',
                                'Namespace': 'Invoke_LambdaInvoke_NS',
                            },
                            {
                                'Name': 'Approve',
                                'Configuration': {
                                    'CustomData': '#{Invoke_LambdaInvoke_NS.SomeVar}',
                                },
                            },
                        ],
                    },
                ],
            }));
        });
    });
});
function stackIncludingLambdaInvokeCodePipeline(props, app) {
    const stack = new core_1.Stack(app);
    new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [
                    new cpactions.GitHubSourceAction({
                        actionName: 'GitHub',
                        output: props.lambdaInput || new codepipeline.Artifact(),
                        oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                        owner: 'awslabs',
                        repo: 'aws-cdk',
                    }),
                ],
            },
            {
                stageName: 'Invoke',
                actions: [
                    new cpactions.LambdaInvokeAction({
                        actionName: 'Lambda',
                        lambda: new lambda.Function(stack, 'Lambda', {
                            code: lambda.Code.fromCfnParameters(),
                            handler: 'index.handler',
                            runtime: lambda.Runtime.NODEJS_14_X,
                        }),
                        userParameters: props.userParams,
                        userParametersString: props.userParamsString,
                        inputs: props.lambdaInput ? [props.lambdaInput] : undefined,
                        outputs: props.lambdaOutput ? [props.lambdaOutput] : undefined,
                    }),
                ],
            },
        ],
    });
    return stack;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWludm9rZS1hY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhbWJkYS1pbnZva2UtYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsMERBQTBEO0FBQzFELDhDQUE4QztBQUM5QyxzQ0FBc0M7QUFDdEMsd0NBQXdDO0FBQ3hDLHdDQUEwRTtBQUMxRSx1Q0FBdUM7QUFFdkMsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFO0lBQ2hCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtZQUNuRSxNQUFNLEtBQUssR0FBRyxzQ0FBc0MsQ0FBQztnQkFDbkQsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxJQUFJO2lCQUNWO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUUsa0JBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQzlGLFFBQVEsRUFBRTtvQkFDUixFQUFFO29CQUNGO3dCQUNFLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxlQUFlLEVBQUU7b0NBQ2YsZ0JBQWdCLEVBQUUsY0FBYztpQ0FDakM7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUNqRSxNQUFNLEtBQUssR0FBRyxzQ0FBc0MsQ0FBQztnQkFDbkQsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDaEQ7YUFDRixDQUFDLENBQUM7WUFDSCxx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QUFRLENBQUM7d0JBQ2pELEtBQUssRUFBRSxTQUFTO3dCQUNoQixJQUFJLEVBQUUsU0FBUztxQkFDaEIsQ0FBQztpQkFDSDthQUNGO1lBQ0Q7Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLE9BQU8sRUFBRTtvQkFDUCxJQUFJLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQzt3QkFDL0IsVUFBVSxFQUFFLFFBQVE7d0JBQ3BCLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTs0QkFDM0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7NEJBQ3JDLE9BQU8sRUFBRSxlQUFlOzRCQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO3lCQUNwQyxDQUFDO3dCQUNGLGNBQWMsRUFBRSxLQUFLLENBQUMsVUFBVTt3QkFDaEMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjt3QkFDNUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO3dCQUMzRCxPQUFPLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7cUJBQy9ELENBQUM7aUJBQ0g7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0IHsgQXBwLCBBd3MsIExhenksIFNlY3JldFZhbHVlLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi8uLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnJywgKCkgPT4ge1xuICBkZXNjcmliZSgnTGFtYmRhIGludm9rZSBBY3Rpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgncHJvcGVybHkgc2VyaWFsaXplcyB0aGUgb2JqZWN0IHBhc3NlZCBpbiB1c2VyUGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gc3RhY2tJbmNsdWRpbmdMYW1iZGFJbnZva2VDb2RlUGlwZWxpbmUoe1xuICAgICAgICB1c2VyUGFyYW1zOiB7XG4gICAgICAgICAga2V5OiAxMjM0LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1VzZXJQYXJhbWV0ZXJzJzogJ3tcImtleVwiOjEyMzR9JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJvcGVybHkgcmVzb2x2ZXMgYW55IFRva2VucyBwYXNzZWQgaW4gdXNlclBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IHN0YWNrSW5jbHVkaW5nTGFtYmRhSW52b2tlQ29kZVBpcGVsaW5lKHtcbiAgICAgICAgdXNlclBhcmFtczoge1xuICAgICAgICAgIGtleTogTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBBd3MuUkVHSU9OIH0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge30sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdVc2VyUGFyYW1ldGVycyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICd7XCJrZXlcIjpcIicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdcIn0nLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcm9wZXJseSByZXNvbHZlcyBhbnkgc3RyaW5naWZpZWQgVG9rZW5zIHBhc3NlZCBpbiB1c2VyUGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gc3RhY2tJbmNsdWRpbmdMYW1iZGFJbnZva2VDb2RlUGlwZWxpbmUoe1xuICAgICAgICB1c2VyUGFyYW1zOiB7XG4gICAgICAgICAga2V5OiBUb2tlbi5hc1N0cmluZyhudWxsKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge30sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdVc2VyUGFyYW1ldGVycyc6ICd7XCJrZXlcIjpudWxsfScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Byb3Blcmx5IGFzc2luZ3MgdXNlclBhcmFtZXRlcnNTdHJpbmcgdG8gVXNlclBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IHN0YWNrSW5jbHVkaW5nTGFtYmRhSW52b2tlQ29kZVBpcGVsaW5lKHtcbiAgICAgICAgdXNlclBhcmFtc1N0cmluZzogJyoqLyoudGVtcGxhdGUuanNvbicsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHt9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnVXNlclBhcmFtZXRlcnMnOiAnKiovKi50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIGJvdGggdXNlclBhcmFtZXRlcnMgYW5kIHVzZXJQYXJhbWV0ZXJzU3RyaW5nIGFyZSBzdXBwbGllZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBzdGFja0luY2x1ZGluZ0xhbWJkYUludm9rZUNvZGVQaXBlbGluZSh7XG4gICAgICAgIHVzZXJQYXJhbXM6IHtcbiAgICAgICAgICBrZXk6IFRva2VuLmFzU3RyaW5nKG51bGwpLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyUGFyYW1zU3RyaW5nOiAnKiovKi50ZW1wbGF0ZS5qc29uJyxcbiAgICAgIH0pKS50b1Rocm93KC9Pbmx5IG9uZSBvZiB1c2VyUGFyYW1ldGVycyBvciB1c2VyUGFyYW1ldGVyc1N0cmluZyBjYW4gYmUgc3BlY2lmaWVkLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwiYXNzaWducyB0aGUgQWN0aW9uJ3MgUm9sZSB3aXRoIHJlYWQgcGVybWlzc2lvbnMgdG8gdGhlIEJ1Y2tldCBpZiBpdCBoYXMgb25seSBpbnB1dHNcIiwgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBzdGFja0luY2x1ZGluZ0xhbWJkYUludm9rZUNvZGVQaXBlbGluZSh7XG4gICAgICAgIGxhbWJkYUlucHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnbGFtYmRhOkxpc3RGdW5jdGlvbnMnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwiYXNzaWducyB0aGUgQWN0aW9uJ3MgUm9sZSB3aXRoIHdyaXRlIHBlcm1pc3Npb25zIHRvIHRoZSBCdWNrZXQgaWYgaXQgaGFzIG9ubHkgb3V0cHV0c1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IHN0YWNrSW5jbHVkaW5nTGFtYmRhSW52b2tlQ29kZVBpcGVsaW5lKHtcbiAgICAgICAgbGFtYmRhT3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgIC8vIG5vIGlucHV0IHRvIHRoZSBMYW1iZGEgQWN0aW9uIC0gd2Ugd2FudCB3cml0ZSBwZXJtaXNzaW9ucyBvbmx5IGluIHRoaXMgY2FzZVxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lOYW1lOiAnUGlwZWxpbmVJbnZva2VMYW1iZGFDb2RlUGlwZWxpbmVBY3Rpb25Sb2xlRGVmYXVsdFBvbGljeTEwM0YzNERBJyxcbiAgICAgICAgJ1BvbGljeURvY3VtZW50JzogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdsYW1iZGE6TGlzdEZ1bmN0aW9ucycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoXCJhc3NpZ25zIHRoZSBBY3Rpb24ncyBSb2xlIHdpdGggcmVhZC13cml0ZSBwZXJtaXNzaW9ucyB0byB0aGUgQnVja2V0IGlmIGl0IGhhcyBib3RoIGlucHV0cyBhbmQgb3V0cHV0c1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IHN0YWNrSW5jbHVkaW5nTGFtYmRhSW52b2tlQ29kZVBpcGVsaW5lKHtcbiAgICAgICAgbGFtYmRhSW5wdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKSxcbiAgICAgICAgbGFtYmRhT3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeU5hbWU6ICdQaXBlbGluZUludm9rZUxhbWJkYUNvZGVQaXBlbGluZUFjdGlvblJvbGVEZWZhdWx0UG9saWN5MTAzRjM0REEnLFxuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ2xhbWJkYTpMaXN0RnVuY3Rpb25zJyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgICAgJ2ttczpEZXNjcmliZUtleScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2V4cG9zZXMgdmFyaWFibGVzIGZvciBvdGhlciBhY3Rpb25zIHRvIGNvbnN1bWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBjb25zdCBsYW1iZGFJbnZva2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkxhbWJkYUludm9rZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdMYW1iZGFJbnZva2UnLFxuICAgICAgICBsYW1iZGE6IGxhbWJkYS5GdW5jdGlvbi5mcm9tRnVuY3Rpb25Bcm4oc3RhY2ssICdGdW5jJywgJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6ZnVuY3Rpb246c29tZS1mdW5jJyksXG4gICAgICB9KTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1MzX1NvdXJjZScsXG4gICAgICAgICAgICAgICAgYnVja2V0OiBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssICdCdWNrZXQnLCAnYnVja2V0JyksXG4gICAgICAgICAgICAgICAgYnVja2V0S2V5OiAna2V5JyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnSW52b2tlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbGFtYmRhSW52b2tlQWN0aW9uLFxuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLk1hbnVhbEFwcHJvdmFsQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQXBwcm92ZScsXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbEluZm9ybWF0aW9uOiBsYW1iZGFJbnZva2VBY3Rpb24udmFyaWFibGUoJ1NvbWVWYXInKSxcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb25Ub3BpYzogc25zLlRvcGljLmZyb21Ub3BpY0FybihzdGFjaywgJ1RvcGljJywgJ2Fybjphd3M6c25zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bXl0b3BpYycpLFxuICAgICAgICAgICAgICAgIHJ1bk9yZGVyOiAyLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0ludm9rZScsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0xhbWJkYUludm9rZScsXG4gICAgICAgICAgICAgICAgJ05hbWVzcGFjZSc6ICdJbnZva2VfTGFtYmRhSW52b2tlX05TJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0FwcHJvdmUnLFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0N1c3RvbURhdGEnOiAnI3tJbnZva2VfTGFtYmRhSW52b2tlX05TLlNvbWVWYXJ9JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5pbnRlcmZhY2UgSGVscGVyUHJvcHMge1xuICByZWFkb25seSB1c2VyUGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbiAgcmVhZG9ubHkgdXNlclBhcmFtc1N0cmluZz86IHN0cmluZztcbiAgcmVhZG9ubHkgbGFtYmRhSW5wdXQ/OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG4gIHJlYWRvbmx5IGxhbWJkYU91dHB1dD86IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcbn1cblxuZnVuY3Rpb24gc3RhY2tJbmNsdWRpbmdMYW1iZGFJbnZva2VDb2RlUGlwZWxpbmUocHJvcHM6IEhlbHBlclByb3BzLCBhcHA/OiBBcHApIHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcblxuICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgc3RhZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICBuZXcgY3BhY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiAnR2l0SHViJyxcbiAgICAgICAgICAgIG91dHB1dDogcHJvcHMubGFtYmRhSW5wdXQgfHwgbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpLFxuICAgICAgICAgICAgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdzZWNyZXQnKSxcbiAgICAgICAgICAgIG93bmVyOiAnYXdzbGFicycsXG4gICAgICAgICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzdGFnZU5hbWU6ICdJbnZva2UnLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5MYW1iZGFJbnZva2VBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0xhbWJkYScsXG4gICAgICAgICAgICBsYW1iZGE6IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGEnLCB7XG4gICAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21DZm5QYXJhbWV0ZXJzKCksXG4gICAgICAgICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHVzZXJQYXJhbWV0ZXJzOiBwcm9wcy51c2VyUGFyYW1zLFxuICAgICAgICAgICAgdXNlclBhcmFtZXRlcnNTdHJpbmc6IHByb3BzLnVzZXJQYXJhbXNTdHJpbmcsXG4gICAgICAgICAgICBpbnB1dHM6IHByb3BzLmxhbWJkYUlucHV0ID8gW3Byb3BzLmxhbWJkYUlucHV0XSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG91dHB1dHM6IHByb3BzLmxhbWJkYU91dHB1dCA/IFtwcm9wcy5sYW1iZGFPdXRwdXRdIDogdW5kZWZpbmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcblxuICByZXR1cm4gc3RhY2s7XG59XG4iXX0=
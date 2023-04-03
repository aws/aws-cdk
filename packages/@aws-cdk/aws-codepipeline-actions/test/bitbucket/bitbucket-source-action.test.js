"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
cdk_build_tools_1.describeDeprecated('BitBucket source Action', () => {
    describe('BitBucket source Action', () => {
        test('produces the correct configuration when added to a pipeline', () => {
            const stack = new core_1.Stack();
            createBitBucketAndCodeBuildPipeline(stack, {
                codeBuildCloneOutput: false,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                        'Actions': [
                            {
                                'Name': 'BitBucket',
                                'ActionTypeId': {
                                    'Owner': 'AWS',
                                    'Provider': 'CodeStarSourceConnection',
                                },
                                'Configuration': {
                                    'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                                    'FullRepositoryId': 'aws/aws-cdk',
                                    'BranchName': 'master',
                                },
                            },
                        ],
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'CodeBuild',
                            },
                        ],
                    },
                ],
            });
        });
    });
    test('setting codeBuildCloneOutput=true adds permission to use the connection to the following CodeBuild Project', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            codeBuildCloneOutput: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'logs:CreateLogGroup',
                            'logs:CreateLogStream',
                            'logs:PutLogEvents',
                        ],
                    },
                    {},
                    {},
                    {},
                    {},
                    {
                        'Action': 'codestar-connections:UseConnection',
                        'Effect': 'Allow',
                        'Resource': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                    },
                ],
            },
        });
    });
    test('grant s3 putObjectACL to the following CodeBuild Project', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            codeBuildCloneOutput: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        'Action': [
                            's3:PutObjectAcl',
                            's3:PutObjectVersionAcl',
                        ],
                        'Effect': 'Allow',
                        'Resource': {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            'PipelineArtifactsBucket22248F97',
                                            'Arn',
                                        ],
                                    },
                                    '/*',
                                ],
                            ],
                        },
                    }),
                ]),
            },
        });
    });
    test('setting triggerOnPush=false reflects in the configuration', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            triggerOnPush: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {
                    'Name': 'Source',
                    'Actions': [
                        {
                            'Name': 'BitBucket',
                            'ActionTypeId': {
                                'Owner': 'AWS',
                                'Provider': 'CodeStarSourceConnection',
                            },
                            'Configuration': {
                                'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                                'FullRepositoryId': 'aws/aws-cdk',
                                'BranchName': 'master',
                                'DetectChanges': false,
                            },
                        },
                    ],
                },
                {
                    'Name': 'Build',
                    'Actions': [
                        {
                            'Name': 'CodeBuild',
                        },
                    ],
                },
            ],
        });
    });
});
function createBitBucketAndCodeBuildPipeline(stack, props) {
    const sourceOutput = new codepipeline.Artifact();
    new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [
                    new cpactions.BitBucketSourceAction({
                        actionName: 'BitBucket',
                        owner: 'aws',
                        repo: 'aws-cdk',
                        output: sourceOutput,
                        connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                        ...props,
                    }),
                ],
            },
            {
                stageName: 'Build',
                actions: [
                    new cpactions.CodeBuildAction({
                        actionName: 'CodeBuild',
                        project: new codebuild.PipelineProject(stack, 'MyProject'),
                        input: sourceOutput,
                        outputs: [new codepipeline.Artifact()],
                    }),
                ],
            },
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0YnVja2V0LXNvdXJjZS1hY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJpdGJ1Y2tldC1zb3VyY2UtYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsb0RBQW9EO0FBQ3BELDBEQUEwRDtBQUMxRCw4REFBOEQ7QUFDOUQsd0NBQXNDO0FBQ3RDLHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsb0NBQWtCLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO0lBQ2pELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLG1DQUFtQyxDQUFDLEtBQUssRUFBRTtnQkFDekMsb0JBQW9CLEVBQUUsS0FBSzthQUM1QixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDN0UsUUFBUSxFQUFFO29CQUNSO3dCQUNFLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLFdBQVc7Z0NBQ25CLGNBQWMsRUFBRTtvQ0FDZCxPQUFPLEVBQUUsS0FBSztvQ0FDZCxVQUFVLEVBQUUsMEJBQTBCO2lDQUN2QztnQ0FDRCxlQUFlLEVBQUU7b0NBQ2YsZUFBZSxFQUFFLGdHQUFnRztvQ0FDakgsa0JBQWtCLEVBQUUsYUFBYTtvQ0FDakMsWUFBWSxFQUFFLFFBQVE7aUNBQ3ZCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNEO3dCQUNFLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxNQUFNLEVBQUUsV0FBVzs2QkFDcEI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFH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QUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pELElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1FBQzNDLE1BQU0sRUFBRTtZQUNOO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxTQUFTLENBQUMscUJBQXFCLENBQUM7d0JBQ2xDLFVBQVUsRUFBRSxXQUFXO3dCQUN2QixLQUFLLEVBQUUsS0FBSzt3QkFDWixJQUFJLEVBQUUsU0FBUzt3QkFDZixNQUFNLEVBQUUsWUFBWTt3QkFDcEIsYUFBYSxFQUFFLGdHQUFnRzt3QkFDL0csR0FBRyxLQUFLO3FCQUNULENBQUM7aUJBQ0g7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO3dCQUM1QixVQUFVLEVBQUUsV0FBVzt3QkFDdkIsT0FBTyxFQUFFLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO3dCQUMxRCxLQUFLLEVBQUUsWUFBWTt3QkFDbkIsT0FBTyxFQUFFLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ3ZDLENBQUM7aUJBQ0g7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgZGVzY3JpYmVEZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmVEZXByZWNhdGVkKCdCaXRCdWNrZXQgc291cmNlIEFjdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0JpdEJ1Y2tldCBzb3VyY2UgQWN0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Byb2R1Y2VzIHRoZSBjb3JyZWN0IGNvbmZpZ3VyYXRpb24gd2hlbiBhZGRlZCB0byBhIHBpcGVsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY3JlYXRlQml0QnVja2V0QW5kQ29kZUJ1aWxkUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgICAgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQml0QnVja2V0JyxcbiAgICAgICAgICAgICAgICAnQWN0aW9uVHlwZUlkJzoge1xuICAgICAgICAgICAgICAgICAgJ093bmVyJzogJ0FXUycsXG4gICAgICAgICAgICAgICAgICAnUHJvdmlkZXInOiAnQ29kZVN0YXJTb3VyY2VDb25uZWN0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25Bcm4nOiAnYXJuOmF3czpjb2Rlc3Rhci1jb25uZWN0aW9uczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNvbm5lY3Rpb24vMTIzNDU2NzgtYWJjZC0xMmFiLTM0Y2RlZjU2NzhnaCcsXG4gICAgICAgICAgICAgICAgICAnRnVsbFJlcG9zaXRvcnlJZCc6ICdhd3MvYXdzLWNkaycsXG4gICAgICAgICAgICAgICAgICAnQnJhbmNoTmFtZSc6ICdtYXN0ZXInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzZXR0aW5nIGNvZGVCdWlsZENsb25lT3V0cHV0PXRydWUgYWRkcyBwZXJtaXNzaW9uIHRvIHVzZSB0aGUgY29ubmVjdGlvbiB0byB0aGUgZm9sbG93aW5nIENvZGVCdWlsZCBQcm9qZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjcmVhdGVCaXRCdWNrZXRBbmRDb2RlQnVpbGRQaXBlbGluZShzdGFjaywge1xuICAgICAgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dHcm91cCcsXG4gICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgICAge30sXG4gICAgICAgICAge30sXG4gICAgICAgICAge30sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdjb2Rlc3Rhci1jb25uZWN0aW9uczpVc2VDb25uZWN0aW9uJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjb25uZWN0aW9uLzEyMzQ1Njc4LWFiY2QtMTJhYi0zNGNkZWY1Njc4Z2gnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2dyYW50IHMzIHB1dE9iamVjdEFDTCB0byB0aGUgZm9sbG93aW5nIENvZGVCdWlsZCBQcm9qZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY3JlYXRlQml0QnVja2V0QW5kQ29kZUJ1aWxkUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgIGNvZGVCdWlsZENsb25lT3V0cHV0OiB0cnVlLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3RBY2wnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvbkFjbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdQaXBlbGluZUFydGlmYWN0c0J1Y2tldDIyMjQ4Rjk3JyxcbiAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG4gIHRlc3QoJ3NldHRpbmcgdHJpZ2dlck9uUHVzaD1mYWxzZSByZWZsZWN0cyBpbiB0aGUgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY3JlYXRlQml0QnVja2V0QW5kQ29kZUJ1aWxkUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgIHRyaWdnZXJPblB1c2g6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdCaXRCdWNrZXQnLFxuICAgICAgICAgICAgICAnQWN0aW9uVHlwZUlkJzoge1xuICAgICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAgICdQcm92aWRlcic6ICdDb2RlU3RhclNvdXJjZUNvbm5lY3Rpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbkFybic6ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y29ubmVjdGlvbi8xMjM0NTY3OC1hYmNkLTEyYWItMzRjZGVmNTY3OGdoJyxcbiAgICAgICAgICAgICAgICAnRnVsbFJlcG9zaXRvcnlJZCc6ICdhd3MvYXdzLWNkaycsXG4gICAgICAgICAgICAgICAgJ0JyYW5jaE5hbWUnOiAnbWFzdGVyJyxcbiAgICAgICAgICAgICAgICAnRGV0ZWN0Q2hhbmdlcyc6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJpdEJ1Y2tldEFuZENvZGVCdWlsZFBpcGVsaW5lKHN0YWNrOiBTdGFjaywgcHJvcHM6IFBhcnRpYWw8Y3BhY3Rpb25zLkJpdEJ1Y2tldFNvdXJjZUFjdGlvblByb3BzPik6IHZvaWQge1xuICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICBzdGFnZXM6IFtcbiAgICAgIHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQml0QnVja2V0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCaXRCdWNrZXQnLFxuICAgICAgICAgICAgb3duZXI6ICdhd3MnLFxuICAgICAgICAgICAgcmVwbzogJ2F3cy1jZGsnLFxuICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICBjb25uZWN0aW9uQXJuOiAnYXJuOmF3czpjb2Rlc3Rhci1jb25uZWN0aW9uczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNvbm5lY3Rpb24vMTIzNDU2NzgtYWJjZC0xMmFiLTM0Y2RlZjU2NzhnaCcsXG4gICAgICAgICAgICAuLi5wcm9wcyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnKSxcbiAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICBvdXRwdXRzOiBbbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const stepfunction = require("@aws-cdk/aws-stepfunctions");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
describe('StepFunctions Invoke Action', () => {
    describe('StepFunctions Invoke Action', () => {
        test('Verify stepfunction configuration properties are set to specific values', () => {
            const stack = new core_1.Stack();
            // when
            minimalPipeline(stack);
            // then
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                Stages: [
                    //  Must have a source stage
                    {
                        Actions: [
                            {
                                ActionTypeId: {
                                    Category: 'Source',
                                    Owner: 'AWS',
                                    Provider: 'S3',
                                    Version: '1',
                                },
                                Configuration: {
                                    S3Bucket: {
                                        Ref: 'MyBucketF68F3FF0',
                                    },
                                    S3ObjectKey: 'some/path/to',
                                },
                            },
                        ],
                    },
                    // Must have stepfunction invoke action configuration
                    {
                        Actions: [
                            {
                                ActionTypeId: {
                                    Category: 'Invoke',
                                    Owner: 'AWS',
                                    Provider: 'StepFunctions',
                                    Version: '1',
                                },
                                Configuration: {
                                    StateMachineArn: {
                                        Ref: 'SimpleStateMachineE8E2CF40',
                                    },
                                    InputType: 'Literal',
                                    // JSON Stringified input when the input type is Literal
                                    Input: '{\"IsHelloWorldExample\":true}',
                                },
                            },
                        ],
                    },
                ],
            }));
        });
        test('Allows the pipeline to invoke this stepfunction', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyName: 'MyPipelineInvokeCodePipelineActionRoleDefaultPolicy07A602B1',
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([
                        {
                            Action: ['states:StartExecution', 'states:DescribeStateMachine'],
                            Resource: {
                                Ref: 'SimpleStateMachineE8E2CF40',
                            },
                            Effect: 'Allow',
                        },
                    ]),
                },
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 4);
        });
        test('Allows the pipeline to describe this stepfunction execution', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {},
                        {
                            Action: 'states:DescribeExecution',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':states:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':execution:',
                                        {
                                            'Fn::Select': [
                                                6,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            Ref: 'SimpleStateMachineE8E2CF40',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        ':*',
                                    ],
                                ],
                            },
                            Effect: 'Allow',
                        },
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 4);
        });
    });
});
function minimalPipeline(stack) {
    const sourceOutput = new codepipeline.Artifact();
    const startState = new stepfunction.Pass(stack, 'StartState');
    const simpleStateMachine = new stepfunction.StateMachine(stack, 'SimpleStateMachine', {
        definition: startState,
    });
    const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
    const sourceStage = pipeline.addStage({
        stageName: 'Source',
        actions: [
            new cpactions.S3SourceAction({
                actionName: 'Source',
                bucket: new s3.Bucket(stack, 'MyBucket'),
                bucketKey: 'some/path/to',
                output: sourceOutput,
                trigger: cpactions.S3Trigger.POLL,
            }),
        ],
    });
    pipeline.addStage({
        stageName: 'Invoke',
        actions: [
            new cpactions.StepFunctionInvokeAction({
                actionName: 'Invoke',
                stateMachine: simpleStateMachine,
                stateMachineInput: cpactions.StateMachineInput.literal({ IsHelloWorldExample: true }),
            }),
        ],
    });
    return sourceStage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcGZ1bmN0aW9ucy1pbnZva2UtYWN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RlcGZ1bmN0aW9ucy1pbnZva2UtYWN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELDBEQUEwRDtBQUMxRCxzQ0FBc0M7QUFDdEMsMkRBQTJEO0FBQzNELHdDQUFzQztBQUN0Qyx1Q0FBdUM7QUFFdkMsUUFBUSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUMzQyxRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQzNDLElBQUksQ0FBQyx5RUFBeUUsRUFBRSxHQUFHLEVBQUU7WUFDbkYsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRSxrQkFBSyxDQUFDLFVBQVUsQ0FBQztnQkFDOUYsTUFBTSxFQUFFO29CQUNOLDRCQUE0QjtvQkFDNUI7d0JBQ0UsT0FBTyxFQUFFOzRCQUNQO2dDQUNFLFlBQVksRUFBRTtvQ0FDWixRQUFRLEVBQUUsUUFBUTtvQ0FDbEIsS0FBSyxFQUFFLEtBQUs7b0NBQ1osUUFBUSxFQUFFLElBQUk7b0NBQ2QsT0FBTyxFQUFFLEdBQUc7aUNBQ2I7Z0NBQ0QsYUFBYSxFQUFFO29DQUNiLFFBQVEsRUFBRTt3Q0FDUixHQUFHLEVBQUUsa0JBQWtCO3FDQUN4QjtvQ0FDRCxXQUFXLEVBQUUsY0FBYztpQ0FDNUI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBQ0QscURBQXFEO29CQUNyRDt3QkFDRSxPQUFPLEVBQUU7NEJBQ1A7Z0NBQ0UsWUFBWSxFQUFFO29DQUNaLFFBQVEsRUFBRSxRQUFRO29DQUNsQixLQUFLLEVBQUUsS0FBSztvQ0FDWixRQUFRLEVBQUUsZUFBZTtvQ0FDekIsT0FBTyxFQUFFLEdBQUc7aUNBQ2I7Z0NBQ0QsYUFBYSxFQUFFO29DQUNiLGVBQWUsRUFBRTt3Q0FDZixHQUFHLEVBQUUsNEJBQTRCO3FDQUNsQztvQ0FDRCxTQUFTLEVBQUUsU0FBUztvQ0FDcEIsd0RBQXdEO29DQUN4RCxLQUFLLEVBQUUsZ0NBQWdDO2lDQUN4Qzs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQyxDQUFDO1FBR04sQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQzNELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO2dCQUNsRSxVQUFVLEVBQUUsNkRBQTZEO2dCQUN6RSxjQUFjLEVBQUU7b0JBQ2QsU0FBUyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDO3dCQUN6Qjs0QkFDRSxNQUFNLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSw2QkFBNkIsQ0FBQzs0QkFDaEUsUUFBUSxFQUFFO2dDQUNSLEdBQUcsRUFBRSw0QkFBNEI7NkJBQ2xDOzRCQUNELE1BQU0sRUFBRSxPQUFPO3lCQUNoQjtxQkFDRixDQUFDO2lCQUNIO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR2pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDbEUsY0FBYyxFQUFFO29CQUNkLFNBQVMsRUFBRTt3QkFDVCxFQUFFO3dCQUNGOzRCQUNFLE1BQU0sRUFBRSwwQkFBMEI7NEJBQ2xDLFFBQVEsRUFBRTtnQ0FDUixVQUFVLEVBQUU7b0NBQ1YsRUFBRTtvQ0FDRjt3Q0FDRSxNQUFNO3dDQUNOOzRDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7eUNBQ3RCO3dDQUNELFVBQVU7d0NBQ1Y7NENBQ0UsR0FBRyxFQUFFLGFBQWE7eUNBQ25CO3dDQUNELEdBQUc7d0NBQ0g7NENBQ0UsR0FBRyxFQUFFLGdCQUFnQjt5Q0FDdEI7d0NBQ0QsYUFBYTt3Q0FDYjs0Q0FDRSxZQUFZLEVBQUU7Z0RBQ1osQ0FBQztnREFDRDtvREFDRSxXQUFXLEVBQUU7d0RBQ1gsR0FBRzt3REFDSDs0REFDRSxHQUFHLEVBQUUsNEJBQTRCO3lEQUNsQztxREFDRjtpREFDRjs2Q0FDRjt5Q0FDRjt3Q0FDRCxJQUFJO3FDQUNMO2lDQUNGOzZCQUNGOzRCQUNELE1BQU0sRUFBRSxPQUFPO3lCQUNoQjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUdqRSxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLGVBQWUsQ0FBQyxLQUFZO0lBQ25DLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pELE1BQU0sVUFBVSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1FBQ3BGLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCLENBQUMsQ0FBQztJQUNILE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDaEUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxTQUFTLEVBQUUsUUFBUTtRQUNuQixPQUFPLEVBQUU7WUFDUCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0JBQzNCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7Z0JBQ3hDLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSTthQUNsQyxDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2hCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLE9BQU8sRUFBRTtZQUNQLElBQUksU0FBUyxDQUFDLHdCQUF3QixDQUFDO2dCQUNyQyxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsWUFBWSxFQUFFLGtCQUFrQjtnQkFDaEMsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO2FBQ3RGLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzdGVwZnVuY3Rpb24gZnJvbSAnQGF3cy1jZGsvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnU3RlcEZ1bmN0aW9ucyBJbnZva2UgQWN0aW9uJywgKCkgPT4ge1xuICBkZXNjcmliZSgnU3RlcEZ1bmN0aW9ucyBJbnZva2UgQWN0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ1ZlcmlmeSBzdGVwZnVuY3Rpb24gY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFyZSBzZXQgdG8gc3BlY2lmaWMgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gd2hlblxuICAgICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrKTtcblxuICAgICAgLy8gdGhlblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBTdGFnZXM6IFtcbiAgICAgICAgICAvLyAgTXVzdCBoYXZlIGEgc291cmNlIHN0YWdlXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uVHlwZUlkOiB7XG4gICAgICAgICAgICAgICAgICBDYXRlZ29yeTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICAgICBPd25lcjogJ0FXUycsXG4gICAgICAgICAgICAgICAgICBQcm92aWRlcjogJ1MzJyxcbiAgICAgICAgICAgICAgICAgIFZlcnNpb246ICcxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgIFMzQnVja2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFMzT2JqZWN0S2V5OiAnc29tZS9wYXRoL3RvJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIE11c3QgaGF2ZSBzdGVwZnVuY3Rpb24gaW52b2tlIGFjdGlvbiBjb25maWd1cmF0aW9uXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uVHlwZUlkOiB7XG4gICAgICAgICAgICAgICAgICBDYXRlZ29yeTogJ0ludm9rZScsXG4gICAgICAgICAgICAgICAgICBPd25lcjogJ0FXUycsXG4gICAgICAgICAgICAgICAgICBQcm92aWRlcjogJ1N0ZXBGdW5jdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgVmVyc2lvbjogJzEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgU3RhdGVNYWNoaW5lQXJuOiB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ1NpbXBsZVN0YXRlTWFjaGluZUU4RTJDRjQwJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBJbnB1dFR5cGU6ICdMaXRlcmFsJyxcbiAgICAgICAgICAgICAgICAgIC8vIEpTT04gU3RyaW5naWZpZWQgaW5wdXQgd2hlbiB0aGUgaW5wdXQgdHlwZSBpcyBMaXRlcmFsXG4gICAgICAgICAgICAgICAgICBJbnB1dDogJ3tcXFwiSXNIZWxsb1dvcmxkRXhhbXBsZVxcXCI6dHJ1ZX0nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnQWxsb3dzIHRoZSBwaXBlbGluZSB0byBpbnZva2UgdGhpcyBzdGVwZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBtaW5pbWFsUGlwZWxpbmUoc3RhY2spO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgUG9saWN5TmFtZTogJ015UGlwZWxpbmVJbnZva2VDb2RlUGlwZWxpbmVBY3Rpb25Sb2xlRGVmYXVsdFBvbGljeTA3QTYwMkIxJyxcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogWydzdGF0ZXM6U3RhcnRFeGVjdXRpb24nLCAnc3RhdGVzOkRlc2NyaWJlU3RhdGVNYWNoaW5lJ10sXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnU2ltcGxlU3RhdGVNYWNoaW5lRThFMkNGNDAnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDQpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ0FsbG93cyB0aGUgcGlwZWxpbmUgdG8gZGVzY3JpYmUgdGhpcyBzdGVwZnVuY3Rpb24gZXhlY3V0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RhdGVzOkRlc2NyaWJlRXhlY3V0aW9uJyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOnN0YXRlczonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6ZXhlY3V0aW9uOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1NpbXBsZVN0YXRlTWFjaGluZUU4RTJDRjQwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgNCk7XG5cblxuICAgIH0pO1xuXG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG1pbmltYWxQaXBlbGluZShzdGFjazogU3RhY2spOiBjb2RlcGlwZWxpbmUuSVN0YWdlIHtcbiAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICBjb25zdCBzdGFydFN0YXRlID0gbmV3IHN0ZXBmdW5jdGlvbi5QYXNzKHN0YWNrLCAnU3RhcnRTdGF0ZScpO1xuICBjb25zdCBzaW1wbGVTdGF0ZU1hY2hpbmUgPSBuZXcgc3RlcGZ1bmN0aW9uLlN0YXRlTWFjaGluZShzdGFjaywgJ1NpbXBsZVN0YXRlTWFjaGluZScsIHtcbiAgICBkZWZpbml0aW9uOiBzdGFydFN0YXRlLFxuICB9KTtcbiAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnTXlQaXBlbGluZScpO1xuICBjb25zdCBzb3VyY2VTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgIGFjdGlvbnM6IFtcbiAgICAgIG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKSxcbiAgICAgICAgYnVja2V0S2V5OiAnc29tZS9wYXRoL3RvJyxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgIHRyaWdnZXI6IGNwYWN0aW9ucy5TM1RyaWdnZXIuUE9MTCxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0pO1xuICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgc3RhZ2VOYW1lOiAnSW52b2tlJyxcbiAgICBhY3Rpb25zOiBbXG4gICAgICBuZXcgY3BhY3Rpb25zLlN0ZXBGdW5jdGlvbkludm9rZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdJbnZva2UnLFxuICAgICAgICBzdGF0ZU1hY2hpbmU6IHNpbXBsZVN0YXRlTWFjaGluZSxcbiAgICAgICAgc3RhdGVNYWNoaW5lSW5wdXQ6IGNwYWN0aW9ucy5TdGF0ZU1hY2hpbmVJbnB1dC5saXRlcmFsKHsgSXNIZWxsb1dvcmxkRXhhbXBsZTogdHJ1ZSB9KSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0pO1xuXG4gIHJldHVybiBzb3VyY2VTdGFnZTtcbn1cbiJdfQ==
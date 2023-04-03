"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const waiter_state_machine_1 = require("../../lib/provider-framework/waiter-state-machine");
describe('state machine', () => {
    test('contains the needed resources', () => {
        // GIVEN
        const stack = new core_1.Stack();
        constructs_1.Node.of(stack).setContext('@aws-cdk/core:target-partitions', ['aws', 'aws-cn']);
        const isCompleteHandler = new aws_lambda_1.Function(stack, 'isComplete', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        const timeoutHandler = new aws_lambda_1.Function(stack, 'isTimeout', {
            code: aws_lambda_1.Code.fromInline('foo'),
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        const interval = core_1.Duration.hours(2);
        const maxAttempts = 2;
        const backoffRate = 5;
        // WHEN
        new waiter_state_machine_1.WaiterStateMachine(stack, 'statemachine', {
            isCompleteHandler,
            timeoutHandler,
            backoffRate,
            interval,
            maxAttempts,
        });
        // THEN
        const roleId = 'statemachineRole52044F93';
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: {
                'Fn::Join': [
                    '',
                    [
                        '{"StartAt":"framework-isComplete-task","States":{"framework-isComplete-task":{"End":true,"Retry":[{"ErrorEquals":["States.ALL"],' +
                            `"IntervalSeconds":${interval.toSeconds()},"MaxAttempts":${maxAttempts},"BackoffRate":${backoffRate}}],` +
                            '"Catch":[{"ErrorEquals":["States.ALL"],"Next":"framework-onTimeout-task"}],"Type":"Task","Resource":"',
                        stack.resolve(isCompleteHandler.functionArn),
                        '"},"framework-onTimeout-task":{"End":true,"Type":"Task","Resource":"',
                        stack.resolve(timeoutHandler.functionArn),
                        '"}}}',
                    ],
                ],
            },
            RoleArn: {
                'Fn::GetAtt': [roleId, 'Arn'],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'states.',
                                        stack.resolve(stack.region),
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'lambda:InvokeFunction',
                        Effect: 'Allow',
                        Resource: stack.resolve(isCompleteHandler.resourceArnsForGrantInvoke),
                    },
                    {
                        Action: 'lambda:InvokeFunction',
                        Effect: 'Allow',
                        Resource: stack.resolve(timeoutHandler.resourceArnsForGrantInvoke),
                    },
                ],
                Version: '2012-10-17',
            },
            Roles: [{ Ref: roleId }],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdGVyLXN0YXRlLW1hY2hpbmUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhaXRlci1zdGF0ZS1tYWNoaW5lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msb0RBQTBFO0FBQzFFLHdDQUFnRDtBQUNoRCwyQ0FBa0M7QUFDbEMsNEZBQXVGO0FBRXZGLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDekMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsaUJBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLGlDQUFpQyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFaEYsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHFCQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUMxRCxJQUFJLEVBQUUsaUJBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQzVCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxjQUFjLEdBQUcsSUFBSSxxQkFBUSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDdEQsSUFBSSxFQUFFLGlCQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUM1QixPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLE9BQU8sRUFBRSxlQUFlO1NBQ3pCLENBQUMsQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLGVBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUV0QixPQUFPO1FBQ1AsSUFBSSx5Q0FBa0IsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO1lBQzVDLGlCQUFpQjtZQUNqQixjQUFjO1lBQ2QsV0FBVztZQUNYLFFBQVE7WUFDUixXQUFXO1NBQ1osQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDO1FBQzFDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtDQUFrQyxFQUFFO1lBQ2xGLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRSxrSUFBa0k7NEJBQ2xJLHFCQUFxQixRQUFRLENBQUMsU0FBUyxFQUFFLGtCQUFrQixXQUFXLGtCQUFrQixXQUFXLEtBQUs7NEJBQ3hHLHVHQUF1Rzt3QkFDdkcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUM7d0JBQzVDLHNFQUFzRTt3QkFDdEUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO3dCQUN6QyxNQUFNO3FCQUNQO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQzthQUM5QjtTQUNGLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ2hFLHdCQUF3QixFQUFFO2dCQUN4QixTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsTUFBTSxFQUFFLE9BQU87d0JBQ2YsU0FBUyxFQUFFOzRCQUNULE9BQU8sRUFBRTtnQ0FDUCxVQUFVLEVBQUU7b0NBQ1YsRUFBRTtvQ0FDRjt3Q0FDRSxTQUFTO3dDQUNULEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzt3Q0FDM0IsZ0JBQWdCO3FDQUNqQjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsWUFBWTthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLHVCQUF1Qjt3QkFDL0IsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsMEJBQTBCLENBQUM7cUJBQ3RFO29CQUNEO3dCQUNFLE1BQU0sRUFBRSx1QkFBdUI7d0JBQy9CLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQztxQkFDbkU7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFLFlBQVk7YUFDdEI7WUFDRCxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IENvZGUsIEZ1bmN0aW9uIGFzIGxhbWJkYUZuLCBSdW50aW1lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFdhaXRlclN0YXRlTWFjaGluZSB9IGZyb20gJy4uLy4uL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvd2FpdGVyLXN0YXRlLW1hY2hpbmUnO1xuXG5kZXNjcmliZSgnc3RhdGUgbWFjaGluZScsICgpID0+IHtcbiAgdGVzdCgnY29udGFpbnMgdGhlIG5lZWRlZCByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIE5vZGUub2Yoc3RhY2spLnNldENvbnRleHQoJ0Bhd3MtY2RrL2NvcmU6dGFyZ2V0LXBhcnRpdGlvbnMnLCBbJ2F3cycsICdhd3MtY24nXSk7XG5cbiAgICBjb25zdCBpc0NvbXBsZXRlSGFuZGxlciA9IG5ldyBsYW1iZGFGbihzdGFjaywgJ2lzQ29tcGxldGUnLCB7XG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcbiAgICBjb25zdCB0aW1lb3V0SGFuZGxlciA9IG5ldyBsYW1iZGFGbihzdGFjaywgJ2lzVGltZW91dCcsIHtcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIH0pO1xuICAgIGNvbnN0IGludGVydmFsID0gRHVyYXRpb24uaG91cnMoMik7XG4gICAgY29uc3QgbWF4QXR0ZW1wdHMgPSAyO1xuICAgIGNvbnN0IGJhY2tvZmZSYXRlID0gNTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgV2FpdGVyU3RhdGVNYWNoaW5lKHN0YWNrLCAnc3RhdGVtYWNoaW5lJywge1xuICAgICAgaXNDb21wbGV0ZUhhbmRsZXIsXG4gICAgICB0aW1lb3V0SGFuZGxlcixcbiAgICAgIGJhY2tvZmZSYXRlLFxuICAgICAgaW50ZXJ2YWwsXG4gICAgICBtYXhBdHRlbXB0cyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByb2xlSWQgPSAnc3RhdGVtYWNoaW5lUm9sZTUyMDQ0RjkzJztcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAne1wiU3RhcnRBdFwiOlwiZnJhbWV3b3JrLWlzQ29tcGxldGUtdGFza1wiLFwiU3RhdGVzXCI6e1wiZnJhbWV3b3JrLWlzQ29tcGxldGUtdGFza1wiOntcIkVuZFwiOnRydWUsXCJSZXRyeVwiOlt7XCJFcnJvckVxdWFsc1wiOltcIlN0YXRlcy5BTExcIl0sJyArXG4gICAgICAgICAgICBgXCJJbnRlcnZhbFNlY29uZHNcIjoke2ludGVydmFsLnRvU2Vjb25kcygpfSxcIk1heEF0dGVtcHRzXCI6JHttYXhBdHRlbXB0c30sXCJCYWNrb2ZmUmF0ZVwiOiR7YmFja29mZlJhdGV9fV0sYCArXG4gICAgICAgICAgICAnXCJDYXRjaFwiOlt7XCJFcnJvckVxdWFsc1wiOltcIlN0YXRlcy5BTExcIl0sXCJOZXh0XCI6XCJmcmFtZXdvcmstb25UaW1lb3V0LXRhc2tcIn1dLFwiVHlwZVwiOlwiVGFza1wiLFwiUmVzb3VyY2VcIjpcIicsXG4gICAgICAgICAgICBzdGFjay5yZXNvbHZlKGlzQ29tcGxldGVIYW5kbGVyLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgICAgICdcIn0sXCJmcmFtZXdvcmstb25UaW1lb3V0LXRhc2tcIjp7XCJFbmRcIjp0cnVlLFwiVHlwZVwiOlwiVGFza1wiLFwiUmVzb3VyY2VcIjpcIicsXG4gICAgICAgICAgICBzdGFjay5yZXNvbHZlKHRpbWVvdXRIYW5kbGVyLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgICAgICdcIn19fScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW3JvbGVJZCwgJ0FybiddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXRlcy4nLFxuICAgICAgICAgICAgICAgICAgICBzdGFjay5yZXNvbHZlKHN0YWNrLnJlZ2lvbiksXG4gICAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHN0YWNrLnJlc29sdmUoaXNDb21wbGV0ZUhhbmRsZXIucmVzb3VyY2VBcm5zRm9yR3JhbnRJbnZva2UpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBzdGFjay5yZXNvbHZlKHRpbWVvdXRIYW5kbGVyLnJlc291cmNlQXJuc0ZvckdyYW50SW52b2tlKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFt7IFJlZjogcm9sZUlkIH1dLFxuICAgIH0pO1xuICB9KTtcbn0pOyJdfQ==
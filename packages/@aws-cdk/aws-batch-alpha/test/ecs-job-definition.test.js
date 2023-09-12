"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const ecs = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const lib_1 = require("../lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
test('EcsJobDefinition respects propagateTags', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.EcsJobDefinition(stack, 'JobDefn', {
        propagateTags: true,
        container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsContainer', {
            cpu: 256,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memory: aws_cdk_lib_1.Size.mebibytes(2048),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        PropagateTags: true,
    });
});
test('EcsJobDefinition uses Compatibility.EC2 for EC2 containers', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
        container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsContainer', {
            cpu: 256,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memory: aws_cdk_lib_1.Size.mebibytes(2048),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        PlatformCapabilities: [lib_1.Compatibility.EC2],
    });
});
test('EcsJobDefinition uses Compatibility.FARGATE for Fargate containers', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new lib_1.EcsJobDefinition(stack, 'ECSJobDefn', {
        container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsContainer', {
            cpu: 256,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memory: aws_cdk_lib_1.Size.mebibytes(2048),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        PlatformCapabilities: [lib_1.Compatibility.FARGATE],
    });
});
test('can be imported from ARN', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    const importedJob = lib_1.EcsJobDefinition.fromJobDefinitionArn(stack, 'importedJobDefinition', 'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
    // THEN
    expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
});
test('JobDefinitionName is parsed from arn', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    const jobDefinition = new lib_1.EcsJobDefinition(stack, 'JobDefn', {
        propagateTags: true,
        container: new lib_1.EcsEc2ContainerDefinition(stack, 'EcsContainer', {
            cpu: 256,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memory: aws_cdk_lib_1.Size.mebibytes(2048),
        }),
    });
    // THEN
    expect(aws_cdk_lib_1.Tokenization.resolve(jobDefinition.jobDefinitionName, {
        scope: stack,
        resolver: new aws_cdk_lib_1.DefaultTokenResolver(new aws_cdk_lib_1.StringConcat()),
    })).toEqual({
        'Fn::Select': [
            1,
            {
                'Fn::Split': [
                    '/',
                    {
                        'Fn::Select': [
                            5,
                            {
                                'Fn::Split': [
                                    ':',
                                    {
                                        Ref: 'JobDefnA747EE6E',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    });
});
test('JobDefinitionName is parsed from arn in imported job', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    const importedJob = lib_1.EcsJobDefinition.fromJobDefinitionArn(stack, 'importedJobDefinition', 'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
    // THEN
    expect(importedJob.jobDefinitionName).toEqual('job-def-name');
});
test('grantSubmitJob() grants the job role the correct actions', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    const ecsJob = new lib_1.EcsJobDefinition(stack, 'ECSJob', {
        container: new lib_1.EcsFargateContainerDefinition(stack, 'EcsContainer', {
            cpu: 256,
            memory: aws_cdk_lib_1.Size.mebibytes(2048),
            image: ecs.ContainerImage.fromRegistry('foorepo/fooimage'),
        }),
    });
    const queue = new lib_1.JobQueue(stack, 'queue');
    queue.addComputeEnvironment(new lib_1.ManagedEc2EcsComputeEnvironment(stack, 'env', {
        vpc: new aws_ec2_1.Vpc(stack, 'VPC'),
    }), 1);
    const user = new iam.User(stack, 'MyUser');
    // WHEN
    ecsJob.grantSubmitJob(user, queue);
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [{
                    Action: 'batch:SubmitJob',
                    Effect: 'Allow',
                    Resource: [
                        { Ref: 'ECSJobFFFEA569' },
                        { 'Fn::GetAtt': ['queue276F7297', 'JobQueueArn'] },
                    ],
                }],
            Version: '2012-10-17',
        },
        PolicyName: 'MyUserDefaultPolicy7B897426',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWpvYi1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3Mtam9iLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MsNkNBQTRGO0FBQzVGLDJDQUEyQztBQUMzQyxnQ0FBOEo7QUFDOUosaURBQTBDO0FBRTFDLElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7SUFDbkQsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU87SUFDUCxJQUFJLHNCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckMsYUFBYSxFQUFFLElBQUk7UUFDbkIsU0FBUyxFQUFFLElBQUksK0JBQXlCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtZQUM5RCxHQUFHLEVBQUUsR0FBRztZQUNSLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztZQUNsRSxNQUFNLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1NBQzdCLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7UUFDM0UsYUFBYSxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO0lBQ3RFLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3hDLFNBQVMsRUFBRSxJQUFJLCtCQUF5QixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDOUQsR0FBRyxFQUFFLEdBQUc7WUFDUixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7WUFDbEUsTUFBTSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztTQUM3QixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzNFLG9CQUFvQixFQUFFLENBQUMsbUJBQWEsQ0FBQyxHQUFHLENBQUM7S0FDMUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO0lBQzlFLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3hDLFNBQVMsRUFBRSxJQUFJLG1DQUE2QixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDbEUsR0FBRyxFQUFFLEdBQUc7WUFDUixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7WUFDbEUsTUFBTSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztTQUM3QixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzNFLG9CQUFvQixFQUFFLENBQUMsbUJBQWEsQ0FBQyxPQUFPLENBQUM7S0FDOUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsTUFBTSxXQUFXLEdBQUcsc0JBQWdCLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUN0RixvRUFBb0UsQ0FBQyxDQUFDO0lBRXhFLE9BQU87SUFDUCxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7QUFDckgsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsTUFBTSxhQUFhLEdBQUcsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzNELGFBQWEsRUFBRSxJQUFJO1FBQ25CLFNBQVMsRUFBRSxJQUFJLCtCQUF5QixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDOUQsR0FBRyxFQUFFLEdBQUc7WUFDUixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7WUFDbEUsTUFBTSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztTQUM3QixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLE1BQU0sQ0FBQywwQkFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUU7UUFDM0QsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQUUsSUFBSSxrQ0FBb0IsQ0FBQyxJQUFJLDBCQUFZLEVBQUUsQ0FBQztLQUN2RCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDVixZQUFZLEVBQUU7WUFDWixDQUFDO1lBQ0Q7Z0JBQ0UsV0FBVyxFQUFFO29CQUNYLEdBQUc7b0JBQ0g7d0JBQ0UsWUFBWSxFQUFFOzRCQUNaLENBQUM7NEJBQ0Q7Z0NBQ0UsV0FBVyxFQUFFO29DQUNYLEdBQUc7b0NBQ0g7d0NBQ0UsR0FBRyxFQUFFLGlCQUFpQjtxQ0FDdkI7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO0lBQ2hFLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsTUFBTSxXQUFXLEdBQUcsc0JBQWdCLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUN0RixvRUFBb0UsQ0FBQyxDQUFDO0lBRXhFLE9BQU87SUFDUCxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hFLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtJQUNwRSxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ25ELFNBQVMsRUFBRSxJQUFJLG1DQUE2QixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDbEUsR0FBRyxFQUFFLEdBQUc7WUFDUixNQUFNLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztTQUMzRCxDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTNDLEtBQUssQ0FBQyxxQkFBcUIsQ0FDekIsSUFBSSxxQ0FBK0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQ2hELEdBQUcsRUFBRSxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0tBQzNCLENBQUMsRUFDRixDQUFDLENBQ0YsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFM0MsT0FBTztJQUNQLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRW5DLE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtRQUNsRSxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsQ0FBQztvQkFDVixNQUFNLEVBQUUsaUJBQWlCO29CQUN6QixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUU7d0JBQ1IsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7d0JBQ3pCLEVBQUUsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxFQUFFO3FCQUNuRDtpQkFDRixDQUFDO1lBQ0YsT0FBTyxFQUFFLFlBQVk7U0FDdEI7UUFDRCxVQUFVLEVBQUUsNkJBQTZCO0tBQzFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IERlZmF1bHRUb2tlblJlc29sdmVyLCBTaXplLCBTdHJpbmdDb25jYXQsIFN0YWNrLCBUb2tlbml6YXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb21wYXRpYmlsaXR5LCBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uLCBFY3NGYXJnYXRlQ29udGFpbmVyRGVmaW5pdGlvbiwgRWNzSm9iRGVmaW5pdGlvbiwgSm9iUXVldWUsIE1hbmFnZWRFYzJFY3NDb21wdXRlRW52aXJvbm1lbnQgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgVnBjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbnRlc3QoJ0Vjc0pvYkRlZmluaXRpb24gcmVzcGVjdHMgcHJvcGFnYXRlVGFncycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnSm9iRGVmbicsIHtcbiAgICBwcm9wYWdhdGVUYWdzOiB0cnVlLFxuICAgIGNvbnRhaW5lcjogbmV3IEVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICBjcHU6IDI1NixcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeTogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgUHJvcGFnYXRlVGFnczogdHJ1ZSxcbiAgfSk7XG59KTtcblxudGVzdCgnRWNzSm9iRGVmaW5pdGlvbiB1c2VzIENvbXBhdGliaWxpdHkuRUMyIGZvciBFQzIgY29udGFpbmVycycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBFY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUNTSm9iRGVmbicsIHtcbiAgICBjb250YWluZXI6IG5ldyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzQ29udGFpbmVyJywge1xuICAgICAgY3B1OiAyNTYsXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgIFBsYXRmb3JtQ2FwYWJpbGl0aWVzOiBbQ29tcGF0aWJpbGl0eS5FQzJdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdFY3NKb2JEZWZpbml0aW9uIHVzZXMgQ29tcGF0aWJpbGl0eS5GQVJHQVRFIGZvciBGYXJnYXRlIGNvbnRhaW5lcnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0VDU0pvYkRlZm4nLCB7XG4gICAgY29udGFpbmVyOiBuZXcgRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICBjcHU6IDI1NixcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeTogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgUGxhdGZvcm1DYXBhYmlsaXRpZXM6IFtDb21wYXRpYmlsaXR5LkZBUkdBVEVdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYW4gYmUgaW1wb3J0ZWQgZnJvbSBBUk4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBpbXBvcnRlZEpvYiA9IEVjc0pvYkRlZmluaXRpb24uZnJvbUpvYkRlZmluaXRpb25Bcm4oc3RhY2ssICdpbXBvcnRlZEpvYkRlZmluaXRpb24nLFxuICAgICdhcm46YXdzOmJhdGNoOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6am9iLWRlZmluaXRpb24vam9iLWRlZi1uYW1lOjEnKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChpbXBvcnRlZEpvYi5qb2JEZWZpbml0aW9uQXJuKS50b0VxdWFsKCdhcm46YXdzOmJhdGNoOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6am9iLWRlZmluaXRpb24vam9iLWRlZi1uYW1lOjEnKTtcbn0pO1xuXG50ZXN0KCdKb2JEZWZpbml0aW9uTmFtZSBpcyBwYXJzZWQgZnJvbSBhcm4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBqb2JEZWZpbml0aW9uID0gbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdKb2JEZWZuJywge1xuICAgIHByb3BhZ2F0ZVRhZ3M6IHRydWUsXG4gICAgY29udGFpbmVyOiBuZXcgRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0NvbnRhaW5lcicsIHtcbiAgICAgIGNwdTogMjU2LFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoVG9rZW5pemF0aW9uLnJlc29sdmUoam9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uTmFtZSwge1xuICAgIHNjb3BlOiBzdGFjayxcbiAgICByZXNvbHZlcjogbmV3IERlZmF1bHRUb2tlblJlc29sdmVyKG5ldyBTdHJpbmdDb25jYXQoKSksXG4gIH0pKS50b0VxdWFsKHtcbiAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgIDEsXG4gICAgICB7XG4gICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgJy8nLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICA1LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnSm9iRGVmbkE3NDdFRTZFJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnSm9iRGVmaW5pdGlvbk5hbWUgaXMgcGFyc2VkIGZyb20gYXJuIGluIGltcG9ydGVkIGpvYicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGltcG9ydGVkSm9iID0gRWNzSm9iRGVmaW5pdGlvbi5mcm9tSm9iRGVmaW5pdGlvbkFybihzdGFjaywgJ2ltcG9ydGVkSm9iRGVmaW5pdGlvbicsXG4gICAgJ2Fybjphd3M6YmF0Y2g6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpqb2ItZGVmaW5pdGlvbi9qb2ItZGVmLW5hbWU6MScpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KGltcG9ydGVkSm9iLmpvYkRlZmluaXRpb25OYW1lKS50b0VxdWFsKCdqb2ItZGVmLW5hbWUnKTtcbn0pO1xuXG50ZXN0KCdncmFudFN1Ym1pdEpvYigpIGdyYW50cyB0aGUgam9iIHJvbGUgdGhlIGNvcnJlY3QgYWN0aW9ucycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgZWNzSm9iID0gbmV3IEVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdFQ1NKb2InLCB7XG4gICAgY29udGFpbmVyOiBuZXcgRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICBjcHU6IDI1NixcbiAgICAgIG1lbW9yeTogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnZm9vcmVwby9mb29pbWFnZScpLFxuICAgIH0pLFxuICB9KTtcbiAgY29uc3QgcXVldWUgPSBuZXcgSm9iUXVldWUoc3RhY2ssICdxdWV1ZScpO1xuXG4gIHF1ZXVlLmFkZENvbXB1dGVFbnZpcm9ubWVudChcbiAgICBuZXcgTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ2VudicsIHtcbiAgICAgIHZwYzogbmV3IFZwYyhzdGFjaywgJ1ZQQycpLFxuICAgIH0pLFxuICAgIDEsXG4gICk7XG5cbiAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuXG4gIC8vIFdIRU5cbiAgZWNzSm9iLmdyYW50U3VibWl0Sm9iKHVzZXIsIHF1ZXVlKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgIEFjdGlvbjogJ2JhdGNoOlN1Ym1pdEpvYicsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICB7IFJlZjogJ0VDU0pvYkZGRkVBNTY5JyB9LFxuICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ3F1ZXVlMjc2RjcyOTcnLCAnSm9iUXVldWVBcm4nXSB9LFxuICAgICAgICBdLFxuICAgICAgfV0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBQb2xpY3lOYW1lOiAnTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2JyxcbiAgfSk7XG59KTtcbiJdfQ==
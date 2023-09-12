"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const utils_1 = require("./utils");
const batch = require("../lib");
const defaultExpectedEcsProps = {
    type: 'container',
    platformCapabilities: [batch.Compatibility.EC2],
};
const defaultExpectedEksProps = {
    type: 'container',
};
const defaultExpectedMultiNodeProps = {
    type: 'multinode',
};
let stack;
let pascalCaseExpectedEcsProps;
let pascalCaseExpectedEksProps;
let pascalCaseExpectedMultiNodeProps;
let defaultEcsProps;
let defaultEksProps;
let defaultMultiNodeProps;
let expectedProps;
let defaultProps;
describe.each([batch.EcsJobDefinition, batch.EksJobDefinition, batch.MultiNodeJobDefinition])('%p type JobDefinition', (JobDefinition) => {
    // GIVEN
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        pascalCaseExpectedEcsProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEcsProps);
        pascalCaseExpectedEksProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedEksProps);
        pascalCaseExpectedMultiNodeProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedMultiNodeProps);
        defaultEcsProps = {
            container: new batch.EcsEc2ContainerDefinition(stack, 'EcsContainer', {
                cpu: 256,
                memory: aws_cdk_lib_1.Size.mebibytes(2048),
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            }),
        };
        defaultEksProps = {
            container: new batch.EksContainerDefinition(stack, 'EksContainer', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            }),
        };
        defaultMultiNodeProps = {
            containers: [{
                    container: new batch.EcsEc2ContainerDefinition(stack, 'MultinodeEcsContainer', {
                        cpu: 256,
                        memory: aws_cdk_lib_1.Size.mebibytes(2048),
                        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                    }),
                    startNode: 0,
                    endNode: 10,
                }],
            mainNode: 0,
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.R4, aws_ec2_1.InstanceSize.LARGE),
        };
        switch (JobDefinition) {
            case batch.EcsJobDefinition:
                expectedProps = pascalCaseExpectedEcsProps;
                defaultProps = defaultEcsProps;
                break;
            case batch.EksJobDefinition:
                expectedProps = pascalCaseExpectedEksProps;
                defaultProps = defaultEksProps;
                break;
            case batch.MultiNodeJobDefinition:
                expectedProps = pascalCaseExpectedMultiNodeProps;
                defaultProps = defaultMultiNodeProps;
                break;
        }
    });
    test('JobDefinition respects name', () => {
        // WHEN
        new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
            jobDefinitionName: 'myEcsJob',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            JobDefinitionName: 'myEcsJob',
        });
    });
    test('JobDefinition respects parameters', () => {
        // WHEN
        new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
            parameters: {
                foo: 'bar',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            Parameters: {
                foo: 'bar',
            },
        });
    });
    test('JobDefinition respects retryAttempts', () => {
        // WHEN
        new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
            retryAttempts: 8,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            RetryStrategy: {
                Attempts: 8,
            },
        });
    });
    test('JobDefinition respects retryStrategies', () => {
        // WHEN
        new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
            retryStrategies: [
                batch.RetryStrategy.of(batch.Action.EXIT, batch.Reason.CANNOT_PULL_CONTAINER),
                batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.NON_ZERO_EXIT_CODE),
                batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.SPOT_INSTANCE_RECLAIMED),
                batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.custom({
                    onExitCode: '40*',
                    onReason: 'reason*',
                    onStatusReason: 'statusReason',
                })),
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            RetryStrategy: {
                EvaluateOnExit: [
                    {
                        Action: 'EXIT',
                        OnReason: 'CannotPullContainerError:*',
                    },
                    {
                        Action: 'RETRY',
                        OnExitCode: '*',
                    },
                    {
                        Action: 'RETRY',
                        OnStatusReason: 'Host EC2*',
                    },
                    {
                        Action: 'RETRY',
                        OnExitCode: '40*',
                        OnReason: 'reason*',
                        OnStatusReason: 'statusReason',
                    },
                ],
            },
        });
    });
    test('JobDefinition respects schedulingPriority', () => {
        // WHEN
        new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
            schedulingPriority: 10,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            SchedulingPriority: 10,
        });
    });
    test('JobDefinition respects schedulingPriority', () => {
        // WHEN
        new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
            timeout: aws_cdk_lib_1.Duration.minutes(10),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            Timeout: {
                AttemptDurationSeconds: 600,
            },
        });
    });
    test('JobDefinition respects addRetryStrategy()', () => {
        // WHEN
        const jobDefn = new JobDefinition(stack, 'JobDefn', {
            ...defaultProps,
        });
        jobDefn.addRetryStrategy(batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.SPOT_INSTANCE_RECLAIMED));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...expectedProps,
            RetryStrategy: {
                EvaluateOnExit: [
                    {
                        Action: 'RETRY',
                        OnStatusReason: 'Host EC2*',
                    },
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLWRlZmluaXRpb24tYmFzZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiam9iLWRlZmluaXRpb24tYmFzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQWtEO0FBQ2xELGlEQUFnRjtBQUNoRiwyQ0FBMkM7QUFDM0MsNkNBQTZEO0FBQzdELG1DQUFrRDtBQUNsRCxnQ0FBZ0M7QUFHaEMsTUFBTSx1QkFBdUIsR0FBMEI7SUFDckQsSUFBSSxFQUFFLFdBQVc7SUFDakIsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztDQUNoRCxDQUFDO0FBQ0YsTUFBTSx1QkFBdUIsR0FBMEI7SUFDckQsSUFBSSxFQUFFLFdBQVc7Q0FDbEIsQ0FBQztBQUNGLE1BQU0sNkJBQTZCLEdBQTBCO0lBQzNELElBQUksRUFBRSxXQUFXO0NBQ2xCLENBQUM7QUFFRixJQUFJLEtBQVksQ0FBQztBQUVqQixJQUFJLDBCQUErQixDQUFDO0FBQ3BDLElBQUksMEJBQStCLENBQUM7QUFDcEMsSUFBSSxnQ0FBcUMsQ0FBQztBQUUxQyxJQUFJLGVBQTRDLENBQUM7QUFDakQsSUFBSSxlQUE0QyxDQUFDO0FBQ2pELElBQUkscUJBQXdELENBQUM7QUFFN0QsSUFBSSxhQUFrQixDQUFDO0FBQ3ZCLElBQUksWUFBaUIsQ0FBQztBQUV0QixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLENBQUMsYUFBYSxFQUFFLEVBQUU7SUFDdkksUUFBUTtJQUNSLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxtQkFBSyxFQUFFLENBQUM7UUFFcEIsMEJBQTBCLEdBQUcsSUFBQSwrQkFBdUIsRUFBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsQ0FB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QVMsRUFBRTtZQUNsQyxHQUFHLFlBQVk7WUFDZixPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQzlCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsRUFBRTtZQUMzRSxHQUFHLGFBQWE7WUFDaEIsT0FBTyxFQUFFO2dCQUNQLHNCQUFzQixFQUFFLEdBQUc7YUFDNUI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbEQsR0FBRyxZQUFZO1NBQ2hCLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUUzRyxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7WUFDM0UsR0FBRyxhQUFhO1lBQ2hCLGFBQWEsRUFBRTtnQkFDYixjQUFjLEVBQUU7b0JBQ2Q7d0JBQ0UsTUFBTSxFQUFFLE9BQU87d0JBQ2YsY0FBYyxFQUFFLFdBQVc7cUJBQzVCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCB7IEluc3RhbmNlQ2xhc3MsIEluc3RhbmNlU2l6ZSwgSW5zdGFuY2VUeXBlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgeyAvKkF3cywqLyBEdXJhdGlvbiwgU2l6ZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgYmF0Y2ggZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IENmbkpvYkRlZmluaXRpb25Qcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5cbmNvbnN0IGRlZmF1bHRFeHBlY3RlZEVjc1Byb3BzOiBDZm5Kb2JEZWZpbml0aW9uUHJvcHMgPSB7XG4gIHR5cGU6ICdjb250YWluZXInLFxuICBwbGF0Zm9ybUNhcGFiaWxpdGllczogW2JhdGNoLkNvbXBhdGliaWxpdHkuRUMyXSxcbn07XG5jb25zdCBkZWZhdWx0RXhwZWN0ZWRFa3NQcm9wczogQ2ZuSm9iRGVmaW5pdGlvblByb3BzID0ge1xuICB0eXBlOiAnY29udGFpbmVyJyxcbn07XG5jb25zdCBkZWZhdWx0RXhwZWN0ZWRNdWx0aU5vZGVQcm9wczogQ2ZuSm9iRGVmaW5pdGlvblByb3BzID0ge1xuICB0eXBlOiAnbXVsdGlub2RlJyxcbn07XG5cbmxldCBzdGFjazogU3RhY2s7XG5cbmxldCBwYXNjYWxDYXNlRXhwZWN0ZWRFY3NQcm9wczogYW55O1xubGV0IHBhc2NhbENhc2VFeHBlY3RlZEVrc1Byb3BzOiBhbnk7XG5sZXQgcGFzY2FsQ2FzZUV4cGVjdGVkTXVsdGlOb2RlUHJvcHM6IGFueTtcblxubGV0IGRlZmF1bHRFY3NQcm9wczogYmF0Y2guRWNzSm9iRGVmaW5pdGlvblByb3BzO1xubGV0IGRlZmF1bHRFa3NQcm9wczogYmF0Y2guRWtzSm9iRGVmaW5pdGlvblByb3BzO1xubGV0IGRlZmF1bHRNdWx0aU5vZGVQcm9wczogYmF0Y2guTXVsdGlOb2RlSm9iRGVmaW5pdGlvblByb3BzO1xuXG5sZXQgZXhwZWN0ZWRQcm9wczogYW55O1xubGV0IGRlZmF1bHRQcm9wczogYW55O1xuXG5kZXNjcmliZS5lYWNoKFtiYXRjaC5FY3NKb2JEZWZpbml0aW9uLCBiYXRjaC5Fa3NKb2JEZWZpbml0aW9uLCBiYXRjaC5NdWx0aU5vZGVKb2JEZWZpbml0aW9uXSkoJyVwIHR5cGUgSm9iRGVmaW5pdGlvbicsIChKb2JEZWZpbml0aW9uKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBwYXNjYWxDYXNlRXhwZWN0ZWRFY3NQcm9wcyA9IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKHN0YWNrLCBkZWZhdWx0RXhwZWN0ZWRFY3NQcm9wcyk7XG4gICAgcGFzY2FsQ2FzZUV4cGVjdGVkRWtzUHJvcHMgPSBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyhzdGFjaywgZGVmYXVsdEV4cGVjdGVkRWtzUHJvcHMpO1xuICAgIHBhc2NhbENhc2VFeHBlY3RlZE11bHRpTm9kZVByb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIGRlZmF1bHRFeHBlY3RlZE11bHRpTm9kZVByb3BzKTtcblxuICAgIGRlZmF1bHRFY3NQcm9wcyA9IHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IGJhdGNoLkVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NDb250YWluZXInLCB7XG4gICAgICAgIGNwdTogMjU2LFxuICAgICAgICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9KSxcbiAgICB9O1xuICAgIGRlZmF1bHRFa3NQcm9wcyA9IHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IGJhdGNoLkVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFa3NDb250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0pLFxuICAgIH07XG4gICAgZGVmYXVsdE11bHRpTm9kZVByb3BzID0ge1xuICAgICAgY29udGFpbmVyczogW3tcbiAgICAgICAgY29udGFpbmVyOiBuZXcgYmF0Y2guRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ011bHRpbm9kZUVjc0NvbnRhaW5lcicsIHtcbiAgICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgICBtZW1vcnk6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0YXJ0Tm9kZTogMCxcbiAgICAgICAgZW5kTm9kZTogMTAsXG4gICAgICB9XSxcbiAgICAgIG1haW5Ob2RlOiAwLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5SNCwgSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICB9O1xuICAgIHN3aXRjaCAoSm9iRGVmaW5pdGlvbikge1xuICAgICAgY2FzZSBiYXRjaC5FY3NKb2JEZWZpbml0aW9uOlxuICAgICAgICBleHBlY3RlZFByb3BzID0gcGFzY2FsQ2FzZUV4cGVjdGVkRWNzUHJvcHM7XG4gICAgICAgIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRFY3NQcm9wcztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGJhdGNoLkVrc0pvYkRlZmluaXRpb246XG4gICAgICAgIGV4cGVjdGVkUHJvcHMgPSBwYXNjYWxDYXNlRXhwZWN0ZWRFa3NQcm9wcztcbiAgICAgICAgZGVmYXVsdFByb3BzID0gZGVmYXVsdEVrc1Byb3BzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYmF0Y2guTXVsdGlOb2RlSm9iRGVmaW5pdGlvbjpcbiAgICAgICAgZXhwZWN0ZWRQcm9wcyA9IHBhc2NhbENhc2VFeHBlY3RlZE11bHRpTm9kZVByb3BzO1xuICAgICAgICBkZWZhdWx0UHJvcHMgPSBkZWZhdWx0TXVsdGlOb2RlUHJvcHM7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnSm9iRGVmaW5pdGlvbiByZXNwZWN0cyBuYW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgSm9iRGVmaW5pdGlvbihzdGFjaywgJ0pvYkRlZm4nLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICBqb2JEZWZpbml0aW9uTmFtZTogJ215RWNzSm9iJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBKb2JEZWZpbml0aW9uTmFtZTogJ215RWNzSm9iJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSm9iRGVmaW5pdGlvbiByZXNwZWN0cyBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgSm9iRGVmaW5pdGlvbihzdGFjaywgJ0pvYkRlZm4nLCB7XG4gICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgZm9vOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0pvYkRlZmluaXRpb24gcmVzcGVjdHMgcmV0cnlBdHRlbXB0cycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEpvYkRlZmluaXRpb24oc3RhY2ssICdKb2JEZWZuJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgcmV0cnlBdHRlbXB0czogOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBSZXRyeVN0cmF0ZWd5OiB7XG4gICAgICAgIEF0dGVtcHRzOiA4LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSm9iRGVmaW5pdGlvbiByZXNwZWN0cyByZXRyeVN0cmF0ZWdpZXMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBKb2JEZWZpbml0aW9uKHN0YWNrLCAnSm9iRGVmbicsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgIHJldHJ5U3RyYXRlZ2llczogW1xuICAgICAgICBiYXRjaC5SZXRyeVN0cmF0ZWd5Lm9mKGJhdGNoLkFjdGlvbi5FWElULCBiYXRjaC5SZWFzb24uQ0FOTk9UX1BVTExfQ09OVEFJTkVSKSxcbiAgICAgICAgYmF0Y2guUmV0cnlTdHJhdGVneS5vZihiYXRjaC5BY3Rpb24uUkVUUlksIGJhdGNoLlJlYXNvbi5OT05fWkVST19FWElUX0NPREUpLFxuICAgICAgICBiYXRjaC5SZXRyeVN0cmF0ZWd5Lm9mKGJhdGNoLkFjdGlvbi5SRVRSWSwgYmF0Y2guUmVhc29uLlNQT1RfSU5TVEFOQ0VfUkVDTEFJTUVEKSxcbiAgICAgICAgYmF0Y2guUmV0cnlTdHJhdGVneS5vZihiYXRjaC5BY3Rpb24uUkVUUlksIGJhdGNoLlJlYXNvbi5jdXN0b20oe1xuICAgICAgICAgIG9uRXhpdENvZGU6ICc0MConLFxuICAgICAgICAgIG9uUmVhc29uOiAncmVhc29uKicsXG4gICAgICAgICAgb25TdGF0dXNSZWFzb246ICdzdGF0dXNSZWFzb24nLFxuICAgICAgICB9KSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4uZXhwZWN0ZWRQcm9wcyxcbiAgICAgIFJldHJ5U3RyYXRlZ3k6IHtcbiAgICAgICAgRXZhbHVhdGVPbkV4aXQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdFWElUJyxcbiAgICAgICAgICAgIE9uUmVhc29uOiAnQ2Fubm90UHVsbENvbnRhaW5lckVycm9yOionLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnUkVUUlknLFxuICAgICAgICAgICAgT25FeGl0Q29kZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnUkVUUlknLFxuICAgICAgICAgICAgT25TdGF0dXNSZWFzb246ICdIb3N0IEVDMionLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnUkVUUlknLFxuICAgICAgICAgICAgT25FeGl0Q29kZTogJzQwKicsXG4gICAgICAgICAgICBPblJlYXNvbjogJ3JlYXNvbionLFxuICAgICAgICAgICAgT25TdGF0dXNSZWFzb246ICdzdGF0dXNSZWFzb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdKb2JEZWZpbml0aW9uIHJlc3BlY3RzIHNjaGVkdWxpbmdQcmlvcml0eScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEpvYkRlZmluaXRpb24oc3RhY2ssICdKb2JEZWZuJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgc2NoZWR1bGluZ1ByaW9yaXR5OiAxMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLmV4cGVjdGVkUHJvcHMsXG4gICAgICBTY2hlZHVsaW5nUHJpb3JpdHk6IDEwLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdKb2JEZWZpbml0aW9uIHJlc3BlY3RzIHNjaGVkdWxpbmdQcmlvcml0eScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEpvYkRlZmluaXRpb24oc3RhY2ssICdKb2JEZWZuJywge1xuICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxMCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgVGltZW91dDoge1xuICAgICAgICBBdHRlbXB0RHVyYXRpb25TZWNvbmRzOiA2MDAsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdKb2JEZWZpbml0aW9uIHJlc3BlY3RzIGFkZFJldHJ5U3RyYXRlZ3koKScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgam9iRGVmbiA9IG5ldyBKb2JEZWZpbml0aW9uKHN0YWNrLCAnSm9iRGVmbicsIHtcbiAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICB9KTtcblxuICAgIGpvYkRlZm4uYWRkUmV0cnlTdHJhdGVneShiYXRjaC5SZXRyeVN0cmF0ZWd5Lm9mKGJhdGNoLkFjdGlvbi5SRVRSWSwgYmF0Y2guUmVhc29uLlNQT1RfSU5TVEFOQ0VfUkVDTEFJTUVEKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5leHBlY3RlZFByb3BzLFxuICAgICAgUmV0cnlTdHJhdGVneToge1xuICAgICAgICBFdmFsdWF0ZU9uRXhpdDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ1JFVFJZJyxcbiAgICAgICAgICAgIE9uU3RhdHVzUmVhc29uOiAnSG9zdCBFQzIqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
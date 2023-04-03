"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const logs = require("@aws-cdk/aws-logs");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('aws log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
    });
    test('create an aws log driver', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.AwsLogDriver({
                datetimeFormat: 'format',
                logRetention: logs.RetentionDays.ONE_MONTH,
                multilinePattern: 'pattern',
                streamPrefix: 'hello',
                mode: ecs.AwsLogDriverMode.NON_BLOCKING,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: logs.RetentionDays.ONE_MONTH,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': { Ref: 'TaskDefinitionContainerLogGroup4D0A87C1' },
                            'awslogs-stream-prefix': 'hello',
                            'awslogs-region': { Ref: 'AWS::Region' },
                            'awslogs-datetime-format': 'format',
                            'awslogs-multiline-pattern': 'pattern',
                            'mode': 'non-blocking',
                        },
                    },
                }),
            ],
        });
    });
    test('create an aws log driver using awsLogs', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.AwsLogDriver.awsLogs({
                datetimeFormat: 'format',
                logRetention: logs.RetentionDays.ONE_MONTH,
                multilinePattern: 'pattern',
                streamPrefix: 'hello',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: logs.RetentionDays.ONE_MONTH,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': { Ref: 'TaskDefinitionContainerLogGroup4D0A87C1' },
                            'awslogs-stream-prefix': 'hello',
                            'awslogs-region': { Ref: 'AWS::Region' },
                            'awslogs-datetime-format': 'format',
                            'awslogs-multiline-pattern': 'pattern',
                        },
                    },
                }),
            ],
        });
    });
    test('with a defined log group', () => {
        // GIVEN
        const logGroup = new logs.LogGroup(stack, 'LogGroup');
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.AwsLogDriver({
                logGroup,
                streamPrefix: 'hello',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: logs.RetentionDays.TWO_YEARS,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': { Ref: 'LogGroupF5B46931' },
                            'awslogs-stream-prefix': 'hello',
                            'awslogs-region': { Ref: 'AWS::Region' },
                        },
                    },
                }),
            ],
        });
    });
    test('without a defined log group: creates one anyway', () => {
        // GIVEN
        td.addContainer('Container', {
            image,
            logging: new ecs.AwsLogDriver({
                streamPrefix: 'hello',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {});
    });
    test('throws when specifying log retention and log group', () => {
        // GIVEN
        const logGroup = new logs.LogGroup(stack, 'LogGroup');
        // THEN
        expect(() => new ecs.AwsLogDriver({
            logGroup,
            logRetention: logs.RetentionDays.FIVE_DAYS,
            streamPrefix: 'hello',
        })).toThrow(/`logGroup`.*`logRetentionDays`/);
    });
    test('allows cross-region log group', () => {
        // GIVEN
        const logGroupRegion = 'asghard';
        const logGroup = logs.LogGroup.fromLogGroupArn(stack, 'LogGroup', `arn:aws:logs:${logGroupRegion}:1234:log-group:my_log_group`);
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.AwsLogDriver({
                logGroup,
                streamPrefix: 'hello',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': logGroup.logGroupName,
                            'awslogs-stream-prefix': 'hello',
                            'awslogs-region': logGroupRegion,
                        },
                    },
                }),
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWxvZy1kcml2ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1sb2ctZHJpdmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsMENBQTBDO0FBQzFDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLElBQUksRUFBc0IsQ0FBQztBQUMzQixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU1RCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEIsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxPQUFPO1FBQ1AsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDM0IsS0FBSztZQUNMLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUM7Z0JBQzVCLGNBQWMsRUFBRSxRQUFRO2dCQUN4QixZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTO2dCQUMxQyxnQkFBZ0IsRUFBRSxTQUFTO2dCQUMzQixZQUFZLEVBQUUsT0FBTztnQkFDckIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZO2FBQ3hDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsZUFBZSxFQUFFLElBQUksQ0FBQyxh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USxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQzlELGdCQUFnQixjQUFjLDhCQUE4QixDQUFDLENBQUM7UUFFaEUsT0FBTztRQUNQLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO1lBQzNCLEtBQUs7WUFDTCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO2dCQUM1QixRQUFRO2dCQUNSLFlBQVksRUFBRSxPQUFPO2FBQ3RCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLG9CQUFvQixFQUFFO2dCQUNwQixrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixnQkFBZ0IsRUFBRTt3QkFDaEIsU0FBUyxFQUFFLFNBQVM7d0JBQ3BCLE9BQU8sRUFBRTs0QkFDUCxlQUFlLEVBQUUsUUFBUSxDQUFDLFlBQVk7NEJBQ3RDLHVCQUF1QixFQUFFLE9BQU87NEJBQ2hDLGdCQUFnQixFQUFFLGNBQWM7eUJBQ2pDO3FCQUNGO2lCQUNGLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uL2xpYic7XG5cbmxldCBzdGFjazogY2RrLlN0YWNrO1xubGV0IHRkOiBlY3MuVGFza0RlZmluaXRpb247XG5jb25zdCBpbWFnZSA9IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QtaW1hZ2UnKTtcblxuZGVzY3JpYmUoJ2F3cyBsb2cgZHJpdmVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICB0ZCA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZmluaXRpb24nKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhbiBhd3MgbG9nIGRyaXZlcicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHtcbiAgICAgICAgZGF0ZXRpbWVGb3JtYXQ6ICdmb3JtYXQnLFxuICAgICAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEgsXG4gICAgICAgIG11bHRpbGluZVBhdHRlcm46ICdwYXR0ZXJuJyxcbiAgICAgICAgc3RyZWFtUHJlZml4OiAnaGVsbG8nLFxuICAgICAgICBtb2RlOiBlY3MuQXdzTG9nRHJpdmVyTW9kZS5OT05fQkxPQ0tJTkcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIHtcbiAgICAgIFJldGVudGlvbkluRGF5czogbG9ncy5SZXRlbnRpb25EYXlzLk9ORV9NT05USCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7IFJlZjogJ1Rhc2tEZWZpbml0aW9uQ29udGFpbmVyTG9nR3JvdXA0RDBBODdDMScgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdoZWxsbycsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICdhd3Nsb2dzLWRhdGV0aW1lLWZvcm1hdCc6ICdmb3JtYXQnLFxuICAgICAgICAgICAgICAnYXdzbG9ncy1tdWx0aWxpbmUtcGF0dGVybic6ICdwYXR0ZXJuJyxcbiAgICAgICAgICAgICAgJ21vZGUnOiAnbm9uLWJsb2NraW5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYW4gYXdzIGxvZyBkcml2ZXIgdXNpbmcgYXdzTG9ncycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Bd3NMb2dEcml2ZXIuYXdzTG9ncyh7XG4gICAgICAgIGRhdGV0aW1lRm9ybWF0OiAnZm9ybWF0JyxcbiAgICAgICAgbG9nUmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgICAgICBtdWx0aWxpbmVQYXR0ZXJuOiAncGF0dGVybicsXG4gICAgICAgIHN0cmVhbVByZWZpeDogJ2hlbGxvJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OkxvZ0dyb3VwJywge1xuICAgICAgUmV0ZW50aW9uSW5EYXlzOiBsb2dzLlJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHsgUmVmOiAnVGFza0RlZmluaXRpb25Db250YWluZXJMb2dHcm91cDREMEE4N0MxJyB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ2hlbGxvJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZGF0ZXRpbWUtZm9ybWF0JzogJ2Zvcm1hdCcsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLW11bHRpbGluZS1wYXR0ZXJuJzogJ3BhdHRlcm4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYSBkZWZpbmVkIGxvZyBncm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7XG4gICAgICAgIGxvZ0dyb3VwLFxuICAgICAgICBzdHJlYW1QcmVmaXg6ICdoZWxsbycsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIHtcbiAgICAgIFJldGVudGlvbkluRGF5czogbG9ncy5SZXRlbnRpb25EYXlzLlRXT19ZRUFSUyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7IFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnIH0sXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnaGVsbG8nLFxuICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGhvdXQgYSBkZWZpbmVkIGxvZyBncm91cDogY3JlYXRlcyBvbmUgYW55d2F5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHtcbiAgICAgICAgc3RyZWFtUHJlZml4OiAnaGVsbG8nLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCB7fSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIHNwZWNpZnlpbmcgbG9nIHJldGVudGlvbiBhbmQgbG9nIGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgbG9nUmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuRklWRV9EQVlTLFxuICAgICAgc3RyZWFtUHJlZml4OiAnaGVsbG8nLFxuICAgIH0pKS50b1Rocm93KC9gbG9nR3JvdXBgLipgbG9nUmV0ZW50aW9uRGF5c2AvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93cyBjcm9zcy1yZWdpb24gbG9nIGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbG9nR3JvdXBSZWdpb24gPSAnYXNnaGFyZCc7XG4gICAgY29uc3QgbG9nR3JvdXAgPSBsb2dzLkxvZ0dyb3VwLmZyb21Mb2dHcm91cEFybihzdGFjaywgJ0xvZ0dyb3VwJyxcbiAgICAgIGBhcm46YXdzOmxvZ3M6JHtsb2dHcm91cFJlZ2lvbn06MTIzNDpsb2ctZ3JvdXA6bXlfbG9nX2dyb3VwYCk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuQXdzTG9nRHJpdmVyKHtcbiAgICAgICAgbG9nR3JvdXAsXG4gICAgICAgIHN0cmVhbVByZWZpeDogJ2hlbGxvJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxvZ3M6OkxvZ0dyb3VwJywgMCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IGxvZ0dyb3VwLmxvZ0dyb3VwTmFtZSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdoZWxsbycsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IGxvZ0dyb3VwUmVnaW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
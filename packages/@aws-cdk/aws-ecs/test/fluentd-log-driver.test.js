"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('fluentd log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
    });
    test('create a fluentd log driver with options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.FluentdLogDriver({
                tag: 'hello',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'fluentd',
                        Options: {
                            tag: 'hello',
                        },
                    },
                }),
            ],
        });
    });
    test('create a fluentd log driver without options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.FluentdLogDriver(),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'fluentd',
                    },
                }),
            ],
        });
    });
    test('create a fluentd log driver with all possible options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.FluentdLogDriver({
                address: 'localhost:24224',
                asyncConnect: true,
                bufferLimit: 128,
                retryWait: cdk.Duration.seconds(1),
                maxRetries: 4294967295,
                subSecondPrecision: false,
                tag: 'my-tag',
                labels: [
                    'one',
                    'two',
                    'three',
                ],
                env: [
                    'one',
                    'two',
                    'three',
                ],
                envRegex: '[0-9]{1}',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'fluentd',
                        Options: {
                            'fluentd-address': 'localhost:24224',
                            'fluentd-async-connect': 'true',
                            'fluentd-buffer-limit': '128',
                            'fluentd-retry-wait': '1',
                            'fluentd-max-retries': '4294967295',
                            'fluentd-sub-second-precision': 'false',
                            'tag': 'my-tag',
                            'labels': 'one,two,three',
                            'env': 'one,two,three',
                            'env-regex': '[0-9]{1}',
                        },
                    },
                }),
            ],
        });
    });
    test('create a fluentd log driver using fluentd', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.fluentd(),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'fluentd',
                    },
                }),
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx1ZW50ZC1sb2ctZHJpdmVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmbHVlbnRkLWxvZy1kcml2ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLEVBQXNCLENBQUM7QUFDM0IsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFNUQsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsT0FBTztRQUNQLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO1lBQzNCLEtBQUs7WUFDTCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2hDLEdBQUcsRUFBRSxPQUFPO2FBQ2IsQ0FBQztZQUNGLGNBQWMsRUFBRSxHQUFHO1NBQ3BCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMxRSxvQkFBb0IsRUFBRTtnQkFDcEIsa0JBQUssQ0FBQyxVQUFVLENBQUM7b0JBQ2YsZ0JBQWdCLEVBQUU7d0JBQ2hCLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixPQUFPLEVBQUU7NEJBQ1AsR0FBRyxFQUFFLE9BQU87eUJBQ2I7cUJBQ0Y7aUJBQ0Ys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QUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICcuLi9saWInO1xuXG5sZXQgc3RhY2s6IGNkay5TdGFjaztcbmxldCB0ZDogZWNzLlRhc2tEZWZpbml0aW9uO1xuY29uc3QgaW1hZ2UgPSBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0LWltYWdlJyk7XG5cbmRlc2NyaWJlKCdmbHVlbnRkIGxvZyBkcml2ZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIHRkID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWZpbml0aW9uJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIGZsdWVudGQgbG9nIGRyaXZlciB3aXRoIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBuZXcgZWNzLkZsdWVudGRMb2dEcml2ZXIoe1xuICAgICAgICB0YWc6ICdoZWxsbycsXG4gICAgICB9KSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2ZsdWVudGQnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICB0YWc6ICdoZWxsbycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgZmx1ZW50ZCBsb2cgZHJpdmVyIHdpdGhvdXQgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuRmx1ZW50ZExvZ0RyaXZlcigpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnZmx1ZW50ZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBmbHVlbnRkIGxvZyBkcml2ZXIgd2l0aCBhbGwgcG9zc2libGUgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuRmx1ZW50ZExvZ0RyaXZlcih7XG4gICAgICAgIGFkZHJlc3M6ICdsb2NhbGhvc3Q6MjQyMjQnLFxuICAgICAgICBhc3luY0Nvbm5lY3Q6IHRydWUsXG4gICAgICAgIGJ1ZmZlckxpbWl0OiAxMjgsXG4gICAgICAgIHJldHJ5V2FpdDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMSksXG4gICAgICAgIG1heFJldHJpZXM6IDQyOTQ5NjcyOTUsXG4gICAgICAgIHN1YlNlY29uZFByZWNpc2lvbjogZmFsc2UsXG4gICAgICAgIHRhZzogJ215LXRhZycsXG4gICAgICAgIGxhYmVsczogW1xuICAgICAgICAgICdvbmUnLFxuICAgICAgICAgICd0d28nLFxuICAgICAgICAgICd0aHJlZScsXG4gICAgICAgIF0sXG4gICAgICAgIGVudjogW1xuICAgICAgICAgICdvbmUnLFxuICAgICAgICAgICd0d28nLFxuICAgICAgICAgICd0aHJlZScsXG4gICAgICAgIF0sXG4gICAgICAgIGVudlJlZ2V4OiAnWzAtOV17MX0nLFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdmbHVlbnRkJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2ZsdWVudGQtYWRkcmVzcyc6ICdsb2NhbGhvc3Q6MjQyMjQnLFxuICAgICAgICAgICAgICAnZmx1ZW50ZC1hc3luYy1jb25uZWN0JzogJ3RydWUnLFxuICAgICAgICAgICAgICAnZmx1ZW50ZC1idWZmZXItbGltaXQnOiAnMTI4JyxcbiAgICAgICAgICAgICAgJ2ZsdWVudGQtcmV0cnktd2FpdCc6ICcxJyxcbiAgICAgICAgICAgICAgJ2ZsdWVudGQtbWF4LXJldHJpZXMnOiAnNDI5NDk2NzI5NScsXG4gICAgICAgICAgICAgICdmbHVlbnRkLXN1Yi1zZWNvbmQtcHJlY2lzaW9uJzogJ2ZhbHNlJyxcbiAgICAgICAgICAgICAgJ3RhZyc6ICdteS10YWcnLFxuICAgICAgICAgICAgICAnbGFiZWxzJzogJ29uZSx0d28sdGhyZWUnLFxuICAgICAgICAgICAgICAnZW52JzogJ29uZSx0d28sdGhyZWUnLFxuICAgICAgICAgICAgICAnZW52LXJlZ2V4JzogJ1swLTldezF9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBmbHVlbnRkIGxvZyBkcml2ZXIgdXNpbmcgZmx1ZW50ZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLmZsdWVudGQoKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2ZsdWVudGQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
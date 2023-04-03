"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('syslog log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
    });
    test('create a syslog log driver with options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.SyslogLogDriver({
                tag: 'hello',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'syslog',
                        Options: {
                            tag: 'hello',
                        },
                    },
                }),
            ],
        });
    });
    test('create a syslog log driver without options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.SyslogLogDriver(),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'syslog',
                    },
                }),
            ],
        });
    });
    test('create a syslog log driver using syslog', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.syslog(),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'syslog',
                        Options: {},
                    },
                }),
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLWxvZy1kcml2ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN5c2xvZy1sb2ctZHJpdmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUU5QixJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxFQUFzQixDQUFDO0FBQzNCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTVELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELE9BQU87UUFDUCxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUMzQixLQUFLO1lBQ0wsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDL0IsR0FBRyxFQUFFLE9BQU87YUFDYixDQUFDO1lBQ0YsY0FBYyxFQUFFLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLG9CQUFvQixFQUFFO2dCQUNwQixrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixnQkFBZ0IsRUFBRTt3QkFDaEIsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLE9BQU8sRUFBRTs0QkFDUCxHQUFHLEVBQUUsT0FBTzt5QkFDYjtxQkFDRjtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDdEQsT0FBTztRQUNQLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO1lBQzNCLEtBQUs7WUFDTCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFO1lBQ2xDLGNBQWMsRUFBRSxHQUFHO1NBQ3BCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMxRSxvQkFBb0IsRUFBRTtnQkFDcEIsa0JBQUssQ0FBQyxVQUFVLENBQUM7b0JBQ2YsZ0JBQWdCLEVBQUU7d0JBQ2hCLFNBQVMsRUFBRSxRQUFRO3FCQUNwQjtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsT0FBTztRQUNQLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO1lBQzNCLEtBQUs7WUFDTCxPQUFPLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDaEMsY0FBYyxFQUFFLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLG9CQUFvQixFQUFFO2dCQUNwQixrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixnQkFBZ0IsRUFBRTt3QkFDaEIsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLE9BQU8sRUFBRSxFQUFFO3FCQUNaO2lCQUNGLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICcuLi9saWInO1xuXG5sZXQgc3RhY2s6IGNkay5TdGFjaztcbmxldCB0ZDogZWNzLlRhc2tEZWZpbml0aW9uO1xuY29uc3QgaW1hZ2UgPSBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0LWltYWdlJyk7XG5cbmRlc2NyaWJlKCdzeXNsb2cgbG9nIGRyaXZlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgdGQgPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZmluaXRpb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgc3lzbG9nIGxvZyBkcml2ZXIgd2l0aCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0ZC5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlLFxuICAgICAgbG9nZ2luZzogbmV3IGVjcy5TeXNsb2dMb2dEcml2ZXIoe1xuICAgICAgICB0YWc6ICdoZWxsbycsXG4gICAgICB9KSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ3N5c2xvZycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHRhZzogJ2hlbGxvJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBzeXNsb2cgbG9nIGRyaXZlciB3aXRob3V0IG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBuZXcgZWNzLlN5c2xvZ0xvZ0RyaXZlcigpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnc3lzbG9nJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHN5c2xvZyBsb2cgZHJpdmVyIHVzaW5nIHN5c2xvZycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLnN5c2xvZygpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnc3lzbG9nJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHt9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
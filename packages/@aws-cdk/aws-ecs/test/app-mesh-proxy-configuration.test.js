"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
describe('app mesh proxy configuration', () => {
    test('correctly sets all appMeshProxyConfiguration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
            networkMode: ecs.NetworkMode.AWS_VPC,
            proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
                containerName: 'envoy',
                properties: {
                    ignoredUID: 1337,
                    ignoredGID: 1338,
                    appPorts: [80, 81],
                    proxyIngressPort: 80,
                    proxyEgressPort: 81,
                    egressIgnoredPorts: [8081],
                    egressIgnoredIPs: ['169.254.170.2', '169.254.169.254'],
                },
            }),
        });
        taskDefinition.addContainer('web', {
            memoryLimitMiB: 1024,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        taskDefinition.addContainer('envoy', {
            memoryLimitMiB: 1024,
            image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ProxyConfiguration: {
                ContainerName: 'envoy',
                ProxyConfigurationProperties: [
                    {
                        Name: 'IgnoredUID',
                        Value: '1337',
                    },
                    {
                        Name: 'IgnoredGID',
                        Value: '1338',
                    },
                    {
                        Name: 'AppPorts',
                        Value: '80,81',
                    },
                    {
                        Name: 'ProxyIngressPort',
                        Value: '80',
                    },
                    {
                        Name: 'ProxyEgressPort',
                        Value: '81',
                    },
                    {
                        Name: 'EgressIgnoredPorts',
                        Value: '8081',
                    },
                    {
                        Name: 'EgressIgnoredIPs',
                        Value: '169.254.170.2,169.254.169.254',
                    },
                ],
                Type: 'APPMESH',
            },
        });
    });
    test('correctly sets appMeshProxyConfiguration with default properties set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
            networkMode: ecs.NetworkMode.AWS_VPC,
            proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
                containerName: 'envoy',
                properties: {
                    ignoredUID: 1337,
                    appPorts: [80, 81],
                    proxyIngressPort: 80,
                    proxyEgressPort: 81,
                },
            }),
        });
        taskDefinition.addContainer('web', {
            memoryLimitMiB: 1024,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        taskDefinition.addContainer('envoy', {
            memoryLimitMiB: 1024,
            image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ProxyConfiguration: {
                ContainerName: 'envoy',
                ProxyConfigurationProperties: [
                    {
                        Name: 'IgnoredUID',
                        Value: '1337',
                    },
                    {
                        Name: 'AppPorts',
                        Value: '80,81',
                    },
                    {
                        Name: 'ProxyIngressPort',
                        Value: '80',
                    },
                    {
                        Name: 'ProxyEgressPort',
                        Value: '81',
                    },
                ],
                Type: 'APPMESH',
            },
        });
    });
    test('correctly sets appMeshProxyConfiguration with empty egressIgnoredPorts and egressIgnoredIPs', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
            networkMode: ecs.NetworkMode.AWS_VPC,
            proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
                containerName: 'envoy',
                properties: {
                    ignoredUID: 1337,
                    appPorts: [80, 81],
                    proxyIngressPort: 80,
                    proxyEgressPort: 81,
                    egressIgnoredIPs: [],
                    egressIgnoredPorts: [],
                },
            }),
        });
        taskDefinition.addContainer('web', {
            memoryLimitMiB: 1024,
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        taskDefinition.addContainer('envoy', {
            memoryLimitMiB: 1024,
            image: ecs.ContainerImage.fromRegistry('envoyproxy/envoy'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ProxyConfiguration: {
                ContainerName: 'envoy',
                ProxyConfigurationProperties: [
                    {
                        Name: 'IgnoredUID',
                        Value: '1337',
                    },
                    {
                        Name: 'AppPorts',
                        Value: '80,81',
                    },
                    {
                        Name: 'ProxyIngressPort',
                        Value: '80',
                    },
                    {
                        Name: 'ProxyEgressPort',
                        Value: '81',
                    },
                ],
                Type: 'APPMESH',
            },
        });
    });
    test('throws when neither of IgnoredUID and IgnoredGID is set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
                proxyConfiguration: ecs.ProxyConfigurations.appMeshProxyConfiguration({
                    containerName: 'envoy',
                    properties: {
                        appPorts: [80, 81],
                        proxyIngressPort: 80,
                        proxyEgressPort: 81,
                    },
                }),
            });
        }).toThrow(/At least one of ignoredUID or ignoredGID should be specified./);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLW1lc2gtcHJveHktY29uZmlndXJhdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLW1lc2gtcHJveHktY29uZmlndXJhdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtJQUM1QyxJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1FBQ3hELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixPQUFPO1FBQ1AsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNwRSxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPO1lBQ3BDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDcEUsYUFBYSxFQUFFLE9BQU87Z0JBQ3RCLFVBQVUsRUFBRTtvQkFDVixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7b0JBQ2xCLGdCQUFnQixFQUFFLEVBQUU7b0JBQ3BCLGVBQWUsRUFBRSxFQUFFO29CQUNuQixrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDMUIsZ0JBQWdCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUM7aUJBQ3ZEO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUNILGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQ2pDLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztTQUNuRSxD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bnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnYXBwIG1lc2ggcHJveHkgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgdGVzdCgnY29ycmVjdGx5IHNldHMgYWxsIGFwcE1lc2hQcm94eUNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJywge1xuICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgcHJveHlDb25maWd1cmF0aW9uOiBlY3MuUHJveHlDb25maWd1cmF0aW9ucy5hcHBNZXNoUHJveHlDb25maWd1cmF0aW9uKHtcbiAgICAgICAgY29udGFpbmVyTmFtZTogJ2Vudm95JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGlnbm9yZWRVSUQ6IDEzMzcsXG4gICAgICAgICAgaWdub3JlZEdJRDogMTMzOCxcbiAgICAgICAgICBhcHBQb3J0czogWzgwLCA4MV0sXG4gICAgICAgICAgcHJveHlJbmdyZXNzUG9ydDogODAsXG4gICAgICAgICAgcHJveHlFZ3Jlc3NQb3J0OiA4MSxcbiAgICAgICAgICBlZ3Jlc3NJZ25vcmVkUG9ydHM6IFs4MDgxXSxcbiAgICAgICAgICBlZ3Jlc3NJZ25vcmVkSVBzOiBbJzE2OS4yNTQuMTcwLjInLCAnMTY5LjI1NC4xNjkuMjU0J10sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgIH0pO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignZW52b3knLCB7XG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdlbnZveXByb3h5L2Vudm95JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIFByb3h5Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBDb250YWluZXJOYW1lOiAnZW52b3knLFxuICAgICAgICBQcm94eUNvbmZpZ3VyYXRpb25Qcm9wZXJ0aWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ0lnbm9yZWRVSUQnLFxuICAgICAgICAgICAgVmFsdWU6ICcxMzM3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdJZ25vcmVkR0lEJyxcbiAgICAgICAgICAgIFZhbHVlOiAnMTMzOCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnQXBwUG9ydHMnLFxuICAgICAgICAgICAgVmFsdWU6ICc4MCw4MScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnUHJveHlJbmdyZXNzUG9ydCcsXG4gICAgICAgICAgICBWYWx1ZTogJzgwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdQcm94eUVncmVzc1BvcnQnLFxuICAgICAgICAgICAgVmFsdWU6ICc4MScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnRWdyZXNzSWdub3JlZFBvcnRzJyxcbiAgICAgICAgICAgIFZhbHVlOiAnODA4MScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnRWdyZXNzSWdub3JlZElQcycsXG4gICAgICAgICAgICBWYWx1ZTogJzE2OS4yNTQuMTcwLjIsMTY5LjI1NC4xNjkuMjU0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBUeXBlOiAnQVBQTUVTSCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2NvcnJlY3RseSBzZXRzIGFwcE1lc2hQcm94eUNvbmZpZ3VyYXRpb24gd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMgc2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgIHByb3h5Q29uZmlndXJhdGlvbjogZWNzLlByb3h5Q29uZmlndXJhdGlvbnMuYXBwTWVzaFByb3h5Q29uZmlndXJhdGlvbih7XG4gICAgICAgIGNvbnRhaW5lck5hbWU6ICdlbnZveScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBpZ25vcmVkVUlEOiAxMzM3LFxuICAgICAgICAgIGFwcFBvcnRzOiBbODAsIDgxXSxcbiAgICAgICAgICBwcm94eUluZ3Jlc3NQb3J0OiA4MCxcbiAgICAgICAgICBwcm94eUVncmVzc1BvcnQ6IDgxLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICB9KTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2Vudm95Jywge1xuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnZW52b3lwcm94eS9lbnZveScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBQcm94eUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgQ29udGFpbmVyTmFtZTogJ2Vudm95JyxcbiAgICAgICAgUHJveHlDb25maWd1cmF0aW9uUHJvcGVydGllczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdJZ25vcmVkVUlEJyxcbiAgICAgICAgICAgIFZhbHVlOiAnMTMzNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnQXBwUG9ydHMnLFxuICAgICAgICAgICAgVmFsdWU6ICc4MCw4MScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnUHJveHlJbmdyZXNzUG9ydCcsXG4gICAgICAgICAgICBWYWx1ZTogJzgwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdQcm94eUVncmVzc1BvcnQnLFxuICAgICAgICAgICAgVmFsdWU6ICc4MScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVHlwZTogJ0FQUE1FU0gnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyBhcHBNZXNoUHJveHlDb25maWd1cmF0aW9uIHdpdGggZW1wdHkgZWdyZXNzSWdub3JlZFBvcnRzIGFuZCBlZ3Jlc3NJZ25vcmVkSVBzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgIHByb3h5Q29uZmlndXJhdGlvbjogZWNzLlByb3h5Q29uZmlndXJhdGlvbnMuYXBwTWVzaFByb3h5Q29uZmlndXJhdGlvbih7XG4gICAgICAgIGNvbnRhaW5lck5hbWU6ICdlbnZveScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBpZ25vcmVkVUlEOiAxMzM3LFxuICAgICAgICAgIGFwcFBvcnRzOiBbODAsIDgxXSxcbiAgICAgICAgICBwcm94eUluZ3Jlc3NQb3J0OiA4MCxcbiAgICAgICAgICBwcm94eUVncmVzc1BvcnQ6IDgxLFxuICAgICAgICAgIGVncmVzc0lnbm9yZWRJUHM6IFtdLFxuICAgICAgICAgIGVncmVzc0lnbm9yZWRQb3J0czogW10sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgIH0pO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignZW52b3knLCB7XG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdlbnZveXByb3h5L2Vudm95JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIFByb3h5Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBDb250YWluZXJOYW1lOiAnZW52b3knLFxuICAgICAgICBQcm94eUNvbmZpZ3VyYXRpb25Qcm9wZXJ0aWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ0lnbm9yZWRVSUQnLFxuICAgICAgICAgICAgVmFsdWU6ICcxMzM3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdBcHBQb3J0cycsXG4gICAgICAgICAgICBWYWx1ZTogJzgwLDgxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6ICdQcm94eUluZ3Jlc3NQb3J0JyxcbiAgICAgICAgICAgIFZhbHVlOiAnODAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogJ1Byb3h5RWdyZXNzUG9ydCcsXG4gICAgICAgICAgICBWYWx1ZTogJzgxJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBUeXBlOiAnQVBQTUVTSCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIG5laXRoZXIgb2YgSWdub3JlZFVJRCBhbmQgSWdub3JlZEdJRCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgICAgcHJveHlDb25maWd1cmF0aW9uOiBlY3MuUHJveHlDb25maWd1cmF0aW9ucy5hcHBNZXNoUHJveHlDb25maWd1cmF0aW9uKHtcbiAgICAgICAgICBjb250YWluZXJOYW1lOiAnZW52b3knLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGFwcFBvcnRzOiBbODAsIDgxXSxcbiAgICAgICAgICAgIHByb3h5SW5ncmVzc1BvcnQ6IDgwLFxuICAgICAgICAgICAgcHJveHlFZ3Jlc3NQb3J0OiA4MSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0F0IGxlYXN0IG9uZSBvZiBpZ25vcmVkVUlEIG9yIGlnbm9yZWRHSUQgc2hvdWxkIGJlIHNwZWNpZmllZC4vKTtcblxuXG4gIH0pO1xufSk7XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const ecs = require("../../lib");
class ServiceConnect extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const cluster = new ecs.Cluster(this, 'EcsCluster', {
            defaultCloudMapNamespace: {
                name: 'scorekeep.com',
                useForServiceConnect: true,
            },
        });
        const td = new ecs.FargateTaskDefinition(this, 'TaskDef', {
            cpu: 1024,
            memoryLimitMiB: 2048,
        });
        td.addContainer('container', {
            containerName: 'web',
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            portMappings: [
                {
                    name: 'api',
                    containerPort: 80,
                    appProtocol: ecs.AppProtocol.http2,
                },
            ],
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: 'web',
            }),
        });
        new ecs.FargateService(this, 'svc', {
            taskDefinition: td,
            cluster: cluster,
            serviceConnectConfiguration: {
                services: [
                    {
                        portMappingName: 'api',
                        dnsName: 'api',
                        port: 80,
                    },
                ],
                logDriver: ecs.LogDrivers.awsLogs({
                    streamPrefix: 'sc',
                }),
            },
        });
    }
}
const app = new cdk.App();
const stack = new ServiceConnect(app, 'aws-ecs-service-connect');
new integ.IntegTest(app, 'ServiceConnect', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2VydmljZS1jb25uZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc2VydmljZS1jb25uZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLDhDQUE4QztBQUU5QyxpQ0FBaUM7QUFHakMsTUFBTSxjQUFlLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNsRCx3QkFBd0IsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLG9CQUFvQixFQUFFLElBQUk7YUFDM0I7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3hELEdBQUcsRUFBRSxJQUFJO1lBQ1QsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDM0IsYUFBYSxFQUFFLEtBQUs7WUFDcEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO1lBQ2xFLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxJQUFJLEVBQUUsS0FBSztvQkFDWCxhQUFhLEVBQUUsRUFBRTtvQkFDakIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSztpQkFDbkM7YUFDRjtZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsWUFBWSxFQUFFLEtBQUs7YUFDcEIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ2xDLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLDJCQUEyQixFQUFFO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsZUFBZSxFQUFFLEtBQUs7d0JBQ3RCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSxFQUFFO3FCQUNUO2lCQUNGO2dCQUNELFNBQVMsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsWUFBWSxFQUFFLElBQUk7aUJBQ25CLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUVqRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFO0lBQ3pDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICcuLi8uLi9saWInO1xuXG5cbmNsYXNzIFNlcnZpY2VDb25uZWN0IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0Vjc0NsdXN0ZXInLCB7XG4gICAgICBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2U6IHtcbiAgICAgICAgbmFtZTogJ3Njb3Jla2VlcC5jb20nLFxuICAgICAgICB1c2VGb3JTZXJ2aWNlQ29ubmVjdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB0ZCA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHRoaXMsICdUYXNrRGVmJywge1xuICAgICAgY3B1OiAxMDI0LFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgfSk7XG5cbiAgICB0ZC5hZGRDb250YWluZXIoJ2NvbnRhaW5lcicsIHtcbiAgICAgIGNvbnRhaW5lck5hbWU6ICd3ZWInLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgcG9ydE1hcHBpbmdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnYXBpJyxcbiAgICAgICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICBhcHBQcm90b2NvbDogZWNzLkFwcFByb3RvY29sLmh0dHAyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLmF3c0xvZ3Moe1xuICAgICAgICBzdHJlYW1QcmVmaXg6ICd3ZWInLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHRoaXMsICdzdmMnLCB7XG4gICAgICB0YXNrRGVmaW5pdGlvbjogdGQsXG4gICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgc2VydmljZUNvbm5lY3RDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIHNlcnZpY2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcG9ydE1hcHBpbmdOYW1lOiAnYXBpJyxcbiAgICAgICAgICAgIGRuc05hbWU6ICdhcGknLFxuICAgICAgICAgICAgcG9ydDogODAsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgbG9nRHJpdmVyOiBlY3MuTG9nRHJpdmVycy5hd3NMb2dzKHtcbiAgICAgICAgICBzdHJlYW1QcmVmaXg6ICdzYycsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU2VydmljZUNvbm5lY3QoYXBwLCAnYXdzLWVjcy1zZXJ2aWNlLWNvbm5lY3QnKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdTZXJ2aWNlQ29ubmVjdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==
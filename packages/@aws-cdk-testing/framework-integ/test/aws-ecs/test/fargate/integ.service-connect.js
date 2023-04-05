"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const ecs = require("aws-cdk-lib/aws-ecs");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2VydmljZS1jb25uZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc2VydmljZS1jb25uZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUVwRCwyQ0FBMkM7QUFHM0MsTUFBTSxjQUFlLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNsRCx3QkFBd0IsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLG9CQUFvQixFQUFFLElBQUk7YUFDM0I7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3hELEdBQUcsRUFBRSxJQUFJO1lBQ1QsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDM0IsYUFBYSxFQUFFLEtBQUs7WUFDcEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO1lBQ2xFLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxJQUFJLEVBQUUsS0FBSztvQkFDWCxhQUFhLEVBQUUsRUFBRTtvQkFDakIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSztpQkFDbkM7YUFDRjtZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsWUFBWSxFQUFFLEtBQUs7YUFDcEIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ2xDLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLDJCQUEyQixFQUFFO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsZUFBZSxFQUFFLEtBQUs7d0JBQ3RCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSxFQUFFO3FCQUNUO2lCQUNGO2dCQUNELFNBQVMsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsWUFBWSxFQUFFLElBQUk7aUJBQ25CLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBRWpFLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7SUFDekMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcblxuXG5jbGFzcyBTZXJ2aWNlQ29ubmVjdCBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsICdFY3NDbHVzdGVyJywge1xuICAgICAgZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlOiB7XG4gICAgICAgIG5hbWU6ICdzY29yZWtlZXAuY29tJyxcbiAgICAgICAgdXNlRm9yU2VydmljZUNvbm5lY3Q6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGQgPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAnVGFza0RlZicsIHtcbiAgICAgIGNwdTogMTAyNCxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgIH0pO1xuXG4gICAgdGQuYWRkQ29udGFpbmVyKCdjb250YWluZXInLCB7XG4gICAgICBjb250YWluZXJOYW1lOiAnd2ViJyxcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIHBvcnRNYXBwaW5nczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2FwaScsXG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgYXBwUHJvdG9jb2w6IGVjcy5BcHBQcm90b2NvbC5odHRwMixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVycy5hd3NMb2dzKHtcbiAgICAgICAgc3RyZWFtUHJlZml4OiAnd2ViJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgbmV3IGVjcy5GYXJnYXRlU2VydmljZSh0aGlzLCAnc3ZjJywge1xuICAgICAgdGFza0RlZmluaXRpb246IHRkLFxuICAgICAgY2x1c3RlcjogY2x1c3RlcixcbiAgICAgIHNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBzZXJ2aWNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBvcnRNYXBwaW5nTmFtZTogJ2FwaScsXG4gICAgICAgICAgICBkbnNOYW1lOiAnYXBpJyxcbiAgICAgICAgICAgIHBvcnQ6IDgwLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGxvZ0RyaXZlcjogZWNzLkxvZ0RyaXZlcnMuYXdzTG9ncyh7XG4gICAgICAgICAgc3RyZWFtUHJlZml4OiAnc2MnLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFNlcnZpY2VDb25uZWN0KGFwcCwgJ2F3cy1lY3Mtc2VydmljZS1jb25uZWN0Jyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnU2VydmljZUNvbm5lY3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTsiXX0=
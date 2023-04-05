"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_certificatemanager_1 = require("aws-cdk-lib/aws-certificatemanager");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-integ-alb-idle-timeout');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
// Two load balancers with different idle timeouts.
new aws_ecs_patterns_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
    cluster,
    memoryLimitMiB: 256,
    taskImageOptions: {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    enableExecuteCommand: true,
    loadBalancers: [
        {
            name: 'lb',
            idleTimeout: aws_cdk_lib_1.Duration.seconds(400),
            domainName: 'api.example.com',
            domainZone: zone,
            listeners: [
                {
                    name: 'listener',
                    protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
                    certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                    sslPolicy: aws_elasticloadbalancingv2_1.SslPolicy.TLS12_EXT,
                },
            ],
        },
        {
            name: 'lb2',
            idleTimeout: aws_cdk_lib_1.Duration.seconds(400),
            domainName: 'frontend.example.com',
            domainZone: zone,
            listeners: [
                {
                    name: 'listener2',
                    protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
                    certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert2', 'helloworld'),
                    sslPolicy: aws_elasticloadbalancingv2_1.SslPolicy.TLS12_EXT,
                },
            ],
        },
    ],
    targetGroups: [
        {
            containerPort: 80,
            listener: 'listener',
        },
        {
            containerPort: 90,
            pathPattern: 'a/b/c',
            priority: 10,
            listener: 'listener',
        },
        {
            containerPort: 443,
            listener: 'listener2',
        },
        {
            containerPort: 80,
            pathPattern: 'a/b/c',
            priority: 10,
            listener: 'listener2',
        },
    ],
});
new integ.IntegTest(app, 'multiAlbEcsEc2Test', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGlwbGUtYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlZC1lY3Mtc2VydmljZS1pZGxlLXRpbWVvdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5tdWx0aXBsZS1hcHBsaWNhdGlvbi1sb2FkLWJhbGFuY2VkLWVjcy1zZXJ2aWNlLWlkbGUtdGltZW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtFQUFpRTtBQUNqRSxpREFBd0Q7QUFDeEQsaURBQThEO0FBQzlELHVGQUF3RjtBQUN4Rix5REFBMkQ7QUFDM0QsNkNBQW1EO0FBQ25ELG9EQUFvRDtBQUVwRCxtRUFBeUY7QUFFekYsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxNQUFNLElBQUksR0FBRyxJQUFJLDhCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNwRixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdkQsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLHNCQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRS9GLG1EQUFtRDtBQUNuRCxJQUFJLDREQUF5QyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDaEUsT0FBTztJQUNQLGNBQWMsRUFBRSxHQUFHO0lBQ25CLGdCQUFnQixFQUFFO1FBQ2hCLEtBQUssRUFBRSx3QkFBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztLQUMvRDtJQUNELG9CQUFvQixFQUFFLElBQUk7SUFDMUIsYUFBYSxFQUFFO1FBQ2I7WUFDRSxJQUFJLEVBQUUsSUFBSTtZQUNWLFdBQVcsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDbEMsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixVQUFVLEVBQUUsSUFBSTtZQUNoQixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFFBQVEsRUFBRSxnREFBbUIsQ0FBQyxLQUFLO29CQUNuQyxXQUFXLEVBQUUsb0NBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQztvQkFDeEUsU0FBUyxFQUFFLHNDQUFTLENBQUMsU0FBUztpQkFDL0I7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsS0FBSztZQUNYLFdBQVcsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDbEMsVUFBVSxFQUFFLHNCQUFzQjtZQUNsQyxVQUFVLEVBQUUsSUFBSTtZQUNoQixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFFBQVEsRUFBRSxnREFBbUIsQ0FBQyxLQUFLO29CQUNuQyxXQUFXLEVBQUUsb0NBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQztvQkFDekUsU0FBUyxFQUFFLHNDQUFTLENBQUMsU0FBUztpQkFDL0I7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxZQUFZLEVBQUU7UUFDWjtZQUNFLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFFBQVEsRUFBRSxVQUFVO1NBQ3JCO1FBQ0Q7WUFDRSxhQUFhLEVBQUUsRUFBRTtZQUNqQixXQUFXLEVBQUUsT0FBTztZQUNwQixRQUFRLEVBQUUsRUFBRTtZQUNaLFFBQVEsRUFBRSxVQUFVO1NBQ3JCO1FBQ0Q7WUFDRSxhQUFhLEVBQUUsR0FBRztZQUNsQixRQUFRLEVBQUUsV0FBVztTQUN0QjtRQUNEO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsV0FBVyxFQUFFLE9BQU87WUFDcEIsUUFBUSxFQUFFLEVBQUU7WUFDWixRQUFRLEVBQUUsV0FBVztTQUN0QjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUM3QyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VydGlmaWNhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCB7IEluc3RhbmNlVHlwZSwgVnBjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBDbHVzdGVyLCBDb250YWluZXJJbWFnZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Qcm90b2NvbCwgU3NsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IHsgUHVibGljSG9zdGVkWm9uZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtZWNzLWludGVnLWFsYi1pZGxlLXRpbWVvdXQnKTtcbmNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMiB9KTtcbmNvbnN0IHpvbmUgPSBuZXcgUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7IHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nIH0pO1xuY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuLy8gVHdvIGxvYWQgYmFsYW5jZXJzIHdpdGggZGlmZmVyZW50IGlkbGUgdGltZW91dHMuXG5uZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdteVNlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIG1lbW9yeUxpbWl0TWlCOiAyNTYsXG4gIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgfSxcbiAgZW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gIGxvYWRCYWxhbmNlcnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiAnbGInLFxuICAgICAgaWRsZVRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoNDAwKSxcbiAgICAgIGRvbWFpbk5hbWU6ICdhcGkuZXhhbXBsZS5jb20nLFxuICAgICAgZG9tYWluWm9uZTogem9uZSxcbiAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2xpc3RlbmVyJyxcbiAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgICAgICBjZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnQ2VydCcsICdoZWxsb3dvcmxkJyksXG4gICAgICAgICAgc3NsUG9saWN5OiBTc2xQb2xpY3kuVExTMTJfRVhULFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgaWRsZVRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoNDAwKSxcbiAgICAgIGRvbWFpbk5hbWU6ICdmcm9udGVuZC5leGFtcGxlLmNvbScsXG4gICAgICBkb21haW5ab25lOiB6b25lLFxuICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgICAgICBjZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnQ2VydDInLCAnaGVsbG93b3JsZCcpLFxuICAgICAgICAgIHNzbFBvbGljeTogU3NsUG9saWN5LlRMUzEyX0VYVCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgdGFyZ2V0R3JvdXBzOiBbXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgcGF0aFBhdHRlcm46ICdhL2IvYycsXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDQ0MyxcbiAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXIyJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgcGF0aFBhdHRlcm46ICdhL2IvYycsXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMicsXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ211bHRpQWxiRWNzRWMyVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
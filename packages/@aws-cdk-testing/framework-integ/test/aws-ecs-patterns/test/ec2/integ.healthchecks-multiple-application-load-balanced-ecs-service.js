"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-integ-multiple-alb-healthchecks');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
// Two load balancers with two listeners and two target groups.
const applicationMultipleTargetGroupsFargateService = new aws_ecs_patterns_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
    cluster,
    memoryLimitMiB: 512,
    taskImageOptions: {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    loadBalancers: [
        {
            name: 'lb1',
            listeners: [
                {
                    name: 'listener1',
                },
            ],
        },
        {
            name: 'lb2',
            listeners: [
                {
                    name: 'listener2',
                },
            ],
        },
    ],
    targetGroups: [
        {
            containerPort: 80,
            listener: 'listener1',
        },
        {
            containerPort: 90,
            listener: 'listener2',
        },
    ],
});
applicationMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({
    protocol: aws_elasticloadbalancingv2_1.Protocol.HTTP,
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 2,
    timeout: aws_cdk_lib_1.Duration.seconds(10),
    interval: aws_cdk_lib_1.Duration.seconds(30),
    healthyHttpCodes: '200',
});
applicationMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({
    protocol: aws_elasticloadbalancingv2_1.Protocol.HTTP,
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 2,
    timeout: aws_cdk_lib_1.Duration.seconds(10),
    interval: aws_cdk_lib_1.Duration.seconds(30),
    healthyHttpCodes: '200',
});
new integ_tests_alpha_1.IntegTest(app, 'Integ', { testCases: [stack] });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaGVhbHRoY2hlY2tzLW11bHRpcGxlLWFwcGxpY2F0aW9uLWxvYWQtYmFsYW5jZWQtZWNzLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5oZWFsdGhjaGVja3MtbXVsdGlwbGUtYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlZC1lY3Mtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUF3RDtBQUN4RCxpREFBOEQ7QUFDOUQsdUZBQWtFO0FBQ2xFLDZDQUFtRDtBQUNuRCxrRUFBdUQ7QUFFdkQsbUVBQXlGO0FBRXpGLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUseUNBQXlDLENBQUMsQ0FBQztBQUN4RSxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELE9BQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUUvRiwrREFBK0Q7QUFDL0QsTUFBTSw2Q0FBNkMsR0FBRyxJQUFJLDREQUF5QyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDdEgsT0FBTztJQUNQLGNBQWMsRUFBRSxHQUFHO0lBQ25CLGdCQUFnQixFQUFFO1FBQ2hCLEtBQUssRUFBRSx3QkFBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztLQUMvRDtJQUNELGFBQWEsRUFBRTtRQUNiO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsWUFBWSxFQUFFO1FBQ1o7WUFDRSxhQUFhLEVBQUUsRUFBRTtZQUNqQixRQUFRLEVBQUUsV0FBVztTQUN0QjtRQUNEO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLFdBQVc7U0FDdEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILDZDQUE2QyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztJQUNqRixRQUFRLEVBQUUscUNBQVEsQ0FBQyxJQUFJO0lBQ3ZCLHFCQUFxQixFQUFFLENBQUM7SUFDeEIsdUJBQXVCLEVBQUUsQ0FBQztJQUMxQixPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzdCLFFBQVEsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDOUIsZ0JBQWdCLEVBQUUsS0FBSztDQUN4QixDQUFDLENBQUM7QUFFSCw2Q0FBNkMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUM7SUFDakYsUUFBUSxFQUFFLHFDQUFRLENBQUMsSUFBSTtJQUN2QixxQkFBcUIsRUFBRSxDQUFDO0lBQ3hCLHVCQUF1QixFQUFFLENBQUM7SUFDMUIsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM3QixRQUFRLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzlCLGdCQUFnQixFQUFFLEtBQUs7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFcEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5zdGFuY2VUeXBlLCBWcGMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IENsdXN0ZXIsIENvbnRhaW5lckltYWdlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtZWNzLWludGVnLW11bHRpcGxlLWFsYi1oZWFsdGhjaGVja3MnKTtcbmNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMiB9KTtcbmNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbmNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbi8vIFR3byBsb2FkIGJhbGFuY2VycyB3aXRoIHR3byBsaXN0ZW5lcnMgYW5kIHR3byB0YXJnZXQgZ3JvdXBzLlxuY29uc3QgYXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlID0gbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnbXlTZXJ2aWNlJywge1xuICBjbHVzdGVyLFxuICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gIH0sXG4gIGxvYWRCYWxhbmNlcnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiAnbGIxJyxcbiAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2xpc3RlbmVyMScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2xiMicsXG4gICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuICB0YXJnZXRHcm91cHM6IFtcbiAgICB7XG4gICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXIxJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgbGlzdGVuZXI6ICdsaXN0ZW5lcjInLFxuICAgIH0sXG4gIF0sXG59KTtcblxuYXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlLnRhcmdldEdyb3Vwc1swXS5jb25maWd1cmVIZWFsdGhDaGVjayh7XG4gIHByb3RvY29sOiBQcm90b2NvbC5IVFRQLFxuICBoZWFsdGh5VGhyZXNob2xkQ291bnQ6IDIsXG4gIHVuaGVhbHRoeVRocmVzaG9sZENvdW50OiAyLFxuICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgaW50ZXJ2YWw6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICBoZWFsdGh5SHR0cENvZGVzOiAnMjAwJyxcbn0pO1xuXG5hcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2UudGFyZ2V0R3JvdXBzWzFdLmNvbmZpZ3VyZUhlYWx0aENoZWNrKHtcbiAgcHJvdG9jb2w6IFByb3RvY29sLkhUVFAsXG4gIGhlYWx0aHlUaHJlc2hvbGRDb3VudDogMixcbiAgdW5oZWFsdGh5VGhyZXNob2xkQ291bnQ6IDIsXG4gIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gIGhlYWx0aHlIdHRwQ29kZXM6ICcyMDAnLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnSW50ZWcnLCB7IHRlc3RDYXNlczogW3N0YWNrXSB9KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
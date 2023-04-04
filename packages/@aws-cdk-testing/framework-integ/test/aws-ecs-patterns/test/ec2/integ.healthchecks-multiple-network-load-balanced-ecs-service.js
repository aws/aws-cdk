"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-integ-nlb-healthchecks');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
// Two load balancers with two listeners and two target groups.
const networkMultipleTargetGroupsFargateService = new aws_ecs_patterns_1.NetworkMultipleTargetGroupsEc2Service(stack, 'myService', {
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
networkMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({});
networkMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({});
new integ_tests_alpha_1.IntegTest(app, 'Integ', { testCases: [stack] });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaGVhbHRoY2hlY2tzLW11bHRpcGxlLW5ldHdvcmstbG9hZC1iYWxhbmNlZC1lY3Mtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmhlYWx0aGNoZWNrcy1tdWx0aXBsZS1uZXR3b3JrLWxvYWQtYmFsYW5jZWQtZWNzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBd0Q7QUFDeEQsaURBQThEO0FBQzlELDZDQUF5QztBQUN6QyxrRUFBdUQ7QUFDdkQsbUVBQXFGO0FBRXJGLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMvRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELE9BQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvRiwrREFBK0Q7QUFDL0QsTUFBTSx5Q0FBeUMsR0FBRyxJQUFJLHdEQUFxQyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDOUcsT0FBTztJQUNQLGNBQWMsRUFBRSxHQUFHO0lBQ25CLGdCQUFnQixFQUFFO1FBQ2hCLEtBQUssRUFBRSx3QkFBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztLQUMvRDtJQUNELGFBQWEsRUFBRTtRQUNiO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsWUFBWSxFQUFFO1FBQ1o7WUFDRSxhQUFhLEVBQUUsRUFBRTtZQUNqQixRQUFRLEVBQUUsV0FBVztTQUN0QjtRQUNEO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLFdBQVc7U0FDdEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILHlDQUF5QyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVuRix5Q0FBeUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFbkYsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFcEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5zdGFuY2VUeXBlLCBWcGMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IENsdXN0ZXIsIENvbnRhaW5lckltYWdlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtZWNzLWludGVnLW5sYi1oZWFsdGhjaGVja3MnKTtcbmNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMiB9KTtcbmNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbmNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG4vLyBUd28gbG9hZCBiYWxhbmNlcnMgd2l0aCB0d28gbGlzdGVuZXJzIGFuZCB0d28gdGFyZ2V0IGdyb3Vwcy5cbmNvbnN0IG5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlID0gbmV3IE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdteVNlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgfSxcbiAgbG9hZEJhbGFuY2VyczogW1xuICAgIHtcbiAgICAgIG5hbWU6ICdsYjEnLFxuICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIxJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbGIyJyxcbiAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2xpc3RlbmVyMicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIHRhcmdldEdyb3VwczogW1xuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgbGlzdGVuZXI6ICdsaXN0ZW5lcjEnLFxuICAgIH0sXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogOTAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMicsXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5uZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZS50YXJnZXRHcm91cHNbMF0uY29uZmlndXJlSGVhbHRoQ2hlY2soe30pO1xuXG5uZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZS50YXJnZXRHcm91cHNbMV0uY29uZmlndXJlSGVhbHRoQ2hlY2soe30pO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ0ludGVnJywgeyB0ZXN0Q2FzZXM6IFtzdGFja10gfSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
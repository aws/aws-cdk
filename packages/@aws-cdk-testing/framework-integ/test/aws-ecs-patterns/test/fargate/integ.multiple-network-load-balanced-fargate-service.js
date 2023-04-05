"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-ecs-integ-fargate-multi-nlb-health');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
// Two load balancers with two listeners and two target groups.
new aws_ecs_patterns_1.NetworkMultipleTargetGroupsFargateService(stack, 'myService', {
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
new integ.IntegTest(app, 'networkMultipleTargetGroupsFargateServiceTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGlwbGUtbmV0d29yay1sb2FkLWJhbGFuY2VkLWZhcmdhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm11bHRpcGxlLW5ldHdvcmstbG9hZC1iYWxhbmNlZC1mYXJnYXRlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBMEM7QUFDMUMsaURBQThEO0FBQzlELDZDQUF5QztBQUN6QyxvREFBb0Q7QUFDcEQsbUVBQXlGO0FBRXpGLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztBQUN2RSxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRXZELCtEQUErRDtBQUMvRCxJQUFJLDREQUF5QyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDaEUsT0FBTztJQUNQLGNBQWMsRUFBRSxHQUFHO0lBQ25CLGdCQUFnQixFQUFFO1FBQ2hCLEtBQUssRUFBRSx3QkFBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztLQUMvRDtJQUNELGFBQWEsRUFBRTtRQUNiO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsWUFBWSxFQUFFO1FBQ1o7WUFDRSxhQUFhLEVBQUUsRUFBRTtZQUNqQixRQUFRLEVBQUUsV0FBVztTQUN0QjtRQUNEO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLFdBQVc7U0FDdEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsK0NBQStDLEVBQUU7SUFDeEUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZwYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQ2x1c3RlciwgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtZWNzLWludGVnLWZhcmdhdGUtbXVsdGktbmxiLWhlYWx0aCcpO1xuY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4vLyBUd28gbG9hZCBiYWxhbmNlcnMgd2l0aCB0d28gbGlzdGVuZXJzIGFuZCB0d28gdGFyZ2V0IGdyb3Vwcy5cbm5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ215U2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICB9LFxuICBsb2FkQmFsYW5jZXJzOiBbXG4gICAge1xuICAgICAgbmFtZTogJ2xiMScsXG4gICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgdGFyZ2V0R3JvdXBzOiBbXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMScsXG4gICAgfSxcbiAgICB7XG4gICAgICBjb250YWluZXJQb3J0OiA5MCxcbiAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXIyJyxcbiAgICB9LFxuICBdLFxufSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnbmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRmFyZ2F0ZVNlcnZpY2VUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
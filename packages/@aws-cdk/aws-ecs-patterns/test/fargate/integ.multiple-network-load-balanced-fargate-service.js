"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-ecs-integ');
const vpc = new aws_ec2_1.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
// Two load balancers with two listeners and two target groups.
new lib_1.NetworkMultipleTargetGroupsFargateService(stack, 'myService', {
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
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGlwbGUtbmV0d29yay1sb2FkLWJhbGFuY2VkLWZhcmdhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm11bHRpcGxlLW5ldHdvcmstbG9hZC1iYWxhbmNlZC1mYXJnYXRlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBdUM7QUFDdkMsOENBQTJEO0FBQzNELHdDQUEyQztBQUUzQyxtQ0FBc0U7QUFFdEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUV2RCwrREFBK0Q7QUFDL0QsSUFBSSwrQ0FBeUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ2hFLE9BQU87SUFDUCxjQUFjLEVBQUUsR0FBRztJQUNuQixnQkFBZ0IsRUFBRTtRQUNoQixLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7S0FDL0Q7SUFDRCxhQUFhLEVBQUU7UUFDYjtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFO2dCQUNUO29CQUNFLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7S0FDRjtJQUNELFlBQVksRUFBRTtRQUNaO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLFdBQVc7U0FDdEI7UUFDRDtZQUNFLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFFBQVEsRUFBRSxXQUFXO1NBQ3RCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWcGMgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IENsdXN0ZXIsIENvbnRhaW5lckltYWdlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmltcG9ydCB7IE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0ZhcmdhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnYXdzLWVjcy1pbnRlZycpO1xuY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4vLyBUd28gbG9hZCBiYWxhbmNlcnMgd2l0aCB0d28gbGlzdGVuZXJzIGFuZCB0d28gdGFyZ2V0IGdyb3Vwcy5cbm5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNGYXJnYXRlU2VydmljZShzdGFjaywgJ215U2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICB9LFxuICBsb2FkQmFsYW5jZXJzOiBbXG4gICAge1xuICAgICAgbmFtZTogJ2xiMScsXG4gICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgdGFyZ2V0R3JvdXBzOiBbXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMScsXG4gICAgfSxcbiAgICB7XG4gICAgICBjb250YWluZXJQb3J0OiA5MCxcbiAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXIyJyxcbiAgICB9LFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==
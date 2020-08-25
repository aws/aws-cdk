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
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
// One load balancer with one listener and two target groups.
new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
    cluster,
    memoryLimitMiB: 256,
    taskImageOptions: {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    targetGroups: [
        {
            containerPort: 80,
        },
        {
            containerPort: 90,
            pathPattern: 'a/b/c',
            priority: 10,
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGlwbGUtYXBwbGljYXRpb24tbG9hZC1iYWxhbmNlZC1lY3Mtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLm11bHRpcGxlLWFwcGxpY2F0aW9uLWxvYWQtYmFsYW5jZWQtZWNzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBcUQ7QUFDckQsOENBQTJEO0FBQzNELHdDQUEyQztBQUUzQyxtQ0FBc0U7QUFFdEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN2RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksc0JBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFL0YsNkRBQTZEO0FBQzdELElBQUksK0NBQXlDLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUNoRSxPQUFPO0lBQ1AsY0FBYyxFQUFFLEdBQUc7SUFDbkIsZ0JBQWdCLEVBQUU7UUFDaEIsS0FBSyxFQUFFLHdCQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO0tBQy9EO0lBQ0QsWUFBWSxFQUFFO1FBQ1o7WUFDRSxhQUFhLEVBQUUsRUFBRTtTQUNsQjtRQUNEO1lBQ0UsYUFBYSxFQUFFLEVBQUU7WUFDakIsV0FBVyxFQUFFLE9BQU87WUFDcEIsUUFBUSxFQUFFLEVBQUU7U0FDYjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5zdGFuY2VUeXBlLCBWcGMgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IENsdXN0ZXIsIENvbnRhaW5lckltYWdlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnYXdzLWVjcy1pbnRlZycpO1xuY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuLy8gT25lIGxvYWQgYmFsYW5jZXIgd2l0aCBvbmUgbGlzdGVuZXIgYW5kIHR3byB0YXJnZXQgZ3JvdXBzLlxubmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnbXlTZXJ2aWNlJywge1xuICBjbHVzdGVyLFxuICBtZW1vcnlMaW1pdE1pQjogMjU2LFxuICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gIH0sXG4gIHRhcmdldEdyb3VwczogW1xuICAgIHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgIH0sXG4gICAge1xuICAgICAgY29udGFpbmVyUG9ydDogOTAsXG4gICAgICBwYXRoUGF0dGVybjogJ2EvYi9jJyxcbiAgICAgIHByaW9yaXR5OiAxMCxcbiAgICB9LFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==
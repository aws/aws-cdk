"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const ecsPatterns = require("aws-cdk-lib/aws-ecs-patterns");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-lb-fargate');
// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
cluster.enableFargateCapacityProviders();
// Create ALB service with capacity provider storategies
new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALBFargateService', {
    cluster,
    memoryLimitMiB: 1024,
    cpu: 512,
    taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    capacityProviderStrategies: [
        {
            capacityProvider: 'FARGATE',
            base: 1,
            weight: 1,
        },
        {
            capacityProvider: 'FARGATE_SPOT',
            base: 0,
            weight: 2,
        },
    ],
});
// Create NLB service with capacity provider storategies
new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFargateService', {
    cluster,
    memoryLimitMiB: 1024,
    cpu: 512,
    taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    capacityProviderStrategies: [
        {
            capacityProvider: 'FARGATE',
            base: 1,
            weight: 1,
        },
        {
            capacityProvider: 'FARGATE_SPOT',
            base: 0,
            weight: 2,
        },
    ],
});
new integ.IntegTest(app, 'l3CapacityProviderStrategiesTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubDMtY2FwYWNpdHktcHJvdmlkZXItc3RyYXRlZ2llcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmwzLWNhcGFjaXR5LXByb3ZpZGVyLXN0cmF0ZWdpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyxvREFBb0Q7QUFDcEQsNERBQTREO0FBRTVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUU3RCx5QkFBeUI7QUFDekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNsRSxPQUFPLENBQUMsOEJBQThCLEVBQUUsQ0FBQztBQUV6Qyx3REFBd0Q7QUFDeEQsSUFBSSxXQUFXLENBQUMscUNBQXFDLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFO0lBQ2hGLE9BQU87SUFDUCxjQUFjLEVBQUUsSUFBSTtJQUNwQixHQUFHLEVBQUUsR0FBRztJQUNSLGdCQUFnQixFQUFFO1FBQ2hCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztLQUNuRTtJQUNELDBCQUEwQixFQUFFO1FBQzFCO1lBQ0UsZ0JBQWdCLEVBQUUsU0FBUztZQUMzQixJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7UUFDRDtZQUNFLGdCQUFnQixFQUFFLGNBQWM7WUFDaEMsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsQ0FBQztTQUNWO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCx3REFBd0Q7QUFDeEQsSUFBSSxXQUFXLENBQUMsaUNBQWlDLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFO0lBQzVFLE9BQU87SUFDUCxjQUFjLEVBQUUsSUFBSTtJQUNwQixHQUFHLEVBQUUsR0FBRztJQUNSLGdCQUFnQixFQUFFO1FBQ2hCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztLQUNuRTtJQUNELDBCQUEwQixFQUFFO1FBQzFCO1lBQ0UsZ0JBQWdCLEVBQUUsU0FBUztZQUMzQixJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7UUFDRDtZQUNFLGdCQUFnQixFQUFFLGNBQWM7WUFDaEMsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsQ0FBQztTQUNWO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGtDQUFrQyxFQUFFO0lBQzNELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgZWNzUGF0dGVybnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcy1wYXR0ZXJucyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWVjcy1pbnRlZy1sYi1mYXJnYXRlJyk7XG5cbi8vIENyZWF0ZSBWUEMgYW5kIGNsdXN0ZXJcbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywgeyBtYXhBenM6IDIgfSk7XG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7IHZwYyB9KTtcbmNsdXN0ZXIuZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzKCk7XG5cbi8vIENyZWF0ZSBBTEIgc2VydmljZSB3aXRoIGNhcGFjaXR5IHByb3ZpZGVyIHN0b3JhdGVnaWVzXG5uZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ0FMQkZhcmdhdGVTZXJ2aWNlJywge1xuICBjbHVzdGVyLFxuICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgY3B1OiA1MTIsXG4gIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gIH0sXG4gIGNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzOiBbXG4gICAge1xuICAgICAgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEUnLFxuICAgICAgYmFzZTogMSxcbiAgICAgIHdlaWdodDogMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFX1NQT1QnLFxuICAgICAgYmFzZTogMCxcbiAgICAgIHdlaWdodDogMixcbiAgICB9LFxuICBdLFxufSk7XG5cbi8vIENyZWF0ZSBOTEIgc2VydmljZSB3aXRoIGNhcGFjaXR5IHByb3ZpZGVyIHN0b3JhdGVnaWVzXG5uZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnTkxCRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICBjcHU6IDUxMixcbiAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgfSxcbiAgY2FwYWNpdHlQcm92aWRlclN0cmF0ZWdpZXM6IFtcbiAgICB7XG4gICAgICBjYXBhY2l0eVByb3ZpZGVyOiAnRkFSR0FURScsXG4gICAgICBiYXNlOiAxLFxuICAgICAgd2VpZ2h0OiAxLFxuICAgIH0sXG4gICAge1xuICAgICAgY2FwYWNpdHlQcm92aWRlcjogJ0ZBUkdBVEVfU1BPVCcsXG4gICAgICBiYXNlOiAwLFxuICAgICAgd2VpZ2h0OiAyLFxuICAgIH0sXG4gIF0sXG59KTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdsM0NhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
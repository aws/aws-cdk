"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const ecs = require("aws-cdk-lib/aws-ecs");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-capacity-provider');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCPCluster', {
    vpc,
    capacityProviders: ['FARGATE', 'FARGATE_SPOT'],
});
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});
new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
    capacityProviderStrategies: [
        {
            capacityProvider: 'FARGATE_SPOT',
            weight: 2,
        },
        {
            capacityProvider: 'FARGATE',
            weight: 1,
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2FwYWNpdHktcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY2FwYWNpdHktcHJvdmlkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtJQUN6RCxHQUFHO0lBQ0gsaUJBQWlCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDO0NBQy9DLENBQUMsQ0FBQztBQUVILE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUV2RSxjQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtJQUNqQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7Q0FDbkUsQ0FBQyxDQUFDO0FBRUgsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtJQUM5QyxPQUFPO0lBQ1AsY0FBYztJQUNkLDBCQUEwQixFQUFFO1FBQzFCO1lBQ0UsZ0JBQWdCLEVBQUUsY0FBYztZQUNoQyxNQUFNLEVBQUUsQ0FBQztTQUNWO1FBQ0Q7WUFDRSxnQkFBZ0IsRUFBRSxTQUFTO1lBQzNCLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWVjcy1pbnRlZy1jYXBhY2l0eS1wcm92aWRlcicpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNQQ2x1c3RlcicsIHtcbiAgdnBjLFxuICBjYXBhY2l0eVByb3ZpZGVyczogWydGQVJHQVRFJywgJ0ZBUkdBVEVfU1BPVCddLFxufSk7XG5cbmNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbnRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG59KTtcblxubmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICBjbHVzdGVyLFxuICB0YXNrRGVmaW5pdGlvbixcbiAgY2FwYWNpdHlQcm92aWRlclN0cmF0ZWdpZXM6IFtcbiAgICB7XG4gICAgICBjYXBhY2l0eVByb3ZpZGVyOiAnRkFSR0FURV9TUE9UJyxcbiAgICAgIHdlaWdodDogMixcbiAgICB9LFxuICAgIHtcbiAgICAgIGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFJyxcbiAgICAgIHdlaWdodDogMSxcbiAgICB9LFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuXG4iXX0=
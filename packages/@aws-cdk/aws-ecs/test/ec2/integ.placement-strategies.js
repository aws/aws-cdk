"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
const app = new cdk.App();
class EcsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC');
        const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        });
        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 256,
        });
        new ecs.Ec2Service(this, 'Test_Stack', {
            cluster,
            taskDefinition,
            placementStrategies: [
                ecs.PlacementStrategy.packedByCpu(),
                ecs.PlacementStrategy.packedByMemory(),
            ],
        });
    }
}
new EcsStack(app, 'aws-cdk-ecs-integration-test-stack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGxhY2VtZW50LXN0cmF0ZWdpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wbGFjZW1lbnQtc3RyYXRlZ2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFFckMsaUNBQWlDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sUUFBUyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtZQUM3QyxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7U0FDaEYsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xFLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztZQUNsRSxjQUFjLEVBQUUsR0FBRztTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNyQyxPQUFPO1lBQ1AsY0FBYztZQUNkLG1CQUFtQixFQUFFO2dCQUNuQixHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFO2dCQUNuQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFO2FBQ3ZDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO0FBRXhELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uLy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIEVjc1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZQQycpO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQyLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbih0aGlzLCAnVGFza0RlZicpO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDI1NixcbiAgICB9KTtcblxuICAgIG5ldyBlY3MuRWMyU2VydmljZSh0aGlzLCAnVGVzdF9TdGFjaycsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIHBsYWNlbWVudFN0cmF0ZWdpZXM6IFtcbiAgICAgICAgZWNzLlBsYWNlbWVudFN0cmF0ZWd5LnBhY2tlZEJ5Q3B1KCksXG4gICAgICAgIGVjcy5QbGFjZW1lbnRTdHJhdGVneS5wYWNrZWRCeU1lbW9yeSgpLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG5uZXcgRWNzU3RhY2soYXBwLCAnYXdzLWNkay1lY3MtaW50ZWdyYXRpb24tdGVzdC1zdGFjaycpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
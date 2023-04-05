"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const efs = require("aws-cdk-lib/aws-efs");
const cdk = require("aws-cdk-lib");
const ecs = require("aws-cdk-lib/aws-ecs");
class FargateWithEfsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
        const fs = new efs.FileSystem(this, 'etcdata', {
            vpc: vpc,
        });
        // Just need a TaskDefinition to test this
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        taskDefinition.addVolume({
            name: 'somedata',
            efsVolumeConfiguration: {
                fileSystemId: fs.fileSystemId,
            },
        });
    }
}
const app = new cdk.App();
new FargateWithEfsStack(app, 'aws-ecs-fargate-efs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZmFyZ2F0ZS13aXRoLWVmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmZhcmdhdGUtd2l0aC1lZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUVuQywyQ0FBMkM7QUFHM0MsTUFBTSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDN0MsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCwwQ0FBMEM7UUFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztTQUNuRSxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQ3ZCLElBQUksRUFBRSxVQUFVO1lBQ2hCLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsRUFBRSxDQUFDLFlBQVk7YUFDOUI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBRXBELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVmcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWZzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcblxuXG5jbGFzcyBGYXJnYXRlV2l0aEVmc1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG4gICAgY29uc3QgZnMgPSBuZXcgZWZzLkZpbGVTeXN0ZW0odGhpcywgJ2V0Y2RhdGEnLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICB9KTtcblxuICAgIC8vIEp1c3QgbmVlZCBhIFRhc2tEZWZpbml0aW9uIHRvIHRlc3QgdGhpc1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24odGhpcywgJ1Rhc2tEZWYnKTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICB9KTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRWb2x1bWUoe1xuICAgICAgbmFtZTogJ3NvbWVkYXRhJyxcbiAgICAgIGVmc1ZvbHVtZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgZmlsZVN5c3RlbUlkOiBmcy5maWxlU3lzdGVtSWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgRmFyZ2F0ZVdpdGhFZnNTdGFjayhhcHAsICdhd3MtZWNzLWZhcmdhdGUtZWZzJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19
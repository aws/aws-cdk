"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const efs = require("@aws-cdk/aws-efs");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZmFyZ2F0ZS13aXRoLWVmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmZhcmdhdGUtd2l0aC1lZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUVyQyxpQ0FBaUM7QUFHakMsTUFBTSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDN0MsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCwwQ0FBMEM7UUFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO1lBQ2pDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztTQUNuRSxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQ3ZCLElBQUksRUFBRSxVQUFVO1lBQ2hCLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsRUFBRSxDQUFDLFlBQVk7YUFDOUI7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUMsQ0FBQztBQUVwRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlZnMgZnJvbSAnQGF3cy1jZGsvYXdzLWVmcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICcuLi8uLi9saWInO1xuXG5cbmNsYXNzIEZhcmdhdGVXaXRoRWZzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyBtYXhBenM6IDIgfSk7XG5cbiAgICBjb25zdCBmcyA9IG5ldyBlZnMuRmlsZVN5c3RlbSh0aGlzLCAnZXRjZGF0YScsIHtcbiAgICAgIHZwYzogdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gSnVzdCBuZWVkIGEgVGFza0RlZmluaXRpb24gdG8gdGVzdCB0aGlzXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAnVGFza0RlZicpO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgIH0pO1xuICAgIHRhc2tEZWZpbml0aW9uLmFkZFZvbHVtZSh7XG4gICAgICBuYW1lOiAnc29tZWRhdGEnLFxuICAgICAgZWZzVm9sdW1lQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBmaWxlU3lzdGVtSWQ6IGZzLmZpbGVTeXN0ZW1JZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBGYXJnYXRlV2l0aEVmc1N0YWNrKGFwcCwgJ2F3cy1lY3MtZmFyZ2F0ZS1lZnMnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
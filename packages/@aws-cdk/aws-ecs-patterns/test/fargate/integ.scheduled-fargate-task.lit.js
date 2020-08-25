"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const cdk = require("@aws-cdk/core");
const path = require("path");
const lib_1 = require("../../lib");
const app = new cdk.App();
class EventStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });
        // Create the scheduled task
        new lib_1.ScheduledFargateTask(this, 'ScheduledFargateTask', {
            cluster,
            scheduledFargateTaskImageOptions: {
                image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
                memoryLimitMiB: 512,
                cpu: 256,
                environment: { TRIGGER: 'CloudWatch Events' },
            },
            desiredTaskCount: 2,
            schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
        });
    }
}
new EventStack(app, 'aws-fargate-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2NoZWR1bGVkLWZhcmdhdGUtdGFzay5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zY2hlZHVsZWQtZmFyZ2F0ZS10YXNrLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHFDQUFxQztBQUNyQyw2QkFBNkI7QUFFN0IsbUNBQWlEO0FBRWpELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sVUFBVyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2hDLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRWpFLDRCQUE0QjtRQUM1QixJQUFJLDBCQUFvQixDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUNyRCxPQUFPO1lBQ1AsZ0NBQWdDLEVBQUU7Z0JBQ2hDLEtBQUssRUFBRSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUNuRSxjQUFjLEVBQUUsR0FBRztnQkFDbkIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFO2FBQzlDO1lBQ0QsZ0JBQWdCLEVBQUUsQ0FBQztZQUNuQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDekMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgU2NoZWR1bGVkRmFyZ2F0ZVRhc2sgfSBmcm9tICcuLi8uLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jbGFzcyBFdmVudFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAxIH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0ZhcmdhdGVDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHNjaGVkdWxlZCB0YXNrXG4gICAgbmV3IFNjaGVkdWxlZEZhcmdhdGVUYXNrKHRoaXMsICdTY2hlZHVsZWRGYXJnYXRlVGFzaycsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBzY2hlZHVsZWRGYXJnYXRlVGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogbmV3IGVjcy5Bc3NldEltYWdlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdkZW1vLWltYWdlJykpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgZW52aXJvbm1lbnQ6IHsgVFJJR0dFUjogJ0Nsb3VkV2F0Y2ggRXZlbnRzJyB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRUYXNrQ291bnQ6IDIsXG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMikpLFxuICAgIH0pO1xuICB9XG59XG5cbm5ldyBFdmVudFN0YWNrKGFwcCwgJ2F3cy1mYXJnYXRlLWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../../lib");
const app = new cdk.App();
class EventStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        /// !show
        // Create the scheduled task
        new lib_1.ScheduledEc2Task(this, 'ScheduledEc2Task', {
            cluster,
            scheduledEc2TaskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
                cpu: 1,
                environment: { TRIGGER: 'CloudWatch Events' },
            },
            desiredTaskCount: 2,
            schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
        });
        /// !hide
    }
}
new EventStack(app, 'aws-ecs-integ-ecs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2NoZWR1bGVkLWVjcy10YXNrLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNjaGVkdWxlZC1lY3MtdGFzay5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFFckMsbUNBQTZDO0FBRTdDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sVUFBVyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2hDLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO1lBQzdDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1NBQy9DLENBQUMsQ0FBQztRQUVILFNBQVM7UUFDVCw0QkFBNEI7UUFDNUIsSUFBSSxzQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDN0MsT0FBTztZQUNQLDRCQUE0QixFQUFFO2dCQUM1QixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7Z0JBQ2xFLGNBQWMsRUFBRSxHQUFHO2dCQUNuQixHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUU7YUFDOUM7WUFDRCxnQkFBZ0IsRUFBRSxDQUFDO1lBQ25CLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RCxDQUFDLENBQUM7UUFDSCxTQUFTO0lBQ1gsQ0FBQztDQUNGO0FBRUQsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDekMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5pbXBvcnQgeyBTY2hlZHVsZWRFYzJUYXNrIH0gZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY2xhc3MgRXZlbnRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMSB9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgfSk7XG5cbiAgICAvLy8gIXNob3dcbiAgICAvLyBDcmVhdGUgdGhlIHNjaGVkdWxlZCB0YXNrXG4gICAgbmV3IFNjaGVkdWxlZEVjMlRhc2sodGhpcywgJ1NjaGVkdWxlZEVjMlRhc2snLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgc2NoZWR1bGVkRWMyVGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIGNwdTogMSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHsgVFJJR0dFUjogJ0Nsb3VkV2F0Y2ggRXZlbnRzJyB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRUYXNrQ291bnQ6IDIsXG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuICB9XG59XG5cbm5ldyBFdmVudFN0YWNrKGFwcCwgJ2F3cy1lY3MtaW50ZWctZWNzJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
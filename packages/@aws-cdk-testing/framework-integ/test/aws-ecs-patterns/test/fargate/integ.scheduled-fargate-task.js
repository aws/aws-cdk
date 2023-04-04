"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const events = require("aws-cdk-lib/aws-events");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const app = new cdk.App();
class EventStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
        const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });
        // Create the scheduled task
        new aws_ecs_patterns_1.ScheduledFargateTask(this, 'ScheduledFargateTask', {
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
const myStack = new EventStack(app, 'aws-fargate-integ');
new integ.IntegTest(app, 'publicQueueProcessingFargateServiceTest', {
    testCases: [myStack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2NoZWR1bGVkLWZhcmdhdGUtdGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNjaGVkdWxlZC1mYXJnYXRlLXRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCxtRUFBb0U7QUFFcEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxVQUFXLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDaEMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFakUsNEJBQTRCO1FBQzVCLElBQUksdUNBQW9CLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQ3JELE9BQU87WUFDUCxnQ0FBZ0MsRUFBRTtnQkFDaEMsS0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ25FLGNBQWMsRUFBRSxHQUFHO2dCQUNuQixHQUFHLEVBQUUsR0FBRztnQkFDUixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUU7YUFDOUM7WUFDRCxnQkFBZ0IsRUFBRSxDQUFDO1lBQ25CLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUV6RCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxFQUFFO0lBQ2xFLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNyQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IFNjaGVkdWxlZEZhcmdhdGVUYXNrIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcy1wYXR0ZXJucyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIEV2ZW50U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyBtYXhBenM6IDEgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIENyZWF0ZSB0aGUgc2NoZWR1bGVkIHRhc2tcbiAgICBuZXcgU2NoZWR1bGVkRmFyZ2F0ZVRhc2sodGhpcywgJ1NjaGVkdWxlZEZhcmdhdGVUYXNrJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHNjaGVkdWxlZEZhcmdhdGVUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBuZXcgZWNzLkFzc2V0SW1hZ2UocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2RlbW8taW1hZ2UnKSksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIGNwdTogMjU2LFxuICAgICAgICBlbnZpcm9ubWVudDogeyBUUklHR0VSOiAnQ2xvdWRXYXRjaCBFdmVudHMnIH0sXG4gICAgICB9LFxuICAgICAgZGVzaXJlZFRhc2tDb3VudDogMixcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygyKSksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgbXlTdGFjayA9IG5ldyBFdmVudFN0YWNrKGFwcCwgJ2F3cy1mYXJnYXRlLWludGVnJyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAncHVibGljUXVldWVQcm9jZXNzaW5nRmFyZ2F0ZVNlcnZpY2VUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtteVN0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
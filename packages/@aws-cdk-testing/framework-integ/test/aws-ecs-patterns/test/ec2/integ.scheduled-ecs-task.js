"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
        });
        /// !show
        // Create the scheduled task
        new aws_ecs_patterns_1.ScheduledEc2Task(this, 'ScheduledEc2Task', {
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
const myStack = new EventStack(app, 'aws-ecs-integ-ecs');
new integ.IntegTest(app, 'scheduledEc2TaskTest', {
    testCases: [myStack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2NoZWR1bGVkLWVjcy10YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc2NoZWR1bGVkLWVjcy10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCxtRUFBZ0U7QUFFaEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxVQUFXLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDaEMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUU7WUFDN0MsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsU0FBUztRQUNULDRCQUE0QjtRQUM1QixJQUFJLG1DQUFnQixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUM3QyxPQUFPO1lBQ1AsNEJBQTRCLEVBQUU7Z0JBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztnQkFDbEUsY0FBYyxFQUFFLEdBQUc7Z0JBQ25CLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTthQUM5QztZQUNELGdCQUFnQixFQUFFLENBQUM7WUFDbkIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hELENBQUMsQ0FBQztRQUNILFNBQVM7SUFDWCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUV6RCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHNCQUFzQixFQUFFO0lBQy9DLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNyQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgU2NoZWR1bGVkRWMyVGFzayB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jbGFzcyBFdmVudFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAxIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICB9KTtcblxuICAgIC8vLyAhc2hvd1xuICAgIC8vIENyZWF0ZSB0aGUgc2NoZWR1bGVkIHRhc2tcbiAgICBuZXcgU2NoZWR1bGVkRWMyVGFzayh0aGlzLCAnU2NoZWR1bGVkRWMyVGFzaycsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBzY2hlZHVsZWRFYzJUYXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgY3B1OiAxLFxuICAgICAgICBlbnZpcm9ubWVudDogeyBUUklHR0VSOiAnQ2xvdWRXYXRjaCBFdmVudHMnIH0sXG4gICAgICB9LFxuICAgICAgZGVzaXJlZFRhc2tDb3VudDogMixcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgfSk7XG4gICAgLy8vICFoaWRlXG4gIH1cbn1cblxuY29uc3QgbXlTdGFjayA9IG5ldyBFdmVudFN0YWNrKGFwcCwgJ2F3cy1lY3MtaW50ZWctZWNzJyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnc2NoZWR1bGVkRWMyVGFza1Rlc3QnLCB7XG4gIHRlc3RDYXNlczogW215U3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ2');
const cluster = new ecs.Cluster(stack, 'FargateCluster');
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});
// Build task definition
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
const containerDefinition = taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
    memoryLimitMiB: 256,
    logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});
// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
    result: sfn.Result.fromObject({ SomeKey: 'SomeValue' }),
}).next(new sfn.Task(stack, 'Run', {
    task: new tasks.RunEcsEc2Task({
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        cluster,
        taskDefinition,
        containerOverrides: [
            {
                containerDefinition,
                environment: [
                    {
                        name: 'SOME_KEY',
                        value: sfn.JsonPath.stringAt('$.SomeKey'),
                    },
                ],
            },
        ],
    }),
}));
new sfn.StateMachine(stack, 'StateMachine', {
    definition,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWMyLXRhc2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5lYzItdGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHFEQUFxRDtBQUNyRCxtQ0FBbUM7QUFDbkMsNkRBQTZEO0FBRTdELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUVuRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDekQsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtJQUM3QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUM5QyxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7Q0FDbEQsQ0FBQyxDQUFDO0FBRUgsd0JBQXdCO0FBQ3hCLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxNQUFNLG1CQUFtQixHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFO0lBQ3RFLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xGLGNBQWMsRUFBRSxHQUFHO0lBQ25CLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLENBQUM7Q0FDN0QsQ0FBQyxDQUFDO0FBRUgsc0JBQXNCO0FBQ3RCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQzlDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQztDQUN4RCxDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ3pCLElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDNUIsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLHlCQUF5QixDQUFDLElBQUk7UUFDdEQsT0FBTztRQUNQLGNBQWM7UUFDZCxrQkFBa0IsRUFBRTtZQUNsQjtnQkFDRSxtQkFBbUI7Z0JBQ25CLFdBQVcsRUFBRTtvQkFDWDt3QkFDRSxJQUFJLEVBQUUsVUFBVTt3QkFDaEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztxQkFDMUM7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztDQUNILENBQUMsQ0FDSCxDQUFDO0FBRUYsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDMUMsVUFBVTtDQUNYLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtZWNzLWludGVnMicpO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInKTtcbmNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxuICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxufSk7XG5cbi8vIEJ1aWxkIHRhc2sgZGVmaW5pdGlvblxuY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuY29uc3QgY29udGFpbmVyRGVmaW5pdGlvbiA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignVGhlQ29udGFpbmVyJywge1xuICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldChwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZXZlbnRoYW5kbGVyLWltYWdlJykpLFxuICBtZW1vcnlMaW1pdE1pQjogMjU2LFxuICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7IHN0cmVhbVByZWZpeDogJ0V2ZW50RGVtbycgfSksXG59KTtcblxuLy8gQnVpbGQgc3RhdGUgbWFjaGluZVxuY29uc3QgZGVmaW5pdGlvbiA9IG5ldyBzZm4uUGFzcyhzdGFjaywgJ1N0YXJ0Jywge1xuICByZXN1bHQ6IHNmbi5SZXN1bHQuZnJvbU9iamVjdCh7IFNvbWVLZXk6ICdTb21lVmFsdWUnIH0pLFxufSkubmV4dChcbiAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnUnVuJywge1xuICAgIHRhc2s6IG5ldyB0YXNrcy5SdW5FY3NFYzJUYXNrKHtcbiAgICAgIGludGVncmF0aW9uUGF0dGVybjogc2ZuLlNlcnZpY2VJbnRlZ3JhdGlvblBhdHRlcm4uU1lOQyxcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIGNvbnRhaW5lck92ZXJyaWRlczogW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGFpbmVyRGVmaW5pdGlvbixcbiAgICAgICAgICBlbnZpcm9ubWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnU09NRV9LRVknLFxuICAgICAgICAgICAgICB2YWx1ZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLlNvbWVLZXknKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIH0pLFxuKTtcblxubmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gIGRlZmluaXRpb24sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
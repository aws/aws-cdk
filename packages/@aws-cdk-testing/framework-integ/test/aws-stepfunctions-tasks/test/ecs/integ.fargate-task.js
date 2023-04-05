"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ2');
const cluster = new ecs.Cluster(stack, 'FargateCluster');
// Build task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
    memoryLimitMiB: 512,
    cpu: 256,
});
const containerDefinition = taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'eventhandler-image')),
    memoryLimitMiB: 256,
    logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' }),
});
// Build state machine
const definition = new sfn.Pass(stack, 'Start', {
    result: sfn.Result.fromObject({ SomeKey: 'SomeValue' }),
}).next(new sfn.Task(stack, 'FargateTask', {
    task: new tasks.RunEcsFargateTask({
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        cluster,
        taskDefinition,
        assignPublicIp: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZmFyZ2F0ZS10YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZmFyZ2F0ZS10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQyxxREFBcUQ7QUFDckQsbUNBQW1DO0FBQ25DLDZEQUE2RDtBQUU3RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFbkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRXpELHdCQUF3QjtBQUN4QixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ3JFLGNBQWMsRUFBRSxHQUFHO0lBQ25CLEdBQUcsRUFBRSxHQUFHO0NBQ1QsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtJQUN0RSxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUNsRixjQUFjLEVBQUUsR0FBRztJQUNuQixPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxDQUFDO0NBQzdELENBQUMsQ0FBQztBQUVILHNCQUFzQjtBQUN0QixNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUM5QyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUM7Q0FDeEQsQ0FBQyxDQUFDLElBQUksQ0FDTCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtJQUNqQyxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7UUFDaEMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLHlCQUF5QixDQUFDLElBQUk7UUFDdEQsT0FBTztRQUNQLGNBQWM7UUFDZCxjQUFjLEVBQUUsSUFBSTtRQUNwQixrQkFBa0IsRUFBRTtZQUNsQjtnQkFDRSxtQkFBbUI7Z0JBQ25CLFdBQVcsRUFBRTtvQkFDWDt3QkFDRSxJQUFJLEVBQUUsVUFBVTt3QkFDaEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztxQkFDMUM7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztDQUNILENBQUMsQ0FDSCxDQUFDO0FBRUYsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDMUMsVUFBVTtDQUNYLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtZWNzLWludGVnMicpO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInKTtcblxuLy8gQnVpbGQgdGFzayBkZWZpbml0aW9uXG5jb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicsIHtcbiAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgY3B1OiAyNTYsXG59KTtcbmNvbnN0IGNvbnRhaW5lckRlZmluaXRpb24gPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ1RoZUNvbnRhaW5lcicsIHtcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tQXNzZXQocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2V2ZW50aGFuZGxlci1pbWFnZScpKSxcbiAgbWVtb3J5TGltaXRNaUI6IDI1NixcbiAgbG9nZ2luZzogbmV3IGVjcy5Bd3NMb2dEcml2ZXIoeyBzdHJlYW1QcmVmaXg6ICdFdmVudERlbW8nIH0pLFxufSk7XG5cbi8vIEJ1aWxkIHN0YXRlIG1hY2hpbmVcbmNvbnN0IGRlZmluaXRpb24gPSBuZXcgc2ZuLlBhc3Moc3RhY2ssICdTdGFydCcsIHtcbiAgcmVzdWx0OiBzZm4uUmVzdWx0LmZyb21PYmplY3QoeyBTb21lS2V5OiAnU29tZVZhbHVlJyB9KSxcbn0pLm5leHQoXG4gIG5ldyBzZm4uVGFzayhzdGFjaywgJ0ZhcmdhdGVUYXNrJywge1xuICAgIHRhc2s6IG5ldyB0YXNrcy5SdW5FY3NGYXJnYXRlVGFzayh7XG4gICAgICBpbnRlZ3JhdGlvblBhdHRlcm46IHNmbi5TZXJ2aWNlSW50ZWdyYXRpb25QYXR0ZXJuLlNZTkMsXG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZSxcbiAgICAgIGNvbnRhaW5lck92ZXJyaWRlczogW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGFpbmVyRGVmaW5pdGlvbixcbiAgICAgICAgICBlbnZpcm9ubWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnU09NRV9LRVknLFxuICAgICAgICAgICAgICB2YWx1ZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLlNvbWVLZXknKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIH0pLFxuKTtcblxubmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gIGRlZmluaXRpb24sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const batch = require("aws-cdk-lib/aws-batch");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws batch list-jobs --job-queue <deployed job queue name or arn> --job-status RUNNABLE : should return jobs-list with size greater than 0
 * *
 * * aws batch describe-jobs --jobs <job-id returned by list-jobs> --query 'jobs[0].status': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 */
class RunBatchStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'vpc', { restrictDefaultSecurityGroup: false });
        const batchQueue = new batch.JobQueue(this, 'JobQueue', {
            computeEnvironments: [
                {
                    order: 1,
                    computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(this, 'ComputeEnv', {
                        vpc,
                    }),
                },
            ],
        });
        const batchJobDefinition = new batch.EcsJobDefinition(this, 'JobDefinition', {
            container: new batch.EcsEc2ContainerDefinition(this, 'Container', {
                image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'batchjob-image')),
                cpu: 256,
                memory: cdk.Size.mebibytes(2048),
            }),
        });
        const submitJob = new aws_stepfunctions_tasks_1.BatchSubmitJob(this, 'Submit Job', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobQueueArn: batchQueue.jobQueueArn,
            jobName: 'MyJob',
            containerOverrides: {
                environment: { key: 'value' },
                memory: cdk.Size.mebibytes(256),
                vcpus: 1,
            },
            payload: sfn.TaskInput.fromObject({
                foo: sfn.JsonPath.stringAt('$.bar'),
            }),
            attempts: 3,
            taskTimeout: sfn.Timeout.duration(cdk.Duration.seconds(60)),
            tags: {
                key: 'value',
            },
        });
        const definition = new sfn.Pass(this, 'Start', {
            result: sfn.Result.fromObject({ bar: 'SomeValue' }),
        }).next(submitJob);
        const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition,
        });
        new cdk.CfnOutput(this, 'JobQueueArn', {
            value: batchQueue.jobQueueArn,
        });
        new cdk.CfnOutput(this, 'StateMachineArn', {
            value: stateMachine.stateMachineArn,
        });
    }
}
const app = new cdk.App();
new RunBatchStack(app, 'aws-stepfunctions-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3VibWl0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnN1Ym1pdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyxpRkFBcUU7QUFFckU7Ozs7Ozs7R0FPRztBQUVILE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU5RSxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBQ1Isa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTt3QkFDaEYsR0FBRztxQkFDSixDQUFDO2lCQUNIO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDM0UsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBQ2hFLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FDMUM7Z0JBQ0QsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSx3Q0FBYyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDdkQsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCO1lBQ3JELFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsT0FBTztZQUNoQixrQkFBa0IsRUFBRTtnQkFDbEIsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtnQkFDN0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUNwQyxDQUFDO1lBQ0YsUUFBUSxFQUFFLENBQUM7WUFDWCxXQUFXLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0QsSUFBSSxFQUFFO2dCQUNKLEdBQUcsRUFBRSxPQUFPO2FBQ2I7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUM3QyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUM7U0FDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVuQixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM5RCxVQUFVO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDckMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxXQUFXO1NBQzlCLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2xELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBiYXRjaCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYmF0Y2gnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBCYXRjaFN1Ym1pdEpvYiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIHN0ZXBmdW5jdGlvbnMgc3RhcnQtZXhlY3V0aW9uIC0tc3RhdGUtbWFjaGluZS1hcm4gPGRlcGxveWVkIHN0YXRlIG1hY2hpbmUgYXJuPiA6IHNob3VsZCByZXR1cm4gZXhlY3V0aW9uIGFyblxuICogKiBhd3MgYmF0Y2ggbGlzdC1qb2JzIC0tam9iLXF1ZXVlIDxkZXBsb3llZCBqb2IgcXVldWUgbmFtZSBvciBhcm4+IC0tam9iLXN0YXR1cyBSVU5OQUJMRSA6IHNob3VsZCByZXR1cm4gam9icy1saXN0IHdpdGggc2l6ZSBncmVhdGVyIHRoYW4gMFxuICogKlxuICogKiBhd3MgYmF0Y2ggZGVzY3JpYmUtam9icyAtLWpvYnMgPGpvYi1pZCByZXR1cm5lZCBieSBsaXN0LWpvYnM+IC0tcXVlcnkgJ2pvYnNbMF0uc3RhdHVzJzogd2FpdCB1bnRpbCB0aGUgc3RhdHVzIGlzICdTVUNDRUVERUQnXG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN1dGlvbi1hcm4gZ2VuZXJhdGVkIGJlZm9yZT4gLS1xdWVyeSAnc3RhdHVzJzogc2hvdWxkIHJldHVybiBzdGF0dXMgYXMgU1VDQ0VFREVEXG4gKi9cblxuY2xhc3MgUnVuQmF0Y2hTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ3ZwYycsIHsgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UgfSk7XG5cbiAgICBjb25zdCBiYXRjaFF1ZXVlID0gbmV3IGJhdGNoLkpvYlF1ZXVlKHRoaXMsICdKb2JRdWV1ZScsIHtcbiAgICAgIGNvbXB1dGVFbnZpcm9ubWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgIGNvbXB1dGVFbnZpcm9ubWVudDogbmV3IGJhdGNoLk1hbmFnZWRFYzJFY3NDb21wdXRlRW52aXJvbm1lbnQodGhpcywgJ0NvbXB1dGVFbnYnLCB7XG4gICAgICAgICAgICB2cGMsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYmF0Y2hKb2JEZWZpbml0aW9uID0gbmV3IGJhdGNoLkVjc0pvYkRlZmluaXRpb24odGhpcywgJ0pvYkRlZmluaXRpb24nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBiYXRjaC5FY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHRoaXMsICdDb250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUFzc2V0KFxuICAgICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdiYXRjaGpvYi1pbWFnZScpLFxuICAgICAgICApLFxuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgbWVtb3J5OiBjZGsuU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN1Ym1pdEpvYiA9IG5ldyBCYXRjaFN1Ym1pdEpvYih0aGlzLCAnU3VibWl0IEpvYicsIHtcbiAgICAgIGpvYkRlZmluaXRpb25Bcm46IGJhdGNoSm9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uQXJuLFxuICAgICAgam9iUXVldWVBcm46IGJhdGNoUXVldWUuam9iUXVldWVBcm4sXG4gICAgICBqb2JOYW1lOiAnTXlKb2InLFxuICAgICAgY29udGFpbmVyT3ZlcnJpZGVzOiB7XG4gICAgICAgIGVudmlyb25tZW50OiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgICBtZW1vcnk6IGNkay5TaXplLm1lYmlieXRlcygyNTYpLFxuICAgICAgICB2Y3B1czogMSxcbiAgICAgIH0sXG4gICAgICBwYXlsb2FkOiBzZm4uVGFza0lucHV0LmZyb21PYmplY3Qoe1xuICAgICAgICBmb286IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5iYXInKSxcbiAgICAgIH0pLFxuICAgICAgYXR0ZW1wdHM6IDMsXG4gICAgICB0YXNrVGltZW91dDogc2ZuLlRpbWVvdXQuZHVyYXRpb24oY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApKSxcbiAgICAgIHRhZ3M6IHtcbiAgICAgICAga2V5OiAndmFsdWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBuZXcgc2ZuLlBhc3ModGhpcywgJ1N0YXJ0Jywge1xuICAgICAgcmVzdWx0OiBzZm4uUmVzdWx0LmZyb21PYmplY3QoeyBiYXI6ICdTb21lVmFsdWUnIH0pLFxuICAgIH0pLm5leHQoc3VibWl0Sm9iKTtcblxuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHRoaXMsICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0pvYlF1ZXVlQXJuJywge1xuICAgICAgdmFsdWU6IGJhdGNoUXVldWUuam9iUXVldWVBcm4sXG4gICAgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1N0YXRlTWFjaGluZUFybicsIHtcbiAgICAgIHZhbHVlOiBzdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lQXJuLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgUnVuQmF0Y2hTdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy1pbnRlZycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=
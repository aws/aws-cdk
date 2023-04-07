"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const batch = require("@aws-cdk/aws-batch-alpha");
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
        const vpc = new ec2.Vpc(this, 'vpc');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3VibWl0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnN1Ym1pdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isa0RBQWtEO0FBQ2xELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyxpRkFBcUU7QUFFckU7Ozs7Ozs7R0FPRztBQUVILE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFckMsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUNSLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7d0JBQ2hGLEdBQUc7cUJBQ0osQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzNFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUNoRSxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQzFDO2dCQUNELEdBQUcsRUFBRSxHQUFHO2dCQUNSLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7YUFDakMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksd0NBQWMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3ZELGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGdCQUFnQjtZQUNyRCxXQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLE9BQU87WUFDaEIsa0JBQWtCLEVBQUU7Z0JBQ2xCLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7Z0JBQzdCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7Z0JBQy9CLEtBQUssRUFBRSxDQUFDO2FBQ1Q7WUFDRCxPQUFPLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ2hDLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFDcEMsQ0FBQztZQUNGLFFBQVEsRUFBRSxDQUFDO1lBQ1gsV0FBVyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzVELENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQztTQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzlELFVBQVU7U0FDWCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFdBQVc7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxLQUFLLEVBQUUsWUFBWSxDQUFDLGVBQWU7U0FDcEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFDbEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGJhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1iYXRjaC1hbHBoYSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEJhdGNoU3VibWl0Sm9iIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MnO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8ZGVwbG95ZWQgc3RhdGUgbWFjaGluZSBhcm4+IDogc2hvdWxkIHJldHVybiBleGVjdXRpb24gYXJuXG4gKiAqIGF3cyBiYXRjaCBsaXN0LWpvYnMgLS1qb2ItcXVldWUgPGRlcGxveWVkIGpvYiBxdWV1ZSBuYW1lIG9yIGFybj4gLS1qb2Itc3RhdHVzIFJVTk5BQkxFIDogc2hvdWxkIHJldHVybiBqb2JzLWxpc3Qgd2l0aCBzaXplIGdyZWF0ZXIgdGhhbiAwXG4gKiAqXG4gKiAqIGF3cyBiYXRjaCBkZXNjcmliZS1qb2JzIC0tam9icyA8am9iLWlkIHJldHVybmVkIGJ5IGxpc3Qtam9icz4gLS1xdWVyeSAnam9ic1swXS5zdGF0dXMnOiB3YWl0IHVudGlsIHRoZSBzdGF0dXMgaXMgJ1NVQ0NFRURFRCdcbiAqICogYXdzIHN0ZXBmdW5jdGlvbnMgZGVzY3JpYmUtZXhlY3V0aW9uIC0tZXhlY3V0aW9uLWFybiA8ZXhlY3V0aW9uLWFybiBnZW5lcmF0ZWQgYmVmb3JlPiAtLXF1ZXJ5ICdzdGF0dXMnOiBzaG91bGQgcmV0dXJuIHN0YXR1cyBhcyBTVUNDRUVERURcbiAqL1xuXG5jbGFzcyBSdW5CYXRjaFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAndnBjJyk7XG5cbiAgICBjb25zdCBiYXRjaFF1ZXVlID0gbmV3IGJhdGNoLkpvYlF1ZXVlKHRoaXMsICdKb2JRdWV1ZScsIHtcbiAgICAgIGNvbXB1dGVFbnZpcm9ubWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgIGNvbXB1dGVFbnZpcm9ubWVudDogbmV3IGJhdGNoLk1hbmFnZWRFYzJFY3NDb21wdXRlRW52aXJvbm1lbnQodGhpcywgJ0NvbXB1dGVFbnYnLCB7XG4gICAgICAgICAgICB2cGMsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYmF0Y2hKb2JEZWZpbml0aW9uID0gbmV3IGJhdGNoLkVjc0pvYkRlZmluaXRpb24odGhpcywgJ0pvYkRlZmluaXRpb24nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBiYXRjaC5FY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHRoaXMsICdDb250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUFzc2V0KFxuICAgICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdiYXRjaGpvYi1pbWFnZScpLFxuICAgICAgICApLFxuICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgbWVtb3J5OiBjZGsuU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN1Ym1pdEpvYiA9IG5ldyBCYXRjaFN1Ym1pdEpvYih0aGlzLCAnU3VibWl0IEpvYicsIHtcbiAgICAgIGpvYkRlZmluaXRpb25Bcm46IGJhdGNoSm9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uQXJuLFxuICAgICAgam9iUXVldWVBcm46IGJhdGNoUXVldWUuam9iUXVldWVBcm4sXG4gICAgICBqb2JOYW1lOiAnTXlKb2InLFxuICAgICAgY29udGFpbmVyT3ZlcnJpZGVzOiB7XG4gICAgICAgIGVudmlyb25tZW50OiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgICBtZW1vcnk6IGNkay5TaXplLm1lYmlieXRlcygyNTYpLFxuICAgICAgICB2Y3B1czogMSxcbiAgICAgIH0sXG4gICAgICBwYXlsb2FkOiBzZm4uVGFza0lucHV0LmZyb21PYmplY3Qoe1xuICAgICAgICBmb286IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5iYXInKSxcbiAgICAgIH0pLFxuICAgICAgYXR0ZW1wdHM6IDMsXG4gICAgICB0YXNrVGltZW91dDogc2ZuLlRpbWVvdXQuZHVyYXRpb24oY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBuZXcgc2ZuLlBhc3ModGhpcywgJ1N0YXJ0Jywge1xuICAgICAgcmVzdWx0OiBzZm4uUmVzdWx0LmZyb21PYmplY3QoeyBiYXI6ICdTb21lVmFsdWUnIH0pLFxuICAgIH0pLm5leHQoc3VibWl0Sm9iKTtcblxuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHRoaXMsICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0pvYlF1ZXVlQXJuJywge1xuICAgICAgdmFsdWU6IGJhdGNoUXVldWUuam9iUXVldWVBcm4sXG4gICAgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1N0YXRlTWFjaGluZUFybicsIHtcbiAgICAgIHZhbHVlOiBzdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lQXJuLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgUnVuQmF0Y2hTdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy1pbnRlZycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=
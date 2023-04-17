"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const batch = require("@aws-cdk/aws-batch-alpha");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws batch list-jobs --job-queue <deployed job queue name or arn> --job-status RUNNABLE : should return jobs-list with size greater than 0
 * *
 * * aws batch describe-jobs --jobs <job-id returned by list-jobs> --query 'jobs[0].status': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> --query 'status': should return status as SUCCEEDED
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
        const submitJob = new sfn.Task(this, 'Submit Job', {
            task: new tasks.RunBatchJob({
                jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                jobName: 'MyJob',
                jobQueueArn: batchQueue.jobQueueArn,
                containerOverrides: {
                    environment: { key: 'value' },
                    memory: 256,
                    vcpus: 1,
                },
                payload: {
                    foo: sfn.JsonPath.stringAt('$.bar'),
                },
                attempts: 3,
                timeout: cdk.Duration.seconds(60),
            }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucnVuLWJhdGNoLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJ1bi1iYXRjaC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isa0RBQWtEO0FBQ2xELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyw2REFBNkQ7QUFFN0Q7Ozs7Ozs7R0FPRztBQUVILE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFckMsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUNSLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7d0JBQ2hGLEdBQUc7cUJBQ0osQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzNFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUNoRSxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQzFDO2dCQUNELEdBQUcsRUFBRSxHQUFHO2dCQUNSLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7YUFDakMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2pELElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLGdCQUFnQjtnQkFDckQsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVztnQkFDbkMsa0JBQWtCLEVBQUU7b0JBQ2xCLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7b0JBQzdCLE1BQU0sRUFBRSxHQUFHO29CQUNYLEtBQUssRUFBRSxDQUFDO2lCQUNUO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2lCQUNwQztnQkFDRCxRQUFRLEVBQUUsQ0FBQztnQkFDWCxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2FBQ2xDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUM3QyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUM7U0FDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVuQixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM5RCxVQUFVO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDckMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxXQUFXO1NBQzlCLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2xELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBiYXRjaCBmcm9tICdAYXdzLWNkay9hd3MtYmF0Y2gtYWxwaGEnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyB0YXNrcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIHN0YXJ0LWV4ZWN1dGlvbiAtLXN0YXRlLW1hY2hpbmUtYXJuIDxkZXBsb3llZCBzdGF0ZSBtYWNoaW5lIGFybj4gOiBzaG91bGQgcmV0dXJuIGV4ZWN1dGlvbiBhcm5cbiAqICogYXdzIGJhdGNoIGxpc3Qtam9icyAtLWpvYi1xdWV1ZSA8ZGVwbG95ZWQgam9iIHF1ZXVlIG5hbWUgb3IgYXJuPiAtLWpvYi1zdGF0dXMgUlVOTkFCTEUgOiBzaG91bGQgcmV0dXJuIGpvYnMtbGlzdCB3aXRoIHNpemUgZ3JlYXRlciB0aGFuIDBcbiAqICpcbiAqICogYXdzIGJhdGNoIGRlc2NyaWJlLWpvYnMgLS1qb2JzIDxqb2ItaWQgcmV0dXJuZWQgYnkgbGlzdC1qb2JzPiAtLXF1ZXJ5ICdqb2JzWzBdLnN0YXR1cyc6IHdhaXQgdW50aWwgdGhlIHN0YXR1cyBpcyAnU1VDQ0VFREVEJ1xuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBkZXNjcmliZS1leGVjdXRpb24gLS1leGVjdXRpb24tYXJuIDxleGVjdGlvbi1hcm4gZ2VuZXJhdGVkIGJlZm9yZT4gLS1xdWVyeSAnc3RhdHVzJzogc2hvdWxkIHJldHVybiBzdGF0dXMgYXMgU1VDQ0VFREVEXG4gKi9cblxuY2xhc3MgUnVuQmF0Y2hTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ3ZwYycpO1xuXG4gICAgY29uc3QgYmF0Y2hRdWV1ZSA9IG5ldyBiYXRjaC5Kb2JRdWV1ZSh0aGlzLCAnSm9iUXVldWUnLCB7XG4gICAgICBjb21wdXRlRW52aXJvbm1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgICBjb21wdXRlRW52aXJvbm1lbnQ6IG5ldyBiYXRjaC5NYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50KHRoaXMsICdDb21wdXRlRW52Jywge1xuICAgICAgICAgICAgdnBjLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJhdGNoSm9iRGVmaW5pdGlvbiA9IG5ldyBiYXRjaC5FY3NKb2JEZWZpbml0aW9uKHRoaXMsICdKb2JEZWZpbml0aW9uJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgYmF0Y2guRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbih0aGlzLCAnQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldChcbiAgICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnYmF0Y2hqb2ItaW1hZ2UnKSxcbiAgICAgICAgKSxcbiAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgIG1lbW9yeTogY2RrLlNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdWJtaXRKb2IgPSBuZXcgc2ZuLlRhc2sodGhpcywgJ1N1Ym1pdCBKb2InLCB7XG4gICAgICB0YXNrOiBuZXcgdGFza3MuUnVuQmF0Y2hKb2Ioe1xuICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgam9iTmFtZTogJ015Sm9iJyxcbiAgICAgICAgam9iUXVldWVBcm46IGJhdGNoUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgIGNvbnRhaW5lck92ZXJyaWRlczoge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgICAgIG1lbW9yeTogMjU2LFxuICAgICAgICAgIHZjcHVzOiAxLFxuICAgICAgICB9LFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgZm9vOiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuYmFyJyksXG4gICAgICAgIH0sXG4gICAgICAgIGF0dGVtcHRzOiAzLFxuICAgICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBuZXcgc2ZuLlBhc3ModGhpcywgJ1N0YXJ0Jywge1xuICAgICAgcmVzdWx0OiBzZm4uUmVzdWx0LmZyb21PYmplY3QoeyBiYXI6ICdTb21lVmFsdWUnIH0pLFxuICAgIH0pLm5leHQoc3VibWl0Sm9iKTtcblxuICAgIGNvbnN0IHN0YXRlTWFjaGluZSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHRoaXMsICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0pvYlF1ZXVlQXJuJywge1xuICAgICAgdmFsdWU6IGJhdGNoUXVldWUuam9iUXVldWVBcm4sXG4gICAgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1N0YXRlTWFjaGluZUFybicsIHtcbiAgICAgIHZhbHVlOiBzdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lQXJuLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgUnVuQmF0Y2hTdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy1pbnRlZycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=
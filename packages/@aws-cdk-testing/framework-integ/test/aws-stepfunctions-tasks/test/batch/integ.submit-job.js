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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3VibWl0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnN1Ym1pdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isa0RBQWtEO0FBQ2xELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyxpRkFBcUU7QUFFckU7Ozs7Ozs7R0FPRztBQUVILE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU5RSxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBQ1Isa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTt3QkFDaEYsR0FBRztxQkFDSixDQUFDO2lCQUNIO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDM0UsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBQ2hFLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FDMUM7Z0JBQ0QsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSx3Q0FBYyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDdkQsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCO1lBQ3JELFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsT0FBTztZQUNoQixrQkFBa0IsRUFBRTtnQkFDbEIsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtnQkFDN0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELE9BQU8sRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUNwQyxDQUFDO1lBQ0YsUUFBUSxFQUFFLENBQUM7WUFDWCxXQUFXLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDN0MsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDO1NBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbkIsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDOUQsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3JDLEtBQUssRUFBRSxVQUFVLENBQUMsV0FBVztTQUM5QixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pDLEtBQUssRUFBRSxZQUFZLENBQUMsZUFBZTtTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLGFBQWEsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUNsRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgYmF0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWJhdGNoLWFscGhhJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQmF0Y2hTdWJtaXRKb2IgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIHN0YXJ0LWV4ZWN1dGlvbiAtLXN0YXRlLW1hY2hpbmUtYXJuIDxkZXBsb3llZCBzdGF0ZSBtYWNoaW5lIGFybj4gOiBzaG91bGQgcmV0dXJuIGV4ZWN1dGlvbiBhcm5cbiAqICogYXdzIGJhdGNoIGxpc3Qtam9icyAtLWpvYi1xdWV1ZSA8ZGVwbG95ZWQgam9iIHF1ZXVlIG5hbWUgb3IgYXJuPiAtLWpvYi1zdGF0dXMgUlVOTkFCTEUgOiBzaG91bGQgcmV0dXJuIGpvYnMtbGlzdCB3aXRoIHNpemUgZ3JlYXRlciB0aGFuIDBcbiAqICpcbiAqICogYXdzIGJhdGNoIGRlc2NyaWJlLWpvYnMgLS1qb2JzIDxqb2ItaWQgcmV0dXJuZWQgYnkgbGlzdC1qb2JzPiAtLXF1ZXJ5ICdqb2JzWzBdLnN0YXR1cyc6IHdhaXQgdW50aWwgdGhlIHN0YXR1cyBpcyAnU1VDQ0VFREVEJ1xuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBkZXNjcmliZS1leGVjdXRpb24gLS1leGVjdXRpb24tYXJuIDxleGVjdXRpb24tYXJuIGdlbmVyYXRlZCBiZWZvcmU+IC0tcXVlcnkgJ3N0YXR1cyc6IHNob3VsZCByZXR1cm4gc3RhdHVzIGFzIFNVQ0NFRURFRFxuICovXG5cbmNsYXNzIFJ1bkJhdGNoU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICd2cGMnLCB7IHJlc3RyaWN0RGVmYXVsdFNlY3VyaXR5R3JvdXA6IGZhbHNlIH0pO1xuXG4gICAgY29uc3QgYmF0Y2hRdWV1ZSA9IG5ldyBiYXRjaC5Kb2JRdWV1ZSh0aGlzLCAnSm9iUXVldWUnLCB7XG4gICAgICBjb21wdXRlRW52aXJvbm1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgICBjb21wdXRlRW52aXJvbm1lbnQ6IG5ldyBiYXRjaC5NYW5hZ2VkRWMyRWNzQ29tcHV0ZUVudmlyb25tZW50KHRoaXMsICdDb21wdXRlRW52Jywge1xuICAgICAgICAgICAgdnBjLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJhdGNoSm9iRGVmaW5pdGlvbiA9IG5ldyBiYXRjaC5FY3NKb2JEZWZpbml0aW9uKHRoaXMsICdKb2JEZWZpbml0aW9uJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgYmF0Y2guRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbih0aGlzLCAnQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldChcbiAgICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnYmF0Y2hqb2ItaW1hZ2UnKSxcbiAgICAgICAgKSxcbiAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgIG1lbW9yeTogY2RrLlNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdWJtaXRKb2IgPSBuZXcgQmF0Y2hTdWJtaXRKb2IodGhpcywgJ1N1Ym1pdCBKb2InLCB7XG4gICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaFF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgam9iTmFtZTogJ015Sm9iJyxcbiAgICAgIGNvbnRhaW5lck92ZXJyaWRlczoge1xuICAgICAgICBlbnZpcm9ubWVudDogeyBrZXk6ICd2YWx1ZScgfSxcbiAgICAgICAgbWVtb3J5OiBjZGsuU2l6ZS5tZWJpYnl0ZXMoMjU2KSxcbiAgICAgICAgdmNwdXM6IDEsXG4gICAgICB9LFxuICAgICAgcGF5bG9hZDogc2ZuLlRhc2tJbnB1dC5mcm9tT2JqZWN0KHtcbiAgICAgICAgZm9vOiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuYmFyJyksXG4gICAgICB9KSxcbiAgICAgIGF0dGVtcHRzOiAzLFxuICAgICAgdGFza1RpbWVvdXQ6IHNmbi5UaW1lb3V0LmR1cmF0aW9uKGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0gbmV3IHNmbi5QYXNzKHRoaXMsICdTdGFydCcsIHtcbiAgICAgIHJlc3VsdDogc2ZuLlJlc3VsdC5mcm9tT2JqZWN0KHsgYmFyOiAnU29tZVZhbHVlJyB9KSxcbiAgICB9KS5uZXh0KHN1Ym1pdEpvYik7XG5cbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdKb2JRdWV1ZUFybicsIHtcbiAgICAgIHZhbHVlOiBiYXRjaFF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTdGF0ZU1hY2hpbmVBcm4nLCB7XG4gICAgICB2YWx1ZTogc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFJ1bkJhdGNoU3RhY2soYXBwLCAnYXdzLXN0ZXBmdW5jdGlvbnMtaW50ZWcnKTtcbmFwcC5zeW50aCgpO1xuIl19
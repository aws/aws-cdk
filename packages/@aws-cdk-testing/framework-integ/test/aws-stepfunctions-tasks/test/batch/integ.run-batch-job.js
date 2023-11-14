"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const batch = require("aws-cdk-lib/aws-batch");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucnVuLWJhdGNoLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJ1bi1iYXRjaC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyw2REFBNkQ7QUFFN0Q7Ozs7Ozs7R0FPRztBQUVILE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU5RSxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBQ1Isa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTt3QkFDaEYsR0FBRztxQkFDSixDQUFDO2lCQUNIO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDM0UsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBQ2hFLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FDMUM7Z0JBQ0QsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDMUIsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCO2dCQUNyRCxPQUFPLEVBQUUsT0FBTztnQkFDaEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXO2dCQUNuQyxrQkFBa0IsRUFBRTtvQkFDbEIsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtvQkFDN0IsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsS0FBSyxFQUFFLENBQUM7aUJBQ1Q7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7aUJBQ3BDO2dCQUNELFFBQVEsRUFBRSxDQUFDO2dCQUNYLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDbEMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQzdDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQztTQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzlELFVBQVU7U0FDWCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFdBQVc7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxLQUFLLEVBQUUsWUFBWSxDQUFDLGVBQWU7U0FDcEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFDbEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGJhdGNoIGZyb20gJ2F3cy1jZGstbGliL2F3cy1iYXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIHN0ZXBmdW5jdGlvbnMgc3RhcnQtZXhlY3V0aW9uIC0tc3RhdGUtbWFjaGluZS1hcm4gPGRlcGxveWVkIHN0YXRlIG1hY2hpbmUgYXJuPiA6IHNob3VsZCByZXR1cm4gZXhlY3V0aW9uIGFyblxuICogKiBhd3MgYmF0Y2ggbGlzdC1qb2JzIC0tam9iLXF1ZXVlIDxkZXBsb3llZCBqb2IgcXVldWUgbmFtZSBvciBhcm4+IC0tam9iLXN0YXR1cyBSVU5OQUJMRSA6IHNob3VsZCByZXR1cm4gam9icy1saXN0IHdpdGggc2l6ZSBncmVhdGVyIHRoYW4gMFxuICogKlxuICogKiBhd3MgYmF0Y2ggZGVzY3JpYmUtam9icyAtLWpvYnMgPGpvYi1pZCByZXR1cm5lZCBieSBsaXN0LWpvYnM+IC0tcXVlcnkgJ2pvYnNbMF0uc3RhdHVzJzogd2FpdCB1bnRpbCB0aGUgc3RhdHVzIGlzICdTVUNDRUVERUQnXG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN0aW9uLWFybiBnZW5lcmF0ZWQgYmVmb3JlPiAtLXF1ZXJ5ICdzdGF0dXMnOiBzaG91bGQgcmV0dXJuIHN0YXR1cyBhcyBTVUNDRUVERURcbiAqL1xuXG5jbGFzcyBSdW5CYXRjaFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAndnBjJywgeyByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiBmYWxzZSB9KTtcblxuICAgIGNvbnN0IGJhdGNoUXVldWUgPSBuZXcgYmF0Y2guSm9iUXVldWUodGhpcywgJ0pvYlF1ZXVlJywge1xuICAgICAgY29tcHV0ZUVudmlyb25tZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgICAgY29tcHV0ZUVudmlyb25tZW50OiBuZXcgYmF0Y2guTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudCh0aGlzLCAnQ29tcHV0ZUVudicsIHtcbiAgICAgICAgICAgIHZwYyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBiYXRjaEpvYkRlZmluaXRpb24gPSBuZXcgYmF0Y2guRWNzSm9iRGVmaW5pdGlvbih0aGlzLCAnSm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IGJhdGNoLkVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24odGhpcywgJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tQXNzZXQoXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2JhdGNoam9iLWltYWdlJyksXG4gICAgICAgICksXG4gICAgICAgIGNwdTogMjU2LFxuICAgICAgICBtZW1vcnk6IGNkay5TaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3VibWl0Sm9iID0gbmV3IHNmbi5UYXNrKHRoaXMsICdTdWJtaXQgSm9iJywge1xuICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICAgIGpvYk5hbWU6ICdNeUpvYicsXG4gICAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaFF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgICBjb250YWluZXJPdmVycmlkZXM6IHtcbiAgICAgICAgICBlbnZpcm9ubWVudDogeyBrZXk6ICd2YWx1ZScgfSxcbiAgICAgICAgICBtZW1vcnk6IDI1NixcbiAgICAgICAgICB2Y3B1czogMSxcbiAgICAgICAgfSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIGZvbzogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmJhcicpLFxuICAgICAgICB9LFxuICAgICAgICBhdHRlbXB0czogMyxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0gbmV3IHNmbi5QYXNzKHRoaXMsICdTdGFydCcsIHtcbiAgICAgIHJlc3VsdDogc2ZuLlJlc3VsdC5mcm9tT2JqZWN0KHsgYmFyOiAnU29tZVZhbHVlJyB9KSxcbiAgICB9KS5uZXh0KHN1Ym1pdEpvYik7XG5cbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdKb2JRdWV1ZUFybicsIHtcbiAgICAgIHZhbHVlOiBiYXRjaFF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTdGF0ZU1hY2hpbmVBcm4nLCB7XG4gICAgICB2YWx1ZTogc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFJ1bkJhdGNoU3RhY2soYXBwLCAnYXdzLXN0ZXBmdW5jdGlvbnMtaW50ZWcnKTtcbmFwcC5zeW50aCgpO1xuIl19
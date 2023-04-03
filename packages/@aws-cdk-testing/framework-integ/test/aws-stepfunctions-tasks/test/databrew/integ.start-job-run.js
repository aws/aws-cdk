"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databrew = require("aws-cdk-lib/aws-databrew");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */
class GlueDataBrewJobStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        const region = this.region;
        const outputBucket = new s3.Bucket(this, 'JobOutputBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const role = new iam.Role(this, 'DataBrew Role', {
            managedPolicies: [{
                    managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSGlueDataBrewServiceRole',
                }],
            path: '/',
            assumedBy: new iam.ServicePrincipal('databrew.amazonaws.com'),
            inlinePolicies: {
                DataBrewPolicy: iam.PolicyDocument.fromJson({
                    Statement: [{
                            Effect: 'Allow',
                            Action: [
                                's3:GetObject',
                                's3:PutObject',
                                's3:DeleteObject',
                                's3:ListBucket',
                            ],
                            Resource: [
                                `arn:aws:s3:::databrew-public-datasets-${region}/*`,
                                `arn:aws:s3:::databrew-public-datasets-${region}`,
                                `${outputBucket.bucketArn}/*`,
                                `${outputBucket.bucketArn}`,
                            ],
                        }],
                }),
            },
        });
        const recipe = new databrew.CfnRecipe(this, 'DataBrew Recipe', {
            name: 'recipe-1',
            steps: [
                {
                    action: {
                        operation: 'UPPER_CASE',
                        parameters: {
                            sourceColumn: 'description',
                        },
                    },
                },
                {
                    action: {
                        operation: 'DELETE',
                        parameters: {
                            sourceColumn: 'doc_id',
                        },
                    },
                },
            ],
        });
        const dataset = new databrew.CfnDataset(this, 'DataBrew Dataset', {
            input: {
                s3InputDefinition: {
                    bucket: `databrew-public-datasets-${region}`,
                    key: 'votes.csv',
                },
            },
            name: 'dataset-1',
        });
        const project = new databrew.CfnProject(this, 'DataBrew Project', {
            name: 'project-1',
            roleArn: role.roleArn,
            datasetName: dataset.name,
            recipeName: recipe.name,
        });
        project.addDependency(dataset);
        project.addDependency(recipe);
        const job = new databrew.CfnJob(this, 'DataBrew Job', {
            name: 'job-1',
            type: 'RECIPE',
            projectName: project.name,
            roleArn: role.roleArn,
            outputs: [{
                    location: {
                        bucket: outputBucket.bucketName,
                    },
                }],
        });
        job.addDependency(project);
        const startGlueDataBrewJob = new aws_stepfunctions_tasks_1.GlueDataBrewStartJobRun(this, 'Start DataBrew Job run', {
            name: job.name,
        });
        const chain = sfn.Chain.start(startGlueDataBrewJob);
        const sm = new sfn.StateMachine(this, 'StateMachine', {
            definition: chain,
            timeout: cdk.Duration.seconds(30),
        });
        new cdk.CfnOutput(this, 'stateMachineArn', {
            value: sm.stateMachineArn,
        });
    }
}
const app = new cdk.App();
new GlueDataBrewJobStack(app, 'aws-stepfunctions-tasks-databrew-start-job-run-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RhcnQtam9iLXJ1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnN0YXJ0LWpvYi1ydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBcUQ7QUFDckQsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6QyxxREFBcUQ7QUFDckQsbUNBQW1DO0FBQ25DLGlGQUE4RTtBQUU5RTs7OztHQUlHO0FBRUgsTUFBTSxvQkFBcUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMxQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsUUFBd0IsRUFBRTtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRTNCLE1BQU0sWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDMUQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUMvQyxlQUFlLEVBQUUsQ0FBQztvQkFDaEIsZ0JBQWdCLEVBQUUsaUVBQWlFO2lCQUNwRixDQUFDO1lBQ0YsSUFBSSxFQUFFLEdBQUc7WUFDVCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUM7WUFDN0QsY0FBYyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztvQkFDMUMsU0FBUyxFQUFFLENBQUM7NEJBQ1YsTUFBTSxFQUFFLE9BQU87NEJBQ2YsTUFBTSxFQUFFO2dDQUNOLGNBQWM7Z0NBQ2QsY0FBYztnQ0FDZCxpQkFBaUI7Z0NBQ2pCLGVBQWU7NkJBQ2hCOzRCQUNELFFBQVEsRUFBRTtn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LEVBQUUsc0RBQXNELENBQUMsQ0FBQztBQUN0RixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkYXRhYnJldyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZGF0YWJyZXcnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgR2x1ZURhdGFCcmV3U3RhcnRKb2JSdW4gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIHN0YXJ0LWV4ZWN1dGlvbiAtLXN0YXRlLW1hY2hpbmUtYXJuIDxkZXBsb3llZCBzdGF0ZSBtYWNoaW5lIGFybj4gOiBzaG91bGQgcmV0dXJuIGV4ZWN1dGlvbiBhcm5cbiAqICogYXdzIHN0ZXBmdW5jdGlvbnMgZGVzY3JpYmUtZXhlY3V0aW9uIC0tZXhlY3V0aW9uLWFybiA8ZXhlY3Rpb24tYXJuIGdlbmVyYXRlZCBiZWZvcmU+IDogc2hvdWxkIHJldHVybiBzdGF0dXMgYXMgU1VDQ0VFREVEXG4gKi9cblxuY2xhc3MgR2x1ZURhdGFCcmV3Sm9iU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHJlZ2lvbiA9IHRoaXMucmVnaW9uO1xuXG4gICAgY29uc3Qgb3V0cHV0QnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnSm9iT3V0cHV0QnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0RhdGFCcmV3IFJvbGUnLCB7XG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFt7XG4gICAgICAgIG1hbmFnZWRQb2xpY3lBcm46ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTR2x1ZURhdGFCcmV3U2VydmljZVJvbGUnLFxuICAgICAgfV0sXG4gICAgICBwYXRoOiAnLycsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZGF0YWJyZXcuYW1hem9uYXdzLmNvbScpLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgRGF0YUJyZXdQb2xpY3k6IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbih7XG4gICAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzMzpHZXRPYmplY3QnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgJ3MzOkRlbGV0ZU9iamVjdCcsXG4gICAgICAgICAgICAgICdzMzpMaXN0QnVja2V0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OmRhdGFicmV3LXB1YmxpYy1kYXRhc2V0cy0ke3JlZ2lvbn0vKmAsXG4gICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6ZGF0YWJyZXctcHVibGljLWRhdGFzZXRzLSR7cmVnaW9ufWAsXG4gICAgICAgICAgICAgIGAke291dHB1dEJ1Y2tldC5idWNrZXRBcm59LypgLFxuICAgICAgICAgICAgICBgJHtvdXRwdXRCdWNrZXQuYnVja2V0QXJufWAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCByZWNpcGUgPSBuZXcgZGF0YWJyZXcuQ2ZuUmVjaXBlKHRoaXMsICdEYXRhQnJldyBSZWNpcGUnLCB7XG4gICAgICBuYW1lOiAncmVjaXBlLTEnLFxuICAgICAgc3RlcHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiAnVVBQRVJfQ0FTRScsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIHNvdXJjZUNvbHVtbjogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiAnREVMRVRFJyxcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgc291cmNlQ29sdW1uOiAnZG9jX2lkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkYXRhc2V0ID0gbmV3IGRhdGFicmV3LkNmbkRhdGFzZXQodGhpcywgJ0RhdGFCcmV3IERhdGFzZXQnLCB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBzM0lucHV0RGVmaW5pdGlvbjoge1xuICAgICAgICAgIGJ1Y2tldDogYGRhdGFicmV3LXB1YmxpYy1kYXRhc2V0cy0ke3JlZ2lvbn1gLFxuICAgICAgICAgIGtleTogJ3ZvdGVzLmNzdicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbmFtZTogJ2RhdGFzZXQtMScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGRhdGFicmV3LkNmblByb2plY3QodGhpcywgJ0RhdGFCcmV3IFByb2plY3QnLCB7XG4gICAgICBuYW1lOiAncHJvamVjdC0xJyxcbiAgICAgIHJvbGVBcm46IHJvbGUucm9sZUFybixcbiAgICAgIGRhdGFzZXROYW1lOiBkYXRhc2V0Lm5hbWUsXG4gICAgICByZWNpcGVOYW1lOiByZWNpcGUubmFtZSxcbiAgICB9KTtcbiAgICBwcm9qZWN0LmFkZERlcGVuZGVuY3koZGF0YXNldCk7XG4gICAgcHJvamVjdC5hZGREZXBlbmRlbmN5KHJlY2lwZSk7XG5cbiAgICBjb25zdCBqb2IgPSBuZXcgZGF0YWJyZXcuQ2ZuSm9iKHRoaXMsICdEYXRhQnJldyBKb2InLCB7XG4gICAgICBuYW1lOiAnam9iLTEnLFxuICAgICAgdHlwZTogJ1JFQ0lQRScsXG4gICAgICBwcm9qZWN0TmFtZTogcHJvamVjdC5uYW1lLFxuICAgICAgcm9sZUFybjogcm9sZS5yb2xlQXJuLFxuICAgICAgb3V0cHV0czogW3tcbiAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICBidWNrZXQ6IG91dHB1dEJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgICB9LFxuICAgICAgfV0sXG4gICAgfSk7XG4gICAgam9iLmFkZERlcGVuZGVuY3kocHJvamVjdCk7XG5cbiAgICBjb25zdCBzdGFydEdsdWVEYXRhQnJld0pvYiA9IG5ldyBHbHVlRGF0YUJyZXdTdGFydEpvYlJ1bih0aGlzLCAnU3RhcnQgRGF0YUJyZXcgSm9iIHJ1bicsIHtcbiAgICAgIG5hbWU6IGpvYi5uYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hhaW4gPSBzZm4uQ2hhaW4uc3RhcnQoc3RhcnRHbHVlRGF0YUJyZXdKb2IpO1xuXG4gICAgY29uc3Qgc20gPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogY2hhaW4sXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnc3RhdGVNYWNoaW5lQXJuJywge1xuICAgICAgdmFsdWU6IHNtLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IEdsdWVEYXRhQnJld0pvYlN0YWNrKGFwcCwgJ2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzLWRhdGFicmV3LXN0YXJ0LWpvYi1ydW4taW50ZWcnKTtcbmFwcC5zeW50aCgpO1xuIl19
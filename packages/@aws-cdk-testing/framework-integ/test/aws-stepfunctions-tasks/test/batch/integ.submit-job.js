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

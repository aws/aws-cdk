"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batch = require("aws-cdk-lib/aws-batch");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const events = require("aws-cdk-lib/aws-events");
const sqs = require("aws-cdk-lib/aws-sqs");
const cdk = require("aws-cdk-lib");
const targets = require("aws-cdk-lib/aws-events-targets");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'batch-events');
const queue = new batch.JobQueue(stack, 'MyQueue', {
    computeEnvironments: [
        {
            computeEnvironment: new batch.UnmanagedComputeEnvironment(stack, 'ComputeEnvironment'),
            order: 1,
        },
    ],
});
const job = new batch.EcsJobDefinition(stack, 'MyJob', {
    container: new batch.EcsEc2ContainerDefinition(stack, 'container', {
        image: aws_ecs_1.ContainerImage.fromRegistry('test-repo'),
        cpu: 256,
        memory: cdk.Size.mebibytes(2048),
    }),
});
const timer = new events.Rule(stack, 'Timer', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.BatchJob(queue.jobQueueArn, queue, job.jobDefinitionArn, job));
const timer2 = new events.Rule(stack, 'Timer2', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});
const dlq = new sqs.Queue(stack, 'Queue');
timer2.addTarget(new targets.BatchJob(queue.jobQueueArn, queue, job.jobDefinitionArn, job, {
    deadLetterQueue: dlq,
    retryAttempts: 2,
    maxEventAge: cdk.Duration.hours(2),
}));
app.synth();

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const batch = __importStar(require("aws-cdk-lib/aws-batch"));
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const events = __importStar(require("aws-cdk-lib/aws-events"));
const sqs = __importStar(require("aws-cdk-lib/aws-sqs"));
const cdk = __importStar(require("aws-cdk-lib"));
const targets = __importStar(require("aws-cdk-lib/aws-events-targets"));
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

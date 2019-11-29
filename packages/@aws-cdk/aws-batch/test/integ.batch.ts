import ec2 = require('@aws-cdk/aws-ec2');
// import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/core');

// import { EcrImage } from '@aws-cdk/aws-ecs';
import * as batch from '../lib/';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'batch-stack');

const vpc = new ec2.Vpc(stack, 'vpc');

new batch.ComputeEnvironment(stack, 'batch-demand-compute-env', {
    managed: false,
    computeResources: {
        type: batch.ComputeResourceType.ON_DEMAND,
        vpc,
    },
});

// const spotComputeEnv = new batch.ComputeEnvironment(stack, 'batch-spot-compute-env', {
//     managed: false,
//     computeResources: {
//         type: batch.ComputeResourceType.SPOT,
//         vpc,
//         bidPercentage: 80,
//     },
// });

// new batch.JobQueue(stack, 'batch-job-queue', {
//     computeEnvironmentOrder: [
//         {
//             computeEnvironment: onDemandComputeEnv,
//             order: 1,
//         },
//         {
//             computeEnvironment: spotComputeEnv,
//             order: 2,
//         },
//     ]
// });

// const repo = new ecr.Repository(stack, 'batch-job-repo');
// const image = new EcrImage(repo, 'latest');

// new batch.JobDefinition(stack, 'batch-job-def', {
//     container: {
//         image,
//     },
// });

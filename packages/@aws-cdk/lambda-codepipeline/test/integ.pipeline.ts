import * as codepipeline from '@aws-cdk/codepipeline';
import { App, Stack } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/lambda';
import * as s3 from '@aws-cdk/s3';
import * as lambda_codepipeline from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-codepipeline-lambda');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const sourceStage = new codepipeline.Stage(pipeline, 'Source');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
});
new codepipeline.AmazonS3Source(sourceStage, 'Source', {
    artifactName: 'SourceArtifact',
    bucket,
    bucketKey: 'key',
});

const lambdaFun = new lambda.Lambda(stack, 'LambdaFun', {
    code: new lambda.LambdaInlineCode(`
        exports.handler = function () {
            console.log("Hello, world!");
        };
    `),
    handler: 'index.handler',
    runtime: lambda.LambdaRuntime.NodeJS610,
});
const lambdaStage = new codepipeline.Stage(pipeline, 'Lambda');
new lambda_codepipeline.PipelineInvokeAction(lambdaStage, 'Lambda', {
    lambda: lambdaFun,
});

process.stdout.write(app.run());

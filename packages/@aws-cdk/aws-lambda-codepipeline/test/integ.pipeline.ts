import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import lambda_codepipeline = require('../lib');

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-lambda');

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

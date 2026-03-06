"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ RetryPipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const pipelines = require("aws-cdk-lib/pipelines");
class BucketStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new s3.Bucket(this, 'Bucket');
    }
}
class PlainStackApp extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        new BucketStack(this, 'Stack');
    }
}
class PipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
                commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
            }),
            selfMutation: false,
        });
        // Add a stage with retryMode via addStage
        pipeline.addStage(new PlainStackApp(this, 'StageWithRetry'), {
            retryMode: pipelines.RetryMode.FAILED_ACTIONS,
        });
        // Add a wave with retryMode via addWave
        const wave = pipeline.addWave('WaveWithRetry', {
            retryMode: pipelines.RetryMode.ALL_ACTIONS,
        });
        wave.addStage(new PlainStackApp(this, 'WaveApp1'));
        wave.addStage(new PlainStackApp(this, 'WaveApp2'));
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
        '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
        '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
    },
});
const stack = new PipelineStack(app, 'RetryPipelineStack');
new integ.IntegTest(app, 'RetryPipelineTest', {
    testCases: [stack],
    diffAssets: true,
});
app.synth();

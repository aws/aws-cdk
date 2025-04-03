"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const ec2 = require("aws-cdk-lib/aws-ec2");
const s3 = require("aws-cdk-lib/aws-s3");
const s3_assets = require("aws-cdk-lib/aws-s3-assets");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const pipelines = require("aws-cdk-lib/pipelines");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });
        const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            codeBuildDefaults: {
                vpc: vpc,
                fileSystemLocations: [codebuild.FileSystemLocation.efs({
                        identifier: 'myidentifier',
                        location: `fs-c8d04839.efs.${aws_cdk_lib_1.Aws.REGION}.amazonaws.com:/mnt`,
                        mountOptions: 'nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2',
                        mountPoint: '/media',
                    })],
                buildEnvironment: {
                    privileged: true,
                },
            },
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
                commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
            }),
            selfMutation: false,
            useChangeSets: false,
        });
        pipeline.addStage(new AppStage(this, 'Beta'));
    }
}
class AppStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'Stack1', {
            synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
        });
        new s3_assets.Asset(stack, 'Asset', {
            path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
        '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
        [cx_api_1.PIPELINE_REDUCE_ASSET_ROLE_TRUST_SCOPE]: true,
        '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
    },
});
const stack = new TestStack(app, 'PipelinesFileSystemLocations');
new integ.IntegTest(app, 'cdk-integ-codepipeline-with-file-system-locations', {
    testCases: [stack],
    diffAssets: true,
});
app.synth();

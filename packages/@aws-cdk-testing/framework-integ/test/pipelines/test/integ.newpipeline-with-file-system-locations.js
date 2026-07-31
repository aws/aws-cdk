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
const path = __importStar(require("path"));
const codebuild = __importStar(require("aws-cdk-lib/aws-codebuild"));
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const s3_assets = __importStar(require("aws-cdk-lib/aws-s3-assets"));
const cx_api_1 = require("aws-cdk-lib/cx-api");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = __importStar(require("@aws-cdk/integ-tests-alpha"));
const pipelines = __importStar(require("aws-cdk-lib/pipelines"));
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

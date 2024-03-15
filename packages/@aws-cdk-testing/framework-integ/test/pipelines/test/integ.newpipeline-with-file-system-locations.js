"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const ec2 = require("aws-cdk-lib/aws-ec2");
const s3 = require("aws-cdk-lib/aws-s3");
const s3_assets = require("aws-cdk-lib/aws-s3-assets");
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
    },
});
const stack = new TestStack(app, 'PipelinesFileSystemLocations');
new integ.IntegTest(app, 'cdk-integ-codepipeline-with-file-system-locations', {
    testCases: [stack],
    diffAssets: true,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmV3cGlwZWxpbmUtd2l0aC1maWxlLXN5c3RlbS1sb2NhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5uZXdwaXBlbGluZS13aXRoLWZpbGUtc3lzdGVtLWxvY2F0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix1REFBdUQ7QUFDdkQsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6Qyx1REFBdUQ7QUFDdkQsNkNBQXFIO0FBQ3JILG9EQUFvRDtBQUVwRCxtREFBbUQ7QUFFbkQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLDRCQUE0QixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFOUUsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELGlCQUFpQixFQUFFO2dCQUNqQixHQUFHLEVBQUUsR0FBRztnQkFDUixtQkFBbUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUM7d0JBQ3JELFVBQVUsRUFBRSxjQUFjO3dCQUMxQixRQUFRLEVBQUUsbUJBQW1CLGlCQUFHLENBQUMsTUFBTSxxQkFBcUI7d0JBQzVELFlBQVksRUFBRSxrRUFBa0U7d0JBQ2hGLFVBQVUsRUFBRSxRQUFRO3FCQUNyQixDQUFDLENBQUM7Z0JBQ0gsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjthQUNGO1lBQ0QsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7Z0JBQzNELFFBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQzthQUNuRCxDQUFDO1lBQ0YsWUFBWSxFQUFFLEtBQUs7WUFDbkIsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFFBQVMsU0FBUSxtQkFBSztJQUMxQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLFdBQVcsRUFBRSxJQUFJLHFDQUF1QixFQUFFO1NBQzNDLENBQUMsQ0FBQztRQUNILElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3Q0FBd0MsQ0FBQztTQUNyRSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsY0FBYyxFQUFFO1FBQ2Qsc0NBQXNDLEVBQUUsR0FBRztRQUMzQyxtREFBbUQsRUFBRSxLQUFLO0tBQzNEO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDhCQUE4QixDQUFDLENBQUM7QUFFakUsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxtREFBbUQsRUFBRTtJQUM1RSxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM19hc3NldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBTdGFnZSwgU3RhZ2VQcm9wcywgQXdzLCBSZW1vdmFsUG9saWN5LCBEZWZhdWx0U3RhY2tTeW50aGVzaXplciB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiBmYWxzZSB9KTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NvdXJjZUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBjb2RlQnVpbGREZWZhdWx0czoge1xuICAgICAgICB2cGM6IHZwYyxcbiAgICAgICAgZmlsZVN5c3RlbUxvY2F0aW9uczogW2NvZGVidWlsZC5GaWxlU3lzdGVtTG9jYXRpb24uZWZzKHtcbiAgICAgICAgICBpZGVudGlmaWVyOiAnbXlpZGVudGlmaWVyJyxcbiAgICAgICAgICBsb2NhdGlvbjogYGZzLWM4ZDA0ODM5LmVmcy4ke0F3cy5SRUdJT059LmFtYXpvbmF3cy5jb206L21udGAsXG4gICAgICAgICAgbW91bnRPcHRpb25zOiAnbmZzdmVycz00LjEscnNpemU9MTA0ODU3Nix3c2l6ZT0xMDQ4NTc2LGhhcmQsdGltZW89NjAwLHJldHJhbnM9MicsXG4gICAgICAgICAgbW91bnRQb2ludDogJy9tZWRpYScsXG4gICAgICAgIH0pXSxcbiAgICAgICAgYnVpbGRFbnZpcm9ubWVudDoge1xuICAgICAgICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuczMoc291cmNlQnVja2V0LCAna2V5JyksXG4gICAgICAgIGNvbW1hbmRzOiBbJ21rZGlyIGNkay5vdXQnLCAndG91Y2ggY2RrLm91dC9kdW1teSddLFxuICAgICAgfSksXG4gICAgICBzZWxmTXV0YXRpb246IGZhbHNlLFxuICAgICAgdXNlQ2hhbmdlU2V0czogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZShuZXcgQXBwU3RhZ2UodGhpcywgJ0JldGEnKSk7XG4gIH1cbn1cblxuY2xhc3MgQXBwU3RhZ2UgZXh0ZW5kcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodGhpcywgJ1N0YWNrMScsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcbiAgICBuZXcgczNfYXNzZXRzLkFzc2V0KHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdGhlbHBlcnMvYXNzZXRzL3Rlc3QtZmlsZS1hc3NldC50eHQnKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogJzEnLFxuICAgICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lOmRlZmF1bHRQaXBlbGluZVR5cGVUb1YyJzogZmFsc2UsXG4gIH0sXG59KTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ1BpcGVsaW5lc0ZpbGVTeXN0ZW1Mb2NhdGlvbnMnKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdjZGstaW50ZWctY29kZXBpcGVsaW5lLXdpdGgtZmlsZS1zeXN0ZW0tbG9jYXRpb25zJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIGRpZmZBc3NldHM6IHRydWUsXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
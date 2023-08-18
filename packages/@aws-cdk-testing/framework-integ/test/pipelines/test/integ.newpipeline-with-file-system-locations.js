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
    context: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
    },
});
const stack = new TestStack(app, 'PipelinesFileSystemLocations');
new integ.IntegTest(app, 'cdk-integ-codepipeline-with-file-system-locations', {
    testCases: [stack],
    diffAssets: true,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmV3cGlwZWxpbmUtd2l0aC1maWxlLXN5c3RlbS1sb2NhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5uZXdwaXBlbGluZS13aXRoLWZpbGUtc3lzdGVtLWxvY2F0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix1REFBdUQ7QUFDdkQsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6Qyx1REFBdUQ7QUFDdkQsNkNBQXFIO0FBQ3JILG9EQUFvRDtBQUVwRCxtREFBbUQ7QUFFbkQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLDRCQUE0QixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFOUUsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELGlCQUFpQixFQUFFO2dCQUNqQixHQUFHLEVBQUUsR0FBRztnQkFDUixtQkFBbUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUM7d0JBQ3JELFVBQVUsRUFBRSxjQUFjO3dCQUMxQixRQUFRLEVBQUUsbUJBQW1CLGlCQUFHLENBQUMsTUFBTSxxQkFBcUI7d0JBQzVELFlBQVksRUFBRSxrRUFBa0U7d0JBQ2hGLFVBQVUsRUFBRSxRQUFRO3FCQUNyQixDQUFDLENBQUM7Z0JBQ0gsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjthQUNGO1lBQ0QsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7Z0JBQzNELFFBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQzthQUNuRCxDQUFDO1lBQ0YsWUFBWSxFQUFFLEtBQUs7WUFDbkIsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFFBQVMsU0FBUSxtQkFBSztJQUMxQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLFdBQVcsRUFBRSxJQUFJLHFDQUF1QixFQUFFO1NBQzNDLENBQUMsQ0FBQztRQUNILElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3Q0FBd0MsQ0FBQztTQUNyRSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsT0FBTyxFQUFFO1FBQ1Asc0NBQXNDLEVBQUUsR0FBRztLQUM1QztDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBRWpFLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsbURBQW1ELEVBQUU7SUFDNUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNfYXNzZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcywgU3RhZ2UsIFN0YWdlUHJvcHMsIEF3cywgUmVtb3ZhbFBvbGljeSwgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UgfSk7XG5cbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdTb3VyY2VCdWNrZXQnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgY29kZUJ1aWxkRGVmYXVsdHM6IHtcbiAgICAgICAgdnBjOiB2cGMsXG4gICAgICAgIGZpbGVTeXN0ZW1Mb2NhdGlvbnM6IFtjb2RlYnVpbGQuRmlsZVN5c3RlbUxvY2F0aW9uLmVmcyh7XG4gICAgICAgICAgaWRlbnRpZmllcjogJ215aWRlbnRpZmllcicsXG4gICAgICAgICAgbG9jYXRpb246IGBmcy1jOGQwNDgzOS5lZnMuJHtBd3MuUkVHSU9OfS5hbWF6b25hd3MuY29tOi9tbnRgLFxuICAgICAgICAgIG1vdW50T3B0aW9uczogJ25mc3ZlcnM9NC4xLHJzaXplPTEwNDg1NzYsd3NpemU9MTA0ODU3NixoYXJkLHRpbWVvPTYwMCxyZXRyYW5zPTInLFxuICAgICAgICAgIG1vdW50UG9pbnQ6ICcvbWVkaWEnLFxuICAgICAgICB9KV0sXG4gICAgICAgIGJ1aWxkRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKHNvdXJjZUJ1Y2tldCwgJ2tleScpLFxuICAgICAgICBjb21tYW5kczogWydta2RpciBjZGsub3V0JywgJ3RvdWNoIGNkay5vdXQvZHVtbXknXSxcbiAgICAgIH0pLFxuICAgICAgc2VsZk11dGF0aW9uOiBmYWxzZSxcbiAgICAgIHVzZUNoYW5nZVNldHM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2UobmV3IEFwcFN0YWdlKHRoaXMsICdCZXRhJykpO1xuICB9XG59XG5cbmNsYXNzIEFwcFN0YWdlIGV4dGVuZHMgU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHRoaXMsICdTdGFjazEnLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKCksXG4gICAgfSk7XG4gICAgbmV3IHMzX2Fzc2V0cy5Bc3NldChzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3RoZWxwZXJzL2Fzc2V0cy90ZXN0LWZpbGUtYXNzZXQudHh0JyksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIGNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogJzEnLFxuICB9LFxufSk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICdQaXBlbGluZXNGaWxlU3lzdGVtTG9jYXRpb25zJyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLWNvZGVwaXBlbGluZS13aXRoLWZpbGUtc3lzdGVtLWxvY2F0aW9ucycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBkaWZmQXNzZXRzOiB0cnVlLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
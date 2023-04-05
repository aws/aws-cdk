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
        const vpc = new ec2.Vpc(this, 'Vpc');
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
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubmV3cGlwZWxpbmUtd2l0aC1maWxlLXN5c3RlbS1sb2NhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5uZXdwaXBlbGluZS13aXRoLWZpbGUtc3lzdGVtLWxvY2F0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix1REFBdUQ7QUFDdkQsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6Qyx1REFBdUQ7QUFDdkQsNkNBQXFIO0FBQ3JILG9EQUFvRDtBQUVwRCxtREFBbUQ7QUFFbkQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXJDLE1BQU0sWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3ZELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM1RCxpQkFBaUIsRUFBRTtnQkFDakIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsbUJBQW1CLEVBQUUsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDO3dCQUNyRCxVQUFVLEVBQUUsY0FBYzt3QkFDMUIsUUFBUSxFQUFFLG1CQUFtQixpQkFBRyxDQUFDLE1BQU0scUJBQXFCO3dCQUM1RCxZQUFZLEVBQUUsa0VBQWtFO3dCQUNoRixVQUFVLEVBQUUsUUFBUTtxQkFDckIsQ0FBQyxDQUFDO2dCQUNILGdCQUFnQixFQUFFO29CQUNoQixVQUFVLEVBQUUsSUFBSTtpQkFDakI7YUFDRjtZQUNELEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUN0QyxLQUFLLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO2dCQUMzRCxRQUFRLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7YUFDbkQsQ0FBQztZQUNGLFlBQVksRUFBRSxLQUFLO1lBQ25CLGFBQWEsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNGO0FBRUQsTUFBTSxRQUFTLFNBQVEsbUJBQUs7SUFDMUIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN0QyxXQUFXLEVBQUUsSUFBSSxxQ0FBdUIsRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFDSCxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNsQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsd0NBQXdDLENBQUM7U0FDckUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLHNDQUFzQyxFQUFFLEdBQUc7S0FDNUM7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQztBQUVqRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLG1EQUFtRCxFQUFFO0lBQzVFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIFN0YWdlLCBTdGFnZVByb3BzLCBBd3MsIFJlbW92YWxQb2xpY3ksIERlZmF1bHRTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnKTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NvdXJjZUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBjb2RlQnVpbGREZWZhdWx0czoge1xuICAgICAgICB2cGM6IHZwYyxcbiAgICAgICAgZmlsZVN5c3RlbUxvY2F0aW9uczogW2NvZGVidWlsZC5GaWxlU3lzdGVtTG9jYXRpb24uZWZzKHtcbiAgICAgICAgICBpZGVudGlmaWVyOiAnbXlpZGVudGlmaWVyJyxcbiAgICAgICAgICBsb2NhdGlvbjogYGZzLWM4ZDA0ODM5LmVmcy4ke0F3cy5SRUdJT059LmFtYXpvbmF3cy5jb206L21udGAsXG4gICAgICAgICAgbW91bnRPcHRpb25zOiAnbmZzdmVycz00LjEscnNpemU9MTA0ODU3Nix3c2l6ZT0xMDQ4NTc2LGhhcmQsdGltZW89NjAwLHJldHJhbnM9MicsXG4gICAgICAgICAgbW91bnRQb2ludDogJy9tZWRpYScsXG4gICAgICAgIH0pXSxcbiAgICAgICAgYnVpbGRFbnZpcm9ubWVudDoge1xuICAgICAgICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuczMoc291cmNlQnVja2V0LCAna2V5JyksXG4gICAgICAgIGNvbW1hbmRzOiBbJ21rZGlyIGNkay5vdXQnLCAndG91Y2ggY2RrLm91dC9kdW1teSddLFxuICAgICAgfSksXG4gICAgICBzZWxmTXV0YXRpb246IGZhbHNlLFxuICAgICAgdXNlQ2hhbmdlU2V0czogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZShuZXcgQXBwU3RhZ2UodGhpcywgJ0JldGEnKSk7XG4gIH1cbn1cblxuY2xhc3MgQXBwU3RhZ2UgZXh0ZW5kcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodGhpcywgJ1N0YWNrMScsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcbiAgICBuZXcgczNfYXNzZXRzLkFzc2V0KHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdGhlbHBlcnMvYXNzZXRzL3Rlc3QtZmlsZS1hc3NldC50eHQnKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgY29udGV4dDoge1xuICAgICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiAnMScsXG4gIH0sXG59KTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ1BpcGVsaW5lc0ZpbGVTeXN0ZW1Mb2NhdGlvbnMnKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdjZGstaW50ZWctY29kZXBpcGVsaW5lLXdpdGgtZmlsZS1zeXN0ZW0tbG9jYXRpb25zJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
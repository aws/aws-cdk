"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VariablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const codebuild = require("aws-cdk-lib/aws-codebuild");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const pipelines = require("aws-cdk-lib/pipelines");
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
                // input: pipelines.CodePipelineSource.gitHub('cdklabs/construct-hub-probe', 'main', {
                //   trigger: GitHubTrigger.POLL,
                // }),
                commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
            }),
            selfMutation: false,
        });
        const cacheBucket = new s3.Bucket(this, 'TestCacheBucket');
        const producer = new pipelines.CodeBuildStep('Produce', {
            commands: ['export MY_VAR=hello'],
            cache: codebuild.Cache.bucket(cacheBucket),
        });
        const consumer = new pipelines.CodeBuildStep('Consume', {
            env: {
                THE_VAR: producer.exportedVariable('MY_VAR'),
            },
            commands: [
                'echo "The variable was: $THE_VAR"',
            ],
            cache: codebuild.Cache.bucket(cacheBucket),
        });
        // WHEN
        pipeline.addWave('MyWave', {
            post: [consumer, producer],
        });
    }
}
const app = new aws_cdk_lib_1.App({
    context: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
    },
});
new PipelineStack(app, 'VariablePipelineStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtd2l0aC12YXJpYWJsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS13aXRoLXZhcmlhYmxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZEQUE2RDtBQUM3RCxpR0FBaUc7QUFDakcsdURBQXVEO0FBQ3ZELHlDQUF5QztBQUN6Qyw2Q0FBb0U7QUFFcEUsbURBQW1EO0FBRW5ELE1BQU0sYUFBYyxTQUFRLG1CQUFLO0lBQy9CLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUN0QyxLQUFLLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO2dCQUMzRCxzRkFBc0Y7Z0JBQ3RGLGlDQUFpQztnQkFDakMsTUFBTTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7YUFDbkQsQ0FBQztZQUNGLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUUzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO1lBQ3RELFFBQVEsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1lBQ2pDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRTtZQUN0RCxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7YUFDN0M7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsbUNBQW1DO2FBQ3BDO1lBQ0QsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUMzQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDekIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztTQUMzQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsT0FBTyxFQUFFO1FBQ1Asc0NBQXNDLEVBQUUsR0FBRztLQUM1QztDQUNGLENBQUMsQ0FBQztBQUVILElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbi8vLyAhY2RrLWludGVnIFZhcmlhYmxlUGlwZWxpbmVTdGFjayBwcmFnbWE6c2V0LWNvbnRleHQ6QGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzPXRydWVcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcblxuY2xhc3MgUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdTb3VyY2VCdWNrZXQnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKHNvdXJjZUJ1Y2tldCwgJ2tleScpLFxuICAgICAgICAvLyBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoJ2Nka2xhYnMvY29uc3RydWN0LWh1Yi1wcm9iZScsICdtYWluJywge1xuICAgICAgICAvLyAgIHRyaWdnZXI6IEdpdEh1YlRyaWdnZXIuUE9MTCxcbiAgICAgICAgLy8gfSksXG4gICAgICAgIGNvbW1hbmRzOiBbJ21rZGlyIGNkay5vdXQnLCAndG91Y2ggY2RrLm91dC9kdW1teSddLFxuICAgICAgfSksXG4gICAgICBzZWxmTXV0YXRpb246IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2FjaGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdUZXN0Q2FjaGVCdWNrZXQnKTtcblxuICAgIGNvbnN0IHByb2R1Y2VyID0gbmV3IHBpcGVsaW5lcy5Db2RlQnVpbGRTdGVwKCdQcm9kdWNlJywge1xuICAgICAgY29tbWFuZHM6IFsnZXhwb3J0IE1ZX1ZBUj1oZWxsbyddLFxuICAgICAgY2FjaGU6IGNvZGVidWlsZC5DYWNoZS5idWNrZXQoY2FjaGVCdWNrZXQpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29uc3VtZXIgPSBuZXcgcGlwZWxpbmVzLkNvZGVCdWlsZFN0ZXAoJ0NvbnN1bWUnLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgVEhFX1ZBUjogcHJvZHVjZXIuZXhwb3J0ZWRWYXJpYWJsZSgnTVlfVkFSJyksXG4gICAgICB9LFxuICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgJ2VjaG8gXCJUaGUgdmFyaWFibGUgd2FzOiAkVEhFX1ZBUlwiJyxcbiAgICAgIF0sXG4gICAgICBjYWNoZTogY29kZWJ1aWxkLkNhY2hlLmJ1Y2tldChjYWNoZUJ1Y2tldCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcGlwZWxpbmUuYWRkV2F2ZSgnTXlXYXZlJywge1xuICAgICAgcG9zdDogW2NvbnN1bWVyLCBwcm9kdWNlcl0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIGNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogJzEnLFxuICB9LFxufSk7XG5cbm5ldyBQaXBlbGluZVN0YWNrKGFwcCwgJ1ZhcmlhYmxlUGlwZWxpbmVTdGFjaycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=
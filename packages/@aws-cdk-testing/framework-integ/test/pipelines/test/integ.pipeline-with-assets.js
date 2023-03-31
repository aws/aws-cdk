"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const path = require("path");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
const s3 = require("aws-cdk-lib/aws-s3");
const s3_assets = require("aws-cdk-lib/aws-s3-assets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cdkp = require("aws-cdk-lib/pipelines");
class MyStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'Stack', {
            ...props,
            synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
        });
        new s3_assets.Asset(stack, 'Asset', {
            path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
        });
        new s3_assets.Asset(stack, 'Asset2', {
            path: path.join(__dirname, 'testhelpers/assets/test-file-asset-two.txt'),
        });
        new aws_cdk_lib_1.CfnResource(stack, 'Resource', {
            type: 'AWS::Test::SomeResource',
        });
    }
}
/**
 * The stack that defines the application pipeline
 */
class CdkpipelinesDemoPipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
        const integTestArtifact = new codepipeline.Artifact('IntegTests');
        const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
            cloudAssemblyArtifact,
            // Where the source can be found
            sourceAction: new codepipeline_actions.S3SourceAction({
                bucket: sourceBucket,
                output: sourceArtifact,
                bucketKey: 'key',
                actionName: 'S3',
            }),
            // How it will be built
            synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                projectName: 'MyServicePipeline-synth',
                additionalArtifacts: [
                    {
                        directory: 'test',
                        artifact: integTestArtifact,
                    },
                ],
            }),
        });
        // This is where we add the application stages
        // ...
        const stage = pipeline.addApplicationStage(new MyStage(this, 'PreProd'));
        stage.addActions(new cdkp.ShellScriptAction({
            actionName: 'UseSource',
            commands: [
                // Comes from source
                'cat README.md',
            ],
            additionalArtifacts: [sourceArtifact],
        }));
    }
}
const app = new aws_cdk_lib_1.App({
    context: {
        '@aws-cdk/core:newStyleStackSynthesis': 'true',
    },
});
new CdkpipelinesDemoPipelineStack(app, 'PipelineStack', {
    synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtd2l0aC1hc3NldHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS13aXRoLWFzc2V0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlGQUF5RjtBQUN6Riw2QkFBNkI7QUFDN0IsNkRBQTZEO0FBQzdELDZFQUE2RTtBQUM3RSx5Q0FBeUM7QUFDekMsdURBQXVEO0FBQ3ZELDZDQUE2SDtBQUU3SCw4Q0FBOEM7QUFFOUMsTUFBTSxPQUFRLFNBQVEsbUJBQUs7SUFDekIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNyQyxHQUFHLEtBQUs7WUFDUixXQUFXLEVBQUUsSUFBSSxxQ0FBdUIsRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFFSCxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNsQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsd0NBQXdDLENBQUM7U0FDckUsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDbkMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDRDQUE0QyxDQUFDO1NBQ3pFLENBQUMsQ0FBQztRQUVILElBQUkseUJBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ2pDLElBQUksRUFBRSx5QkFBeUI7U0FDaEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLDZCQUE4QixTQUFRLG1CQUFLO0lBQy9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RELHFCQUFxQjtZQUVyQixnQ0FBZ0M7WUFDaEMsWUFBWSxFQUFFLElBQUksb0JBQW9CLENBQUMsY0FBYyxDQUFDO2dCQUNwRCxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDO1lBRUYsdUJBQXVCO1lBQ3ZCLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ25ELGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixXQUFXLEVBQUUseUJBQXlCO2dCQUN0QyxtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsU0FBUyxFQUFFLE1BQU07d0JBQ2pCLFFBQVEsRUFBRSxpQkFBaUI7cUJBQzVCO2lCQUNGO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUM5QyxNQUFNO1FBQ04sTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLG1CQUFtQixDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssQ0FBQyxVQUFVLENBQ2QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDekIsVUFBVSxFQUFFLFdBQVc7WUFDdkIsUUFBUSxFQUFFO2dCQUNSLG9CQUFvQjtnQkFDcEIsZUFBZTthQUNoQjtZQUNELG1CQUFtQixFQUFFLENBQUMsY0FBYyxDQUFDO1NBQ3RDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLHNDQUFzQyxFQUFFLE1BQU07S0FDL0M7Q0FDRixDQUFDLENBQUM7QUFDSCxJQUFJLDZCQUE2QixDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7SUFDdEQsV0FBVyxFQUFFLElBQUkscUNBQXVCLEVBQUU7Q0FDM0MsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgUGlwZWxpbmVTdGFjayBwcmFnbWE6c2V0LWNvbnRleHQ6QGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzPXRydWVcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IEFwcCwgQ2ZuUmVzb3VyY2UsIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcywgU3RhZ2UsIFN0YWdlUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNka3AgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcblxuY2xhc3MgTXlTdGFnZSBleHRlbmRzIFN0YWdlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFnZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh0aGlzLCAnU3RhY2snLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcblxuICAgIG5ldyBzM19hc3NldHMuQXNzZXQoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0aGVscGVycy9hc3NldHMvdGVzdC1maWxlLWFzc2V0LnR4dCcpLFxuICAgIH0pO1xuICAgIG5ldyBzM19hc3NldHMuQXNzZXQoc3RhY2ssICdBc3NldDInLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdGhlbHBlcnMvYXNzZXRzL3Rlc3QtZmlsZS1hc3NldC10d28udHh0JyksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlRlc3Q6OlNvbWVSZXNvdXJjZScsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgc3RhY2sgdGhhdCBkZWZpbmVzIHRoZSBhcHBsaWNhdGlvbiBwaXBlbGluZVxuICovXG5jbGFzcyBDZGtwaXBlbGluZXNEZW1vUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdDbG91ZEFzbScpO1xuICAgIGNvbnN0IGludGVnVGVzdEFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnSW50ZWdUZXN0cycpO1xuXG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnU291cmNlQnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY2RrcC5DZGtQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG5cbiAgICAgIC8vIFdoZXJlIHRoZSBzb3VyY2UgY2FuIGJlIGZvdW5kXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgIGJ1Y2tldDogc291cmNlQnVja2V0LFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBidWNrZXRLZXk6ICdrZXknLFxuICAgICAgICBhY3Rpb25OYW1lOiAnUzMnLFxuICAgICAgfSksXG5cbiAgICAgIC8vIEhvdyBpdCB3aWxsIGJlIGJ1aWx0XG4gICAgICBzeW50aEFjdGlvbjogY2RrcC5TaW1wbGVTeW50aEFjdGlvbi5zdGFuZGFyZE5wbVN5bnRoKHtcbiAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgcHJvamVjdE5hbWU6ICdNeVNlcnZpY2VQaXBlbGluZS1zeW50aCcsXG4gICAgICAgIGFkZGl0aW9uYWxBcnRpZmFjdHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXJlY3Rvcnk6ICd0ZXN0JyxcbiAgICAgICAgICAgIGFydGlmYWN0OiBpbnRlZ1Rlc3RBcnRpZmFjdCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGlzIHdoZXJlIHdlIGFkZCB0aGUgYXBwbGljYXRpb24gc3RhZ2VzXG4gICAgLy8gLi4uXG4gICAgY29uc3Qgc3RhZ2UgPSBwaXBlbGluZS5hZGRBcHBsaWNhdGlvblN0YWdlKG5ldyBNeVN0YWdlKHRoaXMsICdQcmVQcm9kJykpO1xuICAgIHN0YWdlLmFkZEFjdGlvbnMoXG4gICAgICBuZXcgY2RrcC5TaGVsbFNjcmlwdEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdVc2VTb3VyY2UnLFxuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgIC8vIENvbWVzIGZyb20gc291cmNlXG4gICAgICAgICAgJ2NhdCBSRUFETUUubWQnLFxuICAgICAgICBdLFxuICAgICAgICBhZGRpdGlvbmFsQXJ0aWZhY3RzOiBbc291cmNlQXJ0aWZhY3RdLFxuICAgICAgfSksXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgY29udGV4dDoge1xuICAgICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiAndHJ1ZScsXG4gIH0sXG59KTtcbm5ldyBDZGtwaXBlbGluZXNEZW1vUGlwZWxpbmVTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJywge1xuICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKCksXG59KTtcbmFwcC5zeW50aCgpO1xuIl19
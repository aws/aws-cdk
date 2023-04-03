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
            singlePublisherPerType: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtd2l0aC1hc3NldHMtc2luZ2xlLXVwbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLXdpdGgtYXNzZXRzLXNpbmdsZS11cGxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RkFBeUY7QUFDekYsNkJBQTZCO0FBQzdCLDZEQUE2RDtBQUM3RCw2RUFBNkU7QUFDN0UseUNBQXlDO0FBQ3pDLHVEQUF1RDtBQUN2RCw2Q0FBNkg7QUFFN0gsOENBQThDO0FBRTlDLE1BQU0sT0FBUSxTQUFRLG1CQUFLO0lBQ3pCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDckMsR0FBRyxLQUFLO1lBQ1IsV0FBVyxFQUFFLElBQUkscUNBQXVCLEVBQUU7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDbEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHdDQUF3QyxDQUFDO1NBQ3JFLENBQUMsQ0FBQztRQUNILElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ25DLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw0Q0FBNEMsQ0FBQztTQUN6RSxDQUFDLENBQUM7UUFFSCxJQUFJLHlCQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUNqQyxJQUFJLEVBQUUseUJBQXlCO1NBQ2hDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSw2QkFBOEIsU0FBUSxtQkFBSztJQUMvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELE1BQU0scUJBQXFCLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWxFLE1BQU0sWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3ZELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0RCxxQkFBcUI7WUFDckIsc0JBQXNCLEVBQUUsSUFBSTtZQUU1QixnQ0FBZ0M7WUFDaEMsWUFBWSxFQUFFLElBQUksb0JBQW9CLENBQUMsY0FBYyxDQUFDO2dCQUNwRCxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDO1lBRUYsdUJBQXVCO1lBQ3ZCLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ25ELGNBQWM7Z0JBQ2QscUJBQXFCO2dCQUNyQixXQUFXLEVBQUUseUJBQXlCO2dCQUN0QyxtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsU0FBUyxFQUFFLE1BQU07d0JBQ2pCLFFBQVEsRUFBRSxpQkFBaUI7cUJBQzVCO2lCQUNGO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUM5QyxNQUFNO1FBQ04sTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLG1CQUFtQixDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssQ0FBQyxVQUFVLENBQ2QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDekIsVUFBVSxFQUFFLFdBQVc7WUFDdkIsUUFBUSxFQUFFO2dCQUNSLG9CQUFvQjtnQkFDcEIsZUFBZTthQUNoQjtZQUNELG1CQUFtQixFQUFFLENBQUMsY0FBYyxDQUFDO1NBQ3RDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLHNDQUFzQyxFQUFFLE1BQU07S0FDL0M7Q0FDRixDQUFDLENBQUM7QUFDSCxJQUFJLDZCQUE2QixDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7SUFDdEQsV0FBVyxFQUFFLElBQUkscUNBQXVCLEVBQUU7Q0FDM0MsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgUGlwZWxpbmVTdGFjayBwcmFnbWE6c2V0LWNvbnRleHQ6QGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzPXRydWVcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IEFwcCwgQ2ZuUmVzb3VyY2UsIFJlbW92YWxQb2xpY3ksIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLCBTdGFjaywgU3RhY2tQcm9wcywgU3RhZ2UsIFN0YWdlUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNka3AgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcblxuY2xhc3MgTXlTdGFnZSBleHRlbmRzIFN0YWdlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFnZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh0aGlzLCAnU3RhY2snLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcblxuICAgIG5ldyBzM19hc3NldHMuQXNzZXQoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0aGVscGVycy9hc3NldHMvdGVzdC1maWxlLWFzc2V0LnR4dCcpLFxuICAgIH0pO1xuICAgIG5ldyBzM19hc3NldHMuQXNzZXQoc3RhY2ssICdBc3NldDInLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdGhlbHBlcnMvYXNzZXRzL3Rlc3QtZmlsZS1hc3NldC10d28udHh0JyksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlRlc3Q6OlNvbWVSZXNvdXJjZScsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgc3RhY2sgdGhhdCBkZWZpbmVzIHRoZSBhcHBsaWNhdGlvbiBwaXBlbGluZVxuICovXG5jbGFzcyBDZGtwaXBlbGluZXNEZW1vUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdDbG91ZEFzbScpO1xuICAgIGNvbnN0IGludGVnVGVzdEFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnSW50ZWdUZXN0cycpO1xuXG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnU291cmNlQnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY2RrcC5DZGtQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICBzaW5nbGVQdWJsaXNoZXJQZXJUeXBlOiB0cnVlLFxuXG4gICAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICBidWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgYnVja2V0S2V5OiAna2V5JyxcbiAgICAgICAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgICAgIH0pLFxuXG4gICAgICAvLyBIb3cgaXQgd2lsbCBiZSBidWlsdFxuICAgICAgc3ludGhBY3Rpb246IGNka3AuU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgIHByb2plY3ROYW1lOiAnTXlTZXJ2aWNlUGlwZWxpbmUtc3ludGgnLFxuICAgICAgICBhZGRpdGlvbmFsQXJ0aWZhY3RzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiAndGVzdCcsXG4gICAgICAgICAgICBhcnRpZmFjdDogaW50ZWdUZXN0QXJ0aWZhY3QsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBpcyB3aGVyZSB3ZSBhZGQgdGhlIGFwcGxpY2F0aW9uIHN0YWdlc1xuICAgIC8vIC4uLlxuICAgIGNvbnN0IHN0YWdlID0gcGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShuZXcgTXlTdGFnZSh0aGlzLCAnUHJlUHJvZCcpKTtcbiAgICBzdGFnZS5hZGRBY3Rpb25zKFxuICAgICAgbmV3IGNka3AuU2hlbGxTY3JpcHRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnVXNlU291cmNlJyxcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAvLyBDb21lcyBmcm9tIHNvdXJjZVxuICAgICAgICAgICdjYXQgUkVBRE1FLm1kJyxcbiAgICAgICAgXSxcbiAgICAgICAgYWRkaXRpb25hbEFydGlmYWN0czogW3NvdXJjZUFydGlmYWN0XSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIGNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogJ3RydWUnLFxuICB9LFxufSk7XG5uZXcgQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcigpLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
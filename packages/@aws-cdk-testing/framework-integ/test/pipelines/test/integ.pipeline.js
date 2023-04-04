"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cdkp = require("aws-cdk-lib/pipelines");
class MyStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'Stack', {
            ...props,
            synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlGQUF5RjtBQUN6Riw2REFBNkQ7QUFDN0QsNkVBQTZFO0FBQzdFLHlDQUF5QztBQUN6Qyw2Q0FBNkg7QUFFN0gsOENBQThDO0FBRTlDLE1BQU0sT0FBUSxTQUFRLG1CQUFLO0lBQ3pCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDckMsR0FBRyxLQUFLO1lBQ1IsV0FBVyxFQUFFLElBQUkscUNBQXVCLEVBQUU7U0FDM0MsQ0FBQyxDQUFDO1FBQ0gsSUFBSSx5QkFBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDakMsSUFBSSxFQUFFLHlCQUF5QjtTQUNoQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sNkJBQThCLFNBQVEsbUJBQUs7SUFDL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLGNBQWMsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxNQUFNLHFCQUFxQixHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRSxNQUFNLGlCQUFpQixHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVsRSxNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN2RCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQscUJBQXFCO1lBRXJCLGdDQUFnQztZQUNoQyxZQUFZLEVBQUUsSUFBSSxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7Z0JBQ3BELE1BQU0sRUFBRSxZQUFZO2dCQUNwQixNQUFNLEVBQUUsY0FBYztnQkFDdEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUM7WUFFRix1QkFBdUI7WUFDdkIsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDbkQsY0FBYztnQkFDZCxxQkFBcUI7Z0JBQ3JCLFdBQVcsRUFBRSx5QkFBeUI7Z0JBQ3RDLG1CQUFtQixFQUFFO29CQUNuQjt3QkFDRSxTQUFTLEVBQUUsTUFBTTt3QkFDakIsUUFBUSxFQUFFLGlCQUFpQjtxQkFDNUI7aUJBQ0Y7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsOENBQThDO1FBQzlDLE1BQU07UUFDTixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLFVBQVUsQ0FDZCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUN6QixVQUFVLEVBQUUsV0FBVztZQUN2QixRQUFRLEVBQUU7Z0JBQ1Isb0JBQW9CO2dCQUNwQixlQUFlO2FBQ2hCO1lBQ0QsbUJBQW1CLEVBQUUsQ0FBQyxjQUFjLENBQUM7U0FDdEMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsT0FBTyxFQUFFO1FBQ1Asc0NBQXNDLEVBQUUsTUFBTTtLQUMvQztDQUNGLENBQUMsQ0FBQztBQUNILElBQUksNkJBQTZCLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUN0RCxXQUFXLEVBQUUsSUFBSSxxQ0FBdUIsRUFBRTtDQUMzQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBQaXBlbGluZVN0YWNrIHByYWdtYTpzZXQtY29udGV4dDpAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXM9dHJ1ZVxuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIENmblJlc291cmNlLCBEZWZhdWx0U3RhY2tTeW50aGVzaXplciwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMsIFN0YWdlLCBTdGFnZVByb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGtwIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XG5cbmNsYXNzIE15U3RhZ2UgZXh0ZW5kcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodGhpcywgJ1N0YWNrJywge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKCksXG4gICAgfSk7XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpUZXN0OjpTb21lUmVzb3VyY2UnLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHN0YWNrIHRoYXQgZGVmaW5lcyB0aGUgYXBwbGljYXRpb24gcGlwZWxpbmVcbiAqL1xuY2xhc3MgQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgY2xvdWRBc3NlbWJseUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQ2xvdWRBc20nKTtcbiAgICBjb25zdCBpbnRlZ1Rlc3RBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0ludGVnVGVzdHMnKTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NvdXJjZUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNka3AuQ2RrUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgY2xvdWRBc3NlbWJseUFydGlmYWN0LFxuXG4gICAgICAvLyBXaGVyZSB0aGUgc291cmNlIGNhbiBiZSBmb3VuZFxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICBidWNrZXQ6IHNvdXJjZUJ1Y2tldCxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgYnVja2V0S2V5OiAna2V5JyxcbiAgICAgICAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgICAgIH0pLFxuXG4gICAgICAvLyBIb3cgaXQgd2lsbCBiZSBidWlsdFxuICAgICAgc3ludGhBY3Rpb246IGNka3AuU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgIHByb2plY3ROYW1lOiAnTXlTZXJ2aWNlUGlwZWxpbmUtc3ludGgnLFxuICAgICAgICBhZGRpdGlvbmFsQXJ0aWZhY3RzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiAndGVzdCcsXG4gICAgICAgICAgICBhcnRpZmFjdDogaW50ZWdUZXN0QXJ0aWZhY3QsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBpcyB3aGVyZSB3ZSBhZGQgdGhlIGFwcGxpY2F0aW9uIHN0YWdlc1xuICAgIC8vIC4uLlxuICAgIGNvbnN0IHN0YWdlID0gcGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShuZXcgTXlTdGFnZSh0aGlzLCAnUHJlUHJvZCcpKTtcbiAgICBzdGFnZS5hZGRBY3Rpb25zKFxuICAgICAgbmV3IGNka3AuU2hlbGxTY3JpcHRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnVXNlU291cmNlJyxcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAvLyBDb21lcyBmcm9tIHNvdXJjZVxuICAgICAgICAgICdjYXQgUkVBRE1FLm1kJyxcbiAgICAgICAgXSxcbiAgICAgICAgYWRkaXRpb25hbEFydGlmYWN0czogW3NvdXJjZUFydGlmYWN0XSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIGNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogJ3RydWUnLFxuICB9LFxufSk7XG5uZXcgQ2RrcGlwZWxpbmVzRGVtb1BpcGVsaW5lU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcigpLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
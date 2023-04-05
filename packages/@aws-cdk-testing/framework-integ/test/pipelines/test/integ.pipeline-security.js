"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCdkStack = void 0;
/// !cdk-integ PipelineSecurityStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const sns = require("aws-cdk-lib/aws-sns");
const subscriptions = require("aws-cdk-lib/aws-sns-subscriptions");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const cdkp = require("aws-cdk-lib/pipelines");
class MyStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'MyStack', {
            synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
        });
        const topic = new sns.Topic(stack, 'Topic');
        topic.grantPublish(new iam.AccountPrincipal(stack.account));
    }
}
class MySafeStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'MySafeStack', {
            synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
        });
        new sns.Topic(stack, 'MySafeTopic');
    }
}
class TestCdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
        const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const pipeline = new cdkp.CdkPipeline(this, 'TestPipeline', {
            selfMutating: false,
            pipelineName: 'TestPipeline',
            cloudAssemblyArtifact,
            sourceAction: new codepipeline_actions.S3SourceAction({
                bucket: sourceBucket,
                output: sourceArtifact,
                bucketKey: 'key',
                actionName: 'S3',
            }),
            synthAction: cdkp.SimpleSynthAction.standardYarnSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: 'yarn build',
            }),
        });
        const pipelineStage = pipeline.codePipeline.addStage({
            stageName: 'UnattachedStage',
        });
        const unattachedStage = new cdkp.CdkStage(this, 'UnattachedStage', {
            stageName: 'UnattachedStage',
            pipelineStage,
            cloudAssemblyArtifact,
            host: {
                publishAsset: () => undefined,
                stackOutputArtifact: () => undefined,
            },
        });
        const topic = new sns.Topic(this, 'SecurityChangesTopic');
        topic.addSubscription(new subscriptions.EmailSubscription('test@email.com'));
        unattachedStage.addApplication(new MyStage(this, 'SingleStage', {}), { confirmBroadeningPermissions: true, securityNotificationTopic: topic });
        const stage1 = pipeline.addApplicationStage(new MyStage(this, 'PreProduction', {}), { confirmBroadeningPermissions: true, securityNotificationTopic: topic });
        stage1.addApplication(new MySafeStage(this, 'SafeProduction', {}));
        stage1.addApplication(new MySafeStage(this, 'DisableSecurityCheck', {}), { confirmBroadeningPermissions: false });
        const stage2 = pipeline.addApplicationStage(new MyStage(this, 'NoSecurityCheck', {}));
        stage2.addApplication(new MyStage(this, 'EnableSecurityCheck', {}), { confirmBroadeningPermissions: true });
    }
}
exports.TestCdkStack = TestCdkStack;
const app = new aws_cdk_lib_1.App({
    context: {
        '@aws-cdk/core:newStyleStackSynthesis': 'true',
    },
});
const stack = new TestCdkStack(app, 'PipelineSecurityStack', {
    synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
});
new integ.IntegTest(app, 'PipelineSecurityTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtc2VjdXJpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS1zZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpR0FBaUc7QUFDakcsNkRBQTZEO0FBQzdELDZFQUE2RTtBQUM3RSwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLDJDQUEyQztBQUMzQyxtRUFBbUU7QUFDbkUsNkNBQWdIO0FBQ2hILG9EQUFvRDtBQUVwRCw4Q0FBOEM7QUFFOUMsTUFBTSxPQUFRLFNBQVEsbUJBQUs7SUFDekIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN2QyxXQUFXLEVBQUUsSUFBSSxxQ0FBdUIsRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztDQUNGO0FBRUQsTUFBTSxXQUFZLFNBQVEsbUJBQUs7SUFDN0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMzQyxXQUFXLEVBQUUsSUFBSSxxQ0FBdUIsRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENB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QUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsRUFDaEYsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxFQUFHLENBQUMsRUFBRSxFQUFFLDRCQUE0QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDL0csQ0FBQztDQUNGO0FBL0RELG9DQStEQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsQ0FBQztJQUNsQixPQUFPLEVBQUU7UUFDUCxzQ0FBc0MsRUFBRSxNQUFNO0tBQy9DO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLHVCQUF1QixFQUFFO0lBQzNELFdBQVcsRUFBRSxJQUFJLHFDQUF1QixFQUFFO0NBQzNDLENBQUMsQ0FBQztBQUVILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIFBpcGVsaW5lU2VjdXJpdHlTdGFjayBwcmFnbWE6c2V0LWNvbnRleHQ6QGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzPXRydWVcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc3Vic2NyaXB0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBEZWZhdWx0U3RhY2tTeW50aGVzaXplciwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMsIFN0YWdlLCBTdGFnZVByb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGtwIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XG5cbmNsYXNzIE15U3RhZ2UgZXh0ZW5kcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHRoaXMsICdNeVN0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcigpLFxuICAgIH0pO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ1RvcGljJyk7XG4gICAgdG9waWMuZ3JhbnRQdWJsaXNoKG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbChzdGFjay5hY2NvdW50KSk7XG4gIH1cbn1cblxuY2xhc3MgTXlTYWZlU3RhZ2UgZXh0ZW5kcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHRoaXMsICdNeVNhZmVTdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcbiAgICBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlTYWZlVG9waWMnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVzdENka1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0Nsb3VkQXNtJyk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnU291cmNlQnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjZGtwLkNka1BpcGVsaW5lKHRoaXMsICdUZXN0UGlwZWxpbmUnLCB7XG4gICAgICBzZWxmTXV0YXRpbmc6IGZhbHNlLFxuICAgICAgcGlwZWxpbmVOYW1lOiAnVGVzdFBpcGVsaW5lJyxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgIHNvdXJjZUFjdGlvbjogbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgYnVja2V0OiBzb3VyY2VCdWNrZXQsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGJ1Y2tldEtleTogJ2tleScsXG4gICAgICAgIGFjdGlvbk5hbWU6ICdTMycsXG4gICAgICB9KSxcbiAgICAgIHN5bnRoQWN0aW9uOiBjZGtwLlNpbXBsZVN5bnRoQWN0aW9uLnN0YW5kYXJkWWFyblN5bnRoKHtcbiAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgYnVpbGRDb21tYW5kOiAneWFybiBidWlsZCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpcGVsaW5lU3RhZ2UgPSBwaXBlbGluZS5jb2RlUGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnVW5hdHRhY2hlZFN0YWdlJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVuYXR0YWNoZWRTdGFnZSA9IG5ldyBjZGtwLkNka1N0YWdlKHRoaXMsICdVbmF0dGFjaGVkU3RhZ2UnLCB7XG4gICAgICBzdGFnZU5hbWU6ICdVbmF0dGFjaGVkU3RhZ2UnLFxuICAgICAgcGlwZWxpbmVTdGFnZSxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgIGhvc3Q6IHtcbiAgICAgICAgcHVibGlzaEFzc2V0OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICAgIHN0YWNrT3V0cHV0QXJ0aWZhY3Q6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ1NlY3VyaXR5Q2hhbmdlc1RvcGljJyk7XG4gICAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzY3JpcHRpb25zLkVtYWlsU3Vic2NyaXB0aW9uKCd0ZXN0QGVtYWlsLmNvbScpKTtcblxuICAgIHVuYXR0YWNoZWRTdGFnZS5hZGRBcHBsaWNhdGlvbihuZXcgTXlTdGFnZSh0aGlzLCAnU2luZ2xlU3RhZ2UnLCB7XG4gICAgfSksIHsgY29uZmlybUJyb2FkZW5pbmdQZXJtaXNzaW9uczogdHJ1ZSwgc2VjdXJpdHlOb3RpZmljYXRpb25Ub3BpYzogdG9waWMgfSk7XG5cbiAgICBjb25zdCBzdGFnZTEgPSBwaXBlbGluZS5hZGRBcHBsaWNhdGlvblN0YWdlKG5ldyBNeVN0YWdlKHRoaXMsICdQcmVQcm9kdWN0aW9uJywge1xuICAgIH0pLCB7IGNvbmZpcm1Ccm9hZGVuaW5nUGVybWlzc2lvbnM6IHRydWUsIHNlY3VyaXR5Tm90aWZpY2F0aW9uVG9waWM6IHRvcGljIH0pO1xuXG4gICAgc3RhZ2UxLmFkZEFwcGxpY2F0aW9uKG5ldyBNeVNhZmVTdGFnZSh0aGlzLCAnU2FmZVByb2R1Y3Rpb24nLCB7XG4gICAgfSkpO1xuXG4gICAgc3RhZ2UxLmFkZEFwcGxpY2F0aW9uKG5ldyBNeVNhZmVTdGFnZSh0aGlzLCAnRGlzYWJsZVNlY3VyaXR5Q2hlY2snLCB7XG4gICAgfSksIHsgY29uZmlybUJyb2FkZW5pbmdQZXJtaXNzaW9uczogZmFsc2UgfSk7XG5cbiAgICBjb25zdCBzdGFnZTIgPSBwaXBlbGluZS5hZGRBcHBsaWNhdGlvblN0YWdlKG5ldyBNeVN0YWdlKHRoaXMsICdOb1NlY3VyaXR5Q2hlY2snLCB7XG4gICAgfSkpO1xuXG4gICAgc3RhZ2UyLmFkZEFwcGxpY2F0aW9uKG5ldyBNeVN0YWdlKHRoaXMsICdFbmFibGVTZWN1cml0eUNoZWNrJywgeyB9KSwgeyBjb25maXJtQnJvYWRlbmluZ1Blcm1pc3Npb25zOiB0cnVlIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICBjb250ZXh0OiB7XG4gICAgJ0Bhd3MtY2RrL2NvcmU6bmV3U3R5bGVTdGFja1N5bnRoZXNpcyc6ICd0cnVlJyxcbiAgfSxcbn0pO1xuY29uc3Qgc3RhY2sgPSBuZXcgVGVzdENka1N0YWNrKGFwcCwgJ1BpcGVsaW5lU2VjdXJpdHlTdGFjaycsIHtcbiAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcigpLFxufSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnUGlwZWxpbmVTZWN1cml0eVRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
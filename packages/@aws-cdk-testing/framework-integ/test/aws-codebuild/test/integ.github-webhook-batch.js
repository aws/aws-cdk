"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const source = codebuild.Source.gitHub({
            owner: 'aws',
            repo: 'aws-cdk',
            reportBuildStatus: false,
            webhook: true,
            webhookTriggersBatchBuild: true,
            webhookFilters: [
                codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH),
            ],
        });
        new codebuild.Project(this, 'MyProject', {
            source,
            grantReportGroupPermissions: false,
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'test-codebuild-github-webhook-batch');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZ2l0aHViLXdlYmhvb2stYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5naXRodWItd2ViaG9vay1iYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx1REFBdUQ7QUFFdkQsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLFNBQVM7WUFDZixpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IseUJBQXlCLEVBQUUsSUFBSTtZQUMvQixjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7YUFDNUQ7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN2QyxNQUFNO1lBQ04sMkJBQTJCLEVBQUUsS0FBSztTQUNuQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUNBQXFDLENBQUMsQ0FBQztBQUUxRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICBvd25lcjogJ2F3cycsXG4gICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICByZXBvcnRCdWlsZFN0YXR1czogZmFsc2UsXG4gICAgICB3ZWJob29rOiB0cnVlLFxuICAgICAgd2ViaG9va1RyaWdnZXJzQmF0Y2hCdWlsZDogdHJ1ZSxcbiAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXG4gICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgJ015UHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZSxcbiAgICAgIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICd0ZXN0LWNvZGVidWlsZC1naXRodWItd2ViaG9vay1iYXRjaCcpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
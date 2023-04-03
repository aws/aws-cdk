"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZ2l0aHViLXdlYmhvb2stYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5naXRodWItd2ViaG9vay1iYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFFcEMsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLFNBQVM7WUFDZixpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IseUJBQXlCLEVBQUUsSUFBSTtZQUMvQixjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7YUFDNUQ7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN2QyxNQUFNO1lBQ04sMkJBQTJCLEVBQUUsS0FBSztTQUNuQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFFMUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViKHtcbiAgICAgIG93bmVyOiAnYXdzJyxcbiAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgIHJlcG9ydEJ1aWxkU3RhdHVzOiBmYWxzZSxcbiAgICAgIHdlYmhvb2s6IHRydWUsXG4gICAgICB3ZWJob29rVHJpZ2dlcnNCYXRjaEJ1aWxkOiB0cnVlLFxuICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcbiAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSCksXG4gICAgICBdLFxuICAgIH0pO1xuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCAnTXlQcm9qZWN0Jywge1xuICAgICAgc291cmNlLFxuICAgICAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ3Rlc3QtY29kZWJ1aWxkLWdpdGh1Yi13ZWJob29rLWJhdGNoJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19
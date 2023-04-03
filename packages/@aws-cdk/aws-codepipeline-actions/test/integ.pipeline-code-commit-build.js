"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
/* eslint-disable quote-props */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-codebuild');
const repository = new codecommit.Repository(stack, 'MyRepo', {
    repositoryName: 'my-repo',
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.CodeCommitSourceAction({
    actionName: 'source',
    output: sourceOutput,
    repository,
    trigger: cpactions.CodeCommitTrigger.POLL,
});
const project = new codebuild.PipelineProject(stack, 'MyBuildProject', {
    grantReportGroupPermissions: false,
});
const buildAction = new cpactions.CodeBuildAction({
    actionName: 'build',
    project,
    input: sourceOutput,
    outputs: [new codepipeline.Artifact()],
    environmentVariables: {
        'TEST_ENV_VARIABLE': {
            value: 'test env variable value',
        },
        'PARAM_STORE_VARIABLE': {
            value: 'param_store',
            type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
    },
});
const testAction = new cpactions.CodeBuildAction({
    type: cpactions.CodeBuildActionType.TEST,
    actionName: 'test',
    project,
    input: sourceOutput,
});
new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
        {
            stageName: 'source',
            actions: [sourceAction],
        },
    ],
}).addStage({
    stageName: 'build',
    actions: [
        buildAction,
        testAction,
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY29kZS1jb21taXQtYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS1jb2RlLWNvbW1pdC1idWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFvRDtBQUNwRCxzREFBc0Q7QUFDdEQsMERBQTBEO0FBQzFELHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFFcEMsZ0NBQWdDO0FBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztBQUU5RSxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUM1RCxjQUFjLEVBQUUsU0FBUztDQUMxQixDQUFDLENBQUM7QUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRSxNQUFNLFlBQVksR0FBRyxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztJQUN4RCxVQUFVLEVBQUUsUUFBUTtJQUNwQixNQUFNLEVBQUUsWUFBWTtJQUNwQixVQUFVO0lBQ1YsT0FBTyxFQUFFLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJO0NBQzFDLENBQUMsQ0FBQztBQUVILE1BQU0sT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDckUsMkJBQTJCLEVBQUUsS0FBSztDQUNuQyxDQUFDLENBQUM7QUFDSCxNQUFNLFdBQVcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7SUFDaEQsVUFBVSxFQUFFLE9BQU87SUFDbkIsT0FBTztJQUNQLEtBQUssRUFBRSxZQUFZO0lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RDLG9CQUFvQixFQUFFO1FBQ3BCLG1CQUFtQixFQUFFO1lBQ25CLEtBQUssRUFBRSx5QkFBeUI7U0FDakM7UUFDRCxzQkFBc0IsRUFBRTtZQUN0QixLQUFLLEVBQUUsYUFBYTtZQUNwQixJQUFJLEVBQUUsU0FBUyxDQUFDLDRCQUE0QixDQUFDLGVBQWU7U0FDN0Q7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sVUFBVSxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQztJQUMvQyxJQUFJLEVBQUUsU0FBUyxDQUFDLG1CQUFtQixDQUFDLElBQUk7SUFDeEMsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTztJQUNQLEtBQUssRUFBRSxZQUFZO0NBQ3BCLENBQUMsQ0FBQztBQUVILElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzNDLE1BQU0sRUFBRTtRQUNOO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQ3hCO0tBQ0Y7Q0FDRixDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ1YsU0FBUyxFQUFFLE9BQU87SUFDbEIsT0FBTyxFQUFFO1FBQ1AsV0FBVztRQUNYLFVBQVU7S0FDWDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVwaXBlbGluZS1jb2RlY29tbWl0LWNvZGVidWlsZCcpO1xuXG5jb25zdCByZXBvc2l0b3J5ID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ015UmVwbycsIHtcbiAgcmVwb3NpdG9yeU5hbWU6ICdteS1yZXBvJyxcbn0pO1xuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbmNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdzb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgcmVwb3NpdG9yeSxcbiAgdHJpZ2dlcjogY3BhY3Rpb25zLkNvZGVDb21taXRUcmlnZ2VyLlBPTEwsXG59KTtcblxuY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlCdWlsZFByb2plY3QnLCB7XG4gIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG59KTtcbmNvbnN0IGJ1aWxkQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnYnVpbGQnLFxuICBwcm9qZWN0LFxuICBpbnB1dDogc291cmNlT3V0cHV0LFxuICBvdXRwdXRzOiBbbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpXSxcbiAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAnVEVTVF9FTlZfVkFSSUFCTEUnOiB7XG4gICAgICB2YWx1ZTogJ3Rlc3QgZW52IHZhcmlhYmxlIHZhbHVlJyxcbiAgICB9LFxuICAgICdQQVJBTV9TVE9SRV9WQVJJQUJMRSc6IHtcbiAgICAgIHZhbHVlOiAncGFyYW1fc3RvcmUnLFxuICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUEFSQU1FVEVSX1NUT1JFLFxuICAgIH0sXG4gIH0sXG59KTtcbmNvbnN0IHRlc3RBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gIHR5cGU6IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb25UeXBlLlRFU1QsXG4gIGFjdGlvbk5hbWU6ICd0ZXN0JyxcbiAgcHJvamVjdCxcbiAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbn0pO1xuXG5uZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ3NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXSxcbiAgICB9LFxuICBdLFxufSkuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdidWlsZCcsXG4gIGFjdGlvbnM6IFtcbiAgICBidWlsZEFjdGlvbixcbiAgICB0ZXN0QWN0aW9uLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
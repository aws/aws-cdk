"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("aws-cdk-lib/aws-codebuild");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws codebuild list-builds-for-project --project-name <deployed project name>: should return a list of projects with size greater than 0
 * *
 * * aws codebuild batch-get-builds --ids <build id returned by list-builds-for-project> --query 'builds[0].buildStatus': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> --query 'status': should return status as SUCCEEDED
 */
class StartBuildStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        let project = new codebuild.Project(this, 'Project', {
            projectName: 'MyTestProject',
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    build: {
                        commands: [
                            'echo "Hello, CodeBuild!"',
                        ],
                    },
                },
            }),
            environmentVariables: {
                zone: {
                    type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                    value: 'defaultZone',
                },
            },
        });
        let startBuild = new tasks.CodeBuildStartBuild(this, 'build-task', {
            project: project,
            environmentVariablesOverride: {
                ZONE: {
                    type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                    value: sfn.JsonPath.stringAt('$.envVariables.zone'),
                },
            },
        });
        const definition = new sfn.Pass(this, 'Start', {
            result: sfn.Result.fromObject({ bar: 'SomeValue' }),
        }).next(startBuild);
        const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
            definition,
        });
        new cdk.CfnOutput(this, 'ProjectName', {
            value: project.projectName,
        });
        new cdk.CfnOutput(this, 'StateMachineArn', {
            value: stateMachine.stateMachineArn,
        });
    }
}
const app = new cdk.App();
new StartBuildStack(app, 'aws-stepfunctions-tasks-codebuild-start-build-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3RhcnQtYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zdGFydC1idWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUF1RDtBQUN2RCxxREFBcUQ7QUFDckQsbUNBQW1DO0FBQ25DLDZEQUE2RDtBQUU3RDs7Ozs7OztHQU9HO0FBRUgsTUFBTSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ25ELFdBQVcsRUFBRSxlQUFlO1lBQzVCLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRTt3QkFDTCxRQUFRLEVBQUU7NEJBQ1IsMEJBQTBCO3lCQUMzQjtxQkFDRjtpQkFDRjthQUNGLENBQUM7WUFDRixvQkFBb0IsRUFBRTtnQkFDcEIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxTQUFTLENBQUMsNEJBQTRCLENBQUMsU0FBUztvQkFDdEQsS0FBSyxFQUFFLGFBQWE7aUJBQ3JCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2pFLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLDRCQUE0QixFQUFFO2dCQUM1QixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTO29CQUN0RCxLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7aUJBQ3BEO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUM3QyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUM7U0FDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVwQixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM5RCxVQUFVO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDckMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxXQUFXO1NBQzNCLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDekMsS0FBSyxFQUFFLFlBQVksQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxxREFBcUQsQ0FBQyxDQUFDO0FBQ2hGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgdGFza3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MnO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8ZGVwbG95ZWQgc3RhdGUgbWFjaGluZSBhcm4+IDogc2hvdWxkIHJldHVybiBleGVjdXRpb24gYXJuXG4gKiAqIGF3cyBjb2RlYnVpbGQgbGlzdC1idWlsZHMtZm9yLXByb2plY3QgLS1wcm9qZWN0LW5hbWUgPGRlcGxveWVkIHByb2plY3QgbmFtZT46IHNob3VsZCByZXR1cm4gYSBsaXN0IG9mIHByb2plY3RzIHdpdGggc2l6ZSBncmVhdGVyIHRoYW4gMFxuICogKlxuICogKiBhd3MgY29kZWJ1aWxkIGJhdGNoLWdldC1idWlsZHMgLS1pZHMgPGJ1aWxkIGlkIHJldHVybmVkIGJ5IGxpc3QtYnVpbGRzLWZvci1wcm9qZWN0PiAtLXF1ZXJ5ICdidWlsZHNbMF0uYnVpbGRTdGF0dXMnOiB3YWl0IHVudGlsIHRoZSBzdGF0dXMgaXMgJ1NVQ0NFRURFRCdcbiAqICogYXdzIHN0ZXBmdW5jdGlvbnMgZGVzY3JpYmUtZXhlY3V0aW9uIC0tZXhlY3V0aW9uLWFybiA8ZXhlY3Rpb24tYXJuIGdlbmVyYXRlZCBiZWZvcmU+IC0tcXVlcnkgJ3N0YXR1cyc6IHNob3VsZCByZXR1cm4gc3RhdHVzIGFzIFNVQ0NFRURFRFxuICovXG5cbmNsYXNzIFN0YXJ0QnVpbGRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbGV0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgJ1Byb2plY3QnLCB7XG4gICAgICBwcm9qZWN0TmFtZTogJ015VGVzdFByb2plY3QnLFxuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICdlY2hvIFwiSGVsbG8sIENvZGVCdWlsZCFcIicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgIHpvbmU6IHtcbiAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QTEFJTlRFWFQsXG4gICAgICAgICAgdmFsdWU6ICdkZWZhdWx0Wm9uZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHN0YXJ0QnVpbGQgPSBuZXcgdGFza3MuQ29kZUJ1aWxkU3RhcnRCdWlsZCh0aGlzLCAnYnVpbGQtdGFzaycsIHtcbiAgICAgIHByb2plY3Q6IHByb2plY3QsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlc092ZXJyaWRlOiB7XG4gICAgICAgIFpPTkU6IHtcbiAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QTEFJTlRFWFQsXG4gICAgICAgICAgdmFsdWU6IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5lbnZWYXJpYWJsZXMuem9uZScpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBuZXcgc2ZuLlBhc3ModGhpcywgJ1N0YXJ0Jywge1xuICAgICAgcmVzdWx0OiBzZm4uUmVzdWx0LmZyb21PYmplY3QoeyBiYXI6ICdTb21lVmFsdWUnIH0pLFxuICAgIH0pLm5leHQoc3RhcnRCdWlsZCk7XG5cbiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCAnU3RhdGVNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdQcm9qZWN0TmFtZScsIHtcbiAgICAgIHZhbHVlOiBwcm9qZWN0LnByb2plY3ROYW1lLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdTdGF0ZU1hY2hpbmVBcm4nLCB7XG4gICAgICB2YWx1ZTogc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFN0YXJ0QnVpbGRTdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcy1jb2RlYnVpbGQtc3RhcnQtYnVpbGQtaW50ZWcnKTtcbmFwcC5zeW50aCgpO1xuIl19
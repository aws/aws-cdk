"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Creates a state machine with a job poller sample project
 * https://docs.aws.amazon.com/step-functions/latest/dg/sample-project-job-poller.html
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Running`.
 *
 * An external process can call the state machine to send a heartbeat or response before it times out.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Running`
 *
 * CHANGEME: extend this test to create the external resources to report heartbeats
 */
class InvokeActivityStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        const submitJobActivity = new sfn.Activity(this, 'SubmitJob');
        const checkJobActivity = new sfn.Activity(this, 'CheckJob');
        const submitJob = new tasks.StepFunctionsInvokeActivity(this, 'Submit Job', {
            activity: submitJobActivity,
            resultPath: '$.guid',
        });
        const waitX = new sfn.Wait(this, 'Wait X Seconds', { time: sfn.WaitTime.secondsPath('$.wait_time') });
        const getStatus = new tasks.StepFunctionsInvokeActivity(this, 'Get Job Status', {
            activity: checkJobActivity,
            inputPath: '$.guid',
            resultPath: '$.status',
        });
        const isComplete = new sfn.Choice(this, 'Job Complete?');
        const jobFailed = new sfn.Fail(this, 'Job Failed', {
            cause: 'AWS Batch Job Failed',
            error: 'DescribeJob returned FAILED',
        });
        const finalStatus = new tasks.StepFunctionsInvokeActivity(this, 'Get Final Job Status', {
            activity: checkJobActivity,
            inputPath: '$.guid',
            parameters: {
                'input.$': '$',
                'stringArgument': 'inital-task',
                'numberArgument': 123,
                'booleanArgument': true,
                'arrayArgument': ['a', 'b', 'c'],
                'jsonPath': sfn.JsonPath.stringAt('$.status'),
            },
        });
        const chain = sfn.Chain
            .start(submitJob)
            .next(waitX)
            .next(getStatus)
            .next(isComplete
            .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
            .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
            .otherwise(waitX));
        const sm = new sfn.StateMachine(this, 'StateMachine', {
            definition: chain,
            timeout: cdk.Duration.seconds(300),
        });
        new cdk.CfnOutput(this, 'stateMachineArn', {
            value: sm.stateMachineArn,
        });
    }
}
const app = new cdk.App();
new InvokeActivityStack(app, 'aws-stepfunctions-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaW52b2tlLWFjdGl2aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuaW52b2tlLWFjdGl2aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyw2REFBNkQ7QUFFN0Q7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLG1CQUFvQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3pDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5RCxNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFNUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMxRSxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFVBQVUsRUFBRSxRQUFRO1NBQ3JCLENBQUMsQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RHLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUM5RSxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFVBQVUsRUFBRSxVQUFVO1NBQ3ZCLENBQUMsQ0FBQztRQUNILE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDekQsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsS0FBSyxFQUFFLHNCQUFzQjtZQUM3QixLQUFLLEVBQUUsNkJBQTZCO1NBQ3JDLENBQUMsQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUN0RixRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsR0FBRztnQkFDZCxnQkFBZ0IsRUFBRSxhQUFhO2dCQUMvQixnQkFBZ0IsRUFBRSxHQUFHO2dCQUNyQixpQkFBaUIsRUFBRSxJQUFJO2dCQUN2QixlQUFlLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDaEMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzthQUM5QztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLO2FBQ3BCLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNYLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDZixJQUFJLENBQUMsVUFBVTthQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUUsU0FBUyxDQUFDO2FBQ2pFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLEVBQUUsV0FBVyxDQUFDO2FBQ3RFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXZCLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3BELFVBQVUsRUFBRSxLQUFLO1lBQ2pCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxLQUFLLEVBQUUsRUFBRSxDQUFDLGVBQWU7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUN4RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZm4gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxuLypcbiAqIENyZWF0ZXMgYSBzdGF0ZSBtYWNoaW5lIHdpdGggYSBqb2IgcG9sbGVyIHNhbXBsZSBwcm9qZWN0XG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL3NhbXBsZS1wcm9qZWN0LWpvYi1wb2xsZXIuaHRtbFxuICpcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqIFRoZSBnZW5lcmF0ZWQgU3RhdGUgTWFjaGluZSBjYW4gYmUgZXhlY3V0ZWQgZnJvbSB0aGUgQ0xJIChvciBTdGVwIEZ1bmN0aW9ucyBjb25zb2xlKVxuICogYW5kIHJ1bnMgd2l0aCBhbiBleGVjdXRpb24gc3RhdHVzIG9mIGBSdW5uaW5nYC5cbiAqXG4gKiBBbiBleHRlcm5hbCBwcm9jZXNzIGNhbiBjYWxsIHRoZSBzdGF0ZSBtYWNoaW5lIHRvIHNlbmQgYSBoZWFydGJlYXQgb3IgcmVzcG9uc2UgYmVmb3JlIGl0IHRpbWVzIG91dC5cbiAqXG4gKiAtLSBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8c3RhdGUtbWFjaGluZS1hcm4tZnJvbS1vdXRwdXQ+IHByb3ZpZGVzIGV4ZWN1dGlvbiBhcm5cbiAqIC0tIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPHN0YXRlLW1hY2hpbmUtYXJuLWZyb20tb3V0cHV0PiByZXR1cm5zIGEgc3RhdHVzIG9mIGBSdW5uaW5nYFxuICpcbiAqIENIQU5HRU1FOiBleHRlbmQgdGhpcyB0ZXN0IHRvIGNyZWF0ZSB0aGUgZXh0ZXJuYWwgcmVzb3VyY2VzIHRvIHJlcG9ydCBoZWFydGJlYXRzXG4gKi9cbmNsYXNzIEludm9rZUFjdGl2aXR5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHN1Ym1pdEpvYkFjdGl2aXR5ID0gbmV3IHNmbi5BY3Rpdml0eSh0aGlzLCAnU3VibWl0Sm9iJyk7XG4gICAgY29uc3QgY2hlY2tKb2JBY3Rpdml0eSA9IG5ldyBzZm4uQWN0aXZpdHkodGhpcywgJ0NoZWNrSm9iJyk7XG5cbiAgICBjb25zdCBzdWJtaXRKb2IgPSBuZXcgdGFza3MuU3RlcEZ1bmN0aW9uc0ludm9rZUFjdGl2aXR5KHRoaXMsICdTdWJtaXQgSm9iJywge1xuICAgICAgYWN0aXZpdHk6IHN1Ym1pdEpvYkFjdGl2aXR5LFxuICAgICAgcmVzdWx0UGF0aDogJyQuZ3VpZCcsXG4gICAgfSk7XG4gICAgY29uc3Qgd2FpdFggPSBuZXcgc2ZuLldhaXQodGhpcywgJ1dhaXQgWCBTZWNvbmRzJywgeyB0aW1lOiBzZm4uV2FpdFRpbWUuc2Vjb25kc1BhdGgoJyQud2FpdF90aW1lJykgfSk7XG4gICAgY29uc3QgZ2V0U3RhdHVzID0gbmV3IHRhc2tzLlN0ZXBGdW5jdGlvbnNJbnZva2VBY3Rpdml0eSh0aGlzLCAnR2V0IEpvYiBTdGF0dXMnLCB7XG4gICAgICBhY3Rpdml0eTogY2hlY2tKb2JBY3Rpdml0eSxcbiAgICAgIGlucHV0UGF0aDogJyQuZ3VpZCcsXG4gICAgICByZXN1bHRQYXRoOiAnJC5zdGF0dXMnLFxuICAgIH0pO1xuICAgIGNvbnN0IGlzQ29tcGxldGUgPSBuZXcgc2ZuLkNob2ljZSh0aGlzLCAnSm9iIENvbXBsZXRlPycpO1xuICAgIGNvbnN0IGpvYkZhaWxlZCA9IG5ldyBzZm4uRmFpbCh0aGlzLCAnSm9iIEZhaWxlZCcsIHtcbiAgICAgIGNhdXNlOiAnQVdTIEJhdGNoIEpvYiBGYWlsZWQnLFxuICAgICAgZXJyb3I6ICdEZXNjcmliZUpvYiByZXR1cm5lZCBGQUlMRUQnLFxuICAgIH0pO1xuICAgIGNvbnN0IGZpbmFsU3RhdHVzID0gbmV3IHRhc2tzLlN0ZXBGdW5jdGlvbnNJbnZva2VBY3Rpdml0eSh0aGlzLCAnR2V0IEZpbmFsIEpvYiBTdGF0dXMnLCB7XG4gICAgICBhY3Rpdml0eTogY2hlY2tKb2JBY3Rpdml0eSxcbiAgICAgIGlucHV0UGF0aDogJyQuZ3VpZCcsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICdpbnB1dC4kJzogJyQnLFxuICAgICAgICAnc3RyaW5nQXJndW1lbnQnOiAnaW5pdGFsLXRhc2snLFxuICAgICAgICAnbnVtYmVyQXJndW1lbnQnOiAxMjMsXG4gICAgICAgICdib29sZWFuQXJndW1lbnQnOiB0cnVlLFxuICAgICAgICAnYXJyYXlBcmd1bWVudCc6IFsnYScsICdiJywgJ2MnXSxcbiAgICAgICAgJ2pzb25QYXRoJzogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLnN0YXR1cycpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoYWluID0gc2ZuLkNoYWluXG4gICAgICAuc3RhcnQoc3VibWl0Sm9iKVxuICAgICAgLm5leHQod2FpdFgpXG4gICAgICAubmV4dChnZXRTdGF0dXMpXG4gICAgICAubmV4dChpc0NvbXBsZXRlXG4gICAgICAgIC53aGVuKHNmbi5Db25kaXRpb24uc3RyaW5nRXF1YWxzKCckLnN0YXR1cycsICdGQUlMRUQnKSwgam9iRmFpbGVkKVxuICAgICAgICAud2hlbihzZm4uQ29uZGl0aW9uLnN0cmluZ0VxdWFscygnJC5zdGF0dXMnLCAnU1VDQ0VFREVEJyksIGZpbmFsU3RhdHVzKVxuICAgICAgICAub3RoZXJ3aXNlKHdhaXRYKSk7XG5cbiAgICBjb25zdCBzbSA9IG5ldyBzZm4uU3RhdGVNYWNoaW5lKHRoaXMsICdTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBkZWZpbml0aW9uOiBjaGFpbixcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnc3RhdGVNYWNoaW5lQXJuJywge1xuICAgICAgdmFsdWU6IHNtLnN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IEludm9rZUFjdGl2aXR5U3RhY2soYXBwLCAnYXdzLXN0ZXBmdW5jdGlvbnMtaW50ZWcnKTtcbmFwcC5zeW50aCgpO1xuIl19
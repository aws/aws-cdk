"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-custom-state-integ');
const finalStatus = new sfn.Pass(stack, 'final step');
const stateJson = {
    Type: 'Task',
    Resource: 'arn:aws:states:::dynamodb:putItem',
    Parameters: {
        TableName: 'my-cool-table',
        Item: {
            id: {
                S: 'my-entry',
            },
        },
    },
    ResultPath: null,
};
const custom = new sfn.CustomState(stack, 'my custom task', {
    stateJson,
});
const chain = sfn.Chain.start(custom).next(finalStatus);
const sm = new sfn.StateMachine(stack, 'StateMachine', {
    definition: chain,
    timeout: cdk.Duration.seconds(30),
});
new cdk.CfnOutput(stack, 'StateMachineARN', {
    value: sm.stateMachineArn,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY3VzdG9tLXN0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY3VzdG9tLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHFEQUFxRDtBQUVyRDs7OztHQUlHO0FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFdEQsTUFBTSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxFQUFFLE1BQU07SUFDWixRQUFRLEVBQUUsbUNBQW1DO0lBQzdDLFVBQVUsRUFBRTtRQUNWLFNBQVMsRUFBRSxlQUFlO1FBQzFCLElBQUksRUFBRTtZQUNKLEVBQUUsRUFBRTtnQkFDRixDQUFDLEVBQUUsVUFBVTthQUNkO1NBQ0Y7S0FDRjtJQUNELFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzFELFNBQVM7Q0FDVixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFeEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDckQsVUFBVSxFQUFFLEtBQUs7SUFDakIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztDQUNsQyxDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO0lBQzFDLEtBQUssRUFBRSxFQUFFLENBQUMsZUFBZTtDQUMxQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcblxuLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqXG4gKiAtLSBhd3Mgc3RlcGZ1bmN0aW9ucyBkZXNjcmliZS1zdGF0ZS1tYWNoaW5lIC0tc3RhdGUtbWFjaGluZS1hcm4gPHN0YWNrLW91dHB1dD4gaGFzIGEgc3RhdHVzIG9mIGBBQ1RJVkVgXG4gKi9cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLXN0ZXBmdW5jdGlvbnMtY3VzdG9tLXN0YXRlLWludGVnJyk7XG5cbmNvbnN0IGZpbmFsU3RhdHVzID0gbmV3IHNmbi5QYXNzKHN0YWNrLCAnZmluYWwgc3RlcCcpO1xuXG5jb25zdCBzdGF0ZUpzb24gPSB7XG4gIFR5cGU6ICdUYXNrJyxcbiAgUmVzb3VyY2U6ICdhcm46YXdzOnN0YXRlczo6OmR5bmFtb2RiOnB1dEl0ZW0nLFxuICBQYXJhbWV0ZXJzOiB7XG4gICAgVGFibGVOYW1lOiAnbXktY29vbC10YWJsZScsXG4gICAgSXRlbToge1xuICAgICAgaWQ6IHtcbiAgICAgICAgUzogJ215LWVudHJ5JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgUmVzdWx0UGF0aDogbnVsbCxcbn07XG5cbmNvbnN0IGN1c3RvbSA9IG5ldyBzZm4uQ3VzdG9tU3RhdGUoc3RhY2ssICdteSBjdXN0b20gdGFzaycsIHtcbiAgc3RhdGVKc29uLFxufSk7XG5cbmNvbnN0IGNoYWluID0gc2ZuLkNoYWluLnN0YXJ0KGN1c3RvbSkubmV4dChmaW5hbFN0YXR1cyk7XG5cbmNvbnN0IHNtID0gbmV3IHNmbi5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZU1hY2hpbmUnLCB7XG4gIGRlZmluaXRpb246IGNoYWluLFxuICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG59KTtcblxubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdTdGF0ZU1hY2hpbmVBUk4nLCB7XG4gIHZhbHVlOiBzbS5zdGF0ZU1hY2hpbmVBcm4sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
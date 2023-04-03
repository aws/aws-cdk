"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("aws-cdk-lib/aws-events");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
/*
 * Stack verification steps :
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> : should return status as SUCCEEDED
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eventbridge-put-events-integ');
const eventBus = new events.EventBus(stack, 'EventBus', {
    eventBusName: 'MyEventBus1',
});
const putEventsTask = new aws_stepfunctions_tasks_1.EventBridgePutEvents(stack, 'Put Custom Events', {
    entries: [{
            // Entry with no event bus specified
            detail: sfn.TaskInput.fromObject({
                Message: 'Hello from Step Functions!',
            }),
            detailType: 'MessageFromStepFunctions',
            source: 'step.functions',
        }, {
            // Entry with EventBus provided as object
            detail: sfn.TaskInput.fromObject({
                Message: 'Hello from Step Functions!',
            }),
            eventBus,
            detailType: 'MessageFromStepFunctions',
            source: 'step.functions',
        }],
});
const sm = new sfn.StateMachine(stack, 'StateMachine', {
    definition: putEventsTask,
    timeout: cdk.Duration.seconds(30),
});
const testCase = new integ_tests_alpha_1.IntegTest(app, 'PutEvents', {
    testCases: [stack],
});
// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
    stateMachineArn: sm.stateMachineArn,
});
// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
    executionArn: start.getAttString('executionArn'),
});
// assert the results
describe.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    status: 'SUCCEEDED',
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHV0LWV2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnB1dC1ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBaUQ7QUFDakQscURBQXFEO0FBQ3JELG1DQUFtQztBQUNuQyxrRUFBdUU7QUFDdkUsaUZBQTJFO0FBRTNFOzs7O0dBSUc7QUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHNEQUFzRCxDQUFDLENBQUM7QUFFekYsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDdEQsWUFBWSxFQUFFLGFBQWE7Q0FDNUIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSw4Q0FBb0IsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUU7SUFDekUsT0FBTyxFQUFFLENBQUM7WUFDUixvQ0FBb0M7WUFDcEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUMvQixPQUFPLEVBQUUsNEJBQTRCO2FBQ3RDLENBQUM7WUFDRixVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLE1BQU0sRUFBRSxnQkFBZ0I7U0FDekIsRUFBRTtZQUNELHlDQUF5QztZQUN6QyxNQUFNLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSw0QkFBNEI7YUFDdEMsQ0FBQztZQUNGLFFBQVE7WUFDUixVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLE1BQU0sRUFBRSxnQkFBZ0I7U0FDekIsQ0FBQztDQUNILENBQUMsQ0FBQztBQUVILE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ3JELFVBQVUsRUFBRSxhQUFhO0lBQ3pCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Q0FDbEMsQ0FBQyxDQUFDO0FBR0gsTUFBTSxRQUFRLEdBQUcsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILHFCQUFxQjtBQUNyQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7SUFDOUUsZUFBZSxFQUFFLEVBQUUsQ0FBQyxlQUFlO0NBQ3BDLENBQUMsQ0FBQztBQUVILHdDQUF3QztBQUN4QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLEVBQUU7SUFDcEYsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO0NBQ2pELENBQUMsQ0FBQztBQUVILHFCQUFxQjtBQUNyQixRQUFRLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFDO0lBQ3hDLE1BQU0sRUFBRSxXQUFXO0NBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBRUosR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QsIEV4cGVjdGVkUmVzdWx0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgRXZlbnRCcmlkZ2VQdXRFdmVudHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbi8qXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHMgOlxuICogKiBhd3Mgc3RlcGZ1bmN0aW9ucyBzdGFydC1leGVjdXRpb24gLS1zdGF0ZS1tYWNoaW5lLWFybiA8ZGVwbG95ZWQgc3RhdGUgbWFjaGluZSBhcm4+IDogc2hvdWxkIHJldHVybiBleGVjdXRpb24gYXJuXG4gKiAqIGF3cyBzdGVwZnVuY3Rpb25zIGRlc2NyaWJlLWV4ZWN1dGlvbiAtLWV4ZWN1dGlvbi1hcm4gPGV4ZWN1dGlvbi1hcm4gZ2VuZXJhdGVkIGJlZm9yZT4gOiBzaG91bGQgcmV0dXJuIHN0YXR1cyBhcyBTVUNDRUVERURcbiAqL1xuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcy1ldmVudGJyaWRnZS1wdXQtZXZlbnRzLWludGVnJyk7XG5cbmNvbnN0IGV2ZW50QnVzID0gbmV3IGV2ZW50cy5FdmVudEJ1cyhzdGFjaywgJ0V2ZW50QnVzJywge1xuICBldmVudEJ1c05hbWU6ICdNeUV2ZW50QnVzMScsXG59KTtcblxuY29uc3QgcHV0RXZlbnRzVGFzayA9IG5ldyBFdmVudEJyaWRnZVB1dEV2ZW50cyhzdGFjaywgJ1B1dCBDdXN0b20gRXZlbnRzJywge1xuICBlbnRyaWVzOiBbe1xuICAgIC8vIEVudHJ5IHdpdGggbm8gZXZlbnQgYnVzIHNwZWNpZmllZFxuICAgIGRldGFpbDogc2ZuLlRhc2tJbnB1dC5mcm9tT2JqZWN0KHtcbiAgICAgIE1lc3NhZ2U6ICdIZWxsbyBmcm9tIFN0ZXAgRnVuY3Rpb25zIScsXG4gICAgfSksXG4gICAgZGV0YWlsVHlwZTogJ01lc3NhZ2VGcm9tU3RlcEZ1bmN0aW9ucycsXG4gICAgc291cmNlOiAnc3RlcC5mdW5jdGlvbnMnLFxuICB9LCB7XG4gICAgLy8gRW50cnkgd2l0aCBFdmVudEJ1cyBwcm92aWRlZCBhcyBvYmplY3RcbiAgICBkZXRhaWw6IHNmbi5UYXNrSW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICBNZXNzYWdlOiAnSGVsbG8gZnJvbSBTdGVwIEZ1bmN0aW9ucyEnLFxuICAgIH0pLFxuICAgIGV2ZW50QnVzLFxuICAgIGRldGFpbFR5cGU6ICdNZXNzYWdlRnJvbVN0ZXBGdW5jdGlvbnMnLFxuICAgIHNvdXJjZTogJ3N0ZXAuZnVuY3Rpb25zJyxcbiAgfV0sXG59KTtcblxuY29uc3Qgc20gPSBuZXcgc2ZuLlN0YXRlTWFjaGluZShzdGFjaywgJ1N0YXRlTWFjaGluZScsIHtcbiAgZGVmaW5pdGlvbjogcHV0RXZlbnRzVGFzayxcbiAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxufSk7XG5cblxuY29uc3QgdGVzdENhc2UgPSBuZXcgSW50ZWdUZXN0KGFwcCwgJ1B1dEV2ZW50cycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbi8vIFN0YXJ0IGFuIGV4ZWN1dGlvblxuY29uc3Qgc3RhcnQgPSB0ZXN0Q2FzZS5hc3NlcnRpb25zLmF3c0FwaUNhbGwoJ1N0ZXBGdW5jdGlvbnMnLCAnc3RhcnRFeGVjdXRpb24nLCB7XG4gIHN0YXRlTWFjaGluZUFybjogc20uc3RhdGVNYWNoaW5lQXJuLFxufSk7XG5cbi8vIGRlc2NyaWJlIHRoZSByZXN1bHRzIG9mIHRoZSBleGVjdXRpb25cbmNvbnN0IGRlc2NyaWJlID0gdGVzdENhc2UuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdTdGVwRnVuY3Rpb25zJywgJ2Rlc2NyaWJlRXhlY3V0aW9uJywge1xuICBleGVjdXRpb25Bcm46IHN0YXJ0LmdldEF0dFN0cmluZygnZXhlY3V0aW9uQXJuJyksXG59KTtcblxuLy8gYXNzZXJ0IHRoZSByZXN1bHRzXG5kZXNjcmliZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIHN0YXR1czogJ1NVQ0NFRURFRCcsXG59KSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
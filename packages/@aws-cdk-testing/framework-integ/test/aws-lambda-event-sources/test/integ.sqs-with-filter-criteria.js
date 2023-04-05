"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("aws-cdk-lib/aws-lambda");
const sqs = require("aws-cdk-lib/aws-sqs");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const test_function_1 = require("./test-function");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-event-source-filter-criteria-sqs');
const fn = new test_function_1.TestFunction(stack, 'F');
const queue = new sqs.Queue(stack, 'Q');
fn.addEventSource(new aws_lambda_event_sources_1.SqsEventSource(queue, {
    batchSize: 5,
    filters: [
        lambda.FilterCriteria.filter({
            body: {
                id: lambda.FilterRule.exists(),
            },
        }),
    ],
}));
new integ.IntegTest(app, 'SQSFilterCriteria', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc3FzLXdpdGgtZmlsdGVyLWNyaXRlcmlhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc3FzLXdpdGgtZmlsdGVyLWNyaXRlcmlhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsb0RBQW9EO0FBQ3BELG1EQUErQztBQUMvQyxtRkFBc0U7QUFFdEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO0FBRTVFLE1BQU0sRUFBRSxHQUFHLElBQUksNEJBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUV4QyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUkseUNBQWMsQ0FBQyxLQUFLLEVBQUU7SUFDMUMsU0FBUyxFQUFFLENBQUM7SUFDWixPQUFPLEVBQUU7UUFDUCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztZQUMzQixJQUFJLEVBQUU7Z0JBQ0osRUFBRSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2FBQy9CO1NBQ0YsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDLENBQUM7QUFFSixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLG1CQUFtQixFQUFFO0lBQzVDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgVGVzdEZ1bmN0aW9uIH0gZnJvbSAnLi90ZXN0LWZ1bmN0aW9uJztcbmltcG9ydCB7IFNxc0V2ZW50U291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ldmVudC1zb3VyY2VzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2xhbWJkYS1ldmVudC1zb3VyY2UtZmlsdGVyLWNyaXRlcmlhLXNxcycpO1xuXG5jb25zdCBmbiA9IG5ldyBUZXN0RnVuY3Rpb24oc3RhY2ssICdGJyk7XG5jb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdRJyk7XG5cbmZuLmFkZEV2ZW50U291cmNlKG5ldyBTcXNFdmVudFNvdXJjZShxdWV1ZSwge1xuICBiYXRjaFNpemU6IDUsXG4gIGZpbHRlcnM6IFtcbiAgICBsYW1iZGEuRmlsdGVyQ3JpdGVyaWEuZmlsdGVyKHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgaWQ6IGxhbWJkYS5GaWx0ZXJSdWxlLmV4aXN0cygpLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdTUVNGaWx0ZXJDcml0ZXJpYScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const test_function_1 = require("./test-function");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-event-source-filter-criteria-dynamodb');
const fn = new test_function_1.TestFunction(stack, 'F');
const table = new dynamodb.Table(stack, 'T', {
    partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
    },
    stream: dynamodb.StreamViewType.NEW_IMAGE,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
fn.addEventSource(new aws_lambda_event_sources_1.DynamoEventSource(table, {
    batchSize: 5,
    startingPosition: lambda.StartingPosition.LATEST,
    filters: [
        lambda.FilterCriteria.filter({
            eventName: lambda.FilterRule.isEqual('INSERT'),
            dynamodb: {
                Keys: {
                    id: {
                        S: lambda.FilterRule.exists(),
                    },
                },
            },
        }),
    ],
}));
new integ.IntegTest(app, 'DynamoDBFilterCriteria', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZHluYW1vZGItd2l0aC1maWx0ZXItY3JpdGVyaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5keW5hbW9kYi13aXRoLWZpbHRlci1jcml0ZXJpYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFxRDtBQUNyRCxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCxtREFBK0M7QUFDL0MsbUZBQXlFO0FBRXpFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsOENBQThDLENBQUMsQ0FBQztBQUVqRixNQUFNLEVBQUUsR0FBRyxJQUFJLDRCQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQzNDLFlBQVksRUFBRTtRQUNaLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTTtLQUNwQztJQUNELE1BQU0sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVM7SUFDekMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztDQUN6QyxDQUFDLENBQUM7QUFFSCxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksNENBQWlCLENBQUMsS0FBSyxFQUFFO0lBQzdDLFNBQVMsRUFBRSxDQUFDO0lBQ1osZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU07SUFDaEQsT0FBTyxFQUFFO1FBQ1AsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7WUFDM0IsU0FBUyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUM5QyxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLEVBQUUsRUFBRTt3QkFDRixDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7cUJBQzlCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7Q0FDRixDQUFDLENBQUMsQ0FBQztBQUVKLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLEVBQUU7SUFDakQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgVGVzdEZ1bmN0aW9uIH0gZnJvbSAnLi90ZXN0LWZ1bmN0aW9uJztcbmltcG9ydCB7IER5bmFtb0V2ZW50U291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ldmVudC1zb3VyY2VzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2xhbWJkYS1ldmVudC1zb3VyY2UtZmlsdGVyLWNyaXRlcmlhLWR5bmFtb2RiJyk7XG5cbmNvbnN0IGZuID0gbmV3IFRlc3RGdW5jdGlvbihzdGFjaywgJ0YnKTtcbmNvbnN0IHRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHN0YWNrLCAnVCcsIHtcbiAgcGFydGl0aW9uS2V5OiB7XG4gICAgbmFtZTogJ2lkJyxcbiAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgfSxcbiAgc3RyZWFtOiBkeW5hbW9kYi5TdHJlYW1WaWV3VHlwZS5ORVdfSU1BR0UsXG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxuZm4uYWRkRXZlbnRTb3VyY2UobmV3IER5bmFtb0V2ZW50U291cmNlKHRhYmxlLCB7XG4gIGJhdGNoU2l6ZTogNSxcbiAgc3RhcnRpbmdQb3NpdGlvbjogbGFtYmRhLlN0YXJ0aW5nUG9zaXRpb24uTEFURVNULFxuICBmaWx0ZXJzOiBbXG4gICAgbGFtYmRhLkZpbHRlckNyaXRlcmlhLmZpbHRlcih7XG4gICAgICBldmVudE5hbWU6IGxhbWJkYS5GaWx0ZXJSdWxlLmlzRXF1YWwoJ0lOU0VSVCcpLFxuICAgICAgZHluYW1vZGI6IHtcbiAgICAgICAgS2V5czoge1xuICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICBTOiBsYW1iZGEuRmlsdGVyUnVsZS5leGlzdHMoKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdEeW5hbW9EQkZpbHRlckNyaXRlcmlhJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
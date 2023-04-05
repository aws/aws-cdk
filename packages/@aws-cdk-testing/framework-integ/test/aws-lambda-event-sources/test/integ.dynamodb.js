"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const test_function_1 = require("./test-function");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
class DynamoEventSourceTest extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const fn = new test_function_1.TestFunction(this, 'F');
        const queue = new dynamodb.Table(this, 'T', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            stream: dynamodb.StreamViewType.NEW_IMAGE,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        fn.addEventSource(new aws_lambda_event_sources_1.DynamoEventSource(queue, {
            batchSize: 5,
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            tumblingWindow: cdk.Duration.seconds(60),
        }));
    }
}
const app = new cdk.App();
new DynamoEventSourceTest(app, 'lambda-event-source-dynamodb');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZHluYW1vZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5keW5hbW9kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFxRDtBQUNyRCxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLG1EQUErQztBQUMvQyxtRkFBeUU7QUFFekUsTUFBTSxxQkFBc0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMzQyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxFQUFFLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUMxQyxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNwQztZQUNELE1BQU0sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVM7WUFDekMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksNENBQWlCLENBQUMsS0FBSyxFQUFFO1lBQzdDLFNBQVMsRUFBRSxDQUFDO1lBQ1osZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFlBQVk7WUFDdEQsY0FBYyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUkscUJBQXFCLENBQUMsR0FBRyxFQUFFLDhCQUE4QixDQUFDLENBQUM7QUFDL0QsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBUZXN0RnVuY3Rpb24gfSBmcm9tICcuL3Rlc3QtZnVuY3Rpb24nO1xuaW1wb3J0IHsgRHluYW1vRXZlbnRTb3VyY2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xuXG5jbGFzcyBEeW5hbW9FdmVudFNvdXJjZVRlc3QgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBUZXN0RnVuY3Rpb24odGhpcywgJ0YnKTtcbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnVCcsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBzdHJlYW06IGR5bmFtb2RiLlN0cmVhbVZpZXdUeXBlLk5FV19JTUFHRSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBmbi5hZGRFdmVudFNvdXJjZShuZXcgRHluYW1vRXZlbnRTb3VyY2UocXVldWUsIHtcbiAgICAgIGJhdGNoU2l6ZTogNSxcbiAgICAgIHN0YXJ0aW5nUG9zaXRpb246IGxhbWJkYS5TdGFydGluZ1Bvc2l0aW9uLlRSSU1fSE9SSVpPTixcbiAgICAgIHR1bWJsaW5nV2luZG93OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSkpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgRHluYW1vRXZlbnRTb3VyY2VUZXN0KGFwcCwgJ2xhbWJkYS1ldmVudC1zb3VyY2UtZHluYW1vZGInKTtcbmFwcC5zeW50aCgpO1xuIl19
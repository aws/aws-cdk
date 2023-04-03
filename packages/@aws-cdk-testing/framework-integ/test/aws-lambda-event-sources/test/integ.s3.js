"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const test_function_1 = require("./test-function");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
class S3EventSourceTest extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const fn = new test_function_1.TestFunction(this, 'F');
        const bucket = new s3.Bucket(this, 'B', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        fn.addEventSource(new aws_lambda_event_sources_1.S3EventSource(bucket, {
            events: [s3.EventType.OBJECT_CREATED],
            filters: [{ prefix: 'subdir/' }],
        }));
    }
}
const app = new cdk.App();
new S3EventSourceTest(app, 'lambda-event-source-s3');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuczMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsbURBQStDO0FBQy9DLG1GQUFxRTtBQUVyRSxNQUFNLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3ZDLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQUUsR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksd0NBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDMUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7WUFDckMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUM7U0FDakMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLGlCQUFpQixDQUFDLEdBQUcsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3JELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVGVzdEZ1bmN0aW9uIH0gZnJvbSAnLi90ZXN0LWZ1bmN0aW9uJztcbmltcG9ydCB7IFMzRXZlbnRTb3VyY2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xuXG5jbGFzcyBTM0V2ZW50U291cmNlVGVzdCBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGZuID0gbmV3IFRlc3RGdW5jdGlvbih0aGlzLCAnRicpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0InLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBmbi5hZGRFdmVudFNvdXJjZShuZXcgUzNFdmVudFNvdXJjZShidWNrZXQsIHtcbiAgICAgIGV2ZW50czogW3MzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRF0sXG4gICAgICBmaWx0ZXJzOiBbeyBwcmVmaXg6ICdzdWJkaXIvJyB9XSxcbiAgICB9KSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBTM0V2ZW50U291cmNlVGVzdChhcHAsICdsYW1iZGEtZXZlbnQtc291cmNlLXMzJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
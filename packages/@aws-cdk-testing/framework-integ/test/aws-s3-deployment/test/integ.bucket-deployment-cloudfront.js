"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
class TestBucketDeployment extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const bucket = new s3.Bucket(this, 'Destination3', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: bucket,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        });
        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket,
            distribution,
            distributionPaths: ['/images/*.png'],
            retainOnDelete: false, // default is true, which will block the integration test cleanup
        });
    }
}
const app = new cdk.App();
new TestBucketDeployment(app, 'test-bucket-deployments-1');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWRlcGxveW1lbnQtY2xvdWRmcm9udC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJ1Y2tldC1kZXBsb3ltZW50LWNsb3VkZnJvbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IseURBQXlEO0FBQ3pELHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsMERBQTBEO0FBRTFELE1BQU0sb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLHNDQUFzQztTQUNoRSxDQUFDLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xGLGFBQWEsRUFBRTtnQkFDYjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsY0FBYyxFQUFFLE1BQU07cUJBQ3ZCO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3pDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDNUQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwRSxpQkFBaUIsRUFBRSxNQUFNO1lBQ3pCLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUNwQyxjQUFjLEVBQUUsS0FBSyxFQUFFLGlFQUFpRTtTQUN6RixDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLG9CQUFvQixDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0FBRTNELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnQnO1xuXG5jbGFzcyBUZXN0QnVja2V0RGVwbG95bWVudCBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0Rlc3RpbmF0aW9uMycsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSwgLy8gbmVlZGVkIGZvciBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHRoaXMsICdEaXN0cmlidXRpb24nLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IGJ1Y2tldCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveVdpdGhJbnZhbGlkYXRpb24nLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgICBkaXN0cmlidXRpb24sXG4gICAgICBkaXN0cmlidXRpb25QYXRoczogWycvaW1hZ2VzLyoucG5nJ10sXG4gICAgICByZXRhaW5PbkRlbGV0ZTogZmFsc2UsIC8vIGRlZmF1bHQgaXMgdHJ1ZSwgd2hpY2ggd2lsbCBibG9jayB0aGUgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdEJ1Y2tldERlcGxveW1lbnQoYXBwLCAndGVzdC1idWNrZXQtZGVwbG95bWVudHMtMScpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
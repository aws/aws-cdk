"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const s3deploy = require("../lib");
class TestBucketDeployment extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const bucket = new s3.Bucket(this, 'Destination3', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
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
            retainOnDelete: false,
        });
    }
}
const app = new cdk.App();
new TestBucketDeployment(app, 'test-bucket-deployments-1');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWRlcGxveW1lbnQtY2xvdWRmcm9udC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJ1Y2tldC1kZXBsb3ltZW50LWNsb3VkZnJvbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBRW5DLE1BQU0sb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xGLGFBQWEsRUFBRTtnQkFDYjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsY0FBYyxFQUFFLE1BQU07cUJBQ3ZCO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3pDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDNUQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwRSxpQkFBaUIsRUFBRSxNQUFNO1lBQ3pCLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUNwQyxjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDLENBQUM7S0FFSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUUzRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWRmcm9udCc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdEJ1Y2tldERlcGxveW1lbnQgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdEZXN0aW5hdGlvbjMnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIG5lZWRlZCBmb3IgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnRGlzdHJpYnV0aW9uJywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW1xuICAgICAgICB7XG4gICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgIHMzQnVja2V0U291cmNlOiBidWNrZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lXaXRoSW52YWxpZGF0aW9uJywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICAgICAgZGlzdHJpYnV0aW9uLFxuICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFsnL2ltYWdlcy8qLnBuZyddLFxuICAgICAgcmV0YWluT25EZWxldGU6IGZhbHNlLCAvLyBkZWZhdWx0IGlzIHRydWUsIHdoaWNoIHdpbGwgYmxvY2sgdGhlIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFRlc3RCdWNrZXREZXBsb3ltZW50KGFwcCwgJ3Rlc3QtYnVja2V0LWRlcGxveW1lbnRzLTEnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
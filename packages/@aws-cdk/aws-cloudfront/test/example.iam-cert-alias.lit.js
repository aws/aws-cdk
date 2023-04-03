"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cloudfront = require("../lib");
class AcmCertificateAliasStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const s3BucketSource = new s3.Bucket(this, 'Bucket');
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'AnAmazingWebsiteProbably', {
            originConfigs: [{
                    s3OriginSource: { s3BucketSource },
                    behaviors: [{ isDefaultBehavior: true }],
                }],
            viewerCertificate: cloudfront.ViewerCertificate.fromIamCertificate('certificateId', {
                aliases: ['example.com'],
                securityPolicy: cloudfront.SecurityPolicyProtocol.SSL_V3,
                sslMethod: cloudfront.SSLMethod.SNI,
            }),
        });
        /// !hide
        Array.isArray(s3BucketSource);
        Array.isArray(distribution);
    }
}
const app = new core_1.App();
new AcmCertificateAliasStack(app, 'AcmCertificateAliasStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5pYW0tY2VydC1hbGlhcy5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGFtcGxlLmlhbS1jZXJ0LWFsaWFzLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUN0Qyx3Q0FBMkM7QUFFM0MscUNBQXFDO0FBRXJDLE1BQU0sd0JBQXlCLFNBQVEsWUFBSztJQUMxQyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLFNBQVM7UUFDVCxNQUFNLGNBQWMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXJELE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUM5RixhQUFhLEVBQUUsQ0FBQztvQkFDZCxjQUFjLEVBQUUsRUFBRSxjQUFjLEVBQUU7b0JBQ2xDLFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3pDLENBQUM7WUFDRixpQkFBaUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQ2hFLGVBQWUsRUFDZjtnQkFDRSxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hCLGNBQWMsRUFBRSxVQUFVLENBQUMsc0JBQXNCLENBQUMsTUFBTTtnQkFDeEQsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRzthQUNwQyxDQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsU0FBUztRQUVULEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM3QjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLHdCQUF3QixDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBQzlELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgQWNtQ2VydGlmaWNhdGVBbGlhc1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBzM0J1Y2tldFNvdXJjZSA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0J1Y2tldCcpO1xuXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2UgfSxcbiAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgIH1dLFxuICAgICAgdmlld2VyQ2VydGlmaWNhdGU6IGNsb3VkZnJvbnQuVmlld2VyQ2VydGlmaWNhdGUuZnJvbUlhbUNlcnRpZmljYXRlKFxuICAgICAgICAnY2VydGlmaWNhdGVJZCcsXG4gICAgICAgIHtcbiAgICAgICAgICBhbGlhc2VzOiBbJ2V4YW1wbGUuY29tJ10sXG4gICAgICAgICAgc2VjdXJpdHlQb2xpY3k6IGNsb3VkZnJvbnQuU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5TU0xfVjMsIC8vIGRlZmF1bHRcbiAgICAgICAgICBzc2xNZXRob2Q6IGNsb3VkZnJvbnQuU1NMTWV0aG9kLlNOSSwgLy8gZGVmYXVsdFxuICAgICAgICB9LFxuICAgICAgKSxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcblxuICAgIEFycmF5LmlzQXJyYXkoczNCdWNrZXRTb3VyY2UpO1xuICAgIEFycmF5LmlzQXJyYXkoZGlzdHJpYnV0aW9uKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgQWNtQ2VydGlmaWNhdGVBbGlhc1N0YWNrKGFwcCwgJ0FjbUNlcnRpZmljYXRlQWxpYXNTdGFjaycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=
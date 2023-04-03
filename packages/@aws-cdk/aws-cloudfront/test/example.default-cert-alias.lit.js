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
            viewerCertificate: cloudfront.ViewerCertificate.fromCloudFrontDefaultCertificate('www.example.com'),
        });
        /// !hide
        Array.isArray(s3BucketSource);
        Array.isArray(distribution);
    }
}
const app = new core_1.App();
new AcmCertificateAliasStack(app, 'AcmCertificateAliasStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5kZWZhdWx0LWNlcnQtYWxpYXMubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbXBsZS5kZWZhdWx0LWNlcnQtYWxpYXMubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDLHdDQUEyQztBQUUzQyxxQ0FBcUM7QUFFckMsTUFBTSx3QkFBeUIsU0FBUSxZQUFLO0lBQzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsU0FBUztRQUNULE1BQU0sY0FBYyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFckQsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQzlGLGFBQWEsRUFBRSxDQUFDO29CQUNkLGNBQWMsRUFBRSxFQUFFLGNBQWMsRUFBRTtvQkFDbEMsU0FBUyxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDekMsQ0FBQztZQUNGLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxnQ0FBZ0MsQ0FDOUUsaUJBQWlCLENBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsU0FBUztRQUVULEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM3QjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLHdCQUF3QixDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBQzlELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgQWNtQ2VydGlmaWNhdGVBbGlhc1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBzM0J1Y2tldFNvdXJjZSA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0J1Y2tldCcpO1xuXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnQW5BbWF6aW5nV2Vic2l0ZVByb2JhYmx5Jywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHsgczNCdWNrZXRTb3VyY2UgfSxcbiAgICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICAgIH1dLFxuICAgICAgdmlld2VyQ2VydGlmaWNhdGU6IGNsb3VkZnJvbnQuVmlld2VyQ2VydGlmaWNhdGUuZnJvbUNsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUoXG4gICAgICAgICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgKSxcbiAgICB9KTtcbiAgICAvLy8gIWhpZGVcblxuICAgIEFycmF5LmlzQXJyYXkoczNCdWNrZXRTb3VyY2UpO1xuICAgIEFycmF5LmlzQXJyYXkoZGlzdHJpYnV0aW9uKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgQWNtQ2VydGlmaWNhdGVBbGlhc1N0YWNrKGFwcCwgJ0FjbUNlcnRpZmljYXRlQWxpYXNTdGFjaycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=
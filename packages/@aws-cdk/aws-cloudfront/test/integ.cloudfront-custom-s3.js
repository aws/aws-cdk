"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cloudfront = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const bucket = new s3.Bucket(this, 'Bucket', {
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: '404.html',
        });
        new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
            originConfigs: [
                {
                    behaviors: [{ isDefaultBehavior: true }],
                    customOriginSource: {
                        originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                        domainName: bucket.bucketWebsiteDomainName,
                    },
                },
            ],
        });
    }
}
const app = new core_1.App();
new TestStack(app, 'cloudfront-custom-s3-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1jdXN0b20tczMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jbG91ZGZyb250LWN1c3RvbS1zMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUN0Qyx3Q0FBMkM7QUFFM0MscUNBQXFDO0FBRXJDLE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUMzQyxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsVUFBVTtTQUNqQyxDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUI7WUFDdkUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZTtZQUNqRCxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsU0FBUyxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDeEMsa0JBQWtCLEVBQUU7d0JBQ2xCLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTO3dCQUMvRCxVQUFVLEVBQUUsTUFBTSxDQUFDLHVCQUF1QjtxQkFDM0M7aUJBQ0Y7YUFDRjtTQUNGLENBQ0EsQ0FBQztLQUNIO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQ2pELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0J1Y2tldCcsIHtcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICc0MDQuaHRtbCcsXG4gICAgfSk7XG5cbiAgICBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHRoaXMsICdEaXN0cmlidXRpb24nLCB7XG4gICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQUyxcbiAgICAgIHByaWNlQ2xhc3M6IGNsb3VkZnJvbnQuUHJpY2VDbGFzcy5QUklDRV9DTEFTU18yMDAsXG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIGN1c3RvbU9yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgb3JpZ2luUHJvdG9jb2xQb2xpY3k6IGNsb3VkZnJvbnQuT3JpZ2luUHJvdG9jb2xQb2xpY3kuSFRUUF9PTkxZLFxuICAgICAgICAgICAgZG9tYWluTmFtZTogYnVja2V0LmJ1Y2tldFdlYnNpdGVEb21haW5OYW1lLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nsb3VkZnJvbnQtY3VzdG9tLXMzLWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
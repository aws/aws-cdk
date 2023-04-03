"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cloudfront = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-failover');
const dist = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
    originConfigs: [{
            behaviors: [{ isDefaultBehavior: true }],
            s3OriginSource: {
                s3BucketSource: new s3.Bucket(stack, 'bucket1'),
            },
            failoverS3OriginSource: {
                s3BucketSource: new s3.Bucket(stack, 'bucket2'),
            },
            failoverCriteriaStatusCodes: [cloudfront.FailoverStatusCode.INTERNAL_SERVER_ERROR],
        }],
});
new cdk.CfnOutput(stack, 'DistributionDomainName', { value: dist.domainName });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1mYWlsb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsb3VkZnJvbnQtZmFpbG92ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFOUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUMzRSxhQUFhLEVBQUUsQ0FBQztZQUNkLFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDeEMsY0FBYyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQzthQUNoRDtZQUNELHNCQUFzQixFQUFFO2dCQUN0QixjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7YUFDaEQ7WUFDRCwyQkFBMkIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQztTQUNuRixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnaW50ZWctY2xvdWRmcm9udC1mYWlsb3ZlcicpO1xuXG5jb25zdCBkaXN0ID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3RyaWJ1dGlvbicsIHtcbiAgb3JpZ2luQ29uZmlnczogW3tcbiAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICBzM0J1Y2tldFNvdXJjZTogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ2J1Y2tldDEnKSxcbiAgICB9LFxuICAgIGZhaWxvdmVyUzNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgIHMzQnVja2V0U291cmNlOiBuZXcgczMuQnVja2V0KHN0YWNrLCAnYnVja2V0MicpLFxuICAgIH0sXG4gICAgZmFpbG92ZXJDcml0ZXJpYVN0YXR1c0NvZGVzOiBbY2xvdWRmcm9udC5GYWlsb3ZlclN0YXR1c0NvZGUuSU5URVJOQUxfU0VSVkVSX0VSUk9SXSxcbiAgfV0sXG59KTtcblxubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdEaXN0cmlidXRpb25Eb21haW5OYW1lJywgeyB2YWx1ZTogZGlzdC5kb21haW5OYW1lIH0pO1xuIl19
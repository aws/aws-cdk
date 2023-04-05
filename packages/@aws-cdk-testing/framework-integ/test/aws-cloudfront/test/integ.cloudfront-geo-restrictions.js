"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-geo-restrictions');
const sourceBucket = new s3.Bucket(stack, 'Bucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
    originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: sourceBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
        },
    ],
    geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB'),
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1nZW8tcmVzdHJpY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY2xvdWRmcm9udC1nZW8tcmVzdHJpY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyx5REFBeUQ7QUFFekQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWhFLE1BQU0sWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ2xELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Q0FDekMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ2hFLGFBQWEsRUFBRTtRQUNiO1lBQ0UsY0FBYyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxZQUFZO2FBQzdCO1lBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6QztLQUNGO0lBQ0QsY0FBYyxFQUFFLFVBQVUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7Q0FDaEUsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2Nsb3VkZnJvbnQtZ2VvLXJlc3RyaWN0aW9ucycpO1xuXG5jb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbm5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdNeURpc3RyaWJ1dGlvbicsIHtcbiAgb3JpZ2luQ29uZmlnczogW1xuICAgIHtcbiAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgIHMzQnVja2V0U291cmNlOiBzb3VyY2VCdWNrZXQsXG4gICAgICB9LFxuICAgICAgYmVoYXZpb3JzOiBbeyBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSB9XSxcbiAgICB9LFxuICBdLFxuICBnZW9SZXN0cmljdGlvbjogY2xvdWRmcm9udC5HZW9SZXN0cmljdGlvbi5hbGxvd2xpc3QoJ1VTJywgJ0dCJyksXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
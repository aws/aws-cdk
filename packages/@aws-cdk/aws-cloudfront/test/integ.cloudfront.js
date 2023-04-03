"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cloudfront = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-cloudfront');
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
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsb3VkZnJvbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFFdkQsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDbEQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztDQUN6QyxDQUFDLENBQUM7QUFFSCxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDaEUsYUFBYSxFQUFFO1FBQ2I7WUFDRSxjQUFjLEVBQUU7Z0JBQ2QsY0FBYyxFQUFFLFlBQVk7YUFDN0I7WUFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pDO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNsb3VkZnJvbnQnKTtcblxuY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5uZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCAnTXlEaXN0cmlidXRpb24nLCB7XG4gIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICB7XG4gICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0LFxuICAgICAgfSxcbiAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
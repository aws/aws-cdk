"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cloudfront = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');
const loggingBucket = new s3.Bucket(stack, 'Bucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
    originConfigs: [
        {
            originHeaders: {
                'X-Custom-Header': 'somevalue',
            },
            customOriginSource: {
                domainName: 'brelandm.a2z.com',
            },
            behaviors: [
                {
                    isDefaultBehavior: true,
                },
            ],
        },
    ],
    loggingConfig: {
        bucket: loggingBucket,
        includeCookies: true,
        prefix: 'test-prefix',
    },
});
new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably2', {
    originConfigs: [
        {
            originHeaders: {
                'X-Custom-Header': 'somevalue',
            },
            customOriginSource: {
                domainName: 'brelandm.a2z.com',
            },
            behaviors: [
                {
                    isDefaultBehavior: true,
                },
            ],
        },
    ],
    loggingConfig: {},
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1idWNrZXQtbG9nZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsb3VkZnJvbnQtYnVja2V0LWxvZ2dpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFOUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDbkQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztDQUN6QyxDQUFDLENBQUM7QUFFSCxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsMEJBQTBCLEVBQUU7SUFDMUUsYUFBYSxFQUFFO1FBQ2I7WUFDRSxhQUFhLEVBQUU7Z0JBQ2IsaUJBQWlCLEVBQUUsV0FBVzthQUMvQjtZQUNELGtCQUFrQixFQUFFO2dCQUNsQixVQUFVLEVBQUUsa0JBQWtCO2FBQy9CO1lBQ0QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGlCQUFpQixFQUFFLElBQUk7aUJBQ3hCO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsYUFBYSxFQUFFO1FBQ2IsTUFBTSxFQUFFLGFBQWE7UUFDckIsY0FBYyxFQUFFLElBQUk7UUFDcEIsTUFBTSxFQUFFLGFBQWE7S0FDdEI7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsMkJBQTJCLEVBQUU7SUFDM0UsYUFBYSxFQUFFO1FBQ2I7WUFDRSxhQUFhLEVBQUU7Z0JBQ2IsaUJBQWlCLEVBQUUsV0FBVzthQUMvQjtZQUNELGtCQUFrQixFQUFFO2dCQUNsQixVQUFVLEVBQUUsa0JBQWtCO2FBQy9CO1lBQ0QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLGlCQUFpQixFQUFFLElBQUk7aUJBQ3hCO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsYUFBYSxFQUFFLEVBQUU7Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY2xvdWRmcm9udC1jdXN0b20nKTtcblxuY29uc3QgbG9nZ2luZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxubmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgb3JpZ2luQ29uZmlnczogW1xuICAgIHtcbiAgICAgIG9yaWdpbkhlYWRlcnM6IHtcbiAgICAgICAgJ1gtQ3VzdG9tLUhlYWRlcic6ICdzb21ldmFsdWUnLFxuICAgICAgfSxcbiAgICAgIGN1c3RvbU9yaWdpblNvdXJjZToge1xuICAgICAgICBkb21haW5OYW1lOiAnYnJlbGFuZG0uYTJ6LmNvbScsXG4gICAgICB9LFxuICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgbG9nZ2luZ0NvbmZpZzoge1xuICAgIGJ1Y2tldDogbG9nZ2luZ0J1Y2tldCxcbiAgICBpbmNsdWRlQ29va2llczogdHJ1ZSxcbiAgICBwcmVmaXg6ICd0ZXN0LXByZWZpeCcsXG4gIH0sXG59KTtcblxubmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseTInLCB7XG4gIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICB7XG4gICAgICBvcmlnaW5IZWFkZXJzOiB7XG4gICAgICAgICdYLUN1c3RvbS1IZWFkZXInOiAnc29tZXZhbHVlJyxcbiAgICAgIH0sXG4gICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgZG9tYWluTmFtZTogJ2JyZWxhbmRtLmEyei5jb20nLFxuICAgICAgfSxcbiAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIGxvZ2dpbmdDb25maWc6IHt9LFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
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
    enableIpV6: false,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1pcHY2LWRpc2FibGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY2xvdWRmcm9udC1pcHY2LWRpc2FibGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBRXZELE1BQU0sWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ2xELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Q0FDekMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ2hFLGFBQWEsRUFBRTtRQUNiO1lBQ0UsY0FBYyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxZQUFZO2FBQzdCO1lBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6QztLQUNGO0lBQ0QsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jbG91ZGZyb250Jyk7XG5cbmNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxubmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ015RGlzdHJpYnV0aW9uJywge1xuICBvcmlnaW5Db25maWdzOiBbXG4gICAge1xuICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNvdXJjZUJ1Y2tldCxcbiAgICAgIH0sXG4gICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgIH0sXG4gIF0sXG4gIGVuYWJsZUlwVjY6IGZhbHNlLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
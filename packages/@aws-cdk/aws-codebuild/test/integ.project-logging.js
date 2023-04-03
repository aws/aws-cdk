"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-logging');
new codebuild.PipelineProject(stack, 'Project', {
    logging: {
        cloudWatch: {
            logGroup: new logs.LogGroup(stack, 'LogingGroup', {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            }),
        },
        s3: {
            bucket: new s3.Bucket(stack, 'LoggingBucket', {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            }),
        },
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1sb2dnaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucHJvamVjdC1sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQTBDO0FBQzFDLHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUU5RCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUM5QyxPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ2hELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87YUFDekMsQ0FBQztTQUNIO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO2dCQUM1QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO2FBQ3pDLENBQUM7U0FDSDtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZC1sb2dnaW5nJyk7XG5cbm5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgbG9nZ2luZzoge1xuICAgIGNsb3VkV2F0Y2g6IHtcbiAgICAgIGxvZ0dyb3VwOiBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ2luZ0dyb3VwJywge1xuICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgfSksXG4gICAgfSxcbiAgICBzMzoge1xuICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTG9nZ2luZ0J1Y2tldCcsIHtcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
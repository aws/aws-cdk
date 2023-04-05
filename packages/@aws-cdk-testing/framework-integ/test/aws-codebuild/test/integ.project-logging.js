"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logs = require("aws-cdk-lib/aws-logs");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1sb2dnaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucHJvamVjdC1sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTZDO0FBQzdDLHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBRXZELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUU5RCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUM5QyxPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7Z0JBQ2hELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87YUFDekMsQ0FBQztTQUNIO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO2dCQUM1QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO2FBQ3pDLENBQUM7U0FDSDtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9ncyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZWJ1aWxkLWxvZ2dpbmcnKTtcblxubmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICBsb2dnaW5nOiB7XG4gICAgY2xvdWRXYXRjaDoge1xuICAgICAgbG9nR3JvdXA6IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9naW5nR3JvdXAnLCB7XG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB9KSxcbiAgICB9LFxuICAgIHMzOiB7XG4gICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdMb2dnaW5nQnVja2V0Jywge1xuICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgfSksXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
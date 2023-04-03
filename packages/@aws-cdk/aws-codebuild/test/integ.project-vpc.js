#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-vpc');
const vpc = new ec2.Vpc(stack, 'MyVPC', {
    maxAzs: 1,
    natGateways: 1,
});
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
    allowAllOutbound: true,
    description: 'Example',
    securityGroupName: 'Bob',
    vpc,
});
new codebuild.Project(stack, 'MyProject', {
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            build: {
                commands: ['echo "Nothing to do!"'],
            },
        },
    }),
    grantReportGroupPermissions: false,
    securityGroups: [securityGroup],
    vpc,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC12cGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm9qZWN0LXZwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLCtCQUErQixDQUFDLENBQUM7QUFDbEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDdEMsTUFBTSxFQUFFLENBQUM7SUFDVCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUMsQ0FBQztBQUNILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbkUsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixXQUFXLEVBQUUsU0FBUztJQUN0QixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLEdBQUc7Q0FDSixDQUFDLENBQUM7QUFDSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUN4QyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLENBQUMsdUJBQXVCLENBQUM7YUFDcEM7U0FDRjtLQUNGLENBQUM7SUFDRiwyQkFBMkIsRUFBRSxLQUFLO0lBQ2xDLGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUMvQixHQUFHO0NBQ0osQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZC1wcm9qZWN0LXZwYycpO1xuY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZQQycsIHtcbiAgbWF4QXpzOiAxLFxuICBuYXRHYXRld2F5czogMSxcbn0pO1xuY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAxJywge1xuICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICBkZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICBzZWN1cml0eUdyb3VwTmFtZTogJ0JvYicsXG4gIHZwYyxcbn0pO1xubmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gICAgcGhhc2VzOiB7XG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogWydlY2hvIFwiTm90aGluZyB0byBkbyFcIiddLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbiAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbiAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwXSxcbiAgdnBjLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
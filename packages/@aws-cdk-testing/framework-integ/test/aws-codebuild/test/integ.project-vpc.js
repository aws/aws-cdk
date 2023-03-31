#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC12cGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm9qZWN0LXZwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUV2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLCtCQUErQixDQUFDLENBQUM7QUFDbEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDdEMsTUFBTSxFQUFFLENBQUM7SUFDVCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUMsQ0FBQztBQUNILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbkUsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixXQUFXLEVBQUUsU0FBUztJQUN0QixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLEdBQUc7Q0FDSixDQUFDLENBQUM7QUFDSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUN4QyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLENBQUMsdUJBQXVCLENBQUM7YUFDcEM7U0FDRjtLQUNGLENBQUM7SUFDRiwyQkFBMkIsRUFBRSxLQUFLO0lBQ2xDLGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUMvQixHQUFHO0NBQ0osQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZWJ1aWxkLXByb2plY3QtdnBjJyk7XG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VlBDJywge1xuICBtYXhBenM6IDEsXG4gIG5hdEdhdGV3YXlzOiAxLFxufSk7XG5jb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU2VjdXJpdHlHcm91cDEnLCB7XG4gIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gIHNlY3VyaXR5R3JvdXBOYW1lOiAnQm9iJyxcbiAgdnBjLFxufSk7XG5uZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICBwaGFzZXM6IHtcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiBbJ2VjaG8gXCJOb3RoaW5nIHRvIGRvIVwiJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxuICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxuICBzZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXBdLFxuICB2cGMsXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
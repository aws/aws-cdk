#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
const cache_1 = require("../lib/cache");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild');
const bucket = new s3.Bucket(stack, 'CacheBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new codebuild.Project(stack, 'MyProject', {
    cache: cache_1.Cache.bucket(bucket),
    buildSpec: codebuild.BuildSpec.fromObject({
        build: {
            commands: ['echo Hello'],
        },
        cache: {
            paths: ['/root/.cache/pip/**/*'],
        },
    }),
    grantReportGroupPermissions: false,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2FjaGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNhY2hpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFDcEMsd0NBQXFDO0FBRXJDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUV0RCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtJQUNqRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUVILElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ3hDLEtBQUssRUFBRSxhQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQ3pCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsS0FBSyxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDakM7S0FDRixDQUFDO0lBQ0YsMkJBQTJCLEVBQUUsS0FBSztDQUNuQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBDYWNoZSB9IGZyb20gJy4uL2xpYi9jYWNoZSc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZCcpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQ2FjaGVCdWNrZXQnLCB7XG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxubmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICBjYWNoZTogQ2FjaGUuYnVja2V0KGJ1Y2tldCksXG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICBidWlsZDoge1xuICAgICAgY29tbWFuZHM6IFsnZWNobyBIZWxsbyddLFxuICAgIH0sXG4gICAgY2FjaGU6IHtcbiAgICAgIHBhdGhzOiBbJy9yb290Ly5jYWNoZS9waXAvKiovKiddLFxuICAgIH0sXG4gIH0pLFxuICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19
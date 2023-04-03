#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sns = require("@aws-cdk/aws-sns");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-vpc');
const project = new codebuild.Project(stack, 'MyProject', {
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            build: {
                commands: ['echo "Nothing to do!"'],
            },
        },
    }),
});
const target = new sns.Topic(stack, 'MyTopic');
project.notifyOnBuildSucceeded('NotifyOnBuildSucceeded', target);
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1ub3RpZmljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm9qZWN0LW5vdGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLCtCQUErQixDQUFDLENBQUM7QUFFbEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDeEQsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1FBQ3hDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2FBQ3BDO1NBQ0Y7S0FDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUvQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFakUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZC1wcm9qZWN0LXZwYycpO1xuXG5jb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gICAgcGhhc2VzOiB7XG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogWydlY2hvIFwiTm90aGluZyB0byBkbyFcIiddLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbn0pO1xuXG5jb25zdCB0YXJnZXQgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuXG5wcm9qZWN0Lm5vdGlmeU9uQnVpbGRTdWNjZWVkZWQoJ05vdGlmeU9uQnVpbGRTdWNjZWVkZWQnLCB0YXJnZXQpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
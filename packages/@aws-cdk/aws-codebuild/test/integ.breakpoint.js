#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const codebuild = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-breakpoint');
new codebuild.Project(stack, 'Project', {
    environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_6_0,
    },
    ssmSessionPermissions: true,
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            build: {
                commands: [
                    // Pause the build container if possible
                    'codebuild-breakpoint',
                    // Regular build in a script in the repository
                    'echo "regular build here"',
                ],
            },
        },
    }),
});
new integ.IntegTest(app, 'ReportGroupIntegTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnJlYWtwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJyZWFrcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQXFDO0FBQ3JDLDhDQUE4QztBQUM5QyxvQ0FBb0M7QUFFcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBRWpFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ3RDLFdBQVcsRUFBRTtRQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLFlBQVk7S0FDbkQ7SUFDRCxxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE1BQU0sRUFBRTtZQUNOLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUU7b0JBQ1Isd0NBQXdDO29CQUN4QyxzQkFBc0I7b0JBQ3RCLDhDQUE4QztvQkFDOUMsMkJBQTJCO2lCQUM1QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtJQUMvQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVidWlsZC1icmVha3BvaW50Jyk7XG5cbm5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gIGVudmlyb25tZW50OiB7XG4gICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF82XzAsXG4gIH0sXG4gIHNzbVNlc3Npb25QZXJtaXNzaW9uczogdHJ1ZSxcbiAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgIHZlcnNpb246ICcwLjInLFxuICAgIHBoYXNlczoge1xuICAgICAgYnVpbGQ6IHtcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAvLyBQYXVzZSB0aGUgYnVpbGQgY29udGFpbmVyIGlmIHBvc3NpYmxlXG4gICAgICAgICAgJ2NvZGVidWlsZC1icmVha3BvaW50JyxcbiAgICAgICAgICAvLyBSZWd1bGFyIGJ1aWxkIGluIGEgc2NyaXB0IGluIHRoZSByZXBvc2l0b3J5XG4gICAgICAgICAgJ2VjaG8gXCJyZWd1bGFyIGJ1aWxkIGhlcmVcIicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxufSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnUmVwb3J0R3JvdXBJbnRlZ1Rlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcblxuIl19
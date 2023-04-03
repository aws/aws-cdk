#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const codebuild = require("aws-cdk-lib/aws-codebuild");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnJlYWtwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJyZWFrcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCx1REFBdUQ7QUFFdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBRWpFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ3RDLFdBQVcsRUFBRTtRQUNYLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLFlBQVk7S0FDbkQ7SUFDRCxxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE1BQU0sRUFBRTtZQUNOLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUU7b0JBQ1Isd0NBQXdDO29CQUN4QyxzQkFBc0I7b0JBQ3RCLDhDQUE4QztvQkFDOUMsMkJBQTJCO2lCQUM1QjthQUNGO1NBQ0Y7S0FDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtJQUMvQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZWJ1aWxkLWJyZWFrcG9pbnQnKTtcblxubmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgZW52aXJvbm1lbnQ6IHtcbiAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLlNUQU5EQVJEXzZfMCxcbiAgfSxcbiAgc3NtU2Vzc2lvblBlcm1pc3Npb25zOiB0cnVlLFxuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gICAgcGhhc2VzOiB7XG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgIC8vIFBhdXNlIHRoZSBidWlsZCBjb250YWluZXIgaWYgcG9zc2libGVcbiAgICAgICAgICAnY29kZWJ1aWxkLWJyZWFrcG9pbnQnLFxuICAgICAgICAgIC8vIFJlZ3VsYXIgYnVpbGQgaW4gYSBzY3JpcHQgaW4gdGhlIHJlcG9zaXRvcnlcbiAgICAgICAgICAnZWNobyBcInJlZ3VsYXIgYnVpbGQgaGVyZVwiJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG59KTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdSZXBvcnRHcm91cEludGVnVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuXG4iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const codebuild = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-report-group');
const reportGroupCodeCoverage = new codebuild.ReportGroup(stack, 'CoverageReportGroup', {
    type: codebuild.ReportGroupType.CODE_COVERAGE,
});
const reportGroupTest = new codebuild.ReportGroup(stack, 'TestReportGroup', {
    type: codebuild.ReportGroupType.TEST,
});
const project = new codebuild.Project(stack, 'MyProject', {
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            build: {
                commands: ['echo "Nothing to do!"'],
            },
        },
        reports: {
            [reportGroupTest.reportGroupArn]: {
                'base-directory': 'test-reports',
                'file-format': 'JUNITXML',
                'files': [
                    '**/*',
                ],
            },
            [reportGroupCodeCoverage.reportGroupArn]: {
                'base-directory': 'coverage',
                'file-format': 'CLOVERXML',
                'files': ['clover.xml'],
            },
        },
    }),
    grantReportGroupPermissions: false,
});
reportGroupCodeCoverage.grantWrite(project);
reportGroupTest.grantWrite(project);
new integ.IntegTest(app, 'ReportGroupIntegTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVwb3J0LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVwb3J0LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLDhDQUE4QztBQUM5QyxvQ0FBb0M7QUFFcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpELE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtJQUN0RixJQUFJLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxhQUFhO0NBQzlDLENBQUMsQ0FBQztBQUVILE1BQU0sZUFBZSxHQUFHLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7SUFDMUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSTtDQUNyQyxDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUN4RCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLENBQUMsdUJBQXVCLENBQUM7YUFDcEM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNoQyxnQkFBZ0IsRUFBRSxjQUFjO2dCQUNoQyxhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFFO29CQUNQLE1BQU07aUJBQ1A7YUFDRjtZQUNELENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ3hDLGdCQUFnQixFQUFFLFVBQVU7Z0JBQzVCLGFBQWEsRUFBRSxXQUFXO2dCQUMxQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDeEI7U0FDRjtLQUNGLENBQUM7SUFDRiwyQkFBMkIsRUFBRSxLQUFLO0NBQ25DLENBQUMsQ0FBQztBQUNILHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXBDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1yZXBvcnQtZ3JvdXAnKTtcblxuY29uc3QgcmVwb3J0R3JvdXBDb2RlQ292ZXJhZ2UgPSBuZXcgY29kZWJ1aWxkLlJlcG9ydEdyb3VwKHN0YWNrLCAnQ292ZXJhZ2VSZXBvcnRHcm91cCcsIHtcbiAgdHlwZTogY29kZWJ1aWxkLlJlcG9ydEdyb3VwVHlwZS5DT0RFX0NPVkVSQUdFLFxufSk7XG5cbmNvbnN0IHJlcG9ydEdyb3VwVGVzdCA9IG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdUZXN0UmVwb3J0R3JvdXAnLCB7XG4gIHR5cGU6IGNvZGVidWlsZC5SZXBvcnRHcm91cFR5cGUuVEVTVCxcbn0pO1xuXG5jb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gICAgcGhhc2VzOiB7XG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogWydlY2hvIFwiTm90aGluZyB0byBkbyFcIiddLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlcG9ydHM6IHtcbiAgICAgIFtyZXBvcnRHcm91cFRlc3QucmVwb3J0R3JvdXBBcm5dOiB7XG4gICAgICAgICdiYXNlLWRpcmVjdG9yeSc6ICd0ZXN0LXJlcG9ydHMnLFxuICAgICAgICAnZmlsZS1mb3JtYXQnOiAnSlVOSVRYTUwnLFxuICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgJyoqLyonLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFtyZXBvcnRHcm91cENvZGVDb3ZlcmFnZS5yZXBvcnRHcm91cEFybl06IHtcbiAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ2NvdmVyYWdlJyxcbiAgICAgICAgJ2ZpbGUtZm9ybWF0JzogJ0NMT1ZFUlhNTCcsXG4gICAgICAgICdmaWxlcyc6IFsnY2xvdmVyLnhtbCddLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbiAgZ3JhbnRSZXBvcnRHcm91cFBlcm1pc3Npb25zOiBmYWxzZSxcbn0pO1xucmVwb3J0R3JvdXBDb2RlQ292ZXJhZ2UuZ3JhbnRXcml0ZShwcm9qZWN0KTtcbnJlcG9ydEdyb3VwVGVzdC5ncmFudFdyaXRlKHByb2plY3QpO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ1JlcG9ydEdyb3VwSW50ZWdUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=
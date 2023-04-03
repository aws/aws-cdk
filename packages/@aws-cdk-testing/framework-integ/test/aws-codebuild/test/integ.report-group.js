"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const codebuild = require("aws-cdk-lib/aws-codebuild");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVwb3J0LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVwb3J0LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUNwRCx1REFBdUQ7QUFFdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpELE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtJQUN0RixJQUFJLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxhQUFhO0NBQzlDLENBQUMsQ0FBQztBQUVILE1BQU0sZUFBZSxHQUFHLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7SUFDMUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSTtDQUNyQyxDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUN4RCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLENBQUMsdUJBQXVCLENBQUM7YUFDcEM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNoQyxnQkFBZ0IsRUFBRSxjQUFjO2dCQUNoQyxhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFFO29CQUNQLE1BQU07aUJBQ1A7YUFDRjtZQUNELENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ3hDLGdCQUFnQixFQUFFLFVBQVU7Z0JBQzVCLGFBQWEsRUFBRSxXQUFXO2dCQUMxQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDeEI7U0FDRjtLQUNGLENBQUM7SUFDRiwyQkFBMkIsRUFBRSxLQUFLO0NBQ25DLENBQUMsQ0FBQztBQUNILHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXBDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLXJlcG9ydC1ncm91cCcpO1xuXG5jb25zdCByZXBvcnRHcm91cENvZGVDb3ZlcmFnZSA9IG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdDb3ZlcmFnZVJlcG9ydEdyb3VwJywge1xuICB0eXBlOiBjb2RlYnVpbGQuUmVwb3J0R3JvdXBUeXBlLkNPREVfQ09WRVJBR0UsXG59KTtcblxuY29uc3QgcmVwb3J0R3JvdXBUZXN0ID0gbmV3IGNvZGVidWlsZC5SZXBvcnRHcm91cChzdGFjaywgJ1Rlc3RSZXBvcnRHcm91cCcsIHtcbiAgdHlwZTogY29kZWJ1aWxkLlJlcG9ydEdyb3VwVHlwZS5URVNULFxufSk7XG5cbmNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICBwaGFzZXM6IHtcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiBbJ2VjaG8gXCJOb3RoaW5nIHRvIGRvIVwiJ10sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVwb3J0czoge1xuICAgICAgW3JlcG9ydEdyb3VwVGVzdC5yZXBvcnRHcm91cEFybl06IHtcbiAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ3Rlc3QtcmVwb3J0cycsXG4gICAgICAgICdmaWxlLWZvcm1hdCc6ICdKVU5JVFhNTCcsXG4gICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAnKiovKicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgW3JlcG9ydEdyb3VwQ29kZUNvdmVyYWdlLnJlcG9ydEdyb3VwQXJuXToge1xuICAgICAgICAnYmFzZS1kaXJlY3RvcnknOiAnY292ZXJhZ2UnLFxuICAgICAgICAnZmlsZS1mb3JtYXQnOiAnQ0xPVkVSWE1MJyxcbiAgICAgICAgJ2ZpbGVzJzogWydjbG92ZXIueG1sJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxuICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxufSk7XG5yZXBvcnRHcm91cENvZGVDb3ZlcmFnZS5ncmFudFdyaXRlKHByb2plY3QpO1xucmVwb3J0R3JvdXBUZXN0LmdyYW50V3JpdGUocHJvamVjdCk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnUmVwb3J0R3JvdXBJbnRlZ1Rlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==
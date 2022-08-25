import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as codebuild from '../lib';

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

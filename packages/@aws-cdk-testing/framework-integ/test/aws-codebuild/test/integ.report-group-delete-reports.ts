import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-report-group-delete-reports');

const reportGroupTest = new codebuild.ReportGroup(stack, 'TestReportGroupDeleteReports', {
  type: codebuild.ReportGroupType.TEST,
  deleteReports: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
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
    },
  }),
  grantReportGroupPermissions: false,
});

reportGroupTest.grantWrite(project);

new integ.IntegTest(app, 'ReportGroupDeleteReportsIntegTest', {
  testCases: [stack],
});

app.synth();

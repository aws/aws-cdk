import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const source = codebuild.Source.gitHub({
      owner: 'aws',
      repo: 'aws-cdk',
      reportBuildStatus: false,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.WORKFLOW_JOB_QUEUED),
      ],
    });
    new codebuild.Project(this, 'MyProject', {
      source,
      grantReportGroupPermissions: false,
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'test-codebuild-github-webhook-workflow-job-queued');
new IntegTest(app, 'ProjectTest', {
  testCases: [stack],
});

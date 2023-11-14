import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const source = codebuild.Source.gitHub({
      owner: 'aws',
      repo: 'aws-cdk',
      reportBuildStatus: false,
      webhook: true,
      webhookTriggersBatchBuild: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH),
      ],
    });
    new codebuild.Project(this, 'MyProject', {
      source,
      grantReportGroupPermissions: false,
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-github-webhook-batch');

app.synth();

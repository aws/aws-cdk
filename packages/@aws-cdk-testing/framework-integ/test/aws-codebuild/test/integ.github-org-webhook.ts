import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

class GitHubOrgWebhookTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const source = codebuild.Source.gitHub({
      owner: 'aws',
      reportBuildStatus: false,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.WORKFLOW_JOB_QUEUED,
        )
          .andRepositoryNameIs('aws-cdk.*')
          .andRepositoryNameIsNot('aws-cdk-lib'),
      ],
    });
    new codebuild.Project(this, 'MyProject', {
      source,
      grantReportGroupPermissions: false,
    });
  }
}

const app = new cdk.App();

new GitHubOrgWebhookTestStack(app, 'codebuild-github-org-webhook');

app.synth();

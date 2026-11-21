import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

class GitHubCodeConnectionsAuthTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Repository-level source with CodeConnections auth
    new codebuild.Project(this, 'RepoProject', {
      source: codebuild.Source.gitHub({
        owner: 'awslabs',
        repo: 'aws-cdk',
        connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/test-connection-id',
        webhookFilters: [
          codebuild.FilterGroup.inEventOf(codebuild.EventAction.WORKFLOW_JOB_QUEUED),
        ],
      }),
    });

    // Organization-level source with CodeConnections auth
    new codebuild.Project(this, 'OrgProject', {
      source: codebuild.Source.gitHub({
        owner: 'awslabs',
        connectionArn: 'arn:aws:codeconnections:us-east-1:123456789012:connection/test-connection-id',
      }),
    });
  }
}

const app = new cdk.App();

new GitHubCodeConnectionsAuthTestStack(app, 'codebuild-github-codeconnections-auth');

app.synth();

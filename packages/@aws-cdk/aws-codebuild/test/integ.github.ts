import cdk = require('@aws-cdk/core');
import codebuild = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const source = codebuild.Source.gitHub({
      owner: 'aws',
      repo: 'aws-cdk',
      reportBuildStatus: false,
    });
    new codebuild.Project(this, 'MyProject', {
      source
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-github');

app.synth();

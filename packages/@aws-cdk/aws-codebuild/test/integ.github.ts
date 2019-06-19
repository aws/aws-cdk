import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const source = codebuild.Source.gitHub({
      owner: 'awslabs',
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

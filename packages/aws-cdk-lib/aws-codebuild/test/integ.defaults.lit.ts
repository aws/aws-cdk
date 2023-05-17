import * as cdk from '../../core';
import * as codebuild from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Hello, CodeBuild!"',
            ],
          },
        },
      }),
    });
    /// !hide
  }
}

const app = new cdk.App();

new TestStack(app, 'codebuild-default-project');

app.synth();

import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    new codebuild.Project(this, 'MyBatchProject', {
      supportBatchBuildType: true,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        batch: {
          'build-list': [
            { identifier: 'build_1' },
          ],
        },
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

new TestStack(app, 'codebuild-batch-project');

app.synth();

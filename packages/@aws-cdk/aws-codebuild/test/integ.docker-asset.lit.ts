import cdk = require('@aws-cdk/cdk');
import path = require('path');
import codebuild = require('../lib');

class TestStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string) {
    super(parent, id);

    new codebuild.Project(this, 'MyProject', {
      buildSpec: {
        version: "0.2",
        phases: {
          build: {
            commands: [ 'ls' ]
          }
        }
      },
      /// !show
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromAsset(this, 'MyImage', {
          directory: path.join(__dirname, 'demo-image')
        })
      }
      /// !hide
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-docker-asset');

app.run();

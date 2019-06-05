import ecr = require('@aws-cdk/aws-ecr');
import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const ecrRepository = new ecr.Repository(this, 'MyRepo');

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
        buildImage: codebuild.LinuxBuildImage.fromEcrRepository(ecrRepository, "v1.0")
      }
      /// !hide
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-docker-asset');

app.synth();

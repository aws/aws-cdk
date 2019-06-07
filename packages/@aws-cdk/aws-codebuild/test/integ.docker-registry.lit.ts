import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/cdk');
import codebuild = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secrets = secretsmanager.Secret.fromSecretArn(this, "MySecrets",
    `arn:aws:secretsmanager:${this.region}:${this.accountId}:secret:my-secrets-123456`);

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
        buildImage: codebuild.LinuxBuildImage.fromDockerRegistry("my-registry/my-repo", secrets)
      }
      /// !hide
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-docker-asset');

app.synth();

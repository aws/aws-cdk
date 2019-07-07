import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/core');
import codebuild = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secrets = secretsmanager.Secret.fromSecretArn(this, "MySecrets",
      `arn:aws:secretsmanager:${this.region}:${this.account}:secret:my-secrets-123456`);

    new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: [ 'ls' ]
          }
        }
      }),
      /// !show
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('my-registry/my-repo', {
          secretsManagerCredentials: secrets,
        }),
      },
      /// !hide
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-docker-asset');

app.synth();

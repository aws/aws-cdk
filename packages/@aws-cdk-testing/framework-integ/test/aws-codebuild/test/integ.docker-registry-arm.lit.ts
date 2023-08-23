import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib/core';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secrets = secretsmanager.Secret.fromSecretCompleteArn(this, 'MySecrets',
      `arn:aws:secretsmanager:${this.region}:${this.account}:secret:my-secrets-123456`);

    new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['ls'],
          },
        },
      }),
      grantReportGroupPermissions: false,
      environment: {
        buildImage: codebuild.LinuxArmBuildImage.fromDockerRegistry('my-registry/my-repo', {
          secretsManagerCredentials: secrets,
        }),
      },
    });
  }
}

const app = new cdk.App();

const codebuildarmdockerasset = new TestStack(app, 'test-codebuild-arm-docker-registry');

new IntegTest(app, 'codebuild-arm-docker-registry', { testCases: [codebuildarmdockerasset] });

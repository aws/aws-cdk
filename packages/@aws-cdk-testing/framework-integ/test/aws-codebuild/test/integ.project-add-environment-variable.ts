import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class AddEnvironmentVariableTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const secret = new secretsmanager.Secret(this, 'DockerHubCredentials');
    const project = new codebuild.Project(this, 'Project', {
      buildSpec: codebuild.BuildSpec.fromObject({ version: '0.2' }),
      environmentVariables: {
        LOG_LEVEL: { value: 'info' },
      },
    });

    project.addEnvironmentVariable('DOCKER_HUB_USERNAME', {
      type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
      value: `${secret.secretArn}:username`,
    });
    project.addEnvironmentVariable('DOCKER_HUB_PASSWORD', {
      type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
      value: `${secret.secretArn}:password`,
    });
  }
}

const app = new App();
const stack = new AddEnvironmentVariableTestStack(app, 'codebuild-add-environment-variable');

new IntegTest(app, 'integ-test-codebuild-add-environment-variable', {
  testCases: [stack],
});

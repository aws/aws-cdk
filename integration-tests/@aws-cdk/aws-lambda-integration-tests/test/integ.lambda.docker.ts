import * as path from 'path';
import { DockerImageCode, DockerImageFunction } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';

class TestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    new DockerImageFunction(this, 'MyLambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
    });
  }
}

const app = new App();
new TestStack(app, 'lambda-ecr-docker');

app.synth();
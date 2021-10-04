import * as path from 'path';
import { DockerPlatform } from '@aws-cdk/aws-ecr-assets';
import { App, Stack } from '@aws-cdk/core';
import { Architecture, DockerImageCode, DockerImageFunction } from '../lib';

class TestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    new DockerImageFunction(this, 'MyLambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-arm64-handler'), {
        platform: DockerPlatform.ARM_64,
      }),
      architectures: [Architecture.ARM_64],
    });
  }
}

const app = new App();

new TestStack(app, 'lambda-ecr-docker-arm64');

app.synth();

import * as path from 'path';
import { App, Stack } from '@aws-cdk/core';
import { Architecture, DockerImageCode, DockerImageFunction } from '../lib';

class TestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    /**
     * The platform will be set to ARM_64 automatically based on the `architecture` property.
     */
    new DockerImageFunction(this, 'MyArmLambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
      architecture: Architecture.ARM_64,
    });
  }
}

const app = new App();

new TestStack(app, 'lambda-ecr-docker-arm64');

app.synth();
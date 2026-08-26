import * as path from 'path';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Architecture, DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'lambda-ecr-docker-arm64');

new DockerImageFunction(stack, 'MyLambda', {
  code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-arm64-handler')),
  architecture: Architecture.ARM_64,
});

new integ.IntegTest(app, 'lambda-docker-arm64', {
  testCases: [stack],
});

app.synth();

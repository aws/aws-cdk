import * as path from 'path';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { DockerImageCode, DockerImageFunction, SnapStartConf } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-snapstart-container-image');

new DockerImageFunction(stack, 'SnapStartContainerImageLambda', {
  code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
  snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
});

new integ.IntegTest(app, 'lambda-snapstart-container-image', {
  testCases: [stack],
});

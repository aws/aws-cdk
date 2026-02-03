import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo', {
  imageScanOnPush: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

repo.onImageScanCompleted('ImageScanComplete');

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri,
});

new IntegTest(app, 'cdk-integ-ecr-image-scan', {
  testCases: [stack],
});

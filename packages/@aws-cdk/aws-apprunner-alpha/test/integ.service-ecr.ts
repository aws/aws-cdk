import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import { Service, Source } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

// Scenario 3: Create the service from local code assets
const imageAsset = new assets.DockerImageAsset(stack, 'ImageAssets', {
  directory: path.join(__dirname, 'docker.assets'),
});
const service3 = new Service(stack, 'Service3', {
  source: Source.fromAsset({
    imageConfiguration: { port: 8000 },
    asset: imageAsset,
  }),
  autoDeploymentsEnabled: true,
});
new cdk.CfnOutput(stack, 'URL3', { value: `https://${service3.serviceUrl}` });

// Scenario 2: Create the service from existing ECR repository
const service2 = new Service(stack, 'Service2', {
  source: Source.fromEcr({
    imageConfiguration: { port: 80 },
    repository: imageAsset.repository,
    tag: imageAsset.assetHash,
  }),
});
new cdk.CfnOutput(stack, 'URL2', { value: `https://${service2.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerEcr', {
  testCases: [stack],
  regions: ['ap-northeast-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-east-2', 'us-west-2'],
});

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import { APPRUNNER_SUPPORTED_REGIONS } from './apprunner-supported-regions';
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
  regions: APPRUNNER_SUPPORTED_REGIONS,
});

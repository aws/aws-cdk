import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import * as sagemaker from '../lib';

/*
 * Stack verification steps:
 * aws sagemaker-runtime invoke-endpoint --endpoint-name <deployed endpoint name> --body "any string" --cli-binary-format raw-in-base64-out /tmp/inference.txt && cat /tmp/inference.txt
 *
 * The above command will result in one of the following outputs (based on relative variant weight).
 *
 * Roughly 25% of the time:
 *
 *   {
 *       "ContentType": "text/plain",
 *       "InvokedProductionVariant": "firstVariant"
 *   }
 *   Artifact info: ['This file exists for test purposes only and is not a real SageMaker Model artifact']
 *
 * Roughly 25% of the time:
 *
 *   {
 *       "ContentType": "text/plain",
 *       "InvokedProductionVariant": "secondVariant"
 *   }
 *   Artifact info: ['This file exists for test purposes only and is not a real SageMaker Model artifact']
 *
 * Roughly 50% of the time:
 *
 *   {
 *       "ContentType": "text/plain",
 *       "InvokedProductionVariant": "thirdVariant"
 *   }
 *   Artifact info: No artifacts are present
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sagemaker-endpoint');

const image = sagemaker.ContainerImage.fromAsset(path.join(__dirname, 'test-image'));
const modelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz'));

const modelWithArtifact = new sagemaker.Model(stack, 'ModelWithArtifact', {
  containers: [{ image, modelData }],
});
const modelWithoutArtifact = new sagemaker.Model(stack, 'ModelWithoutArtifact', {
  containers: [{ image }],
});

const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
  instanceProductionVariants: [
    {
      model: modelWithArtifact,
      variantName: 'firstVariant',
      instanceType: sagemaker.InstanceType.M5_LARGE,
    },
    {
      model: modelWithArtifact,
      variantName: 'secondVariant',
    },
  ],
});
endpointConfig.addInstanceProductionVariant({
  model: modelWithoutArtifact,
  variantName: 'thirdVariant',
  initialVariantWeight: 2.0,
});
const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

const invokerRole = new iam.Role(stack, 'Invoker', {
  assumedBy: new iam.AccountRootPrincipal(),
});
endpoint.grantInvoke(invokerRole);

const productionVariant = endpoint.findInstanceProductionVariant('firstVariant');
const instanceCount = productionVariant.autoScaleInstanceCount({
  maxCapacity: 3,
});
instanceCount.scaleOnInvocations('LimitRPS', {
  maxRequestsPerSecond: 30,
});

const integ = new IntegTest(app, 'integtest-endpoint', {
  testCases: [stack],
});

const invoke = integ.assertions.awsApiCall('SageMakerRuntime', 'invokeEndpoint', {
  EndpointName: endpoint.endpointName,
  TargetVariant: 'firstVariant',
  Body: 'any string',
});
invoke.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'sagemaker:InvokeEndpoint',
  Resource: '*',
});
invoke.assertAtPath('Body', ExpectedResult.stringLikeRegexp('Artifact info:.*This file exists for test purposes only and is not a real SageMaker Model artifact'));

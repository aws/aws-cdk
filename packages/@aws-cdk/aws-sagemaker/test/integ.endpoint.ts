/// !cdk-integ pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
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

const imageAsset = new ecr_assets.DockerImageAsset(stack, 'ModelImage', {
  directory: path.join(__dirname, 'test-image'),
});
const image = sagemaker.ContainerImage.fromAsset(imageAsset);
const modelDataAsset = new s3_assets.Asset(stack, 'ModelData', {
  path: path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz'),
});
const modelData = sagemaker.ModelData.fromAsset(modelDataAsset);

const modelWithArtifactAndVpc = new sagemaker.Model(stack, 'ModelWithArtifactAndVpc', {
  containers: [{ image, modelData }],
  vpc: new ec2.Vpc(stack, 'VPC'),
});
const modelWithoutArtifactAndVpc = new sagemaker.Model(stack, 'ModelWithoutArtifactAndVpc', {
  containers: [{ image }],
});

const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
  instanceProductionVariants: [
    {
      model: modelWithArtifactAndVpc,
      variantName: 'firstVariant',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
    },
    {
      model: modelWithArtifactAndVpc,
      variantName: 'secondVariant',
    },
  ],
});
endpointConfig.addInstanceProductionVariant({
  model: modelWithoutArtifactAndVpc,
  variantName: 'thirdVariant',
  initialVariantWeight: 2.0,
});
const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

const invokerRole = new iam.Role(stack, 'Invoker', {
  assumedBy: new iam.AccountRootPrincipal(),
});
endpoint.grantInvoke(invokerRole);

const productionVariant = endpoint.findProductionVariant('firstVariant');
const instanceCount = productionVariant.autoScaleInstanceCount({
  maxCapacity: 3,
});
instanceCount.scaleOnInvocations('LimitRPS', {
  maxRequestsPerSecond: 30,
});

productionVariant.metricInvocations().createAlarm(stack, 'InvocationsAlarm', {
  threshold: 1,
  evaluationPeriods: 2,
});
productionVariant.metricInvocationsPerInstance().createAlarm(stack, 'InvocationsPerInstanceAlarm', {
  threshold: 4,
  evaluationPeriods: 5,
});
productionVariant.metricModelLatency().createAlarm(stack, 'ModelLatencyAlarm', {
  threshold: 7,
  evaluationPeriods: 8,
});
productionVariant.metricOverheadLatency().createAlarm(stack, 'OverheadLatencyAlarm', {
  threshold: 10,
  evaluationPeriods: 11,
});
productionVariant.metricInvocationResponseCode(sagemaker.InvocationHttpResponseCode.INVOCATION_5XX_ERRORS).createAlarm(stack, 'Invocation5XXErrorsAlarm', {
  threshold: 13,
  evaluationPeriods: 14,
});
productionVariant.metricDiskUtilization().createAlarm(stack, 'DiskUtilizationAlarm', {
  threshold: 16,
  evaluationPeriods: 17,
});
productionVariant.metricCpuUtilization().createAlarm(stack, 'CPUUtilizationAlarm', {
  threshold: 19,
  evaluationPeriods: 20,
});
productionVariant.metricMemoryUtilization().createAlarm(stack, 'MemoryUtilizationAlarm', {
  threshold: 22,
  evaluationPeriods: 23,
});
productionVariant.metricGpuUtilization().createAlarm(stack, 'GPUUtilizationAlarm', {
  threshold: 25,
  evaluationPeriods: 26,
});
productionVariant.metricGpuMemoryUtilization().createAlarm(stack, 'GPUMemoryUtilizationAlarm', {
  threshold: 28,
  evaluationPeriods: 29,
});

app.synth();

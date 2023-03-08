import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as sagemaker from '../lib';

/*
 * Stack verification steps:
 * aws cloudwatch describe-alarms --query "MetricAlarms[?Namespace=='/aws/sagemaker/Endpoints' || Namespace=='AWS/SageMaker'].{MetricName: MetricName, Namespace: Namespace, Dimension: join(\`, \`, Dimensions[].Value)}"
 *
 * The above command will result in the following:
 *
 *   [
 *       {
 *           "MetricName": "CPUUtilization",
 *           "Namespace": "/aws/sagemaker/Endpoints",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "DiskUtilization",
 *           "Namespace": "/aws/sagemaker/Endpoints",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "GPUMemoryUtilization",
 *           "Namespace": "/aws/sagemaker/Endpoints",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "GPUUtilization",
 *           "Namespace": "/aws/sagemaker/Endpoints",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "Invocation5XXErrors",
 *           "Namespace": "AWS/SageMaker",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "Invocations",
 *           "Namespace": "AWS/SageMaker",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "InvocationsPerInstance",
 *           "Namespace": "AWS/SageMaker",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "MemoryUtilization",
 *           "Namespace": "/aws/sagemaker/Endpoints",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "ModelLatency",
 *           "Namespace": "AWS/SageMaker",
 *           "Dimension": "Endpoint..., firstVariant"
 *       },
 *       {
 *           "MetricName": "OverheadLatency",
 *           "Namespace": "AWS/SageMaker",
 *           "Dimension": "Endpoint..., firstVariant"
 *       }
 *   ]
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sagemaker-endpoint-alarms');

const image = sagemaker.ContainerImage.fromAsset(path.join(__dirname, 'test-image'));
const modelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz'));

const modelWithArtifact = new sagemaker.Model(stack, 'ModelWithArtifact', {
  containers: [{ image, modelData }],
});

const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
  instanceProductionVariants: [
    {
      model: modelWithArtifact,
      variantName: 'firstVariant',
    },
  ],
});
const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

const invokerRole = new iam.Role(stack, 'Invoker', {
  assumedBy: new iam.AccountRootPrincipal(),
});
endpoint.grantInvoke(invokerRole);

const productionVariant = endpoint.findInstanceProductionVariant('firstVariant');
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

new IntegTest(app, 'integtest-endpoint-alarms', {
  testCases: [stack],
});

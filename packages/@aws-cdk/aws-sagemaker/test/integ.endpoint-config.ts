import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as sagemaker from '../lib';

/*
 * Stack verification steps:
 * aws sagemaker describe-endpoint-config --endpoint-config-name <endpoint config name>
 *
 * The above command will result in the following output.
 *
 *   {
 *     "EndpointConfigName": "EndpointConfig...",
 *     "EndpointConfigArn": "arn:aws:sagemaker:...",
 *     "ProductionVariants": [
 *         {
 *             "VariantName": "firstVariant",
 *             "ModelName": "ModelWithArtifactAndVpcModel...",
 *             "InitialInstanceCount": 1,
 *             "InstanceType": "ml.m5.large",
 *             "InitialVariantWeight": 1.0
 *         },
 *         {
 *             "VariantName": "secondVariant",
 *             "ModelName": "ModelWithArtifactAndVpcModel...",
 *             "InitialInstanceCount": 1,
 *             "InstanceType": "ml.t2.medium",
 *             "InitialVariantWeight": 1.0
 *         },
 *         {
 *             "VariantName": "thirdVariant",
 *             "ModelName": "ModelWithoutArtifactAndVpcModel...",
 *             "InitialInstanceCount": 1,
 *             "InstanceType": "ml.t2.medium",
 *             "InitialVariantWeight": 2.0
 *         }
 *     ],
 *     "CreationTime": "..."
 *   }
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sagemaker-endpointconfig');

const image = sagemaker.ContainerImage.fromAsset(path.join(__dirname, 'test-image'));
const modelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz'));

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
      instanceType: sagemaker.InstanceType.M5_LARGE,
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

new IntegTest(app, 'integtest-endpointconfig', {
  testCases: [stack],
});

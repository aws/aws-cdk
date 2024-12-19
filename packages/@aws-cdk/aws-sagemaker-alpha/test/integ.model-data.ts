import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import * as sagemaker from '../lib';

/*
 * Stack verification steps:
 * aws sagemaker-runtime invoke-endpoint --endpoint-name <deployed endpoint name> --body "any string" --cli-binary-format raw-in-base64-out /tmp/inference.txt && cat /tmp/inference.txt
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sagemaker-model-data');

// Paths to local assets
const dockerfileDirectory = path.join(__dirname, 'test-image');
const uncompressedArtifactDirectoryPath = path.join(__dirname, 'test-artifacts', 'valid-artifact');
const tarGzArtifactFilePath = path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz');

const ecrImageAsset = new ecr_assets.DockerImageAsset(stack, 'EcrImage', {
  directory: dockerfileDirectory,
});
const ecrImage = sagemaker.ContainerImage.fromEcrRepository(
  ecrImageAsset.repository,
  ecrImageAsset.imageTag,
);

const bucket = new Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const deployment = new BucketDeployment(stack, 'BucketDeployment', {
  destinationBucket: bucket,
  sources: [
    Source.asset(uncompressedArtifactDirectoryPath),
  ],
  destinationKeyPrefix: 'uncompressed/',
});

const uncompressedDirectoryArtifactModel = new sagemaker.Model(stack, 'UncompressedDirectoryArtifactModel', {
  containers: [{
    image: ecrImage,
    modelData: sagemaker.ModelData.fromBucket(deployment.deployedBucket, 'uncompressed/', {
      compressionType: sagemaker.CompressionType.NONE,
      s3DataType: sagemaker.S3DataType.S3_PREFIX,
    }),
  }],
});
const uncompressedFileArtifactModel = new sagemaker.Model(stack, 'UncompressedFileArtifactModel', {
  containers: [{
    image: ecrImage,
    modelData: sagemaker.ModelData.fromBucket(deployment.deployedBucket, 'uncompressed/artifact.txt', {
      compressionType: sagemaker.CompressionType.NONE,
      s3DataType: sagemaker.S3DataType.S3_OBJECT,
    }),
  }],
});
const tarGzArtifactModel = new sagemaker.Model(stack, 'TarGzArtifactModel', {
  containers: [{
    image: ecrImage,
    modelData: sagemaker.ModelData.fromAsset(tarGzArtifactFilePath),
  }],
});
const variants: sagemaker.InstanceProductionVariantProps[] = [
  {
    model: uncompressedDirectoryArtifactModel,
    variantName: 'uncompressed-directory',
  },
  {
    model: uncompressedFileArtifactModel,
    variantName: 'uncompressed-file',
  },
  {
    model: tarGzArtifactModel,
    variantName: 'targz',
  },
];
const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
  instanceProductionVariants: variants,
});
const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

const invokerRole = new iam.Role(stack, 'Invoker', {
  assumedBy: new iam.AccountRootPrincipal(),
});
endpoint.grantInvoke(invokerRole);

const integ = new IntegTest(app, 'integtest-model-data', {
  testCases: [stack],
});

variants.forEach((variant) => {
  const invoke = integ.assertions.awsApiCall('SageMakerRuntime', 'invokeEndpoint', {
    EndpointName: endpoint.endpointName,
    TargetVariant: variant.variantName,
    Body: 'any string',
  });
  invoke.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: 'sagemaker:InvokeEndpoint',
    Resource: '*',
  });
  invoke.assertAtPath('Body', ExpectedResult.stringLikeRegexp('Artifact info:.*This file exists for test purposes only and is not a real SageMaker Model artifact'));
});
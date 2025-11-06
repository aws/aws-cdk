import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as sagemaker from '../lib';

/*
 * Stack verification is performed using API assertions below.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sagemaker-endpointconfig');

const image = sagemaker.ContainerImage.fromAsset(path.join(__dirname, 'test-image'));
const modelData = sagemaker.ModelData.fromAsset(path.join(__dirname, 'test-artifacts', 'valid-artifact.tar.gz'));

const modelWithArtifactAndVpc = new sagemaker.Model(stack, 'ModelWithArtifactAndVpc', {
  containers: [{ image, modelData }],
  vpc: new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false }),
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

// Test serverless endpoint configuration with all properties
const serverlessEndpointConfig = new sagemaker.EndpointConfig(stack, 'ServerlessEndpointConfig', {
  serverlessProductionVariant: {
    model: modelWithoutArtifactAndVpc,
    variantName: 'serverlessVariant',
    maxConcurrency: 10,
    memorySizeInMB: 2048,
    provisionedConcurrency: 5,
    initialVariantWeight: 1.0,
  },
});

// Test serverless endpoint configuration with minimal properties
const minimalServerlessEndpointConfig = new sagemaker.EndpointConfig(stack, 'MinimalServerlessEndpointConfig', {
  serverlessProductionVariant: {
    model: modelWithoutArtifactAndVpc,
    variantName: 'minimalServerlessVariant',
    maxConcurrency: 1,
    memorySizeInMB: 1024,
    // No provisionedConcurrency - testing optional property
  },
});

// Test serverless endpoint configuration with boundary values
const boundaryServerlessEndpointConfig = new sagemaker.EndpointConfig(stack, 'BoundaryServerlessEndpointConfig', {
  serverlessProductionVariant: {
    model: modelWithoutArtifactAndVpc,
    variantName: 'boundaryServerlessVariant',
    maxConcurrency: 200, // Maximum allowed
    memorySizeInMB: 6144, // Maximum allowed
    provisionedConcurrency: 200, // Maximum allowed (equal to maxConcurrency)
  },
});

const integ = new IntegTest(app, 'integtest-endpointconfig', {
  testCases: [stack],
});

// Verify instance-based endpoint config
integ.assertions.awsApiCall('SageMaker', 'describeEndpointConfig', {
  EndpointConfigName: endpointConfig.endpointConfigName,
}).expect(ExpectedResult.objectLike({
  ProductionVariants: [
    { VariantName: 'firstVariant', InstanceType: 'ml.m5.large' },
    { VariantName: 'secondVariant' },
    { VariantName: 'thirdVariant' },
  ],
}));

// Verify serverless endpoint config with all properties
integ.assertions.awsApiCall('SageMaker', 'describeEndpointConfig', {
  EndpointConfigName: serverlessEndpointConfig.endpointConfigName,
}).expect(ExpectedResult.objectLike({
  ProductionVariants: [{
    VariantName: 'serverlessVariant',
    ServerlessConfig: {
      MaxConcurrency: 10,
      MemorySizeInMB: 2048,
      ProvisionedConcurrency: 5,
    },
  }],
}));

// Verify minimal serverless endpoint config
integ.assertions.awsApiCall('SageMaker', 'describeEndpointConfig', {
  EndpointConfigName: minimalServerlessEndpointConfig.endpointConfigName,
}).expect(ExpectedResult.objectLike({
  ProductionVariants: [{
    VariantName: 'minimalServerlessVariant',
    ServerlessConfig: {
      MaxConcurrency: 1,
      MemorySizeInMB: 1024,
    },
  }],
}));

// Verify boundary serverless endpoint config
integ.assertions.awsApiCall('SageMaker', 'describeEndpointConfig', {
  EndpointConfigName: boundaryServerlessEndpointConfig.endpointConfigName,
}).expect(ExpectedResult.objectLike({
  ProductionVariants: [{
    VariantName: 'boundaryServerlessVariant',
    ServerlessConfig: {
      MaxConcurrency: 200,
      MemorySizeInMB: 6144,
      ProvisionedConcurrency: 200,
    },
  }],
}));

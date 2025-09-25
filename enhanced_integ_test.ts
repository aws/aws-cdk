import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sagemaker from '../lib';

/*
 * Stack verification steps:
 * aws sagemaker describe-endpoint-config --endpoint-config-name <endpoint config name>
 *
 * For instance-based endpoint config, the above command will result in the following output:
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
 *
 * For serverless endpoint config, the command will show:
 *   {
 *     "EndpointConfigName": "ServerlessEndpointConfig...",
 *     "EndpointConfigArn": "arn:aws:sagemaker:...",
 *     "ProductionVariants": [
 *         {
 *             "VariantName": "serverlessVariant",
 *             "ModelName": "ModelWithoutArtifactAndVpcModel...",
 *             "InitialVariantWeight": 1.0,
 *             "ServerlessConfig": {
 *                 "MaxConcurrency": 10,
 *                 "MemorySizeInMB": 2048,
 *                 "ProvisionedConcurrency": 5
 *             }
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
    vpc: new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false }),
});
const modelWithoutArtifactAndVpc = new sagemaker.Model(stack, 'ModelWithoutArtifactAndVpc', {
    containers: [{ image }],
});

// Test instance-based endpoint configuration
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
new sagemaker.EndpointConfig(stack, 'ServerlessEndpointConfig', {
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
new sagemaker.EndpointConfig(stack, 'MinimalServerlessEndpointConfig', {
    serverlessProductionVariant: {
        model: modelWithoutArtifactAndVpc,
        variantName: 'minimalServerlessVariant',
        maxConcurrency: 1,
        memorySizeInMB: 1024,
        // No provisionedConcurrency - testing optional property
    },
});

// Test serverless endpoint configuration with boundary values
new sagemaker.EndpointConfig(stack, 'BoundaryServerlessEndpointConfig', {
    serverlessProductionVariant: {
        model: modelWithoutArtifactAndVpc,
        variantName: 'boundaryServerlessVariant',
        maxConcurrency: 200, // Maximum allowed
        memorySizeInMB: 6144, // Maximum allowed
        provisionedConcurrency: 200, // Maximum allowed (equal to maxConcurrency)
    },
});

new IntegTest(app, 'integtest-endpointconfig', {
    testCases: [stack],
});
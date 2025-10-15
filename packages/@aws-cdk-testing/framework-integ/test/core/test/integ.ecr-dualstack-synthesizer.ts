import * as cdk from 'aws-cdk-lib';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';

/**
 * Integration test for ECR dual-stack endpoint support in stack synthesizers
 *
 * This test verifies that Docker image assets are synthesized correctly
 * with both IPv4-only (default) and IPv6 dual-stack endpoints when using
 * the DefaultStackSynthesizer.
 */

const app = new cdk.App();

// Test stack for IPv4-only Docker image asset synthesis (default behavior)
const ipv4Stack = new cdk.Stack(app, 'EcrSynthesizerIpv4Stack');

const ipv4Asset = new DockerImageAsset(ipv4Stack, 'Ipv4DockerAsset', {
  directory: path.join(__dirname, 'docker-asset-fixture'),
});

new cdk.CfnOutput(ipv4Stack, 'Ipv4AssetImageUri', {
  value: ipv4Asset.imageUri,
  description: 'IPv4-only Docker image asset URI',
});

new cdk.CfnOutput(ipv4Stack, 'Ipv4AssetRepository', {
  value: ipv4Asset.repository.repositoryUri,
  description: 'IPv4-only Docker image asset repository URI',
});

// Set the dual-stack environment variable for this stack's synthesis
process.env.AWS_USE_DUALSTACK_ENDPOINT = 'true';

// Test stack for IPv6 dual-stack Docker image asset synthesis
const dualStackStack = new cdk.Stack(app, 'EcrSynthesizerDualStackStack');

const dualStackAsset = new DockerImageAsset(dualStackStack, 'DualStackDockerAsset', {
  directory: path.join(__dirname, 'docker-asset-fixture'),
});

new cdk.CfnOutput(dualStackStack, 'DualStackAssetImageUri', {
  value: dualStackAsset.imageUri,
  description: 'Dual-stack Docker image asset URI',
});

new cdk.CfnOutput(dualStackStack, 'DualStackAssetRepository', {
  value: dualStackAsset.repository.repositoryUri,
  description: 'Dual-stack Docker image asset repository URI',
});

// Clean up environment variable after synthesis
delete process.env.AWS_USE_DUALSTACK_ENDPOINT;

// Integration test configuration
new IntegTest(app, 'EcrSynthesizerDualStackIntegTest', {
  testCases: [ipv4Stack, dualStackStack],
  diffAssets: true,
  stackUpdateWorkflow: true,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});

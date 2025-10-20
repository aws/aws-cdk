import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

/**
 * Integration test for ECR dual-stack endpoint support
 *
 * This test verifies that ECR repositories can be created and used
 * with both IPv4-only (default) and IPv6 dual-stack endpoints.
 */

const app = new cdk.App();

// Test stack for IPv4-only ECR endpoints (default behavior)
const ipv4Stack = new cdk.Stack(app, 'EcrIpv4EndpointStack');

const ipv4Repository = new ecr.Repository(ipv4Stack, 'Ipv4Repository', {
  repositoryName: 'integ-test-ipv4-repo',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new cdk.CfnOutput(ipv4Stack, 'Ipv4RepositoryUri', {
  value: ipv4Repository.repositoryUri,
  description: 'IPv4-only ECR repository URI',
});

new cdk.CfnOutput(ipv4Stack, 'Ipv4RegistryUri', {
  value: ipv4Repository.registryUri,
  description: 'IPv4-only ECR registry URI',
});

// Test stack for IPv6 dual-stack ECR endpoints
const dualStackStack = new cdk.Stack(app, 'EcrDualStackEndpointStack');

// Set the dual-stack environment variable for this stack's synthesis
process.env.AWS_USE_DUALSTACK_ENDPOINT = 'true';

const dualStackRepository = new ecr.Repository(dualStackStack, 'DualStackRepository', {
  repositoryName: 'integ-test-dualstack-repo',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new cdk.CfnOutput(dualStackStack, 'DualStackRepositoryUri', {
  value: dualStackRepository.repositoryUri,
  description: 'Dual-stack ECR repository URI',
});

new cdk.CfnOutput(dualStackStack, 'DualStackRegistryUri', {
  value: dualStackRepository.registryUri,
  description: 'Dual-stack ECR registry URI',
});

// Clean up environment variable
delete process.env.AWS_USE_DUALSTACK_ENDPOINT;

// Integration test configuration
new IntegTest(app, 'EcrDualStackEndpointIntegTest', {
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

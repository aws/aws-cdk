/*
 * Integration test for Bedrock Agent Core WorkloadIdentity construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-workload-identity-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-workload-identity-1');

// Create a workload identity with basic configuration
new agentcore.WorkloadIdentity(stack, 'MyWorkloadIdentity', {
  workloadIdentityName: 'my_workload_identity',
});

// Create a workload identity with OAuth2 return URLs
new agentcore.WorkloadIdentity(stack, 'MyWorkloadIdentity2', {
  workloadIdentityName: 'my_workload_identity2',
  allowedResourceOauth2ReturnUrls: [
    'https://example.com/callback',
    'https://example.com/auth/callback',
  ],
});

// Create a workload identity with tags
new agentcore.WorkloadIdentity(stack, 'MyWorkloadIdentity3', {
  workloadIdentityName: 'my_workload_identity3',
  tags: {
    Environment: 'Dev',
    Team: 'AI/ML',
    Project: 'AgentCore',
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreWorkloadIdentity', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'],
});

app.synth();

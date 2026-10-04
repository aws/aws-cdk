/*
 * Integration test for Bedrock Agent Core Browser construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-code-interpreter-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-code-interpreter-1');

// Create a code interpreter with basic configuration
new agentcore.CodeInterpreterCustom(stack, 'MyCodeInterpreter', {
  codeInterpreterCustomName: 'my_code_interpreter',
  description: 'A code interpreter for code execution',
});

// Create a code interpreter with sandbox network configuration
new agentcore.CodeInterpreterCustom(stack, 'MyCodeInterpreter2', {
  codeInterpreterCustomName: 'my_code_interpreter2',
  networkConfiguration: agentcore.CodeInterpreterNetworkConfiguration.usingSandboxNetwork(),
});

// Create a code interpreter with tags
new agentcore.CodeInterpreterCustom(stack, 'MyCodeInterpreter3', {
  codeInterpreterCustomName: 'my_code_interpreter3',
  networkConfiguration: agentcore.CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
  tags: {
    Environment: 'Dev',
    Team: 'AI/ML',
    Project: 'AgentCore',
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreCodeInterpreter', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});

app.synth();

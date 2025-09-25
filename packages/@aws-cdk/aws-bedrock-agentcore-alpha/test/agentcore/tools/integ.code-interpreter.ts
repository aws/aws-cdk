/*
 * Integration test for Bedrock Agent Core Browser construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-code-interpreter-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';
import { CodeInterpreterNetworkMode } from '../../../agentcore';

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
  networkConfiguration: {
    networkMode: CodeInterpreterNetworkMode.SANDBOX,
  },
});

// Create a code interpreter with tags
new agentcore.CodeInterpreterCustom(stack, 'MyCodeInterpreter3', {
  codeInterpreterCustomName: 'my_code_interpreter3',
  networkConfiguration: {
    networkMode: CodeInterpreterNetworkMode.PUBLIC,
  },
  tags: {
    Environment: 'Dev',
    Team: 'AI/ML',
    Project: 'AgentCore',
  },
});

new integ.IntegTest(app, 'BedrockAgentCoreCodeInterpreter', {
  testCases: [stack],
});

app.synth();

/*
 * Integration test for Bedrock Agent Memory configuration
 */

/// !cdk-integ aws-cdk-bedrock-memory-1

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as bedrock from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-memory-1');

// Create Lambda functions for the action group executors
const defaultMemoryFunction = new lambda.Function(stack, 'DefaultMemoryFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Event:', JSON.stringify(event));
      return {
        messageVersion: '1.0',
        response: {
          actionGroup: event.actionGroup,
          apiPath: event.apiPath,
          httpMethod: event.httpMethod,
          httpStatusCode: 200,
          responseBody: {
            application_json: { result: 'Success from default memory action group' }
          }
        }
      };
    };
  `),
});

const customMemoryFunction = new lambda.Function(stack, 'CustomMemoryFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Event:', JSON.stringify(event));
      return {
        messageVersion: '1.0',
        response: {
          actionGroup: event.actionGroup,
          apiPath: event.apiPath,
          httpMethod: event.httpMethod,
          httpStatusCode: 200,
          responseBody: {
            application_json: { result: 'Success from custom memory action group' }
          }
        }
      };
    };
  `),
});

// Create action group executors
const defaultMemoryExecutor = bedrock.ActionGroupExecutor.fromLambda(defaultMemoryFunction);
const customMemoryExecutor = bedrock.ActionGroupExecutor.fromLambda(customMemoryFunction);

// Create a simple API schema
const apiSchema = bedrock.ApiSchema.fromInline(`
openapi: 3.0.3
info:
  title: Simple API
  version: 1.0.0
paths:
  /hello:
    get:
      operationId: helloWorld
      summary: Say hello
      description: Returns a greeting message
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
`);

// Create action groups
const defaultMemoryActionGroup = new bedrock.AgentActionGroup({
  name: 'DefaultMemoryActionGroup',
  description: 'An action group for testing default memory configuration',
  apiSchema: apiSchema,
  executor: defaultMemoryExecutor,
});

const customMemoryActionGroup = new bedrock.AgentActionGroup({
  name: 'CustomMemoryActionGroup',
  description: 'An action group for testing custom memory configuration',
  apiSchema: apiSchema,
  executor: customMemoryExecutor,
});

// Test 1: Create an agent with default memory configuration
new bedrock.Agent(stack, 'AgentWithDefaultMemory', {
  agentName: 'agent-with-default-memory',
  instruction: 'This is an agent using default memory configuration with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  actionGroups: [defaultMemoryActionGroup],
  memory: bedrock.Memory.SESSION_SUMMARY,
});

// Test 2: Create an agent with custom memory configuration
new bedrock.Agent(stack, 'AgentWithCustomMemory', {
  agentName: 'agent-with-custom-memory',
  instruction: 'This is an agent using custom memory configuration with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  actionGroups: [customMemoryActionGroup],
  memory: bedrock.Memory.sessionSummary({
    memoryDuration: cdk.Duration.days(15),
    maxRecentSessions: 5,
  }),
});

new integ.IntegTest(app, 'BedrockMemory', {
  testCases: [stack],
  regions: ['ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'sa-east-1', 'us-east-1', 'us-east-2', 'us-west-2'],
});

app.synth();

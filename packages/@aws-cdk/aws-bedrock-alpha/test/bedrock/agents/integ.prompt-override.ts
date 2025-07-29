/*
 * Integration test for Bedrock Agent Prompt Override configuration
 */

/// !cdk-integ aws-cdk-bedrock-prompt-override-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as bedrock from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-prompt-override-1');

// Create Lambda functions for the action group executors
const promptOverrideFunction = new lambda.Function(stack, 'PromptOverrideFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
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
            application_json: { result: 'Success from prompt override action group' }
          }
        }
      };
    };
  `),
});

const customParserActionFunction = new lambda.Function(stack, 'CustomParserActionFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
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
            application_json: { result: 'Success from custom parser action group' }
          }
        }
      };
    };
  `),
});

// Create a Lambda function for the custom parser
const parserFunction = new lambda.Function(stack, 'ParserFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Parser Event:', JSON.stringify(event));
      // Extract the raw model response
      const rawResponse = event.invokeModelRawResponse;
      
      // Simple parsing logic - in a real scenario, this would be more sophisticated
      const parsedResponse = {
        messageVersion: '1.0',
        response: rawResponse
      };
      
      return parsedResponse;
    };
  `),
});

// Create action group executors
const promptOverrideExecutor = bedrock.ActionGroupExecutor.fromLambda(promptOverrideFunction);
const customParserExecutor = bedrock.ActionGroupExecutor.fromLambda(customParserActionFunction);

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
const promptOverrideActionGroup = new bedrock.AgentActionGroup({
  name: 'PromptOverrideActionGroup',
  description: 'An action group for testing prompt override configuration',
  apiSchema: apiSchema,
  executor: promptOverrideExecutor,
});

const customParserActionGroup = new bedrock.AgentActionGroup({
  name: 'CustomParserActionGroup',
  description: 'An action group for testing custom parser configuration',
  apiSchema: apiSchema,
  executor: customParserExecutor,
});

// Test 1: Create an agent with prompt override configuration using fromSteps
new bedrock.Agent(stack, 'AgentWithPromptOverride', {
  agentName: 'agent-with-prompt-override',
  instruction: 'This is an agent using prompt override configuration with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  actionGroups: [promptOverrideActionGroup],
  promptOverrideConfiguration: bedrock.PromptOverrideConfiguration.fromSteps([
    {
      stepType: bedrock.AgentStepType.PRE_PROCESSING,
      stepEnabled: true,
      customPromptTemplate: '{"messages":[{"role":"user","content":"Process this user request: {{user_input}}"}]}',
      inferenceConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 250,
        maximumLength: 2048,
        stopSequences: [],
      },
    },
    {
      stepType: bedrock.AgentStepType.POST_PROCESSING,
      stepEnabled: true,
      customPromptTemplate: '{"messages":[{"role":"user","content":"Refine this response to be more concise and helpful: {{response}}"}]}',
      inferenceConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 100,
        maximumLength: 1024,
        stopSequences: [],
      },
    },
  ]),
});

// Test 2: Create an agent with prompt override configuration using withCustomParser
new bedrock.Agent(stack, 'AgentWithCustomParser', {
  agentName: 'agent-with-custom-parser',
  instruction: 'This is an agent using custom parser with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  actionGroups: [customParserActionGroup],
  promptOverrideConfiguration: bedrock.PromptOverrideConfiguration.withCustomParser({
    parser: parserFunction,
    preProcessingStep: {
      stepType: bedrock.AgentStepType.PRE_PROCESSING,
      useCustomParser: true,
      customPromptTemplate: '{"messages":[{"role":"user","content":"Process this user input and prepare it for orchestration: {{user_input}}"}]}',
      inferenceConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 250,
        maximumLength: 2048,
        stopSequences: [],
      },
    },
    memorySummarizationStep: {
      stepType: bedrock.AgentStepType.MEMORY_SUMMARIZATION,
      useCustomParser: true,
      customPromptTemplate: '{"messages":[{"role":"user","content":"Summarize this conversation for memory: {{conversation_history}}"}]}',
      inferenceConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 100,
        maximumLength: 1024,
        stopSequences: [],
      },
    },
  }),
});

new integ.IntegTest(app, 'BedrockPromptOverride', {
  testCases: [stack],
});

app.synth();

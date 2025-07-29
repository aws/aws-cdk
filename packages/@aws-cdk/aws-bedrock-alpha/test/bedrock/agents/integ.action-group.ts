/*
 * Integration test for Bedrock Agent Action Group construct
 */

/// !cdk-integ aws-cdk-bedrock-action-group-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as bedrock from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-action-group-1');

// Create a Lambda function for the action group executor
const actionGroupFunction = new lambda.Function(stack, 'ActionGroupFunction', {
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
            application_json: { result: 'Success from action group' }
          }
        }
      };
    };
  `),
});

// Create an API schema for the action group - using YAML format
const apiSchema = bedrock.ApiSchema.fromInline(`
openapi: 3.0.3
info:
  title: Action Group API
  version: 1.0.0
paths:
  /perform-action:
    post:
      operationId: performAction
      summary: Perform an action
      description: Perform an action with the specified parameters
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - action_type
              properties:
                action_type:
                  type: string
                  description: Type of action to perform
                parameters:
                  type: object
                  description: Additional parameters for the action
      responses:
        '200':
          description: Action performed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  result:
                    type: string
                  details:
                    type: object
`);

// Create an action group executor
const actionGroupExecutor = bedrock.ActionGroupExecutor.fromLambda(actionGroupFunction);

// Create a Bedrock Agent with custom action groups
new bedrock.Agent(stack, 'MyAgent', {
  agentName: 'test-action-group-agent',
  instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  // Enable built-in action groups
  userInputEnabled: true,
  codeInterpreterEnabled: true,
  // Add a custom action group
  actionGroups: [
    new bedrock.AgentActionGroup({
      name: 'CustomActionGroup',
      description: 'A custom action group for testing',
      apiSchema: apiSchema,
      executor: actionGroupExecutor,
      enabled: true,
    }),
  ],
});

new integ.IntegTest(app, 'BedrockActionGroup', {
  testCases: [stack],
});

app.synth();

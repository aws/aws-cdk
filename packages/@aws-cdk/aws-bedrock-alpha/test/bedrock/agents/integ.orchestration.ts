/*
 * Integration test for Bedrock Agent Orchestration construct
 */

/// !cdk-integ aws-cdk-bedrock-orchestration-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-orchestration-1');

// Create a Lambda function for custom orchestration
const orchestrationFunction = new lambda.Function(stack, 'OrchestrationFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Orchestration Event:', JSON.stringify(event));
      
      // Example orchestration logic
      const response = {
        messageVersion: '1.0',
        response: {
          actionGroup: event.actionGroup || 'default',
          apiPath: event.apiPath || '/default',
          httpMethod: event.httpMethod || 'GET',
          httpStatusCode: 200,
          responseBody: {
            application_json: { 
              result: 'Custom orchestration response',
              timestamp: new Date().toISOString()
            }
          }
        }
      };
      
      return response;
    };
  `),
});

// Create an orchestration executor using the Lambda function
const customOrchestrationExecutor = bedrock.CustomOrchestrationExecutor.fromLambda(orchestrationFunction);

// Create a Bedrock Agent with custom orchestration
new bedrock.Agent(stack, 'CustomOrchestrationAgent', {
  agentName: 'custom-orchestration-agent',
  instruction: 'This is an agent using custom orchestration with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  // Specify orchestration executor
  customOrchestrationExecutor: customOrchestrationExecutor,
});

new integ.IntegTest(app, 'BedrockOrchestration', {
  testCases: [stack],
});

app.synth();

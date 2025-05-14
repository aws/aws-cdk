/*
 * Integration test for Bedrock Agent API Schema construct
 */

/// !cdk-integ aws-cdk-bedrock-api-schema-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as bedrock from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-api-schema-1');

// Create Lambda functions for the action group executors
const inlineActionGroupFunction = new lambda.Function(stack, 'InlineActionGroupFunction', {
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
            application_json: { result: 'Success from inline action group' }
          }
        }
      };
    };
  `),
});

const s3ActionGroupFunction = new lambda.Function(stack, 'S3ActionGroupFunction', {
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
            application_json: { result: 'Success from S3 action group' }
          }
        }
      };
    };
  `),
});

// Create action group executors
const inlineActionGroupExecutor = bedrock.ActionGroupExecutor.fromLambda(inlineActionGroupFunction);
const s3ActionGroupExecutor = bedrock.ActionGroupExecutor.fromLambda(s3ActionGroupFunction);

// Create a simple inline API schema
const inlineApiSchema = bedrock.ApiSchema.fromInline(`
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

// Create an S3 bucket for storing the API schema
const schemaBucket = new s3.Bucket(stack, 'SchemaBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Deploy the schema file to S3
const schemaDeployment = new s3deploy.BucketDeployment(stack, 'DeploySchema', {
  sources: [s3deploy.Source.data('schema/s3-api-schema.json', `{
    "openapi": "3.0.3",
    "info": {
      "title": "S3 API Schema",
      "version": "1.0.0"
    },
    "paths": {
      "/s3hello": {
        "get": {
          "operationId": "s3HelloWorld",
          "summary": "Say hello from S3",
          "description": "Returns a greeting message from S3-stored schema",
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`)],
  destinationBucket: schemaBucket,
});

// Create an API schema from the S3 file
const s3ApiSchema = bedrock.ApiSchema.fromS3File(schemaBucket, 'schema/s3-api-schema.json');

// Create a Bedrock Agent with action groups using both API schemas
const agent = new bedrock.Agent(stack, 'ApiSchemaAgent', {
  agentName: 'api-schema-agent',
  instruction: 'This is an agent using an API schema with at least 40 characters of instruction',
  foundationModel: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0,
  forceDelete: true,
  actionGroups: [
    new bedrock.AgentActionGroup({
      name: 'InlineApiSchemaActionGroup',
      description: 'An action group using an inline API schema',
      apiSchema: inlineApiSchema,
      executor: inlineActionGroupExecutor,
    }),
    new bedrock.AgentActionGroup({
      name: 'S3ApiSchemaActionGroup',
      description: 'An action group using an S3-based API schema',
      apiSchema: s3ApiSchema,
      executor: s3ActionGroupExecutor,
    }),
  ],
});

// Add dependency for the agent on the S3 deployment
agent.node.addDependency(schemaDeployment);

new integ.IntegTest(app, 'BedrockApiSchema', {
  testCases: [stack],
});

app.synth();

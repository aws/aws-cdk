/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Key } from 'aws-cdk-lib/aws-kms';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
// internal
import { Gateway, GatewayExceptionLevel } from '../../../agentcore/gateway/gateway';
import { GatewayProtocol, McpGatewaySearchType } from '../../../agentcore/gateway/protocol';
import { GatewayAuthorizer } from '../../../agentcore/gateway/authorizer';
import { McpLambdaTarget } from '../../../agentcore/gateway/targets/mcp-lambda-target';
import { ToolSchema } from '../../../agentcore/gateway/targets/schema/tool-schema';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-gateway-transform-lambda-into-mcp-tools-1');

const userPool = new UserPool(stack, 'MyUserPool', {
  userPoolName: 'sample-agentcore-gateway-pool',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const client = new UserPoolClient(stack, 'MyUserPoolClient', {
  userPool: userPool,
  userPoolClientName: 'sample-agentcore-gateway-client',
  preventUserExistenceErrors: true,
});

const encryptionKey = new Key(stack, 'MyKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const myGateway = new Gateway(stack, 'MyGateway', {
  name: 'my-gateway-2',
  protocol: GatewayProtocol.mcp({
    searchType: McpGatewaySearchType.SEMANTIC,
  }),
  inboundAuthorizer: GatewayAuthorizer.cognito({
    userPool: userPool,
    allowedClients: [client],
  }),
  exceptionLevel: GatewayExceptionLevel.DEBUG,
  kmsKey: encryptionKey,
});

const myLambdaFunction = new PythonFunction(stack, 'MyFunction', {
  entry: path.join(__dirname),
  index: 'lambda_function_code.py',
  runtime: Runtime.PYTHON_3_12,
  handler: 'lambda_handler',
});

new McpLambdaTarget(stack, 'my-function', {
  name: 'my-function-target',
  description: 'Lambda Target using CDK',
  gateway: myGateway,
  lambdaFunction: myLambdaFunction,
  schema: ToolSchema.fromLocalAsset(path.join(__dirname, 'lambda_function_schema.json')),
});

new cdk.CfnOutput(stack, 'MyGatewayUrl', {
  value: myGateway.gatewayUrl!,
});

new cdk.CfnOutput(stack, 'UserPoolUrl', {
  value: userPool.userPoolProviderUrl,
});

new integ.IntegTest(app, 'BedrockAgentMemory', {
  testCases: [stack],
  regions: ['us-east-1'],
});

app.synth();

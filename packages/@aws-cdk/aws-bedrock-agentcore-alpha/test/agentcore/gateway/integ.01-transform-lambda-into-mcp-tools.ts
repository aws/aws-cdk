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
import {
  OAuthScope,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolResourceServer,
} from 'aws-cdk-lib/aws-cognito';
import { Key } from 'aws-cdk-lib/aws-kms';

// internal
import { Gateway, GatewayExceptionLevel } from '../../../agentcore/gateway/gateway';
import { GatewayProtocol, McpGatewaySearchType } from '../../../agentcore/gateway/protocol';
import { GatewayAuthorizer } from '../../../agentcore/gateway/authorizer';

import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { McpLambdaTarget } from '../../../agentcore/gateway/targets/mcp-lambda-target';
import { ToolSchema } from '../../../agentcore/gateway/targets/lambda/tool-schema';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-gateway-transform-lambda-into-mcp-tools-57');

const userPool = new UserPool(stack, 'MyUserPool', {
  userPoolName: 'sample-agentcore-gateway-pool',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const client = new UserPoolClient(stack, 'MyUserPoolClient', {
  userPool: userPool,
  userPoolClientName: 'sample-agentcore-gateway-client',
  supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
  preventUserExistenceErrors: true,
  generateSecret: true,
});

const encryptionKey = new Key(stack, 'MyKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const myGateway = new Gateway(stack, 'MyGateway', {
  name: 'my-gateway-57',
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

const bucket = Bucket.fromBucketName(stack, 'MyBucket', 'aaa-rafams-gfs-demos');

new McpLambdaTarget(stack, 'my-function', {
  name: 'my-function-target',
  description: 'Lambda Target using CDK',
  gateway: myGateway,
  lambdaFunction: myLambdaFunction,
  schema: ToolSchema.fromS3File(bucket, 'lambda_function_schema.json'),
});

new cdk.CfnOutput(stack, 'MyGatewayUrl', {
  value: myGateway.gatewayUrl!,
});

new cdk.CfnOutput(stack, 'UserPoolUrl', {
  value: userPool.userPoolProviderUrl,
});

new integ.IntegTest(app, 'AgentCoreGateway', {
  testCases: [stack],
  regions: ['eu-central-1'],
});

app.synth();

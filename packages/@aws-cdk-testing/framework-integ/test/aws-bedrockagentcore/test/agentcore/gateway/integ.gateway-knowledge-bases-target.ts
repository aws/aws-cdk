/**
 * Integration test: Gateway connector targets backed by an Amazon Bedrock
 * managed knowledge base, and a generic connector target.
 *
 * The assertions wait for the targets to reach READY, which covers create-time
 * validation. A Lambda function then obtains a token from the gateway's Cognito
 * client and calls the MCP endpoint, which covers the permissions the tools use:
 *
 * * `tools/list` returns exactly `managed-kb___AgenticRetrieveStream`, `managed-kb___Retrieve`,
 *   `managed-kb-retrieve___Retrieve` and `web-search___WebSearch` (no
 *   `managed-kb-retrieve___AgenticRetrieveStream`)
 * * `tools/call` succeeds for each tool, with a possibly empty result, instead of an
 *   access denied error or "Missing required field(s)"
 */

/// !cdk-integ cdk-agentcore-gateway-knowledge-bases-target

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-agentcore-gateway-knowledge-bases-target');

// Service role that Amazon Bedrock assumes to read the knowledge base's data sources.
// The knowledge base has no data source in this test, so the role needs no permissions.
const knowledgeBaseRole = new iam.Role(stack, 'KnowledgeBaseRole', {
  assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com', {
    conditions: {
      StringEquals: { 'aws:SourceAccount': stack.account },
      ArnLike: {
        'aws:SourceArn': stack.formatArn({ service: 'bedrock', resource: 'knowledge-base', resourceName: '*' }),
      },
    },
  }),
});

// The knowledge bases connector only supports managed knowledge bases.
const knowledgeBase = new bedrock.CfnKnowledgeBase(stack, 'KnowledgeBase', {
  name: 'integ-gateway-kb-target',
  roleArn: knowledgeBaseRole.roleArn,
  knowledgeBaseConfiguration: {
    type: 'MANAGED',
    managedKnowledgeBaseConfiguration: {
      embeddingModelType: 'MANAGED',
    },
  },
});

const gateway = new agentcore.Gateway(stack, 'Gateway', {
  gatewayName: 'kb-connector-target-gw',
});

// AgentCore validates the bound knowledge base with `bedrock:GetKnowledgeBase`
// right after the target is created. If the gateway role were missing that
// permission, or the policy were created after the target, the target would end
// up FAILED instead of READY and the assertion below would time out.
const target = gateway.addKnowledgeBasesTarget('KnowledgeBases', {
  gatewayTargetName: 'managed-kb',
  agenticRetrieve: {
    retrievers: [{ knowledgeBase, description: 'Integration test documents', maxNumberOfResults: 8 }],
    maxAgentIteration: 3,
    generateResponse: false,
    description: 'Answer questions from the integration test documents.',
  },
  retrieve: {
    knowledgeBase,
    numberOfResults: 5,
    overrideSearchType: agentcore.KnowledgeBaseSearchType.HYBRID,
    description: 'Search the integration test documents.',
    parameterOverrides: [
      {
        path: '$.retrievalConfiguration.managedSearchConfiguration.numberOfResults',
        description: 'Number of results to retrieve (1-100).',
        visible: true,
      },
    ],
  },
});

// A Retrieve-only target on a knowledge base of its own. The gateway role gets
// only GetKnowledgeBase and Retrieve on it, without the agentic actions, so READY
// here shows that this narrower grant passes the create-time validation too.
// With a shared knowledge base, the statement would be merged into the agentic one.
const retrieveOnlyKnowledgeBase = new bedrock.CfnKnowledgeBase(stack, 'RetrieveOnlyKnowledgeBase', {
  name: 'integ-gateway-kb-target-retrieve',
  roleArn: knowledgeBaseRole.roleArn,
  knowledgeBaseConfiguration: {
    type: 'MANAGED',
    managedKnowledgeBaseConfiguration: {
      embeddingModelType: 'MANAGED',
    },
  },
});

const retrieveOnlyTarget = gateway.addKnowledgeBasesTarget('RetrieveOnly', {
  gatewayTargetName: 'managed-kb-retrieve',
  retrieve: { knowledgeBase: retrieveOnlyKnowledgeBase },
});

// A generic connector target. It grants the gateway role nothing, so the permissions
// the Web Search Tool connector needs for tool calls are added here.
const webSearchTarget = gateway.addConnectorTarget('WebSearch', {
  gatewayTargetName: 'web-search',
  connector: agentcore.McpConnector.WEB_SEARCH,
  enabledTools: ['WebSearch'],
  toolConfigurations: [
    {
      name: 'WebSearch',
      description: 'Search the public web.',
      parameterValues: { domainFilter: { exclude: ['example.com'] } },
    },
  ],
});
gateway.grantInvoke(gateway.role);
gateway.role.addToPrincipalPolicy(new iam.PolicyStatement({
  actions: ['bedrock-agentcore:InvokeWebSearch'],
  resources: [
    stack.formatArn({ service: 'bedrock-agentcore', account: 'aws', resource: 'tool', resourceName: 'web-search.v1' }),
  ],
}));

const integTest = new integ.IntegTest(app, 'GatewayKnowledgeBasesTarget', {
  testCases: [stack],
});

const targets = [
  ['managed-kb', target],
  ['managed-kb-retrieve', retrieveOnlyTarget],
  ['web-search', webSearchTarget],
] as const;

for (const [targetName, gatewayTarget] of targets) {
  const apiCall = integTest.assertions.awsApiCall('bedrock-agentcore-control', 'getGatewayTarget', {
    gatewayIdentifier: gateway.gatewayId,
    targetId: gatewayTarget.targetId,
  });

  // `bedrock-agentcore-control` is not in the integ-tests SDK metadata, so the
  // auto-derived IAM action would be `bedrock-agentcore-control:GetGatewayTarget`
  // — wrong; the real prefix is `bedrock-agentcore`. Wire both the onEvent
  // provider and the WaiterStateMachine isComplete provider explicitly.
  apiCall.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['bedrock-agentcore:GetGatewayTarget'],
    Resource: ['*'],
  });

  apiCall.expect(integ.ExpectedResult.objectLike({
    name: targetName,
    status: 'READY',
    credentialProviderConfigurations: [
      { credentialProviderType: 'GATEWAY_IAM_ROLE' },
    ],
  })).waitForAssertions({
    totalTimeout: cdk.Duration.minutes(15),
    interval: cdk.Duration.seconds(30),
  });

  (apiCall as integ.AwsApiCall).waiterProvider?.addToRolePolicy({
    Effect: 'Allow',
    Action: ['bedrock-agentcore:GetGatewayTarget'],
    Resource: ['*'],
  });
}

// Calls every tool through the MCP endpoint with a client_credentials token
const toolCaller = new lambda.Function(stack, 'ToolCaller', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: cdk.Duration.minutes(5),
  environment: {
    GATEWAY_URL: gateway.gatewayUrl!,
    TOKEN_ENDPOINT: gateway.tokenEndpointUrl!,
    USER_POOL_ID: gateway.userPool!.userPoolId,
    CLIENT_ID: gateway.userPoolClient!.userPoolClientId,
    SCOPES: gateway.oauthScopes!.join(' '),
  },
  code: lambda.Code.fromInline(`
const { CognitoIdentityProviderClient, DescribeUserPoolClientCommand } = require('@aws-sdk/client-cognito-identity-provider');

const EXPECTED_TOOLS = [
  'managed-kb___AgenticRetrieveStream',
  'managed-kb___Retrieve',
  'managed-kb-retrieve___Retrieve',
  'web-search___WebSearch',
];
const CALLS = {
  'managed-kb___AgenticRetrieveStream': { messages: [{ role: 'user', content: { text: 'What do the documents cover?' } }] },
  'managed-kb___Retrieve': { retrievalQuery: { text: 'What do the documents cover?' } },
  'managed-kb-retrieve___Retrieve': { retrievalQuery: { text: 'What do the documents cover?' } },
  'web-search___WebSearch': { query: 'AWS CDK' },
};

async function rpc(token, id, method, params) {
  const response = await fetch(process.env.GATEWAY_URL, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
  const text = await response.text();
  if (!response.ok) { return { error: { code: response.status, message: text.slice(0, 500) } }; }
  if ((response.headers.get('content-type') || '').startsWith('text/event-stream')) {
    const messages = text.split('\\n').filter(l => l.startsWith('data:')).map(l => JSON.parse(l.slice(5)));
    return messages.filter(m => m.id === id).pop() || { error: { message: 'no response' } };
  }
  return JSON.parse(text);
}

exports.handler = async () => {
  const cognito = new CognitoIdentityProviderClient({});
  const client = await cognito.send(new DescribeUserPoolClientCommand({ UserPoolId: process.env.USER_POOL_ID, ClientId: process.env.CLIENT_ID }));
  const basic = Buffer.from(process.env.CLIENT_ID + ':' + client.UserPoolClient.ClientSecret).toString('base64');
  const tokenResponse = await fetch(process.env.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + basic, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope: process.env.SCOPES }).toString(),
  });
  const token = (await tokenResponse.json()).access_token;

  const list = await rpc(token, 1, 'tools/list', {});
  const tools = ((list.result && list.result.tools) || []).map(t => t.name).filter(n => !n.startsWith('x_amz_bedrock_agentcore_')).sort();
  const toolsMatch = JSON.stringify(tools) === JSON.stringify([...EXPECTED_TOOLS].sort());

  const calls = {};
  let id = 10;
  for (const [name, args] of Object.entries(CALLS)) {
    const response = await rpc(token, id++, 'tools/call', { name, arguments: args });
    const failed = response.error || !response.result || response.result.isError;
    calls[name] = failed ? JSON.stringify(response.error || response.result).slice(0, 500) : 'ok';
  }

  const allSucceeded = toolsMatch && Object.values(calls).every(v => v === 'ok');
  return { allSucceeded, tools, calls };
};
`),
});
toolCaller.addToRolePolicy(new iam.PolicyStatement({
  actions: ['cognito-idp:DescribeUserPoolClient'],
  resources: [gateway.userPool!.userPoolArn],
}));

const toolCalls = integTest.assertions.invokeFunction({ functionName: toolCaller.functionName });
toolCalls.node.addDependency(target, retrieveOnlyTarget, webSearchTarget);
toolCalls.expect(integ.ExpectedResult.objectLike({
  Payload: integ.Match.stringLikeRegexp('"allSucceeded":true'),
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
});

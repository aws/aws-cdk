/**
 * Integration test: Gateway connector targets backed by an Amazon Bedrock
 * managed knowledge base, and a generic connector target.
 *
 * The assertions wait for the targets to reach READY, which covers create-time
 * validation. Tool calls need a token from the gateway's Cognito client, so
 * they are verified by hand:
 *
 * Stack verification steps:
 * * Deploy with `--no-clean` and obtain a token from the gateway's Cognito client
 *   (client_credentials flow, scopes `<resource server>/read` and `<resource server>/write`)
 * * POST `tools/list` to the gateway URL: expect `managed-kb___AgenticRetrieveStream`,
 *   `managed-kb___Retrieve`, `managed-kb-retrieve___Retrieve` and `web-search___WebSearch`,
 *   and no `managed-kb-retrieve___AgenticRetrieveStream`. `managed-kb___Retrieve` takes
 *   `retrievalConfiguration.managedSearchConfiguration.numberOfResults` as an input
 * * POST `tools/call` for each tool: expect a successful (possibly empty) result,
 *   not an access denied error or "Missing required field(s)"
 */

/// !cdk-integ cdk-agentcore-gateway-knowledge-bases-target

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';

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
    retrievers: [{ knowledgeBase, description: 'Integration test documents' }],
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

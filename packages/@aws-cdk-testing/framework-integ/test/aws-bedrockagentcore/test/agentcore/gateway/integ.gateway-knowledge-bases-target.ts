/**
 * Integration test: Gateway connector target backed by an Amazon Bedrock
 * managed knowledge base.
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
    maxAgentIterations: 3,
  },
  retrieve: {
    knowledgeBase,
    numberOfResults: 5,
    searchType: agentcore.KnowledgeBaseSearchType.HYBRID,
  },
});

const integTest = new integ.IntegTest(app, 'GatewayKnowledgeBasesTarget', {
  testCases: [stack],
});

const apiCall = integTest.assertions.awsApiCall('bedrock-agentcore-control', 'getGatewayTarget', {
  gatewayIdentifier: gateway.gatewayId,
  targetId: target.targetId,
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
  name: 'managed-kb',
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

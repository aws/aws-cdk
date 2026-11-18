/**
 * Integration test for a Gateway with a domain override.
 *
 * The gateway uses the default Cognito (JWT) authorizer and advertises
 * mcp.example.com, plus one alternate domain, in its OAuth discovery URLs.
 * No proxy or DNS record is created: the override only changes the URLs
 * that the gateway returns, so the stack deploys without owning the domain.
 */
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayDomainOverrideIntegTest');
// TODO: Remove this acknowledge once the bundled CFN validation schema includes DomainOverride
cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'DomainOverride is a newly launched property not yet in the bundled schema' });

new agentcore.Gateway(stack, 'DomainOverrideGateway', {
  gatewayName: 'integ-test-domain-override-gateway',
  description: 'Integration test gateway with a domain override',
  domainOverride: {
    defaultDomain: 'mcp.example.com',
    alternateDomains: ['mcp-eu.example.com'],
  },
});

new integ.IntegTest(app, 'GatewayDomainOverrideIntegTest', {
  testCases: [stack],
});

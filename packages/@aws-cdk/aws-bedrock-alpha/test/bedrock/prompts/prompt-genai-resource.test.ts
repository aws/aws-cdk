import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';

describe('PromptGenAiResource', () => {
  let stack: Stack;
  let mockAgent: bedrock.IAgent;
  let mockAgentAlias: bedrock.IAgentAlias;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');

    // Create mock agent and alias
    mockAgent = bedrock.Agent.fromAgentAttributes(stack, 'MockAgent', {
      agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
    });

    mockAgentAlias = bedrock.AgentAlias.fromAttributes(stack, 'MockAgentAlias', {
      aliasId: 'test-alias-id',
      aliasName: 'test-alias',
      agent: mockAgent,
      agentVersion: '1',
    });
  });

  describe('agent factory method', () => {
    test('creates agent GenAI resource', () => {
      const resource = bedrock.PromptGenAiResource.agent({
        agentAlias: mockAgentAlias,
      });

      expect(resource).toBeInstanceOf(bedrock.PromptGenAiResource);
    });

    test('renders correctly to CloudFormation', () => {
      const resource = bedrock.PromptGenAiResource.agent({
        agentAlias: mockAgentAlias,
      });

      const rendered = resource._render();
      expect(rendered).toEqual({
        agent: {
          agentIdentifier: mockAgentAlias.aliasArn,
        },
      });
    });
  });

  describe('type safety', () => {
    test('agent resource is instance of PromptGenAiResource', () => {
      const resource = bedrock.PromptGenAiResource.agent({
        agentAlias: mockAgentAlias,
      });

      expect(resource).toBeInstanceOf(bedrock.PromptGenAiResource);
    });
  });

  describe('integration with agent alias', () => {
    test('uses agent alias ARN correctly', () => {
      const resource = bedrock.PromptGenAiResource.agent({
        agentAlias: mockAgentAlias,
      });

      const rendered = resource._render();
      const agentConfig = rendered.agent as any;
      expect(agentConfig.agentIdentifier).toBe(mockAgentAlias.aliasArn);
    });
  });
});

import { Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AgentCollaborator } from '../../../bedrock/agents/agent-collaborator';
import { IAgentAlias } from '../../../bedrock/agents/agent-alias';

describe('AgentCollaborator', () => {
  let stack: Stack;
  let mockAgentAlias: IAgentAlias;
  let mockGrantInvoke: jest.Mock;
  let mockGrantGet: jest.Mock;

  beforeEach(() => {
    stack = new Stack();
    const mockCombine = jest.fn().mockReturnThis();
    mockGrantInvoke = jest.fn().mockReturnValue({ combine: mockCombine });
    mockGrantGet = jest.fn().mockReturnValue({ combine: mockCombine });

    mockAgentAlias = {
      aliasId: 'test-alias-id',
      aliasArn: 'arn:aws:bedrock:us-east-1:123456789012:agent-alias/test-agent/test-alias-id',
      agent: {} as any,
      grantInvoke: mockGrantInvoke,
      grantGet: mockGrantGet,
      grant: jest.fn(),
      onCloudTrailEvent: jest.fn(),
      node: stack.node,
      env: { account: stack.account, region: stack.region },
      stack: stack,
      applyRemovalPolicy: jest.fn(),
    };
  });

  test('creates with valid properties', () => {
    // WHEN
    const collaborator = new AgentCollaborator({
      agentAlias: mockAgentAlias,
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
      relayConversationHistory: true,
    });

    // THEN
    expect(collaborator.agentAlias).toBe(mockAgentAlias);
    expect(collaborator.collaborationInstruction).toBe('Test instruction');
    expect(collaborator.collaboratorName).toBe('Test collaborator');
    expect(collaborator.relayConversationHistory).toBe(true);
  });

  test('throws error when using TSTALIASID', () => {
    // GIVEN
    const testAlias = {
      ...mockAgentAlias,
      aliasId: 'TSTALIASID',
    };

    // THEN
    expect(() => {
      new AgentCollaborator({
        agentAlias: testAlias,
        collaborationInstruction: 'Test instruction',
        collaboratorName: 'Test collaborator',
      });
    }).toThrow('Agent cannot collaborate with TSTALIASID alias of another agent');
  });

  test('renders with relayConversationHistory true', () => {
    // GIVEN
    const collaborator = new AgentCollaborator({
      agentAlias: mockAgentAlias,
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
      relayConversationHistory: true,
    });

    // WHEN
    const rendered = collaborator._render();

    // THEN
    expect(rendered).toEqual({
      agentDescriptor: {
        aliasArn: mockAgentAlias.aliasArn,
      },
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
      relayConversationHistory: 'TO_COLLABORATOR',
    });
  });

  test('renders with relayConversationHistory false', () => {
    // GIVEN
    const collaborator = new AgentCollaborator({
      agentAlias: mockAgentAlias,
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
      relayConversationHistory: false,
    });

    // WHEN
    const rendered = collaborator._render();

    // THEN
    expect(rendered).toEqual({
      agentDescriptor: {
        aliasArn: mockAgentAlias.aliasArn,
      },
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
      relayConversationHistory: 'DISABLED',
    });
  });

  test('renders with relayConversationHistory undefined', () => {
    // GIVEN
    const collaborator = new AgentCollaborator({
      agentAlias: mockAgentAlias,
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
    });

    // WHEN
    const rendered = collaborator._render();

    // THEN
    expect(rendered).toEqual({
      agentDescriptor: {
        aliasArn: mockAgentAlias.aliasArn,
      },
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
      relayConversationHistory: 'DISABLED',
    });
  });

  test('grants permissions to grantee', () => {
    // GIVEN
    const collaborator = new AgentCollaborator({
      agentAlias: mockAgentAlias,
      collaborationInstruction: 'Test instruction',
      collaboratorName: 'Test collaborator',
    });
    const grantee = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    collaborator.grant(grantee);

    // THEN
    const checkGrantInvoke = () => expect(mockGrantInvoke).toHaveBeenCalledWith(grantee);
    const checkGrantGet = () => expect(mockGrantGet).toHaveBeenCalledWith(grantee);
    checkGrantInvoke();
    checkGrantGet();
  });
});

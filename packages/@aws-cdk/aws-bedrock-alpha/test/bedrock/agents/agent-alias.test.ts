import { App, ArnFormat, Stack, assertions } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { AgentAlias } from '../../../bedrock/agents/agent-alias';
import { IAgent } from '../../../bedrock/agents/agent';

describe('AgentAlias', () => {
  let stack: Stack;
  let mockAgent: IAgent;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'TestStack');
    mockAgent = {
      agentId: 'test-agent-id',
      agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
      lastUpdated: 'test-timestamp',
      role: new iam.Role(stack, 'MockAgentRole', {
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      }),
      grantPrincipal: new iam.Role(stack, 'MockGrantPrincipal', {
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      }),
      grantInvoke: jest.fn(),
      onEvent: jest.fn(),
      metricCount: jest.fn(),
      node: stack.node,
      stack: stack,
      env: { account: stack.account, region: stack.region },
      applyRemovalPolicy: jest.fn(),
    };
  });

  test('creates with minimal properties', () => {
    // WHEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
    });

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::AgentAlias', {});
    expect(alias.aliasName).toBe('latest');
  });

  test('creates with all properties', () => {
    // WHEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
      agentAliasName: 'test-alias',
      agentVersion: '1.0.0',
      description: 'Test description',
    });

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::AgentAlias', {
      AgentAliasName: 'test-alias',
      AgentId: 'test-agent-id',
      Description: 'Test description',
      RoutingConfiguration: [
        {
          AgentVersion: '1.0.0',
        },
      ],
    });
    expect(alias.aliasName).toBe('test-alias');
  });

  test('imports using fromAttributes', () => {
    // WHEN
    const importedAlias = AgentAlias.fromAttributes(stack, 'ImportedAlias', {
      aliasId: 'test-alias-id',
      aliasName: 'test-alias',
      agent: mockAgent,
      agentVersion: '1.0.0',
    });

    // THEN
    expect(importedAlias.aliasId).toBe('test-alias-id');
    expect(importedAlias.aliasArn).toBe(
      stack.formatArn({
        service: 'bedrock',
        resource: 'agent-alias',
        resourceName: 'test-agent-id/test-alias-id',
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      }),
    );
  });

  test('grants invoke permissions', () => {
    // GIVEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
    });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    alias.grantInvoke(role);

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'bedrock:InvokeAgent',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': assertions.Match.arrayWith([
                assertions.Match.stringLikeRegexp('TestAlias[A-Z0-9]+'),
                'AgentAliasArn',
              ]),
            },
          },
        ],
      },
    });
  });

  test('grants get permissions', () => {
    // GIVEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
    });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    alias.grantGet(role);

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'bedrock:GetAgentAlias',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': assertions.Match.arrayWith([
                assertions.Match.stringLikeRegexp('TestAlias[A-Z0-9]+'),
                'AgentAliasArn',
              ]),
            },
          },
        ],
      },
    });
  });

  test('grants custom permissions', () => {
    // GIVEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
    });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    alias.grant(role, 'bedrock:CustomAction');

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'bedrock:CustomAction',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': assertions.Match.arrayWith([
                assertions.Match.stringLikeRegexp('TestAlias[A-Z0-9]+'),
                'AgentAliasArn',
              ]),
            },
          },
        ],
      },
    });
  });

  test('creates CloudTrail event rule', () => {
    // GIVEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
    });
    const fn = new lambda.Function(stack, 'TestFunction', {
      code: lambda.Code.fromInline('exports.handler = function() { }'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    // WHEN
    const rule = alias.onCloudTrailEvent('TestRule', {
      target: new targets.LambdaFunction(fn),
    });

    // THEN
    expect(rule).toBeInstanceOf(events.Rule);
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'source': ['aws.bedrock'],
        'detail-type': ['AWS API Call via CloudTrail'],
        'detail': {
          requestParameters: {
            agentAliasId: [{
              'Fn::GetAtt': assertions.Match.arrayWith([
                assertions.Match.stringLikeRegexp('TestAlias[A-Z0-9]+'),
                'AgentAliasId',
              ]),
            }],
          },
        },
      },
    });
  });

  test('creates CloudTrail event rule with default options', () => {
    // GIVEN
    const alias = new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
    });

    // WHEN
    const rule = alias.onCloudTrailEvent('TestRule');

    // THEN
    expect(rule).toBeInstanceOf(events.Rule);
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'source': ['aws.bedrock'],
        'detail-type': ['AWS API Call via CloudTrail'],
        'detail': {
          requestParameters: {
            agentAliasId: [{
              'Fn::GetAtt': assertions.Match.arrayWith([
                assertions.Match.stringLikeRegexp('TestAlias[A-Z0-9]+'),
                'AgentAliasId',
              ]),
            }],
          },
        },
      },
    });
  });

  test('handles undefined agentVersion', () => {
    // WHEN
    new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
      agentVersion: undefined,
    });

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::AgentAlias', {
      AgentId: 'test-agent-id',
      RoutingConfiguration: assertions.Match.absent(),
    });
  });

  test('handles undefined description', () => {
    // WHEN
    new AgentAlias(stack, 'TestAlias', {
      agent: mockAgent,
      description: undefined,
    });

    // THEN
    const template = assertions.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Bedrock::AgentAlias', {
      AgentId: 'test-agent-id',
      Description: assertions.Match.absent(),
    });
  });
});

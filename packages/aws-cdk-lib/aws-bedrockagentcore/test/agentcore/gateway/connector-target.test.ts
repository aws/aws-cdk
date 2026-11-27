import { Match, Template } from '../../../../assertions';
import * as bedrock from '../../../../aws-bedrock';
import * as iam from '../../../../aws-iam';
import * as kms from '../../../../aws-kms';
import * as cdk from '../../../../core';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import {
  ConnectorTargetConfiguration,
  McpConnector,
  KnowledgeBaseSearchType,
  KnowledgeBasesTargetConfiguration,
} from '../../../lib/gateway/targets/connector-target-configuration';
import { GatewayTarget } from '../../../lib/gateway/targets/target';
import { McpTargetType } from '../../../lib/gateway/targets/target-base';

const KB1_ARN = 'arn:aws:bedrock:us-east-1:123456789012:knowledge-base/KB11111111';
const KB2_ARN = 'arn:aws:bedrock:us-east-1:123456789012:knowledge-base/KB22222222';
const KEY1_ARN = 'arn:aws:kms:us-east-1:123456789012:key/11111111-1111-1111-1111-111111111111';
const KEY2_ARN = 'arn:aws:kms:us-east-1:123456789012:key/22222222-2222-2222-2222-222222222222';
const VIA_BEDROCK = { StringEquals: { 'kms:ViaService': 'bedrock.us-east-1.amazonaws.com' } };

describe('Connector gateway targets', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let kb1: bedrock.IKnowledgeBaseRef;
  let kb2: bedrock.IKnowledgeBaseRef;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
    kb1 = bedrock.CfnKnowledgeBase.fromKnowledgeBaseArn(stack, 'Kb1', KB1_ARN);
    kb2 = bedrock.CfnKnowledgeBase.fromKnowledgeBaseArn(stack, 'Kb2', KB2_ARN);
  });

  /**
   * All identity policy statements in the stack whose actions belong to the given service,
   * with single-element lists unwrapped the way IAM renders them.
   */
  function statementsFor(service: string): any[] {
    const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy');
    return Object.values(policies)
      .flatMap((policy: any) => policy.Properties.PolicyDocument.Statement)
      .filter((statement: any) => [statement.Action].flat().some((action: string) => action.startsWith(`${service}:`)));
  }

  function bedrockStatements(): any[] {
    return statementsFor('bedrock');
  }

  describe('ConnectorTargetConfiguration', () => {
    test('renders the connector source, tool configurations and enabled tools', () => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        gatewayTargetName: 'web-search',
        targetConfiguration: ConnectorTargetConfiguration.create({
          connector: McpConnector.WEB_SEARCH,
          enabledTools: ['WebSearch'],
          toolConfigurations: [{
            name: 'WebSearch',
            description: 'Search the public web',
            parameterValues: { domainFilter: { exclude: ['example.com'] } },
            parameterOverrides: [
              { path: '$.query', description: 'The search query', visible: true },
              { path: '$.maxResults', visible: false },
            ],
          }],
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'web-search',
        CredentialProviderConfigurations: [{ CredentialProviderType: 'GATEWAY_IAM_ROLE' }],
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Source: { ConnectorId: 'web-search' },
              Enabled: ['WebSearch'],
              Configurations: [{
                Name: 'WebSearch',
                Description: 'Search the public web',
                ParameterValues: { domainFilter: { exclude: ['example.com'] } },
                ParameterOverrides: [
                  { Path: '$.query', Description: 'The search query', Visible: true },
                  { Path: '$.maxResults', Visible: false },
                ],
              }],
            },
          },
        },
      });
    });

    test('omits optional properties that are not given', () => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({
          connector: McpConnector.WEB_SEARCH,
          toolConfigurations: [{ name: 'WebSearch' }],
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Source: { ConnectorId: 'web-search' },
              Enabled: Match.absent(),
              Configurations: [{
                Name: 'WebSearch',
                Description: Match.absent(),
                ParameterValues: Match.absent(),
                ParameterOverrides: Match.absent(),
              }],
            },
          },
        },
      });
    });

    test('omits ParameterOverrides for an empty list of parameter overrides', () => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({
          connector: McpConnector.WEB_SEARCH,
          toolConfigurations: [{ name: 'WebSearch', parameterOverrides: [] }],
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Configurations: [{ Name: 'WebSearch', ParameterOverrides: Match.absent() }],
            },
          },
        },
      });
    });

    test.each([
      ['no tool configurations', undefined],
      ['an empty list of tool configurations', []],
    ])('omits Configurations for %s', (_, toolConfigurations) => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({ connector: McpConnector.WEB_SEARCH, toolConfigurations }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: { Connector: { Source: { ConnectorId: 'web-search' }, Configurations: Match.absent() } },
        },
      });
    });

    test('has the CONNECTOR target type and grants the gateway role nothing', () => {
      const target = new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({ connector: McpConnector.WEB_SEARCH }),
      });

      expect(target.targetType).toBe(McpTargetType.CONNECTOR);
      expect(bedrockStatements()).toEqual([]);
    });

    test('accepts an explicit gateway IAM role credential provider', () => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({ connector: McpConnector.WEB_SEARCH }),
        credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [{ CredentialProviderType: 'GATEWAY_IAM_ROLE' }],
      });
    });

    test.each([
      ['API_KEY', () => GatewayCredentialProvider.fromApiKeyIdentityArn({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/apikeycredentialprovider/key',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:key-AbCdEf',
      })],
      ['OAUTH', () => GatewayCredentialProvider.fromOauthIdentityArn({
        providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/default/oauth2credentialprovider/oauth',
        secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:oauth-AbCdEf',
        scopes: ['read'],
      })],
    ])('fails for an %s credential provider', (type, provider) => {
      expect(() => new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({ connector: McpConnector.WEB_SEARCH }),
        credentialProviderConfigurations: [provider()],
      })).toThrow(`connector targets only support the GATEWAY_IAM_ROLE credential provider, got "${type}"`);
    });

    test('fails for an IAM role credential provider with an explicit service', () => {
      expect(() => new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({ connector: McpConnector.WEB_SEARCH }),
        credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole({ service: 'bedrock-agentcore' })],
      })).toThrow('IamCredentialProvider with explicit service/region is only supported for MCP Server and OpenAPI targets, got target type "CONNECTOR"');
    });

    test('fails for an empty connectorId', () => {
      expect(() => McpConnector.of(''))
        .toThrow('connectorId must not be empty');
    });

    test.each([
      [McpConnector.BEDROCK_KNOWLEDGE_BASES, 'bedrock-knowledge-bases'],
      [McpConnector.WEB_SEARCH, 'web-search'],
      [McpConnector.WEB_ANSWER, 'web-answer'],
      [McpConnector.STEP_FUNCTIONS, 'states'],
      [McpConnector.of('my-connector'), 'my-connector'],
    ])('renders connector %s as ConnectorId %s', (connector, connectorId) => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: ConnectorTargetConfiguration.create({ connector }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: { Mcp: { Connector: { Source: { ConnectorId: connectorId } } } },
      });
    });

    test('GatewayTarget.forConnector and addConnectorTarget render the same target as the configuration', () => {
      const options = {
        gatewayTargetName: 'web-search',
        description: 'Search the public web',
        connector: McpConnector.WEB_SEARCH,
        enabledTools: ['WebSearch'],
        toolConfigurations: [{ name: 'WebSearch', parameterValues: { domainFilter: { exclude: ['example.com'] } } }],
      };
      const added = gateway.addConnectorTarget('Added', options);
      const created = GatewayTarget.forConnector(stack, 'Created', { gateway, ...options });

      expect(added.targetType).toBe(McpTargetType.CONNECTOR);
      const targets = Template.fromStack(stack).findResources('AWS::BedrockAgentCore::GatewayTarget');
      const properties = (target: GatewayTarget) =>
        targets[stack.getLogicalId(target.node.defaultChild as cdk.CfnElement)].Properties;

      expect(properties(added)).toEqual({
        GatewayIdentifier: properties(created).GatewayIdentifier,
        Name: 'web-search',
        Description: 'Search the public web',
        CredentialProviderConfigurations: [{ CredentialProviderType: 'GATEWAY_IAM_ROLE' }],
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Source: { ConnectorId: 'web-search' },
              Enabled: ['WebSearch'],
              Configurations: [{ Name: 'WebSearch', ParameterValues: { domainFilter: { exclude: ['example.com'] } } }],
            },
          },
        },
      });
      expect(properties(created)).toEqual(properties(added));
      expect(bedrockStatements()).toEqual([]);
    });

    test.each([
      ['an empty', ''],
      ['a 65 character', 'a'.repeat(65)],
    ])('fails for %s tool name', (_, name) => {
      expect(() => ConnectorTargetConfiguration.create({
        connector: McpConnector.WEB_SEARCH,
        toolConfigurations: [{ name }],
      })).toThrow(`connector tool name must be between 1 and 64 characters long, got "${name}" (${name.length} characters)`);
    });

    test('accepts a 64 character tool name and a 2000 character description', () => {
      expect(() => ConnectorTargetConfiguration.create({
        connector: McpConnector.WEB_SEARCH,
        toolConfigurations: [{ name: 'a'.repeat(64), description: 'd'.repeat(2000) }],
      })).not.toThrow();
    });

    test('fails for a tool description longer than 2000 characters', () => {
      expect(() => ConnectorTargetConfiguration.create({
        connector: McpConnector.WEB_SEARCH,
        toolConfigurations: [{ name: 'WebSearch', description: 'd'.repeat(2001) }],
      })).toThrow('description of connector tool "WebSearch" must be at most 2000 characters long, got 2001 characters');
    });

    test.each([0, 51])('fails for %d enabled tools', (count) => {
      expect(() => ConnectorTargetConfiguration.create({
        connector: McpConnector.WEB_SEARCH,
        enabledTools: Array.from({ length: count }, (_, i) => `Tool${i}`),
      })).toThrow(`enabledTools must contain between 1 and 50 tool names, got ${count}`);
    });

    test.each([1, 50])('accepts %d enabled tools', (count) => {
      expect(() => ConnectorTargetConfiguration.create({
        connector: McpConnector.WEB_SEARCH,
        enabledTools: Array.from({ length: count }, (_, i) => `Tool${i}`),
      })).not.toThrow();
    });

    test('skips validation for unresolved values', () => {
      const param = new cdk.CfnParameter(stack, 'Param');
      const listParam = new cdk.CfnParameter(stack, 'ListParam', { type: 'CommaDelimitedList' });

      // The literal parts alone exceed the limits, so only the token checks let these through.
      expect(() => ConnectorTargetConfiguration.create({
        connector: McpConnector.of(param.valueAsString),
        enabledTools: listParam.valueAsList,
        toolConfigurations: [{
          name: `${param.valueAsString}${'a'.repeat(64)}`,
          description: `${param.valueAsString}${'d'.repeat(2000)}`,
        }],
      })).not.toThrow();
    });
  });

  describe('KnowledgeBasesTargetConfiguration', () => {
    test('renders the AgenticRetrieveStream tool with the service-managed models by default', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        gatewayTargetName: 'docs',
        description: 'Product documentation',
        agenticRetrieve: {
          retrievers: [
            { knowledgeBase: kb1, description: 'Product documentation' },
            { knowledgeBase: kb2 },
          ],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        Name: 'docs',
        Description: 'Product documentation',
        CredentialProviderConfigurations: [{ CredentialProviderType: 'GATEWAY_IAM_ROLE' }],
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Source: { ConnectorId: 'bedrock-knowledge-bases' },
              Enabled: ['AgenticRetrieveStream'],
              Configurations: [{
                Name: 'AgenticRetrieveStream',
                Description: Match.absent(),
                ParameterOverrides: Match.absent(),
                // objectEquals: no generateResponse, no maxAgentIteration and no reranking model by default
                ParameterValues: Match.objectEquals({
                  retrievers: [
                    {
                      description: 'Product documentation',
                      configuration: { knowledgeBase: { knowledgeBaseId: 'KB11111111' } },
                    },
                    { configuration: { knowledgeBase: { knowledgeBaseId: 'KB22222222' } } },
                  ],
                  // The gateway rejects tool calls when agenticRetrieveConfiguration is empty
                  agenticRetrieveConfiguration: { foundationModelType: 'MANAGED' },
                }),
              }],
            },
          },
        },
      });
    });

    test('renders the AgenticRetrieveStream options', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        agenticRetrieve: {
          retrievers: [{ knowledgeBase: kb1 }],
          maxAgentIteration: 3,
          generateResponse: false,
          description: 'Answer questions about the product',
          parameterOverrides: [{ path: '$.userContext', description: 'End-user identity', visible: true }],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Configurations: [{
                Name: 'AgenticRetrieveStream',
                Description: 'Answer questions about the product',
                ParameterOverrides: [{ Path: '$.userContext', Description: 'End-user identity', Visible: true }],
                ParameterValues: Match.objectEquals({
                  retrievers: [{ configuration: { knowledgeBase: { knowledgeBaseId: 'KB11111111' } } }],
                  agenticRetrieveConfiguration: { foundationModelType: 'MANAGED', maxAgentIteration: 3 },
                  generateResponse: false,
                }),
              }],
            },
          },
        },
      });
    });

    test('renders the result limit of a retriever as retrievalOverrides', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        agenticRetrieve: {
          retrievers: [
            { knowledgeBase: kb1, maxNumberOfResults: 8 },
            { knowledgeBase: kb2 },
          ],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Configurations: [{
                Name: 'AgenticRetrieveStream',
                ParameterValues: Match.objectEquals({
                  retrievers: [
                    { configuration: { knowledgeBase: { knowledgeBaseId: 'KB11111111', retrievalOverrides: { maxNumberOfResults: 8 } } } },
                    { configuration: { knowledgeBase: { knowledgeBaseId: 'KB22222222' } } },
                  ],
                  agenticRetrieveConfiguration: { foundationModelType: 'MANAGED' },
                }),
              }],
            },
          },
        },
      });
    });

    test('renders generateResponse as false when maxAgentIteration is 0 and generateResponse is not given', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration: 0 },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Configurations: [{
                Name: 'AgenticRetrieveStream',
                ParameterValues: Match.objectEquals({
                  retrievers: [{ configuration: { knowledgeBase: { knowledgeBaseId: 'KB11111111' } } }],
                  agenticRetrieveConfiguration: { foundationModelType: 'MANAGED', maxAgentIteration: 0 },
                  generateResponse: false,
                }),
              }],
            },
          },
        },
      });
    });

    test('renders the Retrieve tool without a retrievalConfiguration by default', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        retrieve: { knowledgeBase: kb1 },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Source: { ConnectorId: 'bedrock-knowledge-bases' },
              // Only the configured tool is enabled
              Enabled: ['Retrieve'],
              Configurations: [{
                Name: 'Retrieve',
                ParameterValues: Match.objectEquals({ knowledgeBaseId: 'KB11111111' }),
              }],
            },
          },
        },
      });
    });

    test('renders the Retrieve options', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        retrieve: {
          knowledgeBase: kb1,
          numberOfResults: 5,
          overrideSearchType: KnowledgeBaseSearchType.SEMANTIC,
          description: 'Search the product documentation',
          parameterOverrides: [{ path: '$.retrievalQuery.text', description: 'The search query' }],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Configurations: [{
                Name: 'Retrieve',
                Description: 'Search the product documentation',
                ParameterOverrides: [{ Path: '$.retrievalQuery.text', Description: 'The search query' }],
                ParameterValues: {
                  knowledgeBaseId: 'KB11111111',
                  retrievalConfiguration: {
                    managedSearchConfiguration: { numberOfResults: 5, overrideSearchType: 'SEMANTIC' },
                  },
                },
              }],
            },
          },
        },
      });
    });

    test('renders both tools in one target', () => {
      gateway.addKnowledgeBasesTarget('Target', {
        agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }] },
        retrieve: { knowledgeBase: kb2, numberOfResults: 10 },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Enabled: ['AgenticRetrieveStream', 'Retrieve'],
              Configurations: [
                Match.objectLike({ Name: 'AgenticRetrieveStream' }),
                Match.objectLike({
                  Name: 'Retrieve',
                  ParameterValues: {
                    knowledgeBaseId: 'KB22222222',
                    retrievalConfiguration: { managedSearchConfiguration: { numberOfResults: 10 } },
                  },
                }),
              ],
            },
          },
        },
      });
    });

    test('references a knowledge base defined in the same stack', () => {
      const knowledgeBase = new bedrock.CfnKnowledgeBase(stack, 'Kb', {
        name: 'kb',
        roleArn: 'arn:aws:iam::123456789012:role/kb-role',
        knowledgeBaseConfiguration: { type: 'MANAGED' },
      });

      gateway.addKnowledgeBasesTarget('Target', {
        retrieve: { knowledgeBase },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        TargetConfiguration: {
          Mcp: {
            Connector: {
              Configurations: [{ Name: 'Retrieve', ParameterValues: { knowledgeBaseId: { Ref: 'Kb' } } }],
            },
          },
        },
      });
      expect(bedrockStatements()).toEqual([{
        Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve'],
        Effect: 'Allow',
        Resource: { 'Fn::GetAtt': ['Kb', 'KnowledgeBaseArn'] },
      }]);
    });

    test('has the CONNECTOR target type', () => {
      const target = gateway.addKnowledgeBasesTarget('Target', {
        retrieve: { knowledgeBase: kb1 },
      });

      expect(target.targetType).toBe(McpTargetType.CONNECTOR);
    });

    test('GatewayTarget.forKnowledgeBases renders the same target as addKnowledgeBasesTarget', () => {
      const options = {
        gatewayTargetName: 'docs',
        agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration: 2 },
        retrieve: { knowledgeBase: kb1, numberOfResults: 5 },
      };
      const added = gateway.addKnowledgeBasesTarget('Added', options);
      const created = GatewayTarget.forKnowledgeBases(stack, 'Created', { gateway, ...options });

      const targets = Template.fromStack(stack).findResources('AWS::BedrockAgentCore::GatewayTarget');
      const targetConfiguration = (target: GatewayTarget) =>
        targets[stack.getLogicalId(target.node.defaultChild as cdk.CfnElement)].Properties.TargetConfiguration;

      expect(targetConfiguration(created)).toEqual(targetConfiguration(added));
    });

    test('can be used directly with the GatewayTarget constructor', () => {
      new GatewayTarget(stack, 'Target', {
        gateway,
        targetConfiguration: KnowledgeBasesTargetConfiguration.create({ retrieve: { knowledgeBase: kb1 } }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [{ CredentialProviderType: 'GATEWAY_IAM_ROLE' }],
        TargetConfiguration: {
          Mcp: { Connector: { Source: { ConnectorId: 'bedrock-knowledge-bases' } } },
        },
      });
    });

    describe('permissions', () => {
      test('agenticRetrieve grants retrieval on each knowledge base and AgenticRetrieveStream on all resources', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }, { knowledgeBase: kb2 }] },
        });

        expect(bedrockStatements()).toEqual([
          { Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve', 'bedrock:GetDocumentContent'], Effect: 'Allow', Resource: [KB1_ARN, KB2_ARN] },
          { Action: 'bedrock:AgenticRetrieveStream', Effect: 'Allow', Resource: '*' },
        ]);
      });

      test('retrieve grants GetKnowledgeBase and Retrieve on the knowledge base only', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1 },
        });

        expect(bedrockStatements()).toEqual([
          { Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve'], Effect: 'Allow', Resource: KB1_ARN },
        ]);
      });

      test('a knowledge base used by both tools is granted once', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }, { knowledgeBase: kb1 }] },
          retrieve: { knowledgeBase: kb1 },
        });

        expect(bedrockStatements()).toEqual([
          { Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve', 'bedrock:GetDocumentContent'], Effect: 'Allow', Resource: KB1_ARN },
          { Action: 'bedrock:AgenticRetrieveStream', Effect: 'Allow', Resource: '*' },
        ]);
      });

      test('both tools with different knowledge bases do not grant GetDocumentContent on the Retrieve knowledge base', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }] },
          retrieve: { knowledgeBase: kb2 },
        });

        expect(bedrockStatements()).toEqual([
          { Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve', 'bedrock:GetDocumentContent'], Effect: 'Allow', Resource: KB1_ARN },
          { Action: 'bedrock:AgenticRetrieveStream', Effect: 'Allow', Resource: '*' },
          { Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve'], Effect: 'Allow', Resource: KB2_ARN },
        ]);
      });

      test('grants no KMS permission when no encryption key is given', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }] },
          retrieve: { knowledgeBase: kb2 },
        });

        expect(statementsFor('kms')).toEqual([]);
      });

      test('grants decrypt on the encryption key of the Retrieve knowledge base', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1, encryptionKey: kms.Key.fromKeyArn(stack, 'Key1', KEY1_ARN) },
        });

        expect(statementsFor('kms')).toEqual([
          { Action: 'kms:Decrypt', Effect: 'Allow', Resource: KEY1_ARN, Condition: VIA_BEDROCK },
        ]);
      });

      test('grants decrypt on the encryption key of each retriever', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: {
            retrievers: [
              { knowledgeBase: kb1, encryptionKey: kms.Key.fromKeyArn(stack, 'Key1', KEY1_ARN) },
              { knowledgeBase: kb2, encryptionKey: kms.Key.fromKeyArn(stack, 'Key2', KEY2_ARN) },
            ],
          },
        });

        expect(statementsFor('kms')).toEqual([
          { Action: 'kms:Decrypt', Effect: 'Allow', Resource: KEY1_ARN, Condition: VIA_BEDROCK },
          { Action: 'kms:Decrypt', Effect: 'Allow', Resource: KEY2_ARN, Condition: VIA_BEDROCK },
        ]);
      });

      test('an encryption key shared by several knowledge bases is granted once', () => {
        const key = kms.Key.fromKeyArn(stack, 'Key1', KEY1_ARN);

        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: {
            retrievers: [
              { knowledgeBase: kb1, encryptionKey: key },
              { knowledgeBase: kb2, encryptionKey: key },
            ],
          },
          retrieve: { knowledgeBase: kb1, encryptionKey: key },
        });

        expect(statementsFor('kms')).toEqual([
          { Action: 'kms:Decrypt', Effect: 'Allow', Resource: KEY1_ARN, Condition: VIA_BEDROCK },
        ]);
      });

      test('grants decrypt on a key defined in the same stack', () => {
        const key = new kms.Key(stack, 'Key');

        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1, encryptionKey: key },
        });

        expect(statementsFor('kms')).toEqual([
          {
            Action: 'kms:Decrypt',
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': [stack.getLogicalId(key.node.defaultChild as cdk.CfnElement), 'Arn'] },
            Condition: VIA_BEDROCK,
          },
        ]);
      });

      test('grants decrypt through Amazon Bedrock on an imported key in another account', () => {
        const keyArn = 'arn:aws:kms:us-east-1:999999999999:key/11111111-1111-1111-1111-111111111111';

        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1, encryptionKey: kms.Key.fromKeyArn(stack, 'Key1', keyArn) },
        });

        expect(statementsFor('kms')).toEqual([
          { Action: 'kms:Decrypt', Effect: 'Allow', Resource: keyArn, Condition: VIA_BEDROCK },
        ]);
      });

      test('grants decrypt through Amazon Bedrock on a CfnKey', () => {
        const key = new kms.CfnKey(stack, 'Key', {
          keyPolicy: {
            Version: '2012-10-17',
            Statement: [{ Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*', Resource: '*' }],
          },
        });

        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1, encryptionKey: key },
        });

        expect(statementsFor('kms')).toEqual([
          { Action: 'kms:Decrypt', Effect: 'Allow', Resource: { 'Fn::GetAtt': [stack.getLogicalId(key), 'Arn'] }, Condition: VIA_BEDROCK },
        ]);
      });

      test('grants decrypt through Amazon Bedrock on a key defined in a stack of another account', () => {
        const keyStack = new cdk.Stack(stack.node.root as cdk.App, 'KeyStack', {
          env: { account: '999999999999', region: 'us-east-1' },
        });
        const key = new kms.Key(keyStack, 'Key');

        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1, encryptionKey: key },
        });

        expect(statementsFor('kms')).toEqual([
          // The key ARN is read from the other account's stack output
          expect.objectContaining({ Action: 'kms:Decrypt', Effect: 'Allow', Condition: VIA_BEDROCK }),
        ]);
      });

      test('the target is created after the gateway role policy', () => {
        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1 },
        });

        Template.fromStack(stack).hasResource('AWS::BedrockAgentCore::GatewayTarget', {
          DependsOn: Match.arrayWith([Match.stringLikeRegexp('^TestGatewayServiceRoleDefaultPolicy')]),
        });
      });

      test('grants an imported gateway role', () => {
        const role = new iam.Role(stack, 'ImportedGatewayRole', {
          assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
        });
        const importedGateway = Gateway.fromGatewayAttributes(stack, 'ImportedGateway', {
          gatewayArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:gateway/imported-abc123',
          gatewayId: 'imported-abc123',
          gatewayName: 'imported',
          role,
        });

        GatewayTarget.forKnowledgeBases(stack, 'Target', {
          gateway: importedGateway,
          retrieve: { knowledgeBase: kb1 },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          Roles: [{ Ref: stack.getLogicalId(role.node.defaultChild as cdk.CfnElement) }],
          PolicyDocument: {
            Statement: [
              { Action: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve'], Effect: 'Allow', Resource: KB1_ARN },
            ],
          },
        });
      });
    });

    describe('validation', () => {
      test('fails when neither tool is configured', () => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {}))
          .toThrow('at least one of agenticRetrieve and retrieve must be configured for a knowledge bases target');
      });

      test('fails for an empty list of retrievers', () => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', { agenticRetrieve: { retrievers: [] } }))
          .toThrow('agenticRetrieve.retrievers must contain at least one knowledge base');
      });

      test.each([-1, 6, 2.5])('fails for maxAgentIteration %d', (maxAgentIteration) => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration },
        })).toThrow(`agenticRetrieve.maxAgentIteration must be an integer between 0 and 5, got ${maxAgentIteration}`);
      });

      test.each([1, 2, 5])('accepts maxAgentIteration %d', (maxAgentIteration) => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration },
        })).not.toThrow();
      });

      test('accepts maxAgentIteration 0 when generateResponse is false', () => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration: 0, generateResponse: false },
        })).not.toThrow();
      });

      test('fails for maxAgentIteration 0 when generateResponse is true', () => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration: 0, generateResponse: true },
        })).toThrow('agenticRetrieve.generateResponse cannot be true when maxAgentIteration is 0');
      });

      test('accepts an unresolved maxAgentIteration', () => {
        const param = new cdk.CfnParameter(stack, 'Iterations', { type: 'Number' });

        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }], maxAgentIteration: param.valueAsNumber },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
          TargetConfiguration: {
            Mcp: {
              Connector: {
                Configurations: [{
                  ParameterValues: {
                    agenticRetrieveConfiguration: { foundationModelType: 'MANAGED', maxAgentIteration: { Ref: 'Iterations' } },
                  },
                }],
              },
            },
          },
        });
      });

      test.each([0, 1.5, -1])('fails for maxNumberOfResults %d on a retriever', (maxNumberOfResults) => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1 }, { knowledgeBase: kb2, maxNumberOfResults }] },
        })).toThrow(`agenticRetrieve.retrievers[1].maxNumberOfResults must be an integer of at least 1, got ${maxNumberOfResults}`);
      });

      test.each([1, 1000])('accepts maxNumberOfResults %d on a retriever', (maxNumberOfResults) => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1, maxNumberOfResults }] },
        })).not.toThrow();
      });

      test('accepts an unresolved maxNumberOfResults on a retriever', () => {
        const param = new cdk.CfnParameter(stack, 'MaxResults', { type: 'Number' });

        gateway.addKnowledgeBasesTarget('Target', {
          agenticRetrieve: { retrievers: [{ knowledgeBase: kb1, maxNumberOfResults: param.valueAsNumber }] },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
          TargetConfiguration: {
            Mcp: {
              Connector: {
                Configurations: [{
                  ParameterValues: {
                    retrievers: [{
                      configuration: {
                        knowledgeBase: { knowledgeBaseId: 'KB11111111', retrievalOverrides: { maxNumberOfResults: { Ref: 'MaxResults' } } },
                      },
                    }],
                  },
                }],
              },
            },
          },
        });
      });

      test.each([0, 101, 1.5, -1])('fails for numberOfResults %d', (numberOfResults) => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', { retrieve: { knowledgeBase: kb1, numberOfResults } }))
          .toThrow(`retrieve.numberOfResults must be an integer between 1 and 100, got ${numberOfResults}`);
      });

      test.each([1, 100])('accepts numberOfResults %d', (numberOfResults) => {
        expect(() => gateway.addKnowledgeBasesTarget('Target', { retrieve: { knowledgeBase: kb1, numberOfResults } }))
          .not.toThrow();
      });

      test('accepts an unresolved numberOfResults', () => {
        const param = new cdk.CfnParameter(stack, 'Results', { type: 'Number' });

        gateway.addKnowledgeBasesTarget('Target', {
          retrieve: { knowledgeBase: kb1, numberOfResults: param.valueAsNumber },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
          TargetConfiguration: {
            Mcp: {
              Connector: {
                Configurations: [{
                  ParameterValues: {
                    retrievalConfiguration: { managedSearchConfiguration: { numberOfResults: { Ref: 'Results' } } },
                  },
                }],
              },
            },
          },
        });
      });
    });
  });
});

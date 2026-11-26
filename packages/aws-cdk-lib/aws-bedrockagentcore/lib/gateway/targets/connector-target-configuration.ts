import type { Construct } from 'constructs';
import { McpTargetType } from './target-base';
import type { TargetConfigurationConfig } from './target-configuration';
import { McpTargetConfiguration } from './target-configuration';
import * as iam from '../../../../aws-iam';
import { KeyGrants } from '../../../../aws-kms';
import { Stack, Token } from '../../../../core';
import { UnscopedValidationError } from '../../../../core/lib/errors';
import { lit } from '../../../../core/lib/helpers-internal';
import type { IKnowledgeBaseRef } from '../../../../interfaces/generated/aws-bedrock-interfaces.generated';
import type { IKeyRef } from '../../../../interfaces/generated/aws-kms-interfaces.generated';
import type { IGateway } from '../gateway-base';

/******************************************************************************
 *                     Connector Target Configuration
 *****************************************************************************/

/**
 * A connector that an MCP gateway target can use
 *
 * Connectors are pre-built integrations with AWS services and third-party tools.
 */
export class McpConnector {
  /** Amazon Bedrock Managed Knowledge Bases */
  public static readonly BEDROCK_KNOWLEDGE_BASES = new McpConnector('bedrock-knowledge-bases');
  /** Web Search Tool */
  public static readonly WEB_SEARCH = new McpConnector('web-search');
  /** Web Answer */
  public static readonly WEB_ANSWER = new McpConnector('web-answer');
  /** AWS Step Functions */
  public static readonly STEP_FUNCTIONS = new McpConnector('states');

  /**
   * Use a connector that is not yet defined in this class.
   * @param connectorId The identifier of the connector
   */
  public static of(connectorId: string): McpConnector {
    if (!Token.isUnresolved(connectorId) && connectorId.length === 0) {
      throw new UnscopedValidationError(lit`ConnectorIdInvalid`, 'connectorId must not be empty');
    }
    return new McpConnector(connectorId);
  }

  /** The identifier of the connector. */
  public readonly connectorId: string;

  private constructor(connectorId: string) {
    this.connectorId = connectorId;
  }

  /** Returns the identifier of the connector. */
  public toString(): string {
    return this.connectorId;
  }
}

/**
 * Controls whether the agent can see and set a parameter of a connector tool.
 */
export interface ConnectorParameterOverride {
  /**
   * The path identifying the parameter in the tool's request, for example
   * `$.retrievalConfiguration.managedSearchConfiguration.numberOfResults`.
   */
  readonly path: string;

  /**
   * An agent-facing description override for this parameter.
   *
   * @default - the description provided by the connector
   */
  readonly description?: string;

  /**
   * Whether this parameter is visible to the agent.
   *
   * A hidden parameter still receives the value configured in `parameterValues`.
   *
   * @default - the service default for the parameter
   */
  readonly visible?: boolean;
}

/**
 * Configuration for a single tool within a connector.
 */
export interface ConnectorToolConfiguration {
  /**
   * The tool or operation name, for example `Retrieve` or `WebSearch`.
   *
   * Can be up to 64 characters long.
   */
  readonly name: string;

  /**
   * An agent-facing description override for this tool.
   *
   * Can be up to 2000 characters long.
   *
   * @default - the description provided by the connector
   */
  readonly description?: string;

  /**
   * Parameters to set as fixed or default values when provisioning this tool.
   *
   * The accepted keys depend on the connector and the tool.
   *
   * @default - no parameter values
   */
  readonly parameterValues?: { [key: string]: any };

  /**
   * Parameters to expose to the agent at runtime, with optional description overrides.
   *
   * @default - the service defaults for the tool
   */
  readonly parameterOverrides?: ConnectorParameterOverride[];
}

/**
 * Properties for creating a connector target configuration
 */
export interface ConnectorTargetConfigurationProps {
  /**
   * The connector to use
   */
  readonly connector: McpConnector;

  /**
   * Per-tool configurations for the connector.
   *
   * @default - no per-tool configuration
   */
  readonly toolConfigurations?: ConnectorToolConfiguration[];

  /**
   * The names of the tools to enable from this connector.
   *
   * Must contain between 1 and 50 names.
   *
   * @default - all tools provided by the connector are enabled
   */
  readonly enabledTools?: string[];
}

/**
 * Configuration for connector-based MCP targets
 *
 * Connectors provide pre-built integrations with AWS services and third-party tools.
 * This configuration works with any connector, but does not grant the gateway role any
 * permissions: grant the role what the connector needs yourself. For Amazon Bedrock Managed
 * Knowledge Bases, prefer `KnowledgeBasesTargetConfiguration`, which also sets up permissions.
 *
 * Connector targets only support the gateway IAM role credential provider.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-api-target-config.html
 */
export class ConnectorTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create a connector target configuration
   *
   * @param props The configuration properties
   * @returns A new ConnectorTargetConfiguration instance
   */
  public static create(props: ConnectorTargetConfigurationProps): ConnectorTargetConfiguration {
    return new ConnectorTargetConfiguration(props);
  }

  public readonly targetType = McpTargetType.CONNECTOR;

  /**
   * The connector this configuration uses
   */
  public readonly connector: McpConnector;

  /**
   * Per-tool configurations for the connector
   */
  public readonly toolConfigurations?: ConnectorToolConfiguration[];

  /**
   * The names of the tools enabled from this connector
   */
  public readonly enabledTools?: string[];

  constructor(props: ConnectorTargetConfigurationProps) {
    super();
    this.connector = props.connector;
    this.toolConfigurations = props.toolConfigurations;
    this.enabledTools = props.enabledTools;

    this.validateConfiguration();
  }

  /**
   * Binds this configuration to a construct scope
   * No permissions are granted: the required permissions depend on the connector
   *
   * @param _scope The construct scope
   * @param _gateway The gateway that will use this target
   */
  public bind(_scope: Construct, _gateway: IGateway): TargetConfigurationConfig {
    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    const configurations = this.toolConfigurations?.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameterValues: tool.parameterValues,
      parameterOverrides: tool.parameterOverrides && tool.parameterOverrides.length > 0
        ? tool.parameterOverrides.map(override => ({
          path: override.path,
          description: override.description,
          visible: override.visible,
        }))
        : undefined,
    }));

    return {
      connector: {
        source: { connectorId: this.connector.connectorId },
        configurations: configurations && configurations.length > 0 ? configurations : undefined,
        enabled: this.enabledTools,
      },
    };
  }

  private validateConfiguration(): void {
    for (const tool of this.toolConfigurations ?? []) {
      if (!Token.isUnresolved(tool.name) && (tool.name.length < 1 || tool.name.length > 64)) {
        throw new UnscopedValidationError(
          lit`ConnectorToolNameInvalid`,
          `connector tool name must be between 1 and 64 characters long, got ${JSON.stringify(tool.name)} (${tool.name.length} characters)`,
        );
      }
      if (tool.description !== undefined && !Token.isUnresolved(tool.description) && tool.description.length > 2000) {
        throw new UnscopedValidationError(
          lit`ConnectorToolDescriptionInvalid`,
          `description of connector tool ${JSON.stringify(tool.name)} must be at most 2000 characters long, got ${tool.description.length} characters`,
        );
      }
    }

    if (this.enabledTools !== undefined && !Token.isUnresolved(this.enabledTools)
      && (this.enabledTools.length < 1 || this.enabledTools.length > 50)) {
      throw new UnscopedValidationError(
        lit`ConnectorEnabledToolsInvalid`,
        `enabledTools must contain between 1 and 50 tool names, got ${this.enabledTools.length}; omit enabledTools to enable all tools of the connector`,
      );
    }
  }
}

/******************************************************************************
 *                  Knowledge Bases Target Configuration
 *****************************************************************************/

/**
 * The search type used by the `Retrieve` tool of the knowledge bases connector
 */
export enum KnowledgeBaseSearchType {
  /** Combines keyword and vector search */
  HYBRID = 'HYBRID',
  /** Uses vector search only */
  SEMANTIC = 'SEMANTIC',
}

/**
 * A managed knowledge base that agentic retrieval can query
 */
export interface KnowledgeBaseRetriever {
  /**
   * The managed knowledge base to query
   */
  readonly knowledgeBase: IKnowledgeBaseRef;

  /**
   * A description of what the knowledge base contains.
   *
   * Agentic retrieval uses it to decide which knowledge base to query.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The maximum number of results to return from this knowledge base. Must be an integer of at least 1.
   *
   * @default - the service default
   */
  readonly maxNumberOfResults?: number;

  /**
   * The customer managed KMS key that encrypts the knowledge base.
   *
   * The gateway role is granted permission to decrypt with this key through Amazon Bedrock, which
   * requires it from the caller when it reads a knowledge base encrypted with a customer managed key.
   *
   * @default - the knowledge base is not encrypted with a customer managed key, no KMS permission is granted
   */
  readonly encryptionKey?: IKeyRef;
}

/**
 * Options for the `AgenticRetrieveStream` tool of the knowledge bases connector
 *
 * Agentic retrieval plans a retrieval strategy, runs multiple retrieval steps across the
 * knowledge bases, and returns the supporting results with a synthesized, citation-backed answer.
 *
 * It runs with the service-managed foundation model, and the reranking model follows the service
 * default for each knowledge base. To attach a guardrail, filter the results of a retriever by
 * metadata, or use your own foundation or reranking model, add the fields with a property override
 * on the target's `CfnGatewayTarget`. The target
 * keeps the permissions this configuration grants, and you grant what the added fields need.
 */
export interface KnowledgeBaseAgenticRetrieveOptions {
  /**
   * The managed knowledge bases to query. At least one is required.
   */
  readonly retrievers: KnowledgeBaseRetriever[];

  /**
   * The maximum number of planning and retrieval iterations. Must be between 0 and 5.
   *
   * Values from 2 to 5 run agentic retrieval. `1` runs a single retrieval followed by an
   * answer, and `0` runs a single retrieval without an answer, so `generateResponse`
   * cannot be `true` with it.
   *
   * @default - the service default
   */
  readonly maxAgentIteration?: number;

  /**
   * Whether to return a synthesized answer with citations in addition to the retrieval results.
   *
   * @default - true, or false when `maxAgentIteration` is 0
   */
  readonly generateResponse?: boolean;

  /**
   * An agent-facing description override for this tool.
   *
   * Can be up to 2000 characters long.
   *
   * @default - the description provided by the connector
   */
  readonly description?: string;

  /**
   * Parameters to expose to the agent at runtime, with optional description overrides.
   *
   * @default - the agent can only set the conversation messages
   */
  readonly parameterOverrides?: ConnectorParameterOverride[];
}

/**
 * Options for the `Retrieve` tool of the knowledge bases connector
 *
 * `Retrieve` performs a single search and returns the most relevant passages.
 */
export interface KnowledgeBaseRetrieveOptions {
  /**
   * The managed knowledge base to query
   */
  readonly knowledgeBase: IKnowledgeBaseRef;

  /**
   * The customer managed KMS key that encrypts the knowledge base.
   *
   * The gateway role is granted permission to decrypt with this key through Amazon Bedrock, which
   * requires it from the caller when it reads a knowledge base encrypted with a customer managed key.
   *
   * @default - the knowledge base is not encrypted with a customer managed key, no KMS permission is granted
   */
  readonly encryptionKey?: IKeyRef;

  /**
   * The number of source chunks to retrieve. Must be between 1 and 100.
   *
   * @default - the service default
   */
  readonly numberOfResults?: number;

  /**
   * The search type to use instead of the one the knowledge base selects.
   *
   * @default - the knowledge base selects the search type
   */
  readonly overrideSearchType?: KnowledgeBaseSearchType;

  /**
   * An agent-facing description override for this tool.
   *
   * Can be up to 2000 characters long.
   *
   * @default - the description provided by the connector
   */
  readonly description?: string;

  /**
   * Parameters to expose to the agent at runtime, with optional description overrides.
   *
   * @default - the agent can only set the query text
   */
  readonly parameterOverrides?: ConnectorParameterOverride[];
}

/**
 * Properties for creating a knowledge bases target configuration
 *
 * At least one of `agenticRetrieve` and `retrieve` is required.
 */
export interface KnowledgeBasesTargetConfigurationProps {
  /**
   * Configures the `AgenticRetrieveStream` tool, which plans and runs multiple retrieval
   * steps across the knowledge bases and returns a synthesized answer.
   *
   * @default - the tool is not configured, and the target does not expose it
   */
  readonly agenticRetrieve?: KnowledgeBaseAgenticRetrieveOptions;

  /**
   * Configures the `Retrieve` tool, which performs a single search on a knowledge base.
   *
   * @default - the tool is not configured, and the target does not expose it
   */
  readonly retrieve?: KnowledgeBaseRetrieveOptions;
}

/**
 * Configuration for MCP targets backed by Amazon Bedrock Managed Knowledge Bases
 *
 * This configuration uses the `bedrock-knowledge-bases` connector to expose managed knowledge
 * bases as MCP tools, and grants the gateway role the permissions the configured tools need.
 * The connector only supports managed knowledge bases.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-managed-kb.html
 */
export class KnowledgeBasesTargetConfiguration extends McpTargetConfiguration {
  /**
   * Create a knowledge bases target configuration
   *
   * @param props The configuration properties
   * @returns A new KnowledgeBasesTargetConfiguration instance
   */
  public static create(props: KnowledgeBasesTargetConfigurationProps): KnowledgeBasesTargetConfiguration {
    return new KnowledgeBasesTargetConfiguration(props);
  }

  public readonly targetType = McpTargetType.CONNECTOR;

  /**
   * The configuration of the `AgenticRetrieveStream` tool
   */
  public readonly agenticRetrieve?: KnowledgeBaseAgenticRetrieveOptions;

  /**
   * The configuration of the `Retrieve` tool
   */
  public readonly retrieve?: KnowledgeBaseRetrieveOptions;

  private readonly connectorConfiguration: ConnectorTargetConfiguration;

  constructor(props: KnowledgeBasesTargetConfigurationProps) {
    super();
    this.agenticRetrieve = props.agenticRetrieve;
    this.retrieve = props.retrieve;

    this.validateConfiguration();

    const toolConfigurations: ConnectorToolConfiguration[] = [];
    if (this.agenticRetrieve) {
      toolConfigurations.push(this.renderAgenticRetrieve(this.agenticRetrieve));
    }
    if (this.retrieve) {
      toolConfigurations.push(this.renderRetrieve(this.retrieve));
    }
    this.connectorConfiguration = ConnectorTargetConfiguration.create({
      connector: McpConnector.BEDROCK_KNOWLEDGE_BASES,
      toolConfigurations,
      // Only the configured tools are usable, so only they are enabled
      enabledTools: toolConfigurations.map(tool => tool.name),
    });
  }

  /**
   * Binds this configuration to a construct scope
   * Grants the gateway role the permissions the configured tools need
   *
   * @param scope The construct scope
   * @param gateway The gateway that will use this target
   */
  public bind(scope: Construct, gateway: IGateway): TargetConfigurationConfig {
    const grants: iam.Grant[] = [];
    const retrieveArn = this.retrieve?.knowledgeBase.knowledgeBaseRef.knowledgeBaseArn;
    const retrieverArns = new Set(this.agenticRetrieve?.retrievers.map(r => r.knowledgeBase.knowledgeBaseRef.knowledgeBaseArn));

    if (retrieverArns.size > 0) {
      // Agentic retrieval searches each knowledge base and expands passages to full documents with
      // the gateway role, on top of the GetKnowledgeBase check the gateway runs when the target is created.
      // See https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-agentic-retrieve.html
      grants.push(iam.Grant.addToPrincipal({
        grantee: gateway.role,
        actions: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve', 'bedrock:GetDocumentContent'],
        resourceArns: Array.from(retrieverArns),
      }));
      // AgenticRetrieveStream does not support resource-level permissions
      grants.push(iam.Grant.addToPrincipal({
        grantee: gateway.role,
        actions: ['bedrock:AgenticRetrieveStream'],
        resourceArns: ['*'],
      }));
    }

    if (retrieveArn !== undefined && !retrieverArns.has(retrieveArn)) {
      // See https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-api-target-config.html
      grants.push(iam.Grant.addToPrincipal({
        grantee: gateway.role,
        actions: ['bedrock:GetKnowledgeBase', 'bedrock:Retrieve'],
        resourceArns: [retrieveArn],
      }));
    }

    // Amazon Bedrock decrypts customer-managed-key knowledge bases with the caller's permissions
    const encryptionKeys = new Map<string, IKeyRef>();
    for (const key of [this.retrieve?.encryptionKey, ...(this.agenticRetrieve?.retrievers.map(r => r.encryptionKey) ?? [])]) {
      if (key !== undefined) {
        encryptionKeys.set(key.keyRef.keyArn, key);
      }
    }
    // The gateway role only needs to decrypt through Amazon Bedrock
    const viaBedrock = {
      StringEquals: { 'kms:ViaService': `bedrock.${Stack.of(scope).region}.amazonaws.com` },
    };
    for (const key of encryptionKeys.values()) {
      const grant = KeyGrants.fromKey(key).decrypt(gateway.role);
      for (const statement of [...grant.principalStatements, ...grant.resourceStatements]) {
        statement.addConditions(viaBedrock);
      }
      grants.push(grant);
    }

    // The gateway validates the knowledge bases as soon as the target is created
    for (const grant of grants) {
      grant.applyBefore(scope);
    }

    return { bound: true };
  }

  /**
   * Renders the MCP-specific configuration
   */
  protected renderMcpConfiguration(): any {
    return this.connectorConfiguration._render().mcp;
  }

  private renderAgenticRetrieve(options: KnowledgeBaseAgenticRetrieveOptions): ConnectorToolConfiguration {
    // The gateway rejects tool calls when this object is empty, so the service-managed foundation
    // model, which is the default, is always spelled out. The reranking model is left to the
    // service, whose default depends on the embedding model of the knowledge base.
    const agenticRetrieveConfiguration: { [key: string]: any } = {
      foundationModelType: 'MANAGED',
    };
    if (options.maxAgentIteration !== undefined) {
      agenticRetrieveConfiguration.maxAgentIteration = options.maxAgentIteration;
    }

    const parameterValues: { [key: string]: any } = {
      retrievers: options.retrievers.map(retriever => {
        const rendered: { [key: string]: any } = {};
        if (retriever.description !== undefined) {
          rendered.description = retriever.description;
        }
        const knowledgeBase: { [key: string]: any } = {
          knowledgeBaseId: retriever.knowledgeBase.knowledgeBaseRef.knowledgeBaseId,
        };
        if (retriever.maxNumberOfResults !== undefined) {
          knowledgeBase.retrievalOverrides = { maxNumberOfResults: retriever.maxNumberOfResults };
        }
        rendered.configuration = { knowledgeBase };
        return rendered;
      }),
      agenticRetrieveConfiguration,
    };
    // Without an agent iteration no answer is generated, and the service rejects the default of true
    const generateResponse = options.generateResponse ?? (options.maxAgentIteration === 0 ? false : undefined);
    if (generateResponse !== undefined) {
      parameterValues.generateResponse = generateResponse;
    }

    return {
      name: 'AgenticRetrieveStream',
      description: options.description,
      parameterValues,
      parameterOverrides: options.parameterOverrides,
    };
  }

  private renderRetrieve(options: KnowledgeBaseRetrieveOptions): ConnectorToolConfiguration {
    const managedSearchConfiguration: { [key: string]: any } = {};
    if (options.numberOfResults !== undefined) {
      managedSearchConfiguration.numberOfResults = options.numberOfResults;
    }
    if (options.overrideSearchType !== undefined) {
      managedSearchConfiguration.overrideSearchType = options.overrideSearchType;
    }

    const parameterValues: { [key: string]: any } = {
      knowledgeBaseId: options.knowledgeBase.knowledgeBaseRef.knowledgeBaseId,
    };
    if (Object.keys(managedSearchConfiguration).length > 0) {
      parameterValues.retrievalConfiguration = { managedSearchConfiguration };
    }

    return {
      name: 'Retrieve',
      description: options.description,
      parameterValues,
      parameterOverrides: options.parameterOverrides,
    };
  }

  private validateConfiguration(): void {
    if (this.agenticRetrieve === undefined && this.retrieve === undefined) {
      throw new UnscopedValidationError(
        lit`KnowledgeBasesToolRequired`,
        'at least one of agenticRetrieve and retrieve must be configured for a knowledge bases target',
      );
    }

    if (this.agenticRetrieve !== undefined && this.agenticRetrieve.retrievers.length === 0) {
      throw new UnscopedValidationError(
        lit`KnowledgeBasesRetrieversRequired`,
        'agenticRetrieve.retrievers must contain at least one knowledge base',
      );
    }

    this.agenticRetrieve?.retrievers.forEach((retriever, index) => {
      const maxNumberOfResults = retriever.maxNumberOfResults;
      if (maxNumberOfResults !== undefined && !Token.isUnresolved(maxNumberOfResults)
        && (!Number.isInteger(maxNumberOfResults) || maxNumberOfResults < 1)) {
        throw new UnscopedValidationError(
          lit`KnowledgeBasesMaxNumberOfResultsInvalid`,
          `agenticRetrieve.retrievers[${index}].maxNumberOfResults must be an integer of at least 1, got ${JSON.stringify(maxNumberOfResults)}`,
        );
      }
    });

    const maxAgentIteration = this.agenticRetrieve?.maxAgentIteration;
    if (maxAgentIteration !== undefined && !Token.isUnresolved(maxAgentIteration)
      && (!Number.isInteger(maxAgentIteration) || maxAgentIteration < 0 || maxAgentIteration > 5)) {
      throw new UnscopedValidationError(
        lit`KnowledgeBasesMaxAgentIterationInvalid`,
        `agenticRetrieve.maxAgentIteration must be an integer between 0 and 5, got ${JSON.stringify(maxAgentIteration)}`,
      );
    }
    if (maxAgentIteration === 0 && this.agenticRetrieve?.generateResponse === true) {
      throw new UnscopedValidationError(
        lit`KnowledgeBasesGenerateResponseWithoutIterations`,
        'agenticRetrieve.generateResponse cannot be true when maxAgentIteration is 0, because no answer is generated without an agent iteration; set generateResponse to false or raise maxAgentIteration',
      );
    }

    const numberOfResults = this.retrieve?.numberOfResults;
    if (numberOfResults !== undefined && !Token.isUnresolved(numberOfResults)
      && (!Number.isInteger(numberOfResults) || numberOfResults < 1 || numberOfResults > 100)) {
      throw new UnscopedValidationError(
        lit`KnowledgeBasesNumberOfResultsInvalid`,
        `retrieve.numberOfResults must be an integer between 1 and 100, got ${JSON.stringify(numberOfResults)}`,
      );
    }
  }
}

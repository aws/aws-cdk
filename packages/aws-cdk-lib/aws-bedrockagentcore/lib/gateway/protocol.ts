import type { CfnGateway } from '../../../aws-bedrockagentcore';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * The type of protocols
 * @internal
 */
export enum GatewayProtocolType {
  /**
   * MCP (Model Context Protocol) protocol type.
   */
  MCP = 'MCP',
}

/******************************************************************************
 *                                Protocol Configuration
 *****************************************************************************/

/**
 * Abstract interface for gateway protocol configuration
 */
export interface IGatewayProtocolConfig {
  /**
   * The protocol type
   */
  readonly protocolType: string;

  /**
   * Returns internal info as the CFN protocol configuration object
   * @internal
   */
  _render(): any;
}

/**
 * Factory class for instantiating Gateway Protocols
 */
export abstract class GatewayProtocol {
  /**
   * Create an MCP protocol configuration
   * @param props - Optional MCP configuration properties
   * @returns IGatewayProtocolConfig configured for MCP
   */
  public static mcp(props?: McpConfiguration): IGatewayProtocolConfig {
    return new McpProtocolConfiguration(props);
  }
}

/******************************************************************************
 *                          MCP Protocol Configuration
 *****************************************************************************/
/**
 * MCP protocol versions.
 * The Model Context Protocol uses string-based version identifiers following the format YYYY-MM-DD,
 * to indicate the last date backwards incompatible changes were made.
 * Versions are available at https://github.com/modelcontextprotocol/modelcontextprotocol/releases
 */
export class MCPProtocolVersion {
  /**
   * The latest version of the MCP protocol.
   */
  public static readonly MCP_2025_06_18 = new MCPProtocolVersion('2025-06-18');
  /** MCP version 2025-03-26 */
  public static readonly MCP_2025_03_26 = new MCPProtocolVersion('2025-03-26');

  /**
   * Use a custom MCP protocol version not yet defined in this class.
   * @param value The version string (YYYY-MM-DD format)
   */
  public static of(value: string): MCPProtocolVersion {
    return new MCPProtocolVersion(value);
  }

  /** The version string value. */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /** Returns the string value. */
  public toString(): string {
    return this.value;
  }
}

/**
 * Search types supported by MCP gateway
 */
export class McpGatewaySearchType {
  /**
   * Semantic search type.
   * When semantic search is enabled, your gateway can search the tools via
   * the gateway SDK based off of a natural language phrase.
   */
  public static readonly SEMANTIC = new McpGatewaySearchType('SEMANTIC');

  /**
   * Use a custom search type not yet defined in this class.
   * @param value The search type string value
   */
  public static of(value: string): McpGatewaySearchType {
    return new McpGatewaySearchType(value);
  }

  /** The search type string value. */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /** Returns the string value. */
  public toString(): string {
    return this.value;
  }
}

/**
 * MCP protocol configuration
 * The configuration for the Model Context Protocol (MCP).
 * This protocol enables communication between Amazon Bedrock Agent and external tools.
 */
export interface McpConfiguration {
  /**
   * The instructions for using the Model Context Protocol gateway.
   * These instructions provide guidance on how to interact with the gateway.
   *
   * @default - No instructions provided
   */
  readonly instructions?: string;

  /**
   * The search type for the Model Context Protocol gateway.
   * This field specifies how the gateway handles search operations.
   *
   * @default - No search type specified
   */
  readonly searchType?: McpGatewaySearchType;

  /**
   * The supported versions of the Model Context Protocol.
   * This field specifies which versions of the protocol the gateway can use.
   *
   * @default - No specific versions specified
   */
  readonly supportedVersions?: MCPProtocolVersion[];
}

/**
 * MCP (Model Context Protocol) configuration implementation
 */
export class McpProtocolConfiguration implements IGatewayProtocolConfig {
  public readonly protocolType: string;
  /**
   * The supported MCP protocol versions
   */
  public readonly supportedVersions?: MCPProtocolVersion[];
  /**
   * The search type for the MCP gateway
   */
  public readonly searchType?: string;
  /**
   * Instructions for using the MCP gateway
   */
  public readonly instructions?: string;

  constructor(props?: McpConfiguration) {
    this.searchType = props?.searchType?.value;
    this.supportedVersions = props?.supportedVersions;
    this.instructions = props?.instructions;
    this.protocolType = GatewayProtocolType.MCP;
  }

  /**
   * @internal
   */
  public _render(): CfnGateway.GatewayProtocolConfigurationProperty {
    const mcpConfig: CfnGateway.MCPGatewayConfigurationProperty = {
      ...(this.instructions && { instructions: this.instructions }),
      ...(this.searchType && { searchType: this.searchType }),
      ...(this.supportedVersions && { supportedVersions: this.supportedVersions.map(v => v.value) }),
    };
    return { mcp: mcpConfig };
  }
}

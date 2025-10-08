/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { CfnGateway } from 'aws-cdk-lib/aws-bedrockagentcore';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * The type of protocols
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
export interface IGatewayProtocol {
  /**
   * The protocol type
   */
  readonly protocolType: GatewayProtocolType;

  /**
   * Returns internal info as the CFN protocol configuration object
   * @internal
   */
  _render(): CfnGateway.GatewayProtocolConfigurationProperty | undefined;
}

/**
 * Factory class for instantiating Gateway Protocols
 */
export abstract class GatewayProtocol {
  public static mcp(props?: McpConfiguration): IGatewayProtocol {
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
export enum MCPProtocolVersion {
  /**
   * The latest version of the MCP protocol.
   */
  MCP_2025_06_18 = '2025-06-18',
  MCP_2024_11_05 = '2024-11-05',
  MCP_2025_03_26 = '2025-03-26',
  MCP_2024_10_07 = '2024-10-07',
}

/**
 * Search types supported by MCP gateway
 */
export enum McpGatewaySearchType {
  /**
   * Semantic search type.
   * When semantic search is enabled, your gateway can search the tools via
   * the gateway SDK based off of a natural language phrase.
   */
  SEMANTIC = 'SEMANTIC',
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
export class McpProtocolConfiguration implements IGatewayProtocol {
  public readonly protocolType: GatewayProtocolType = GatewayProtocolType.MCP;
  public readonly supportedVersions?: MCPProtocolVersion[];
  public readonly searchType?: string;
  public readonly instructions?: string;

  public readonly configuration: any;

  constructor(props?: McpConfiguration) {
    this.searchType = props?.searchType;
    this.supportedVersions = props?.supportedVersions;
    this.instructions = props?.instructions;
  }

  /**
   * @internal
   */
  _render(): CfnGateway.GatewayProtocolConfigurationProperty | undefined {
    if (!this.searchType && !this.supportedVersions && !this.instructions) {
      return undefined;
    }
    return {
      mcp: {
        instructions: this.instructions,
        searchType: this.searchType,
        supportedVersions: this.supportedVersions,
      },
    };
  }
}

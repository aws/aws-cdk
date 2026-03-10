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

import type { CloudWatchLogsDataSourceConfig } from './types';
import type { IBedrockAgentRuntime } from '../runtime/runtime-base';
import type { IRuntimeEndpoint } from '../runtime/runtime-endpoint-base';

/**
 * Configuration for the data source used in online evaluation.
 *
 * Use the static factory methods to create data source configurations:
 * - `DataSourceConfig.fromAgentRuntimeEndpoint()` for AgentCore Runtime (recommended)
 * - `DataSourceConfig.fromCloudWatchLogs()` for external agents or custom log groups
 *
 * @example
 * // AgentCore Runtime with default endpoint
 * const runtime = new agentcore.Runtime(this, 'Runtime', { ... });
 * const dataSource = agentcore.DataSourceConfig.fromAgentRuntimeEndpoint(runtime);
 *
 * @example
 * // AgentCore Runtime with specific endpoint
 * const runtime = new agentcore.Runtime(this, 'Runtime', { ... });
 * const endpoint = runtime.addEndpoint('PROD');
 * const dataSource = agentcore.DataSourceConfig.fromAgentRuntimeEndpoint(runtime, endpoint);
 *
 * @example
 * // CloudWatch Logs data source (for external agents)
 * const dataSource = agentcore.DataSourceConfig.fromCloudWatchLogs({
 *   logGroupNames: ['/aws/my-external-agent/logs'],
 *   serviceNames: ['my-external-agent'],
 * });
 */
export class DataSourceConfig {
  /**
   * Creates a CloudWatch Logs data source configuration.
   *
   * Use this when your agent traces are stored in CloudWatch Logs,
   * such as for external agents or when you need to specify log groups directly.
   *
   * @param config - The CloudWatch Logs data source configuration
   * @returns A DataSourceConfig instance
   *
   * @example
   * const dataSource = agentcore.DataSourceConfig.fromCloudWatchLogs({
   *   logGroupNames: ['/aws/bedrock-agentcore/runtimes/myRuntime-abc123-DEFAULT'],
   *   serviceNames: ['myRuntime.DEFAULT'],
   * });
   */
  public static fromCloudWatchLogs(config: CloudWatchLogsDataSourceConfig): DataSourceConfig {
    return new DataSourceConfig({
      logGroupNames: config.logGroupNames,
      serviceNames: config.serviceNames,
    });
  }

  /**
   * Creates a data source configuration from an AgentCore Runtime and optional endpoint.
   *
   * This is the recommended way to configure evaluation for AgentCore Runtime agents.
   * It automatically derives the CloudWatch log group and service name from the runtime and endpoint.
   *
   * @param runtime - The AgentCore Runtime construct
   * @param endpoint - The RuntimeEndpoint construct, or endpoint name string. Defaults to 'DEFAULT' if not provided.
   * @returns A DataSourceConfig instance
   *
   * @example
   * // Using default endpoint
   * const runtime = new agentcore.Runtime(this, 'Runtime', {
   *   runtimeName: 'my_agent',
   *   agentRuntimeArtifact: ...,
   * });
   * const dataSource = agentcore.DataSourceConfig.fromAgentRuntimeEndpoint(runtime);
   *
   * @example
   * // Using a specific endpoint
   * const runtime = new agentcore.Runtime(this, 'Runtime', { ... });
   * const endpoint = runtime.addEndpoint('PROD');
   * const dataSource = agentcore.DataSourceConfig.fromAgentRuntimeEndpoint(runtime, endpoint);
   *
   * @example
   * // Using endpoint name as string
   * declare const runtime: agentcore.Runtime;
   * const dataSource = agentcore.DataSourceConfig.fromAgentRuntimeEndpoint(runtime, 'PROD');
   */
  public static fromAgentRuntimeEndpoint(
    runtime: IBedrockAgentRuntime,
    endpoint?: IRuntimeEndpoint | string,
  ): DataSourceConfig {
    let endpointName: string;
    if (endpoint === undefined) {
      endpointName = 'DEFAULT';
    } else if (typeof endpoint === 'string') {
      endpointName = endpoint;
    } else {
      endpointName = endpoint.endpointName;
    }

    const logGroupName = `/aws/bedrock-agentcore/runtimes/${runtime.agentRuntimeId}-${endpointName}`;
    const serviceName = `${runtime.agentRuntimeName}.${endpointName}`;

    return new DataSourceConfig({
      logGroupNames: [logGroupName],
      serviceNames: [serviceName],
    });
  }

  /**
   * The CloudWatch Logs configuration.
   */
  public readonly cloudWatchLogsConfig: CloudWatchLogsDataSourceConfig;

  private constructor(config: CloudWatchLogsDataSourceConfig) {
    this.cloudWatchLogsConfig = config;
  }

  /**
   * Renders the data source configuration for API calls.
   * @internal
   */
  public _render(): any {
    return {
      cloudWatchLogs: {
        logGroupNames: this.cloudWatchLogsConfig.logGroupNames,
        serviceNames: this.cloudWatchLogsConfig.serviceNames,
      },
    };
  }

  /**
   * Returns the log group names for this data source.
   * @internal
   */
  public _getLogGroupNames(): string[] {
    return this.cloudWatchLogsConfig.logGroupNames;
  }
}

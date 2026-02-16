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

import type { IResource, ResourceProps } from 'aws-cdk-lib';
import { Resource } from 'aws-cdk-lib';
import type { IRuntimeEndpointRef, RuntimeEndpointReference } from 'aws-cdk-lib/aws-bedrockagentcore';
import type { Construct } from 'constructs';

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Interface for Runtime Endpoint resources
 */
export interface IRuntimeEndpoint extends IResource, IRuntimeEndpointRef {
  /**
   * The ARN of the runtime endpoint resource
   * @attribute
   * @example "arn:aws:bedrock-agentcore:us-west-2:123456789012:agent-runtime-endpoint/endpoint-abc123"
   */
  readonly agentRuntimeEndpointArn: string;

  /**
   * The name of the runtime endpoint
   */
  readonly endpointName: string;

  /**
   * The ARN of the parent agent runtime
   * @attribute
   */
  readonly agentRuntimeArn: string;

  /**
   * The current status of the runtime endpoint
   * @attribute
   */
  readonly status?: string;

  /**
   * The live version of the agent runtime that is currently serving requests
   * @attribute
   */
  readonly liveVersion?: string;

  /**
   * The target version the endpoint is transitioning to (during updates)
   * @attribute
   */
  readonly targetVersion?: string;

  /**
   * When the endpoint was created
   * @attribute
   */
  readonly createdAt?: string;

  /**
   * The description of the runtime endpoint
   */
  readonly description?: string;
}

/******************************************************************************
 *                                Base Class
 *****************************************************************************/

/**
 * Base class for Runtime Endpoint
 */
export abstract class RuntimeEndpointBase extends Resource implements IRuntimeEndpoint {
  public abstract readonly agentRuntimeEndpointArn: string;
  public abstract readonly endpointName: string;
  public abstract readonly agentRuntimeArn: string;
  public abstract readonly status?: string;
  public abstract readonly liveVersion?: string;
  public abstract readonly targetVersion?: string;
  public abstract readonly createdAt?: string;
  public abstract readonly description?: string;

  /**
   * A reference to a RuntimeEndpoint resource.
   */
  public get runtimeEndpointRef(): RuntimeEndpointReference {
    return {
      agentRuntimeEndpointArn: this.agentRuntimeEndpointArn,
    };
  }

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }
}

/**
 * Attributes for importing an existing Runtime Endpoint
 */
export interface RuntimeEndpointAttributes {
  /**
   * The ARN of the runtime endpoint
   */
  readonly agentRuntimeEndpointArn: string;

  /**
   * The name of the runtime endpoint
   */
  readonly endpointName: string;

  /**
   * The ARN of the parent agent runtime
   */
  readonly agentRuntimeArn: string;

  /**
   * The description of the runtime endpoint
   * @default - No description
   */
  readonly description?: string;

  /**
   * The current status of the runtime endpoint
   * @default - Status not available
   */
  readonly status?: string;

  /**
   * The live version of the agent runtime that is currently serving requests
   * @default - Live version not available
   */
  readonly liveVersion?: string;

  /**
   * The target version the endpoint is transitioning to (during updates)
   * @default - Target version not available
   */
  readonly targetVersion?: string;

  /**
   * When the endpoint was created
   * @default - Creation time not available
   */
  readonly createdAt?: string;

  /**
   * When the endpoint was last updated
   * @default - Last update time not available
   */
  readonly lastUpdatedAt?: string;

  /**
   * The unique identifier of the runtime endpoint
   * @default - Endpoint ID not available
   */
  readonly endpointId?: string;
}

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

import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * Base abstract class for all schema types used in Bedrock AgentCore Gateway Targets.
 * This provides a common interface for both API schemas and tool schemas.
 * @internal
 */
export abstract class TargetSchema {
  /**
   * Format as CFN properties
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): any;

  /**
   * Bind the schema to a construct
   * @internal
   */
  public abstract _bind(scope: Construct): void;

  /**
   * Grant permissions to the role
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _grantPermissionsToRole(role: IRole): Grant | undefined;
}

import type { IRole } from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';

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
   */
  public abstract bind(scope: Construct): void;

  /**
   * Grant permissions to the role
   *
   */
  public abstract grantPermissionsToRole(role: IRole): void;
}

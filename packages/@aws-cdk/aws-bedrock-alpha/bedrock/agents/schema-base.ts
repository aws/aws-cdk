/**
 * Base abstract class for all schema types used in Bedrock Agent Action Groups.
 * This provides a common interface for both API schemas and function schemas.
 * @internal
 */
export abstract class ActionGroupSchema {
  /**
   * Format as CFN properties
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): any;
}

import type { CfnFunction } from './lambda.generated';

/**
 * Specify the tenant isolation mode for Lambda functions.
 *
 * This is incompatible with:
 * - SnapStart
 * - Provisioned Concurrency
 * - Function URLs
 * - Most Event sources (only API Gateway is supported)
 */
export class TenancyConfig {
  /**
   * Each tenant gets a dedicated execution environment.
   * Execution environments are not shared between different tenants,
   * but can be reused for the same tenant to avoid cold starts.
   */
  public static readonly PER_TENANT = new TenancyConfig('PER_TENANT');

  /**
   * The CloudFormation property for tenancy configuration.
   */
  readonly tenancyConfigProperty: CfnFunction.TenancyConfigProperty;

  protected constructor(mode: string) {
    this.tenancyConfigProperty = {
      tenantIsolationMode: mode,
    };
  }
}

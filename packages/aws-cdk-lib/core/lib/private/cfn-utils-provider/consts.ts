// Shared definition with @aws-cdk/custom-resource-handlers/
/**
 * Supported resource type.
 *
 */
export enum CfnUtilsResourceType {
  /**
   * CfnJson
   */
  CFN_JSON = 'Custom::AWSCDKCfnJson',

  /**
   * CfnJsonStringify
   */
  CFN_JSON_STRINGIFY = 'Custom::AWSCDKCfnJsonStringify',
}

// Shared definition with packages/@aws-cdk/custom-resource-handlers/lib/core/cfn-utils-provider/index.ts
/**
 * Supported resource type.
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

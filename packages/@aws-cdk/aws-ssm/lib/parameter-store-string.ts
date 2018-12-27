import cdk = require('@aws-cdk/cdk');

/**
 * Properties for a ParameterStoreValue
 */
export interface ParameterStoreStringProps {
  /**
   * The name of the parameter store value
   */
  parameterName: string;

  /**
   * The version number of the value you wish to retrieve.
   */
  version: number;
}

/**
 * References a secret value in AWS Systems Manager Parameter Store
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export class ParameterStoreString extends cdk.DynamicReference {
  constructor(scope: cdk.Construct, scid: string, props: ParameterStoreStringProps) {
    super(scope, scid, {
      service: cdk.DynamicReferenceService.Ssm,
      referenceKey: `${props.parameterName}:${props.version}`,
    });
  }
}

/**
 * Properties for a ParameterStoreValue
 */
export interface ParameterStoreSecureStringProps {
  /**
   * The name of the parameter store secure string value
   */
  parameterName: string;

  /**
   * The version number of the value you wish to retrieve.
   */
  version: number;
}

/**
 * References a secret value in AWS Systems Manager Parameter Store
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export class ParameterStoreSecureString extends cdk.DynamicReference {
  constructor(scope: cdk.Construct, scid: string, props: ParameterStoreStringProps) {
    super(scope, scid, {
      service: cdk.DynamicReferenceService.SsmSecure,
      referenceKey: `${props.parameterName}:${props.version}`,
    });
  }
}

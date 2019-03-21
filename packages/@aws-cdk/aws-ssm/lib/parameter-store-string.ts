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
   *
   * @default The latest version will be retrieved.
   */
  version?: number;
}

/**
 * References a public value in AWS Systems Manager Parameter Store
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export class ParameterStoreString extends cdk.Construct {
  public readonly stringValue: string;

  constructor(scope: cdk.Construct, id: string, props: ParameterStoreStringProps) {
    super(scope, id);

    // If we don't validate this here it will lead to a very unclear
    // error message in CloudFormation, so better do it.
    if (!props.parameterName) {
      throw new Error('ParameterStoreString: parameterName cannot be empty');
    }

    // We use a different inner construct depend on whether we want the latest
    // or a specific version.
    //
    // * Latest - generate a Parameter and reference that.
    // * Specific - use a Dynamic Reference.
    if (props.version === undefined) {
      // Construct/get a singleton parameter under the stack
      const param = new cdk.CfnParameter(this, 'Parameter', {
        type: 'AWS::SSM::Parameter::Value<String>',
        default: props.parameterName
      });
      this.stringValue = param.stringValue;
    } else {
      // Use a dynamic reference
      const dynRef = new cdk.DynamicReference(this, 'Reference', {
        service: cdk.DynamicReferenceService.Ssm,
        referenceKey: `${props.parameterName}:${props.version}`,
      });
      this.stringValue = dynRef.stringValue;
    }
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
 * It is not possible to retrieve the "latest" value of a secret.
 * Use Secrets Manager if you need that ability.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export class ParameterStoreSecureString extends cdk.DynamicReference {
  constructor(scope: cdk.Construct, id: string, props: ParameterStoreSecureStringProps) {
    super(scope, id, {
      service: cdk.DynamicReferenceService.SsmSecure,
      referenceKey: `${props.parameterName}:${props.version}`,
    });

    // If we don't validate this here it will lead to a very unclear
    // error message in CloudFormation, so better do it.
    if (!props.parameterName) {
      throw new Error('ParameterStoreSecureString: parameterName cannot be empty');
    }
  }
}

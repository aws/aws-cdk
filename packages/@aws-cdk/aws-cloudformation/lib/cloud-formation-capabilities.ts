/**
 * Capabilities that affect whether CloudFormation is allowed to change IAM resources
 */
export enum CloudFormationCapabilities {
  /**
   * No IAM Capabilities
   *
   * Pass this capability if you wish to block the creation IAM resources.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  None = '',

  /**
   * Capability to create anonymous IAM resources
   *
   * Pass this capability if you're only creating anonymous resources.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  AnonymousIAM = 'CAPABILITY_IAM',

  /**
   * Capability to create named IAM resources.
   *
   * Pass this capability if you're creating IAM resources that have physical
   * names.
   *
   * `CloudFormationCapabilities.NamedIAM` implies `CloudFormationCapabilities.IAM`; you don't have to pass both.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  NamedIAM = 'CAPABILITY_NAMED_IAM',
}

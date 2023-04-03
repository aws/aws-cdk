/**
 * Capabilities that affect whether CloudFormation is allowed to change IAM resources
 * @deprecated use `core.CfnCapabilities`
 */
export declare enum CloudFormationCapabilities {
    /**
     * No IAM Capabilities
     *
     * Pass this capability if you wish to block the creation IAM resources.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    NONE = "",
    /**
     * Capability to create anonymous IAM resources
     *
     * Pass this capability if you're only creating anonymous resources.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    ANONYMOUS_IAM = "CAPABILITY_IAM",
    /**
     * Capability to create named IAM resources.
     *
     * Pass this capability if you're creating IAM resources that have physical
     * names.
     *
     * `CloudFormationCapabilities.NamedIAM` implies `CloudFormationCapabilities.IAM`; you don't have to pass both.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    NAMED_IAM = "CAPABILITY_NAMED_IAM",
    /**
     * Capability to run CloudFormation macros
     *
     * Pass this capability if your template includes macros, for example AWS::Include or AWS::Serverless.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.html
     */
    AUTO_EXPAND = "CAPABILITY_AUTO_EXPAND"
}
